"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoorClosed, LayoutGrid, Table } from "lucide-react";
import MultiSelect from "../ui/multiselect";

const DRESSING_TABLE_STYLES = ["Modern", "Classic", "Minimalist", "Luxurious"];
const CABINET_PLACEMENT_OPTIONS = ["Top", "Left", "Right", "Both Side"];

interface StorageOptionsProps {
  config: any;
  onChange: (updates: Partial<any>) => void;
}

export function StorageOptions({ config, onChange }: StorageOptionsProps) {
  useEffect(() => {
    if (!config.cabinetPlacement) {
      onChange({ cabinetPlacement: [] });
    }
  }, [config.hasCabinets, onChange]);

  const handleCabinetPlacementChange = (value: string[]) => {
    onChange({ cabinetPlacement: value });
  };
  const handleSingleCabinetPlacementChange = (value: string) => {
    onChange({ cabinetPlacement: [value] });
  };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Storage Options</h3>

      {/* Cupboard Options */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasCupboard"
            checked={config.hasCupboard}
            onChange={(e) => onChange({ hasCupboard: e.target.checked })}
            className="rounded border-pink-500/20 bg-zinc-800/50"
          />
          <label
            htmlFor="hasCupboard"
            className="flex items-center text-zinc-200"
          >
            <DoorClosed className="mr-2 h-4 w-4" />
            Add Cupboards
          </label>
        </div>

        {config.hasCupboard && (
          <div className="pl-6 space-y-2">
            <Select
              value={config.cupboardLocation}
              onValueChange={(value) => onChange({ cupboardLocation: value })}
            >
              <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
                <SelectValue placeholder="Cupboard Location" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-pink-500/20">
                <SelectItem value="left" className="text-white">
                  Left Side Only
                </SelectItem>
                <SelectItem value="right" className="text-white">
                  Right Side Only
                </SelectItem>
                <SelectItem value="both" className="text-white">
                  Both Sides
                </SelectItem>
              </SelectContent>
            </Select>

            {config.cupboardLocation === "both" ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-zinc-400">Left Side</label>
                  <Select
                    value={String(
                      (config.cupboardCount as { left: number; right: number })
                        .left
                    )}
                    onValueChange={(value) =>
                      onChange({
                        cupboardCount: {
                          ...(config.cupboardCount as {
                            left: number;
                            right: number;
                          }),
                          left: parseInt(value),
                        },
                      })
                    }
                  >
                    <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
                      <SelectValue placeholder="Count" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-pink-500/20">
                      {[1, 2, 3].map((num) => (
                        <SelectItem
                          key={num}
                          value={num.toString()}
                          className="text-white"
                        >
                          {num} Cupboard{num > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Right Side</label>
                  <Select
                    value={String(
                      (config.cupboardCount as { left: number; right: number })
                        .right
                    )}
                    onValueChange={(value) =>
                      onChange({
                        cupboardCount: {
                          ...(config.cupboardCount as {
                            left: number;
                            right: number;
                          }),
                          right: parseInt(value),
                        },
                      })
                    }
                  >
                    <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
                      <SelectValue placeholder="Count" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-pink-500/20">
                      {[1, 2, 3].map((num) => (
                        <SelectItem
                          key={num}
                          value={num.toString()}
                          className="text-white"
                        >
                          {num} Cupboard{num > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <Select
                value={String(
                  typeof config.cupboardCount === "number"
                    ? config.cupboardCount
                    : 1
                )}
                onValueChange={(value) =>
                  onChange({ cupboardCount: parseInt(value) })
                }
              >
                <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
                  <SelectValue placeholder="Number of Cupboards" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-pink-500/20">
                  {[1, 2, 3].map((num) => (
                    <SelectItem
                      key={num}
                      value={num.toString()}
                      className="text-white"
                    >
                      {num} Cupboard{num > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>

      {/* Cabinet Options */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasCabinets"
            checked={config.hasCabinets}
            onChange={(e) => {
              onChange({
                hasCabinets: e.target.checked,
                cabinetPlacement: e.target.checked
                  ? config.cabinetPlacement || []
                  : [],
              });
            }}
            className="rounded border-pink-500/20 bg-zinc-800/50"
          />
          <label
            htmlFor="hasCabinets"
            className="flex items-center text-zinc-200"
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Add Cabinets
          </label>
        </div>

        {config.hasCabinets && (
          <div className="pl-6 space-y-2">
            <Select
              value={config.cabinetPlacement?.[0]}
              onValueChange={handleSingleCabinetPlacementChange}
            >
              <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
                <SelectValue placeholder="Select Side" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-pink-500/20">
                {CABINET_PLACEMENT_OPTIONS.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="text-white"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={config.cabinetCount.toString()}
              onValueChange={(value) =>
                onChange({ cabinetCount: parseInt(value) })
              }
            >
              <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
                <SelectValue placeholder="Number of Cabinets" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-pink-500/20">
                {[1, 2, 3, 4, 6].map((num) => (
                  <SelectItem
                    key={num}
                    value={num.toString()}
                    className="text-white"
                  >
                    {num} Cabinet{num > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Dressing Table Option */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasDressingTable"
            checked={config.hasDressingTable}
            onChange={(e) => onChange({ hasDressingTable: e.target.checked })}
            className="rounded border-pink-500/20 bg-zinc-800/50"
          />
          <label
            htmlFor="hasDressingTable"
            className="flex items-center text-zinc-200"
          >
            <Table className="mr-2 h-4 w-4" />
            Add Dressing Table
          </label>
        </div>

        {config.hasDressingTable && (
          <div className="pl-6 space-y-2">
            <Select
              value={config.dressingTableStyle}
              onValueChange={(value) => onChange({ dressingTableStyle: value })}
            >
              <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
                <SelectValue placeholder="Dressing Table Style" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-pink-500/20">
                {DRESSING_TABLE_STYLES.map((style) => (
                  <SelectItem key={style} value={style} className="text-white">
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={config.dressingTableSide}
              onValueChange={(value) => onChange({ dressingTableSide: value })}
            >
              <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
                <SelectValue placeholder="Dressing Table Side" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-pink-500/20">
                <SelectItem value="left" className="text-white">
                  Left Side
                </SelectItem>
                <SelectItem value="right" className="text-white">
                  Right Side
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={config.dressingTableCabinets.toString()}
              onValueChange={(value) =>
                onChange({ dressingTableCabinets: parseInt(value) })
              }
            >
              <SelectTrigger className="bg-zinc-800/50 border-pink-500/20 text-white">
                <SelectValue placeholder="Number of Cabinets" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-pink-500/20">
                {[1, 2, 3].map((num) => (
                  <SelectItem
                    key={num}
                    value={num.toString()}
                    className="text-white"
                  >
                    {num} Cabinet{num > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
