"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MATERIALS = [
  {
    name: "Antique White",
    imageUrl: "/images/material_images/antique_white.png",
  },
  {
    name: "off white",
    imageUrl: "/images/material_images/off_white.png",
  },
  {
    name: "Light Grey Oak",
    imageUrl: "/images/material_images/light_grey_oak.png",
  },
  {
    name: "Light Beige Wood",
    imageUrl: "/images/material_images/light_beige_wood.png",
  },
  {
    name: "Concrete Gray",
    imageUrl: "/images/material_images/concrete_gray.png",
  },
  {
    name: "Cream White",
    imageUrl: "/images/material_images/cream_white.png",
  },
  {
    name: "Fog Gray",
    imageUrl: "/images/material_images/fog_gray.png",
  },
  {
    name: "Light Cool Gray",
    imageUrl: "/images/material_images/light_cool_gray.png",
  },
  {
    name: "Greenish Gray",
    imageUrl: "/images/material_images/greenish_gray.png",
  },
  {
    name: "Dark Gray Wood",
    imageUrl: "/images/material_images/dark_gray_wood.png",
  },
  {
    name: "Dark Brown",
    imageUrl: "/images/material_images/dark_brown.png",
  },
  {
    name: "Medium Brown Wood",
    imageUrl: "/images/material_images/medium_brown_wood.png",
  },
  {
    name: "Dark Brown",
    imageUrl: "/images/material_images/dark_brown.png",
  },
  {
    name: "Light Silver",
    imageUrl: "/images/material_images/light_silver.png",
  },
  {
    name: "Medium Brown",
    imageUrl: "/images/material_images/medium_brown.png",
  },
  {
    name: "Dark Red Wood",
    imageUrl: "/images/material_images/dark_red_wood.png",
  },
  {
    name: "Light Brown",
    imageUrl: "/images/material_images/light_brown.png",
  },
  {
    name: "medium brown wood",
    imageUrl: "/images/material_images/medium_brown_wood.png",
  },
  {
    name: "walnut",
    imageUrl: "/images/material_images/walnut.png",
  },
];

interface MaterialSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MaterialSelector({ value, onChange }: MaterialSelectorProps) {
  const [open, setOpen] = useState(false);
  const selectedMaterial = MATERIALS.find((mat) => mat.name === value);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-200">Material</label>
      <Select
        value={value}
        onValueChange={onChange}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white flex items-center justify-between">
          {value ? (
            <div className="flex items-center gap-2">
              <span>{value}</span>
              {selectedMaterial?.imageUrl && (
                <div className="w-4 h-4 rounded-full overflow-hidden">
                  <img
                    src={selectedMaterial?.imageUrl}
                    alt={value}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            <SelectValue placeholder="Select Material" />
          )}
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-pink-500/20 p-2 ">
          <div className="grid grid-cols-4 gap-4 p-2 ">
            {MATERIALS.map((material) => (
              <SelectItem
                key={material.name}
                value={material.name}
                className="text-white"
              >
                <button
                  onClick={() => setOpen(false)}
                  className={`relative w-12 h-12 rounded-full border-2 border-transparent hover:border-pink-400 focus:ring-2 ring-pink-500 focus:outline-none`}
                >
                  <div
                    className={
                      "absolute top-0 left-0 w-full h-full rounded-full overflow-hidden"
                    }
                  >
                    <img
                      src={material.imageUrl}
                      alt={material.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
                <span className="block mt-2 text-xs text-center">
                  {material.name}
                </span>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
