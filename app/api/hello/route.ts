import { NextResponse } from "next/server";

export async function GET(request:  Request) {
    return NextResponse.json({
        message : "Hello from get"
    });
}
export async function POST(request:  Request) {
    return new Response('Hello WITH POST', {
        status: 200
    });
}