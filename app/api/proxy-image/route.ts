// app/api/proxy-image/route.ts
import { NextResponse } from "next/server";
import { URL } from "url";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("imageUrl");

  if (!imageUrl || typeof imageUrl !== "string") {
    return new NextResponse("Invalid image URL", { status: 400 });
  }

  try {
    const imageUrlInstance = new URL(imageUrl);
    const imageResponse = await fetch(imageUrlInstance.toString());

    if (!imageResponse.ok) {
      console.error(
        "Proxy fetch failed:",
        imageResponse.status,
        imageResponse.statusText
      );
      return new NextResponse(imageResponse.statusText, {
        status: imageResponse.status,
      });
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    const headers = new Headers();
    headers.set(
      "Content-Type",
      imageResponse.headers.get("Content-Type") || "image/jpeg"
    );
    headers.set("Cache-Control", "public, max-age=31536000"); // Optional: Add caching

    return new NextResponse(Buffer.from(imageBuffer), {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
