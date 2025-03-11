"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BedSizeSelector } from "@/components/wallbed/BedSizeSelector";
import { MaterialSelector } from "@/components/wallbed/MaterialSelector";
import { ColorSelector } from "@/components/wallbed/ColorSelector";
import { LightingSelector } from "@/components/wallbed/LightingSelector";
import { StorageOptions } from "@/components/wallbed/StorageOptions";
import { SofaOptions } from "@/components/wallbed/SofaOptions";
import { DesignHistory } from "@/components/wallbed/DesignHistory";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface WallbedConfig {
  bedSize: string;
  color: string;
  material: string;
  hasCupboard: boolean;
  cupboardCount: number | { left: number; right: number };
  cupboardLocation: string;
  hasCabinets: boolean;
  cabinetCount: number;
  cabinetPlacement: string;
  hasDressingTable: boolean;
  dressingTableStyle: string;
  dressingTableSide: string;
  dressingTableCabinets: number;
  hasSofa: boolean;
  sofaColor: string;
  style: string;
  lighting: string;
  handleStyle: string;
  prompt?: string;
  imageUrl?: string;
  timestamp?: number;
}

const WALLBED_DESIGN_HISTORY = "wallbed_design_history";
const COOKIE_EXPIRATION_DAYS = 30;

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

const filterOldDesigns = (designs: WallbedConfig[]): WallbedConfig[] => {
  const cutoff = Date.now() - COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
  return designs.filter(
    (design) => design.timestamp && design.timestamp >= cutoff
  );
};

const saveImage = async (imageUrl: string | null) => {
  if (!imageUrl) {
    toast.error("No image to save.");
    return;
  }

  try {
    const proxyUrl = `/api/proxy-image?imageUrl=${encodeURIComponent(
      imageUrl
    )}`;
    const response = await fetch(proxyUrl, {
      method: "GET",
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch image:",
        response.status,
        response.statusText
      );
      toast.error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wallbed_design.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Error saving image:", error);
    toast.error(`Failed to save image: ${error.message}`);
  }
};

export function WallbedDesignerForm() {
  const [isClient, setIsClient] = useState(false);
  const [config, setConfig] = useState<WallbedConfig>({
    bedSize: "Queen",
    color: "Natural Oak",
    material: "Wood",
    hasCupboard: false,
    cupboardCount: { left: 1, right: 1 },
    cupboardLocation: "both",
    hasCabinets: false,
    cabinetCount: 2,
    cabinetPlacement: "top",
    hasDressingTable: false,
    dressingTableStyle: "Modern",
    dressingTableSide: "left",
    dressingTableCabinets: 2,
    hasSofa: false,
    sofaColor: "Gray",
    style: "Contemporary",
    lighting: "None",
    handleStyle: "Modern Pull",
    prompt: "",
    imageUrl: "",
    timestamp: 0,
  } as WallbedConfig);
  const [history, setHistory] = useState<WallbedConfig[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<WallbedConfig | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null); // Timer state

  useEffect(() => {
    setIsClient(true);
    loadDesignHistoryFromCookie();
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      setCountdown(null); // Reset countdown when it reaches 0
    }
    if (countdown != null && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  useEffect(() => {
    generatePrompt();
  }, [config]);

  const loadDesignHistoryFromCookie = () => {
    const cookieValue = getCookie(WALLBED_DESIGN_HISTORY);
    if (cookieValue) {
      try {
        const parsedHistory = JSON.parse(decodeURIComponent(cookieValue));
        const recentHistory = filterOldDesigns(parsedHistory);
        setHistory(recentHistory);
      } catch (error) {
        console.error("Error parsing design history from cookie:", error);
        setCookie(WALLBED_DESIGN_HISTORY, "", 0);
      }
    }
  };

  const saveDesignHistoryToCookie = (updatedHistory: WallbedConfig[]) => {
    const recentHistory = filterOldDesigns(updatedHistory);
    const cookieValue = encodeURIComponent(JSON.stringify(recentHistory));
    setCookie(WALLBED_DESIGN_HISTORY, cookieValue, COOKIE_EXPIRATION_DAYS);
  };

  const handleConfigChange = (updates: Partial<WallbedConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const generatePrompt = () => {
    let prompt = `Generate an exceptionally realistic, ultra-high-definition image of a Murphy wallbed unit (foldable murphy wallbed), seamlessly integrated into a modern, minimalist interior. The design should emphasize clean lines, geometric paneling, and a sophisticated, clutter-free aesthetic. This must be a Murphy wallbed with a floating bed design, giving it an airy and contemporary feel. The image should always include a window from which natural light is casting directly onto the Murphy wallbed, creating a warm and inviting atmosphere.`;

    if (config.bedSize) {
      prompt += ` The Murphy wallbed features a comfortable, floating and foldable ${config.bedSize} sized bed, designed to blend seamlessly into the wall unit and appear suspended above the floor.`;
    }

    if (config.material) {
      prompt += ` The primary material of the Murphy wallbed is a high-quality ${config.material} with a smooth, semi-matte finish, showing realistic wood grain or texture. The color should be a neutral tone that complements the natural light.`;
    }

    if (config.lighting) {
      prompt += `  In addition to the natural light, integrate a sleek, built-in ${config.lighting} lighting system within the Murphy wallbed, emphasizing its architectural lines and creating subtle highlights and shadows, particularly around the floating bed base. The artificial lighting should enhance, not compete with, the natural light.`;
    }

    if (config.hasCupboard) {
      prompt += ` The Murphy wallbed unit includes precisely aligned, built-in cupboards, maintaining a consistent panel design.`;
      if (typeof config.cupboardCount === "number") {
        prompt += ` There must be exactly ${config.cupboardCount} equally sized cupboards, perfectly integrated into the overall design of the Murphy wallbed.`;
      } else {
        prompt += ` There must be exactly ${config.cupboardCount.left} cupboards on the left and exactly ${config.cupboardCount.right} cupboards on the right, mirroring each other for a symmetrical look within the Murphy wallbed design.`;
      }
      prompt += ` Position the cupboards strictly on the ${config.cupboardLocation} side of the Murphy wallbed, maintaining the overall clean lines and minimalist design. No cupboards should be placed on other locations of the murphy wallbed.`;
    }

    if (config.hasCabinets) {
      prompt += ` Incorporate exactly ${config.cabinetCount} seamlessly integrated cabinets on the ${config.cabinetPlacement} area of the Murphy wallbed, ensuring they blend harmoniously with the surrounding panel design. These are the only cabinets that should be on the Murphy wallbed unit.`;
    }

    if (config.hasDressingTable) {
      prompt += ` Include a minimalist, ${config.dressingTableStyle} style dressing table integrated on the ${config.dressingTableSide} side of the Murphy wallbed, accompanied by exactly ${config.dressingTableCabinets} built-in cabinets that follow the overall design principles.`;
    }

    prompt += ` only follow the given instructions, only same location cabinets if needed, only same amount cabinets if needed, only same location cupboard if needed, foldable bed, no base of bed, temperature = 0, bright room, fully lit room, sun light shining on the bed, floating bed, floating bed, murphy bed, murphy, murphy wall bed, wallbed, wall bed, 8k picture, 8k picture, realistic picture, realistic picture, lively environment, lively environment, welcoming picture, natural sunlight, The Murphy wallbed should be situated in a spacious, well-lit room with high-end finishes, featuring neutral-toned walls, hardwood flooring, and subtle, inviting decor elements. The room must always include a window positioned to allow natural light to cascade directly onto the Murphy wallbed, creating a warm and realistic atmosphere. The rendering should emphasize impeccable detail, clean lines, balanced proportions, and a sense of refined elegance. The overall impression should be a blend of functionality, sophistication, and a touch of modern luxury, with the floating bed adding to its unique appeal. Focus on photorealistic details, including soft, natural shadows, realistic material textures, accurate reflections, and a believable lighting balance between natural and artificial light, making the scene feel inviting and cozy.`;

    setConfig((prev) => ({ ...prev, prompt: prompt }));
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setError(null);
    setCountdown(25); // Start countdown timer
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: config.prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();
      const storedImageUrl = data.imageUrl;

      setCurrentImageUrl(storedImageUrl);

      const newHistoryItem: WallbedConfig = {
        ...config,
        imageUrl: storedImageUrl,
        timestamp: Date.now(),
      };
      setHistory((prev) => [...prev.slice(-2), newHistoryItem]);
      saveDesignHistoryToCookie([...history.slice(-2), newHistoryItem]);
      toast.success("Design saved to history!");
    } catch (error: any) {
      console.error("Error generating image:", error);
      setError(error.message || "Failed to generate design");
      toast.error(error.message || "Failed to generate design");
    } finally {
      setIsGenerating(false);
      setCountdown(null); // Stop countdown when generation is done or fails
    }
  };

  const handleLoadDesign = (design: WallbedConfig) => {
    setConfig(design);
    setCurrentImageUrl(design.imageUrl || null);
  };

  const handleEnlargeImage = (url: string) => {
    setEnlargedImageUrl(url);
  };

  const handleCloseEnlargeImage = () => {
    setEnlargedImageUrl(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-white to-pink-200"
      >
        Design Your Custom Wall Bed
      </motion.h1>
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
                These Designs are AI-generated and may not perfectly match your
                vision. Re-generate for different results.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="h-fit space-y-6 bg-zinc-800 p-4 md:p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Basic Configuration
          </h2>
          <div className="space-y-4">
            <BedSizeSelector
              value={config.bedSize}
              onChange={(value) => handleConfigChange({ bedSize: value })}
            />
            <MaterialSelector
              value={config.material}
              onChange={(value) => handleConfigChange({ material: value })}
            />
            <StorageOptions config={config} onChange={handleConfigChange} />
            <LightingSelector
              value={config.lighting}
              onChange={(value) => handleConfigChange({ lighting: value })}
            />
          </div>
          <Button
            className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white py-6 text-lg rounded-xl"
            onClick={handleGenerateImage}
            disabled={isGenerating || countdown !== null} // Disable when generating or countdown active
          >
            {isGenerating || countdown !== null ? ( // Show loader or countdown
              countdown !== null ? (
                <span className="text-lg font-medium">
                  Generating... ({countdown}s)
                </span>
              ) : (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span className="text-lg font-medium">Generating...</span>
                </>
              )
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                <span className="text-lg font-medium">Generate Design</span>
              </>
            )}
          </Button>
        </motion.div>

        <motion.div className="bg-zinc-800 p-4 md:p-6 rounded-xl shadow-lg min-h-[300px] flex items-center justify-center flex-col">
          {currentImageUrl ? (
            <>
              <img
                src={currentImageUrl}
                alt="Generated wall bed design"
                className="w-full h-auto max-h-[600px] object-contain cursor-pointer rounded-lg"
                onClick={() => handleEnlargeImage(currentImageUrl)}
              />
              <Button
                onClick={() => saveImage(currentImageUrl)}
                className="mt-2 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white"
              >
                Save Image
              </Button>
            </>
          ) : (
            <p className="text-zinc-400 text-center px-4">
              Configure your wall bed and click Generate Design
            </p>
          )}
          {error && (
            <div className="mt-4 text-red-500 text-center">{error}</div>
          )}
        </motion.div>
      </div>

      <div className="mt-8">
        <DesignHistory
          history={history}
          selectedHistoryItem={selectedHistoryItem}
          onSelectHistoryItem={setSelectedHistoryItem}
          onLoadDesign={handleLoadDesign}
        />
      </div>

      <Dialog open={!!enlargedImageUrl} onOpenChange={handleCloseEnlargeImage}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl bg-black border-2 border-pink-500/20">
          <div className="relative rounded-lg overflow-hidden">
            {enlargedImageUrl && (
              <img
                src={enlargedImageUrl}
                alt="Enlarged wall bed design"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}