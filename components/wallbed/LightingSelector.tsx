"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LIGHTING_OPTIONS = [
  "None",
  "RGB Strip",
  "LED Strip",

  "Spotlights",
  "Ambient",
  "Reading Lights",
];

interface LightingSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function LightingSelector({ value, onChange }: LightingSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-200">Lighting</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
          <SelectValue placeholder="Select Lighting" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-pink-500/20">
          {LIGHTING_OPTIONS.map((option) => (
            <SelectItem key={option} value={option} className="text-white">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
