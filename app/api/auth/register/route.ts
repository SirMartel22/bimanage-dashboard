import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Use API_BASE_URL if available, otherwise fallback to NEXT_PUBLIC_API_BASE_URL or the default
        // Note: API_BASE_URL expects no /api suffix in this specific route usage
        const baseUrl = process.env.API_BASE_URL || 
                        (process.env.NEXT_PUBLIC_API_BASE_URL ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api$/, "") : "https://bimanage-backend.onrender.com");

        const res = await fetch(`${baseUrl}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        return NextResponse.json(data, {
            status: res.status
        });
    } catch (error: any) {
        console.error("Register proxy error:", error);
        return NextResponse.json({ 
            message: "Internal server error during register proxy",
            error: error.message 
        }, { status: 500 });
    }
}
