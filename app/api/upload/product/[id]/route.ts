import { NextRequest, NextResponse } from "next/server";

const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://bimanage-backend.onrender.com/api").replace(/\/$/, "");

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "No token provided" }, { status: 401 });

    const formData = await request.formData();
    
    console.log(`Forwarding product image upload for ID: ${id} to backend: ${baseUrl}/upload/product/${id}`);
    
    const res = await fetch(`${baseUrl}/upload/product/${id}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        // Note: Do NOT set Content-Type for FormData, fetch will set it with the boundary
      },
      body: formData
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (error: any) {
    console.error(`Upload proxy error for product ${error.message}`);
    return NextResponse.json({ 
        message: "Internal server error in upload proxy", 
        error: error.message 
    }, { status: 500 });
  }
}
