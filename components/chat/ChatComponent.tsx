"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  AlertTriangle,
  Maximize2,
  Trash2,
  Send,
  Sparkles,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  image?: string;
  timestamp?: number;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "system",
    content:
      "You are an expert furniture designer specializing in minimalist, functional designs. Focus on clean lines, premium materials, and perfect lighting in your image generations.",
    timestamp: Date.now(),
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
      "Design a minimalist study desk featuring built-in cable management and ergonomic features, with sleek pull-out drawers and overhead cabinets in warm walnut wood. Position near a window where natural light emphasizes the grain patterns and brass hardware.",
    icon: "📚",
  },
];

const COOKIE_NAME = "chat_history";
const COOKIE_EXPIRATION_DAYS = 15;

function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

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

const filterOldMessages = (messages: Message[]): Message[] => {
  const cutoff = Date.now() - COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
  return messages.filter(
    (message) => message.timestamp && message.timestamp >= cutoff
  );
};

const containsFurnitureKeywords = (text: string): boolean => {
  const furnitureKeywords = [
    "furniture",
    "chair",
    "table",
    "sofa",
    "couch",
    "bed",
    "desk",
    "cabinet",
    "wardrobe",
    "shelf",
    "shelves",
    "dresser",
    "cupboard",
    "ottoman",
    "stool",
    "bench",
    "lamp",
    "lighting",
    "decor",
    "interior",
    "design",
    "drawers",
    "mirror",
  ];
  const lowerCaseText = text.toLowerCase();
  return furnitureKeywords.some((keyword) => lowerCaseText.includes(keyword));
};

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearChat = () => {
    if (isLoading) return;
    setCookie(COOKIE_NAME, "", 0);
    setMessages(INITIAL_MESSAGES);
    setInput("");
    toast.success("Chat history cleared!");
  };

  useEffect(() => {
    setIsClient(true);
    loadChatHistoryFromCookie();
    loadChatHistory();
  }, []);

  const loadChatHistoryFromCookie = () => {
    const cookieValue = getCookie(COOKIE_NAME);
    if (cookieValue) {
      try {
        const parsedMessages = JSON.parse(decodeURIComponent(cookieValue));
        const recentMessages = filterOldMessages(parsedMessages);
        setMessages((prevMessages) => {
          const allMessages = [...INITIAL_MESSAGES, ...recentMessages];
          const uniqueMessages = Array.from(
            new Map(allMessages.map((item) => [item.content, item])).values()
          );
          return uniqueMessages;
        });
      } catch (error) {
        console.error("Error parsing chat history from cookie:", error);
        setCookie(COOKIE_NAME, "", 0);
      }
    }
  };

  const loadChatHistory = async () => {
    // Kept for the option to have more chat history from the database
  };

  const saveChatHistoryToCookie = (updatedMessages: Message[]) => {
    const recentMessages = filterOldMessages(updatedMessages);
    const cookieValue = encodeURIComponent(JSON.stringify(recentMessages));
    setCookie(COOKIE_NAME, cookieValue, COOKIE_EXPIRATION_DAYS);
  };

  const handleSubmit = async (userMessage: string, type: string) => {
    if (!userMessage.trim()) return;

    setInput("");

    const newUserMessage: Message = {
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      await saveChatMessage(userMessage, "user");
    } catch (error) {
      console.error("Error saving user message:", error);
    }

    setIsLoading(true);

    let shouldGenerateImage = type === "generate";

    if (shouldGenerateImage) {
      if (containsFurnitureKeywords(userMessage)) {
        setIsGeneratingImage(true);

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: messages.filter((m) => m.role !== "system"),
              userMessage,
              shouldGenerateImage: true,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to get response");
          }

          const data = await response.json();
          const { response: assistantResponse, imageUrl } = data;

          let storedImageUrl = imageUrl;
          if (imageUrl) {
            try {
              storedImageUrl = await uploadImage(imageUrl, "chat");
            } catch (error) {
              console.error("Error uploading image:", error);
            }
          }

          try {
            await saveChatMessage(
              assistantResponse,
              "assistant",
              storedImageUrl
            );
          } catch (error) {
            console.error("Error saving assistant message:", error);
          }

          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: assistantResponse,
              image: storedImageUrl,
              timestamp: Date.now(),
            },
          ]);
          saveChatHistoryToCookie(messages);
        } catch (error: any) {
          console.error("Error:", error);
          toast.error(error.message || "Failed to get response");
        } finally {
          setIsLoading(false);
          setIsGeneratingImage(false);
        }
      } else {
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I can only generate images related to furniture design. Please provide a description of furniture you'd like me to visualize.",
            timestamp: Date.now(),
          },
        ]);
        saveChatHistoryToCookie(messages);
      }
    } else {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messages.filter((m) => m.role !== "system"),
            userMessage,
            shouldGenerateImage: false,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get response");
        }

        const data = await response.json();
        const { response: assistantResponse } = data;

        try {
          await saveChatMessage(assistantResponse, "assistant");
        } catch (error) {
          console.error("Error saving assistant message:", error);
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: assistantResponse,
            timestamp: Date.now(),
          },
        ]);
        saveChatHistoryToCookie(messages);
      } catch (error: any) {
        console.error("Error:", error);
        toast.error(error.message || "Failed to get response");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        handleSubmit(input, "send");
      }
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setEnlargedImage(imageUrl);
  };

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
                  Press <b>Generate</b> to generate an image. All designs are
                  AI-generated and may vary from expectations.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-pink-500/10 flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4 relative">
            <div className="space-y-4">
              {/* Preset Prompts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {PRESET_PROMPTS.map((preset, index) => (
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
                    onClick={() => handleSubmit(preset.prompt, "generate")}
                    className="p-3 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg border border-pink-500/10 hover:border-pink-500/20 transition-all text-left group"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">{preset.icon}</span>
                      <h3 className="font-medium text-white text-sm group-hover:text-pink-300 transition-colors">
                        {preset.title}
                      </h3>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Initial Message */}
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

              {/* Chat Messages */}
              {messages
                .filter((m) => m.role !== "system")
                .map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
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
                ))}

              {/* Loading Indicator */}
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
                            <Sparkles className="h-12 w-12 text-pink-400/50" />
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                handleSubmit(input, "send");
              }
            }}
            className="p-4 border-t border-pink-500/10 relative"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex gap-2 flex-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={handleClearChat}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative w-10 h-10 rounded-xl bg-zinc-800/80 border border-pink-500/20 hover:bg-pink-500/10 text-pink-400 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <div className="absolute inset-0 rounded-xl bg-pink-500/5 opacity-0 hover:opacity-100 transition-opacity" />
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Clear Chat</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your furniture idea..."
                  disabled={isLoading}
                  className="bg-zinc-800/50 border-pink-500/20 text-white placeholder:text-zinc-400 flex-1 h-10"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative h-10 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 text-white flex items-center justify-center overflow-hidden group flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Send className="h-4 w-4 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-pink-400/30 to-pink-400/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => handleSubmit(input, "generate")}
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative h-10 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 text-white flex items-center gap-2 justify-center overflow-hidden group flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-medium whitespace-nowrap">
                      Generate Image
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-pink-400/30 to-pink-400/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
                </motion.button>
              </div>
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
