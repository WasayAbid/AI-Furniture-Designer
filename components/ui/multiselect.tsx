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

    // Ensure value is always an array
    const currentSelected = Array.isArray(value) ? value : [];

    const handleSelection = (option: string) => {
      if (currentSelected.includes(option)) {
        onChange(currentSelected.filter((item) => item !== option));
      } else {
        onChange([...currentSelected, option]);
      }
    };

    const displayedValue =
      currentSelected?.length > 0 ? currentSelected.join(", ") : placeholder;

    return (
      <Select open={open} onOpenChange={setOpen}>
        <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
          <SelectValue placeholder={displayedValue} />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-pink-500/20">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="text-white hover:bg-transparent"
              onSelect={() => handleSelection(option)}
            >
              <div className="flex items-center justify-between p-2">
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
