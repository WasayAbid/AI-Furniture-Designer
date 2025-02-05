"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HANDLE_STYLES = [
  "Modern Pull",
  "Classic Knob",
  "Hidden",
  "Integrated",
  "Metallic Bar",
];

interface HandleStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function HandleStyleSelector({
  value,
  onChange,
}: HandleStyleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-200">Handle Style</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
          <SelectValue placeholder="Select Handle Style" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-pink-500/20">
          {HANDLE_STYLES.map((style) => (
            <SelectItem key={style} value={style} className="text-white">
              {style}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
