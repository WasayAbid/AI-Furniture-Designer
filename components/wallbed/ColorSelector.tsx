"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, Search } from "lucide-react";
import { useState } from "react";
import { SketchPicker } from "react-color";

const COLORS = {
  Neutral: [
    "White",
    "Black",
    "Gray",
    "Beige",
    "Cream",
    "Off-White",
    "Charcoal",
  ],
  Bold: [
    "Navy Blue",
    "Forest Green",
    "Burgundy",
    "Deep Purple",
    "Royal Blue",
    "Emerald",
  ],
  Pastels: ["Sage Green", "Dusty Blue", "Blush Pink", "Lavender", "Mint"],
};

interface ColorSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

// Helper function to determine a valid CSS color
const isValidColor = (color: string): boolean => {
  if (!color) return false;
  // Basic check for valid CSS color names or hex values
  return (
    /^([a-zA-Z]+|#[0-9a-fA-F]{3,6})$/.test(color) ||
    Object.values(COLORS).flat().includes(color)
  );
};

export function ColorSelector({ value, onChange }: ColorSelectorProps) {
  const [colorSearch, setColorSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const filteredColors = Object.entries(COLORS).reduce(
    (acc, [category, colors]) => {
      const filtered = colors.filter((color) =>
        color.toLowerCase().includes(colorSearch.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {} as Record<string, string[]>
  );
  const handleColorChange = (color: any) => {
    onChange(color.hex);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-200">Color</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start bg-zinc-800/50 border-pink-500/20 text-white"
          >
            <Palette className="mr-2 h-4 w-4" />
            {value}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4 bg-zinc-800 border-pink-500/20">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Search colors..."
                value={colorSearch}
                onChange={(e) => setColorSearch(e.target.value)}
                className="flex-1 bg-zinc-700/50 border-pink-500/20 text-white placeholder:text-zinc-400"
              />
            </div>

            <Button
              onClick={() => setShowPicker(!showPicker)}
              className="w-full bg-zinc-700/50 border-pink-500/20 text-white"
            >
              {showPicker ? "Hide Color Picker" : "Show Color Picker"}
            </Button>
            {showPicker && (
              <SketchPicker color={value} onChange={handleColorChange} />
            )}
            {Object.entries(filteredColors).map(([category, colors]) => (
              <div key={category}>
                <h3 className="font-semibold text-white mb-2">{category}</h3>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`p-2 rounded hover:bg-zinc-700 flex items-center gap-2 ${
                        value === color ? "ring-2 ring-pink-500" : ""
                      }`}
                      onClick={() => onChange(color)}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-pink-500/20"
                        style={{
                          backgroundColor: isValidColor(color)
                            ? color.toLowerCase()
                            : "transparent",
                        }}
                      />
                      <span className="text-xs text-center text-white">
                        {color}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
