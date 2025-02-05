"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ options, value, onChange, placeholder }, ref) => {
    const [open, setOpen] = React.useState(false);

    const handleSelection = (option: string) => {
      if (value.includes(option)) {
        onChange(value.filter((item) => item !== option));
      } else {
        onChange([...value, option]);
      }
    };

    const displayedValue = value.length > 0 ? value.join(", ") : placeholder;

    return (
      <Select open={open} onOpenChange={setOpen} value={displayedValue}>
        <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-pink-500/20">
          {options.map((option) => (
            <SelectItem key={option} value={option} className="text-white">
              <div
                className="flex items-center justify-between p-2 hover:bg-zinc-700"
                onClick={() => handleSelection(option)}
              >
                <input
                  type="checkbox"
                  checked={value.includes(option)}
                  onChange={() => {}}
                  className="mr-2 rounded border-pink-500/20 bg-zinc-800/50"
                />
                <span>{option}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
