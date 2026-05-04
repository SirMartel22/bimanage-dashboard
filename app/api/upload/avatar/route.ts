import { NextRequest, NextResponse } from "next/server";

const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://bimanage-backend.onrender.com/api").replace(/\/$/, "");

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "No token provided" }, { status: 401 });

    const formData = await request.formData();
    
    console.log(`Forwarding avatar upload to backend: ${baseUrl}/upload/avatar`);
    
    const res = await fetch(`${baseUrl}/upload/avatar`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (error: any) {
    console.error(`Avatar upload proxy error: ${error.message}`);
    return NextResponse.json({ 
        message: "Internal server error in upload proxy", 
        error: error.message 
    }, { status: 500 });
  }
}
