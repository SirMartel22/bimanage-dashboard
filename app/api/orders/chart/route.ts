import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "7days";

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://bimanage-backend.onrender.com/api";

    const res = await fetch(`${baseUrl}/orders/chart?range=${range}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      cache: "no-store"
    });

    const data = await res.json();
    
    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
