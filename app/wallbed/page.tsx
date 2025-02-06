"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { WallbedDesignerForm } from "@/components/wallbed/WallbedDesignerForm";

export default function WallbedDesigner() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleGoBack = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 relative">
      <Button
        onClick={handleGoBack}
        variant="ghost"
        className="absolute top-24 left-4 z-10 p-2 text-zinc-300 hover:text-white hover:bg-zinc-900/30 rounded-full border border-pink-500/20"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <div className="container mx-auto px-4 py-8">
        <WallbedDesignerForm />
      </div>
    </div>
  );
}
