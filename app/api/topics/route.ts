import connectMongoDB from "@/lib/mongodb";
import topic from "@/models/topic";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { title, description } = await request.json();
  await connectMongoDB();
  await topic.create({ title, description });
  return NextResponse.json(
    { message: "Topic Created" },
    {
      status: 201,
    }
  );
}

export async function GET() {
  await connectMongoDB();
  const topics = await topic.find();
  return NextResponse.json({ topics });
}