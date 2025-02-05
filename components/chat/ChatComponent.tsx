"use client";

import { useState, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  Lightbulb,
  AlertTriangle,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  image?: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "system",
    content:
      "You are an expert furniture designer specializing in minimalist, functional designs. Focus on clean lines, premium materials, and perfect lighting in your image generations.",
  },
];

const PRESET_PROMPTS = [
  {
    title: "Kitchen Cabinets",
    prompt:
      "generate a minimalist kitchen with sleek cabinets in white and wood tones. Show natural light from large windows highlighting the clean lines and premium materials.",
    icon: "🪑",
  },
  {
    title: "Dressing Table",
    prompt:
      "generate a modern dressing table with a floating mirror, integrated LED lighting, and hidden storage. Natural light should emphasize the luxurious finishes.",
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

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const router = useRouter();
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent, customPrompt?: string) => {
    e.preventDefault();
    if (!input.trim() && !customPrompt) return;

    const userMessage = customPrompt || input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    const shouldGenerateImage =
      userMessage.toLowerCase().includes("generate image") ||
      userMessage.toLowerCase().includes("make") ||
      userMessage.toLowerCase().includes("show") ||
      userMessage.toLowerCase().includes("create a visualization") ||
      userMessage.toLowerCase().includes("create") ||
      userMessage.toLowerCase().includes("generate") ||
      userMessage.toLowerCase().includes("image") ||
      userMessage.toLowerCase().includes("picture") ||
      userMessage.toLowerCase().includes("pic") ||
      userMessage.toLowerCase().includes("img") ||
      userMessage.toLowerCase().includes("show you a design") ||
      userMessage.toLowerCase().includes("visualize") ||
      userMessage.toLowerCase().includes("render");

    setIsGeneratingImage(shouldGenerateImage);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
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

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantResponse,
          image: imageUrl,
        },
      ]);
    } catch (error: any) {
      console.error("Error:", error);
      if (isClient) {
        toast.error(
          error.message || "Failed to get response. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
      setIsGeneratingImage(false);
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
          <ScrollArea className="flex-1 p-4">
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
            className="p-4 border-t border-pink-500/10"
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
