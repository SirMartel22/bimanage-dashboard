import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://bimanage-backend.onrender.com/api";

    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    
    // In a real app, you might want to set a secure cookie here
    // For now, we'll just return the data (including token) to the client
    
    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
