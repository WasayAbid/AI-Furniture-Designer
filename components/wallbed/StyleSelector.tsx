"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STYLES = [
  "Contemporary",
  "Modern",
  "Traditional",
  "Minimalist",
  "Industrial",
  "Scandinavian",
];

interface StyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-200">Overall Style</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
          <SelectValue placeholder="Select Style" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-pink-500/20">
          {STYLES.map((style) => (
            <SelectItem key={style} value={style} className="text-white">
              {style}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
