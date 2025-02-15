"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import { toast } from "sonner";

interface HistoryItem {
  imageUrl?: string;
  bedSize: string;
  style: string;
  color: string;
  material: string;
  handleStyle: string;
  lighting: string;
  hasCupboard: boolean;
  cupboardCount: number | { left: number; right: number };
  cupboardLocation: string;
  hasCabinets: boolean;
  cabinetCount: number;
  cabinetPlacement: string;
  hasDressingTable: boolean;
  dressingTableStyle: string;
  dressingTableSide: string;
  dressingTableCabinets: number;
  hasSofa: boolean;
  sofaColor: string;
  timestamp?: number;
}

interface DesignHistoryProps {
  history: HistoryItem[];
  selectedHistoryItem: HistoryItem | null;
  onSelectHistoryItem: (item: HistoryItem | null) => void;
  onLoadDesign: (design: HistoryItem) => void;
}

// Function to save image
const saveImage = async (imageUrl: string | null) => {
  if (!imageUrl) {
    toast.error("No image to save.");
    return;
  }

  try {
    const proxyUrl = `/api/proxy-image?imageUrl=${encodeURIComponent(
      imageUrl
    )}`;
    const response = await fetch(proxyUrl, {
      method: "GET",
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch image:",
        response.status,
        response.statusText
      );
      toast.error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wallbed_design.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Error saving image:", error);
    toast.error(`Failed to save image: ${error.message}`);
  }
};

export function DesignHistory({
  history,
  selectedHistoryItem,
  onSelectHistoryItem,
  onLoadDesign,
}: DesignHistoryProps) {
  return (
    <>
      {history.length > 0 && (
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-pink-500/10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-pink-400" />
            <h3 className="text-lg font-semibold text-white">Design History</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => onSelectHistoryItem(item)}
                className="relative aspect-square bg-zinc-800/50 rounded-lg overflow-hidden hover:ring-2 ring-pink-500 transition-all"
              >
                {/* Display image from URL */}
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={`Design ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-xs text-zinc-400">Design {index + 1}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <Dialog
        open={!!selectedHistoryItem}
        onOpenChange={() => onSelectHistoryItem(null)}
      >
        <DialogContent className="max-w-4xl bg-zinc-800 border-pink-500/20">
          <DialogTitle className="text-white">Design Details</DialogTitle>
          <div className="grid grid-cols-2 gap-8">
            {selectedHistoryItem?.imageUrl ? (
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <img
                  src={selectedHistoryItem.imageUrl}
                  alt="Historical design"
                  className="w-full h-full object-cover"
                />
                <Button
                  onClick={() => saveImage(selectedHistoryItem.imageUrl!)}
                  className="mt-2 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white"
                >
                  Save Image
                </Button>
              </div>
            ) : (
              <div>No Image to Display</div>
            )}
            <div className="space-y-4 text-zinc-200">
              {selectedHistoryItem && (
                <div className="space-y-2">
                  <p>
                    <strong>Bed Size:</strong> {selectedHistoryItem.bedSize}
                  </p>
                  <p>
                    <strong>Style:</strong> {selectedHistoryItem.style}
                  </p>
                  <p>
                    <strong>Color:</strong> {selectedHistoryItem.color}
                  </p>
                  <p>
                    <strong>Material:</strong> {selectedHistoryItem.material}
                  </p>
                  <p>
                    <strong>Handle Style:</strong>{" "}
                    {selectedHistoryItem.handleStyle}
                  </p>
                  <p>
                    <strong>Lighting:</strong> {selectedHistoryItem.lighting}
                  </p>
                  {selectedHistoryItem.hasCupboard && (
                    <p>
                      <strong>Cupboard:</strong>{" "}
                      {typeof selectedHistoryItem.cupboardCount === "object"
                        ? `${selectedHistoryItem.cupboardCount.left} on left, ${selectedHistoryItem.cupboardCount.right} on right`
                        : `${selectedHistoryItem.cupboardCount} on ${selectedHistoryItem.cupboardLocation}`}
                    </p>
                  )}
                  {selectedHistoryItem.hasCabinets && (
                    <p>
                      <strong>Cabinets:</strong>{" "}
                      {selectedHistoryItem.cabinetCount} on{" "}
                      {selectedHistoryItem.cabinetPlacement}
                    </p>
                  )}
                  {selectedHistoryItem.hasDressingTable && (
                    <p>
                      <strong>Dressing Table:</strong>{" "}
                      {selectedHistoryItem.dressingTableStyle} style on{" "}
                      {selectedHistoryItem.dressingTableSide} side with{" "}
                      {selectedHistoryItem.dressingTableCabinets} cabinets
                    </p>
                  )}
                  {selectedHistoryItem.hasSofa && (
                    <p>
                      <strong>Sofa:</strong> {selectedHistoryItem.sofaColor}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
