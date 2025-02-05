// app/api/chat/route.ts
import { NextResponse } from "next/server";

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
    const { messages, userMessage, shouldGenerateImage } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid message history provided" },
        { status: 400 }
      );
    }

    if (
      !userMessage ||
      typeof userMessage !== "string" ||
      userMessage.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Invalid or empty user message provided" },
        { status: 400 }
      );
    }

    let response;
    let imageUrl: string | null = null;

    if (shouldGenerateImage) {
      const geminiPrompt = `Improve this prompt for the best DALL-E image generation: ${userMessage}. Ensure the output is a highly specific, detailed, and clear image description suitable for DALL-E. Focus on details such as wood type, materials used, dimensions, lighting,  style, and  any specific design elements, also provide specific keywords. Do not use metaphors, abstract concepts, or overly complex sentence structures, output only the improved prompt.`;
      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=" +
          process.env.GOOGLE_API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are the best prompt optimizer for image generation. You write special keywords which gives the best output image of a furniture item, now improve this prompt:  ${userMessage}`,
                  },
                ],
              },
              {
                role: "model",
                parts: [
                  {
                    text: geminiPrompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        console.error("Gemini API Error:", errorData);
        return NextResponse.json(
          { error: `Failed to get response from Gemini API` },
          { status: 500 }
        );
      }

      const geminiData = await geminiResponse.json();
      const improvedPrompt = geminiData.candidates[0]?.content?.parts[0]?.text;

      if (!improvedPrompt) {
        return NextResponse.json(
          { error: `No response from Gemini to improve the prompt.` },
          { status: 500 }
        );
      }
      console.log("Gemini Improved Prompt:", improvedPrompt);
      try {
        const imageData = await fetchWithRetryAndJson(
          "https://api.openai.com/v1/images/generations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "dall-e-3",
              prompt: improvedPrompt,
              n: 1,
              size: "1792x1024",
              quality: "hd",
              style: "vivid",
            }),
          }
        );
        imageUrl = imageData.data[0]?.url;
        response = `Here is your desired image: \n
                       
                            `;
      } catch (error: any) {
        console.error("Error generating image:", error);
        response = "Failed to generate image!";
      }
    } else {
      // Call Gemini for text response only
      const geminiSystemPrompt = `You are a custom furniture designer expert, skilled in woodworking and furniture design. You will only talk about topics related to furniture design and woodworking, avoid engaging in any other type of conversation.`;
      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=" +
          process.env.GOOGLE_API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: geminiSystemPrompt + " \n " + userMessage,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        console.error("Gemini API Error:", errorData);
        const errorMessage =
          errorData.error?.message || "Failed to get response from Gemini API";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
      }

      const geminiData = await geminiResponse.json();
      response = geminiData.candidates[0]?.content?.parts[0]?.text;

      if (!response) {
        return NextResponse.json(
          { error: "No response content from Gemini API" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ response, imageUrl });
  } catch (error: any) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
