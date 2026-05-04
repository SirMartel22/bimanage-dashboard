import { NextRequest, NextResponse } from "next/server";

const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://bimanage-backend.onrender.com/api").replace(/\/$/, "");

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "No token provided" }, { status: 401 });

    const res = await fetch(`${baseUrl}/inventory/products`, {
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

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "No token provided" }, { status: 401 });

    // Read as text to bypass potential json() size limits
    const textBody = await request.text();
    const body = JSON.parse(textBody);
    const bodySize = textBody.length;
    
    console.log(`Forwarding POST to backend. Size: ${bodySize} bytes. URL: ${baseUrl}/inventory/products`);

    
    const res = await fetch(`${baseUrl}/inventory/products`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body)
    });

    console.log(`Backend response status: ${res.status}`);

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } else {
        const text = await res.text();
        console.error("Backend returned non-JSON response. Status:", res.status, "Body:", text.substring(0, 200));
        return NextResponse.json({ 
            message: "Backend returned non-JSON response", 
            status: res.status,
            details: text.substring(0, 500) 
        }, { status: res.status || 500 });
    }

  } catch (error: any) {
    console.error("POST /api/inventory/products proxy error:", error);
    return NextResponse.json({ 
        message: "Internal server error in proxy", 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}


