import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./database.types";

export const getDesigns = async (page = 1, limit = 10) => {
  const supabase = createClientComponentClient<Database>();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      console.log("No authenticated user found");
      return { designs: [], total: 0 };
    }

    console.log("Fetching designs for user:", session.user.id);

    const { data, error, count } = await supabase
      .from("designs")
      .select("*", { count: "exact" })
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    return { designs: data || [], total: count || 0 };
  } catch (error) {
    console.error("Error getting designs:", error);
    throw error;
  }
};

export const saveDesign = async (designData: any, imageUrl: string | null) => {
  const supabase = createClientComponentClient<Database>();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("designs")
      .insert({
        user_id: session.user.id,
        design_data: designData,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving design:", error);
    throw error;
  }
};

export const getChatHistory = async (page = 1, limit = 50) => {
  const supabase = createClientComponentClient<Database>();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      console.log("No authenticated user found");
      return { messages: [], total: 0 };
    }

    const { data, error, count } = await supabase
      .from("chat_messages")
      .select("*", { count: "exact" })
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error("Error fetching chat history:", error);
      throw error;
    }

    return { messages: data || [], total: count || 0 };
  } catch (error) {
    console.error("Error getting chat history:", error);
    throw error;
  }
};

export const saveChatMessage = async (
  content: string,
  role: "user" | "assistant" | "system",
  imageUrl?: string | null
) => {
  const supabase = createClientComponentClient<Database>();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error("No authenticated user found");
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        user_id: session.user.id,
        content,
        role,
        image_url: imageUrl || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error while saving message:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned after saving message");
    }

    return data;
  } catch (error) {
    console.error("Error saving chat message:", error);
    throw error;
  }
};
