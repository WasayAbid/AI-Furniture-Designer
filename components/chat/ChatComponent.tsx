"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  Lightbulb,
  AlertTriangle,
  Maximize2,
  X, // Import the X icon (or Trash2, etc.)
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { saveChatMessage, getChatHistory } from "@/lib/supabase/queries";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/supabase/database.types";
import { uploadImage } from "@/lib/supabase/storage";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  image?: string;
  timestamp?: number; // Add a timestamp to each message
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "system",
    content:
      "You are an expert furniture designer specializing in minimalist, functional designs. Focus on clean lines, premium materials, and perfect lighting in your image generations.",
    timestamp: Date.now(), //  Add timestamp
  },
];

const PRESET_PROMPTS = [
  {
    title: "Kitchen Cabinets",
    prompt:
      "visualize modern kitchen cabinets in a warm terracotta color with walnut wood veneer accents. Feature thin shaker-style doors and a light-toned quartz countertop. Design for a natural and inviting modern kitchen.",
    icon: "🪑",
  },
  {
    title: "Dressing Table",
    prompt:
      "Visualize an elegant and modern vanity room. Feature a dressing table with a large mirror and drawers, complemented by wall-mounted cabinets and floor-to-ceiling cupboards for storage. Use soft, diffused lighting to create a luxurious, serene atmosphere.",
    icon: "🪞",
  },
  {
    title: "Wardrobe",
    prompt:
      "Generate a built-in wardrobe design with clean lines and smart storage. Show it in morning light with perfect shadows highlighting the organization systems.",
    icon: "👔",
  },
  {
    title: "Study Desk",
    prompt:
      "Create a minimalist study desk with clean cable management and ergonomic design. Natural light should showcase the premium materials and thoughtful details.",
    icon: "📚",
  },
];

const COOKIE_NAME = "chat_history";
const COOKIE_EXPIRATION_DAYS = 15;

// Helper function to set a cookie
function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

// Helper function to get a cookie
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Helper to remove messages older than the expiration
const filterOldMessages = (messages: Message[]): Message[] => {
  const cutoff = Date.now() - COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
  return messages.filter(
    (message) => message.timestamp && message.timestamp >= cutoff
  );
};

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const supabase = createClientComponentClient<Database>();

  const handleClearChat = () => {
    setCookie(COOKIE_NAME, "", 0); // Delete the cookie
    setMessages(INITIAL_MESSAGES); // Reset messages to initial state
    toast.success("Chat history cleared!");
  };

  useEffect(() => {
    setIsClient(true);
    loadChatHistoryFromCookie(); // Load from cookie FIRST
    loadChatHistory(); // Then load from Supabase (for older messages, if you want)
  }, []);

  const loadChatHistoryFromCookie = () => {
    const cookieValue = getCookie(COOKIE_NAME);
    if (cookieValue) {
      try {
        const parsedMessages = JSON.parse(decodeURIComponent(cookieValue));
        // Filter out messages older than 15 days
        const recentMessages = filterOldMessages(parsedMessages);
        setMessages((prevMessages) => {
          // Combine cookie messages with initial messages, ensuring no duplicates
          const allMessages = [...INITIAL_MESSAGES, ...recentMessages];
          const uniqueMessages = Array.from(
            new Map(allMessages.map((item) => [item.content, item])).values()
          ); // Simple deduplication
          return uniqueMessages;
        });
      } catch (error) {
        console.error("Error parsing chat history from cookie:", error);
        // Handle the error, e.g., clear the corrupted cookie
        setCookie(COOKIE_NAME, "", 0); // Remove the cookie
      }
    }
  };

  const loadChatHistory = async () => {
    //Kept for option to have more chat history from database
  };

  const saveChatHistoryToCookie = (updatedMessages: Message[]) => {
    // Filter out messages older than 15 days before saving.
    const recentMessages = filterOldMessages(updatedMessages);
    const cookieValue = encodeURIComponent(JSON.stringify(recentMessages));
    setCookie(COOKIE_NAME, cookieValue, COOKIE_EXPIRATION_DAYS);
  };

  const handleSubmit = async (e: React.FormEvent, customPrompt?: string) => {
    e.preventDefault();
    if (!input.trim() && !customPrompt) return;

    const userMessage = customPrompt || input;
    setInput("");

    // Add user message to UI immediately
    const newUserMessage: Message = {
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
    };
    setMessages((prev) => {
      const updatedMessages = [...prev, newUserMessage];
      saveChatHistoryToCookie(updatedMessages);
      return updatedMessages;
    });

    // Save user message to database
    try {
      await saveChatMessage(userMessage, "user");
    } catch (error) {
      console.error("Error saving user message:", error);
    }

    setIsLoading(true);

    const shouldGenerateImage =
      userMessage.toLowerCase().includes("generate") ||
      userMessage.toLowerCase().includes("create") ||
      userMessage.toLowerCase().includes("show") ||
      userMessage.toLowerCase().includes("visualize");

    setIsGeneratingImage(shouldGenerateImage);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.filter((m) => m.role !== "system"), // Don't send the system message to the API
          userMessage,
          shouldGenerateImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();
      const { response: assistantResponse, imageUrl } = data;

      // Upload image to Supabase Storage if one was generated
      let storedImageUrl = imageUrl;
      if (imageUrl) {
        try {
          storedImageUrl = await uploadImage(imageUrl, "chat");
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }

      // Save assistant message to database
      try {
        await saveChatMessage(assistantResponse, "assistant", storedImageUrl);
      } catch (error) {
        console.error("Error saving assistant message:", error);
      }

      // Update UI
      setMessages((prev) => {
        const newAssistantMessage: Message = {
          role: "assistant",
          content: assistantResponse,
          image: storedImageUrl,
          timestamp: Date.now(),
        };
        const updatedMessages = [...prev, newAssistantMessage];
        saveChatHistoryToCookie(updatedMessages); // Save to cookie after assistant response
        return updatedMessages;
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to get response");
    } finally {
      setIsLoading(false);
      setIsGeneratingImage(false);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setEnlargedImage(imageUrl);
  };

  // ... rest of your component remains largely the same, just use the updated messages ...
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-zinc-900/50 to-zinc-950/80" />
      </div>

      <div className="max-w-4xl mx-auto p-4 relative min-h-screen flex flex-col">
        {isClient && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-white to-pink-200"
          >
            Custom Furniture Expert
          </motion.h1>
        )}

        {isClient && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-pink-500/10 to-zinc-800/50 rounded-lg p-4 border border-pink-500/20 mb-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-pink-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-2">
                  Instructions & Disclaimer
                </h3>
                <p className="text-zinc-300 text-sm">
                  All designs are AI-generated and may vary from expectations.
                  Use keywords like &quot;generate&quot;, &quot;create&quot;,
                  &quot;visualize&quot;, &quot;render&quot; to visualize your
                  idea.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-pink-500/10 flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4 relative">
            {/* Clear Chat Button (Moved inside ScrollArea) */}
            <Button
              onClick={handleClearChat}
              className="absolute bottom-2 left-2 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white text-xs"
            >
              Clear Chat
            </Button>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {PRESET_PROMPTS.map(
                  (preset, index) =>
                    isClient && (
                      <motion.button
                        key={preset.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: index * 0.1 },
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => handleSubmit(e, preset.prompt)}
                        className="p-3 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg border border-pink-500/10 hover:border-pink-500/20 transition-all text-left group"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-2xl">{preset.icon}</span>
                          <h3 className="font-medium text-white text-sm group-hover:text-pink-300 transition-colors">
                            {preset.title}
                          </h3>
                        </div>
                      </motion.button>
                    )
                )}
              </div>

              {isClient && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-pink-500/10 text-white rounded-xl p-4 mr-4"
                >
                  <div className="prose prose-invert max-w-none">
                    <p>
                      Hello! I&apos;m ready to assist you with your furniture
                      design needs. Let&apos;s create something amazing!
                    </p>
                  </div>
                </motion.div>
              )}

              {messages
                .filter((m) => m.role !== "system")
                .map(
                  (message, index) =>
                    isClient && (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[100%] rounded-xl p-4 ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white ml-4"
                              : "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-pink-500/10 text-white mr-4"
                          }`}
                        >
                          <div className="prose prose-invert max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                          {message.image && (
                            <div className="relative mt-4 group">
                              <img
                                src={message.image}
                                alt="Generated furniture design"
                                className="rounded-lg max-w-full cursor-pointer transition-transform hover:scale-[1.02]"
                                onClick={() => handleImageClick(message.image!)}
                              />
                              <button
                                onClick={() => handleImageClick(message.image!)}
                                className="absolute top-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Maximize2 className="h-4 w-4 text-white" />
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                )}

              {isLoading && isClient && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-pink-500/10 rounded-xl p-4 mr-4">
                    <div className="flex items-center space-x-2 text-white mb-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">
                        {isGeneratingImage
                          ? "Generating your design..."
                          : "Thinking..."}
                      </span>
                    </div>
                    {isGeneratingImage && (
                      <div className="relative w-full aspect-[2/1] max-w-[900px] rounded-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 animate-pulse" />
                        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <Lightbulb className="h-12 w-12 text-pink-400/50" />
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-pink-500/10 relative" // Add relative positioning
          >
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your furniture idea..."
                disabled={isLoading}
                className="bg-zinc-800/50 border-pink-500/20 text-white placeholder:text-zinc-400"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Dialog
        open={!!enlargedImage}
        onOpenChange={() => setEnlargedImage(null)}
      >
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black/90 border-pink-500/20">
          <div className="relative w-full h-full">
            {enlargedImage && (
              <img
                src={enlargedImage}
                alt="Enlarged furniture design"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
