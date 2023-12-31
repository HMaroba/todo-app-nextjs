import connectMongoDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

const MAX_AGE = 60 * 60 * 24 * 30; // DAYS

export async function POST(request: Request) {
  const body = await request.json();

  const { emailAddress, password } = body;
  await connectMongoDB();

  if (emailAddress !== "admin@gmail.com" || password !== "admin") {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const secret = process.env.JWT_SECRET || " ";
  const token = sign(
    {
      emailAddress,
    },
    secret,
    {
      expiresIn: MAX_AGE,
    }
  );

  const seralized = serialize("OurSideJWT", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });

  const response = {
    message: "Authenticated",
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      "Set-Cookie": seralized,
    },
  });
}
