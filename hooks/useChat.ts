"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { saveChatMessage, getChatHistory } from "@/lib/supabase/queries";
import { uploadImage } from "@/lib/supabase/storage";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  image?: string;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  isGeneratingImage: boolean;
  hasMore: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  clearMessages: () => void;
}

const INITIAL_MESSAGES = [
  {
    role: "system" as const,
    content:
      "You are an expert furniture designer specializing in minimalist, functional designs. Focus on clean lines, premium materials, and perfect lighting in your image generations.",
  },
];

const PAGE_SIZE = 50;

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shouldGenerateImage = (message: string): boolean => {
    const triggerWords = [
      "generate",
      "create",
      "show",
      "visualize",
      "make",
      "design",
      "draw",
      "render",
    ];
    return triggerWords.some((word) => message.toLowerCase().includes(word));
  };

  const loadMoreMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const { messages: chatHistory, total } = await getChatHistory(
        nextPage,
        PAGE_SIZE
      );

      if (chatHistory) {
        const formattedMessages = chatHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
          image: msg.image_url || undefined,
        }));

        setMessages((prev) => [...prev, ...formattedMessages]);
        setHasMore(chatHistory.length === PAGE_SIZE);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more messages:", error);
      toast.error("Failed to load more messages");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setError(null);
    const shouldGenImage = shouldGenerateImage(content);
    setIsGeneratingImage(shouldGenImage);
    setIsLoading(true);

    // Add user message to UI immediately
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Save user message to database
      await saveChatMessage(content, "user");

      // Get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          userMessage: content,
          shouldGenerateImage: shouldGenImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();
      const { response: assistantResponse, imageUrl } = data;

      // Handle image storage
      let storedImageUrl = imageUrl;
      if (imageUrl) {
        try {
          storedImageUrl = await uploadImage(imageUrl, "chat");
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Failed to save image");
        }
      }

      // Save assistant message to database
      try {
        await saveChatMessage(assistantResponse, "assistant", storedImageUrl);
      } catch (error) {
        console.error("Error saving assistant message:", error);
        toast.error("Failed to save response");
      }

      // Update UI with assistant message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantResponse,
          image: storedImageUrl,
        },
      ]);
    } catch (error: any) {
      setError(error.message || "Failed to get response");
      toast.error(error.message || "Failed to get response");
    } finally {
      setIsLoading(false);
      setIsGeneratingImage(false);
    }
  };

  const clearMessages = () => {
    setMessages(INITIAL_MESSAGES);
    setPage(1);
    setHasMore(true);
    setError(null);
  };

  return {
    messages,
    isLoading,
    isGeneratingImage,
    hasMore,
    error,
    sendMessage,
    loadMoreMessages,
    clearMessages,
  };
}
