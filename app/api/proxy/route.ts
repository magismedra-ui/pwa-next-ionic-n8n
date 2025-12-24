import { NextResponse } from "next/server";

const TARGET_URL =
  "https://primary-production-e16cb.up.railway.app/webhook/gestiondb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    console.log(`[Proxy] Forwarding request to ${TARGET_URL}`);

    const response = await fetch(TARGET_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(
        `[Proxy] Remote Error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: `Remote Error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Proxy] Internal Error:", error);
    return NextResponse.json(
      { error: "Internal Proxy Error" },
      { status: 500 }
    );
  }
}
