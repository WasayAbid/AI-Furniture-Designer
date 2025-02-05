"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bed } from "lucide-react";

const BED_SIZES = ["Single", "Double", "Queen", "King"];

interface BedSizeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function BedSizeSelector({ value, onChange }: BedSizeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-200">Bed Size</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
          <SelectValue placeholder="Select Bed Size" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-pink-500/20">
          {BED_SIZES.map((size) => (
            <SelectItem key={size} value={size} className="text-white">
              <div className="flex items-center">
                <Bed className="mr-2 h-4 w-4" />
                {size}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
