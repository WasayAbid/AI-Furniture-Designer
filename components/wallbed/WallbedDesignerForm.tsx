// components/wallbed/WallbedDesignerForm.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
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
}

interface WallbedDesignerFormProps {}

export const WallbedDesignerForm: React.FC<WallbedDesignerFormProps> = () => {
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
  });

  const [history, setHistory] = useState<WallbedConfig[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<WallbedConfig | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    generatePrompt();
  }, [config]);

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

    prompt += ` only follow the given instructions, only same location cabinets if needed, only same amount cabinets if needed, only same location cupboard if needed, foldable bed, no base of bed, temperature = 0, bright room, fully lit room, sun light shining on the bed, floating bed, floating bed, murphy bed, murphy, murphy wall bed, wallbed, wall bed, 8k picture, 8k picture, 8k picture, realistic picture, realistic picture, lively environment, lively environment, welcoming picture, natural sunlight, The Murphy wallbed should be situated in a spacious, well-lit room with high-end finishes, featuring neutral-toned walls, hardwood flooring, and subtle, inviting decor elements. The room must always include a window positioned to allow natural light to cascade directly onto the Murphy wallbed, creating a warm and realistic atmosphere. The rendering should emphasize impeccable detail, clean lines, balanced proportions, and a sense of refined elegance. The overall impression should be a blend of functionality, sophistication, and a touch of modern luxury, with the floating bed adding to its unique appeal. Focus on photorealistic details, including soft, natural shadows, realistic material textures, accurate reflections, and a believable lighting balance between natural and artificial light, making the scene feel inviting and cozy.`;

    setConfig((prev) => ({ ...prev, prompt: prompt }));
  };
  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setError(null);
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
      setCurrentImageUrl(data.imageUrl);
      const newHistoryItem = { ...config, imageUrl: data.imageUrl };
      setHistory((prev) => [...prev.slice(-3), newHistoryItem]);
      toast.success("Design generated successfully!");
    } catch (error: any) {
      console.error("Error generating image:", error);
      setError(error.message || "Failed to generate design");
      toast.error(error.message || "Failed to generate design");
    } finally {
      setIsGenerating(false);
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
    <>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-2 text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-white to-pink-200"
      >
        Design Your Custom Wall Bed
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 bg-zinc-800 p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-white">
            Basic Configuration
          </h2>
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
          <Button
            className="w-full bg-pink-600 text-white"
            onClick={handleGenerateImage}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Generate Design"
            )}
          </Button>
        </motion.div>

        <motion.div className="bg-zinc-800 p-6 rounded-xl shadow-lg">
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="Generated wall bed design"
              className="w-full h-full object-contain cursor-pointer"
              onClick={() => handleEnlargeImage(currentImageUrl)}
            />
          ) : (
            <p className="text-zinc-400">
              Configure your wall bed and click Generate Design
            </p>
          )}
          {error && <div className="mt-4 text-red-500">Error: {error}</div>}
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
        <DialogContent className="max-w-4xl bg-black border-2 border-pink-500/20">
          <div className="aspect-square relative rounded-lg overflow-hidden">
            {enlargedImageUrl && (
              <img
                src={enlargedImageUrl}
                alt="Enlarged wall bed design"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
