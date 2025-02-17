"use client";

export const setChatHistory = (chatHistory: any[]) => {
  if (typeof window === "undefined") return;

  // Filter out system messages and ensure all messages have timestamps
  const processedHistory = chatHistory
    .filter((msg) => msg.role !== "system")
    .map((msg) => ({
      ...msg,
      timestamp: msg.timestamp || Date.now(),
    }));

  const serialized = JSON.stringify(processedHistory);
  document.cookie = `chat_history=${encodeURIComponent(
    serialized
  )};path=/;max-age=${15 * 24 * 60 * 60};SameSite=Strict`;
};

export const getChatHistory = () => {
  if (typeof window === "undefined") return [];

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("chat_history="));
  if (!cookie) return [];

  try {
    const history = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
    return history.map((msg: any) => ({
      ...msg,
      timestamp: msg.timestamp || Date.now(),
    }));
  } catch {
    return [];
  }
};

export const clearChatHistory = () => {
  if (typeof window === "undefined") return;
  document.cookie =
    "chat_history=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export const setGeneratedImages = (images: string[]) => {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(images);
  document.cookie = `generated_images=${encodeURIComponent(
    serialized
  )};path=/;max-age=${15 * 24 * 60 * 60};SameSite=Strict`;
};

export const getGeneratedImages = () => {
  if (typeof window === "undefined") return [];
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("generated_images="));
  if (!cookie) return [];
  try {
    return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
  } catch {
    return [];
  }
};

export const addGeneratedImage = (imageUrl: string) => {
  const images = getGeneratedImages();
  const updatedImages = [...images, imageUrl];
  setGeneratedImages(updatedImages);
};

export const clearGeneratedImages = () => {
  if (typeof window === "undefined") return;
  document.cookie =
    "generated_images=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
