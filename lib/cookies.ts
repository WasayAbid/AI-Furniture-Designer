export const setChatHistory = (chatHistory: any[]) => {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(chatHistory);
  document.cookie = `chat_history=${encodeURIComponent(
    serialized
  )};path=/;max-age=3600;SameSite=Strict`;
};

export const getChatHistory = () => {
  if (typeof window === "undefined") return [];
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("chat_history="));
  if (!cookie) return [];
  try {
    return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
  } catch {
    return [];
  }
};

export const setGeneratedImages = (images: string[]) => {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(images);
  document.cookie = `generated_images=${encodeURIComponent(
    serialized
  )};path=/;max-age=3600;SameSite=Strict`;
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
