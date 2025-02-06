"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Header() {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push("/");
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-b from-zinc-900/90 to-transparent backdrop-blur-md border-b border-pink-500/10"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleHomeClick}
            className="group relative z-[101] px-0 hover:bg-transparent"
          >
            <motion.h1
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-white to-pink-200"
              whileHover={{ scale: 1.05 }}
            >
              Murphy Al-Saham
            </motion.h1>
          </Button>

          <nav className="flex items-center gap-6">
            <Link
              href="/about"
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
            >
              <Info className="h-5 w-5" />
              <span>About</span>
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
