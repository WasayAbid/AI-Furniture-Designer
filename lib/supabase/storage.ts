import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./database.types";

export const uploadImage = async (
  imageUrl: string,
  folder: "chat" | "designs"
): Promise<string> => {
  const supabase = createClientComponentClient<Database>();

  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Generate a unique filename
    const filename = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.png`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("images")
      .upload(filename, blob, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filename);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    // Return original URL if upload fails
    return imageUrl;
  }
};
