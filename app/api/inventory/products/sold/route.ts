import { NextRequest, NextResponse } from "next/server";

const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://bimanage-backend.onrender.com/api").replace(/\/$/, "");


export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "No token provided" }, { status: 401 });

    const res = await fetch(`${baseUrl}/inventory/products/sold`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
