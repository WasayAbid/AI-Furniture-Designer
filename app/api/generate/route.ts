import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetryAndJson(url: string, options: any, retries = 0) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const text = await response.text();

      let errorData;

      if (text.startsWith("<")) {
        console.error(
          `Attempt ${
            retries + 1
          } to fetch from OpenAI Failed due to an HTML Response:`,
          text
        );
        errorData = { error: { message: text } };
      } else {
        try {
          errorData = JSON.parse(text);
        } catch (e) {
          console.error(
            `Attempt ${
              retries + 1
            } to fetch from OpenAI Failed due to a non-json response:`,
            text
          );
          throw new Error(`Non-JSON response on retry attempt ${retries + 1}`);
        }
        console.error(
          `Attempt ${retries + 1} to fetch from OpenAI Failed with status ${
            response.status
          }:`,
          errorData
        );
      }

      const errorMessage =
        errorData.error?.message || "Failed to generate image";

      if (response.status === 429 && retries < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetryAndJson(url, options, retries + 1);
      }
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (e: any) {
    if (retries < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetryAndJson(url, options, retries + 1);
    }
    throw e;
  }
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Invalid or empty prompt provided" },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const data = await fetchWithRetryAndJson(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: "1792x1024",
          quality: "hd",
          style: "vivid",
        }),
      }
    );

    console.log("OpenAI Full Response:", data); // Log the full response
    const endTime = Date.now();
    console.log(`OpenAI API call took: ${endTime - startTime}ms`);

    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL not found in response" },
        { status: 500 }
      );
    }
    const genId = uuidv4();

    return NextResponse.json({ imageUrl, genId });
  } catch (error: any) {
    console.error("Error generating image:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
