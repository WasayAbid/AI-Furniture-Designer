"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette } from "lucide-react";

const COLORS = {
  "Wood Tones": [
    "Natural Oak",
    "Walnut",
    "Mahogany",
    "Cherry",
    "Maple",
    "Teak",
    "Ebony",
  ],
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

interface SofaOptionsProps {
  hasSofa: boolean;
  sofaColor: string;
  onHasSofaChange: (value: boolean) => void;
  onSofaColorChange: (value: string) => void;
}

export function SofaOptions({
  hasSofa,
  sofaColor,
  onHasSofaChange,
  onSofaColorChange,
}: SofaOptionsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="hasSofa"
          checked={hasSofa}
          onChange={(e) => onHasSofaChange(e.target.checked)}
          className="rounded border-pink-500/20 bg-zinc-800/50"
        />
        <label htmlFor="hasSofa" className="text-zinc-200">
          Add Sofa
        </label>
      </div>

      {hasSofa && (
        <div className="pl-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start bg-zinc-800/50 border-pink-500/20 text-white"
              >
                <Palette className="mr-2 h-4 w-4" />
                {sofaColor || "Choose Sofa Color"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-4 bg-zinc-800 border-pink-500/20">
              <div className="space-y-4">
                {Object.entries(COLORS).map(([category, colors]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-white mb-2">
                      {category}
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          className={`p-2 rounded hover:bg-zinc-700 flex flex-col items-center gap-1 ${
                            sofaColor === color ? "ring-2 ring-pink-500" : ""
                          }`}
                          onClick={() => onSofaColorChange(color)}
                        >
                          <div
                            className="w-8 h-8 rounded-full border border-pink-500/20"
                            style={{ backgroundColor: color.toLowerCase() }}
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
      )}
    </div>
  );
}
