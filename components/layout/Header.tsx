// components/layout/Header.js
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Info, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserMenuContent } from "./UserMenu"; // Updated import path - relative to layout directory
import { UserMenuDesktop } from "./UserMenuDesktop";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleHomeClick = () => {
    router.push("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
              className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-white to-pink-200"
              whileHover={{ scale: 1.05 }}
            >
              Murphy Al-Saham
            </motion.h1>
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-zinc-300 hover:text-white"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/about"
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
            >
              <Info className="h-5 w-5" />
              <span>About</span>
            </Link>
            <div className="relative">
              {isDesktop ? <UserMenuDesktop /> : <UserMenuContent />}{" "}
              {/* Conditional User Menu */}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="fixed top-0 right-0 h-screen bg-zinc-900/95 backdrop-blur-md z-[99] w-[280px] lg:hidden"
            >
              {/* Close Button for Mobile Menu */}
              <button
                onClick={closeMenu}
                className="absolute top-4 right-4 p-2 text-zinc-300 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="h-full flex flex-col px-4 py-8">
                <div className="mb-8">
                  <motion.h2
                    className="text-lg font-semibold text-white"
                    whileHover={{ scale: 1.05 }}
                  >
                    Menu
                  </motion.h2>
                </div>
                <nav className="flex flex-col space-y-2">
                  {/* Removed Navigation Links */}
                </nav>
                <div className="mt-auto">
                  <UserMenuContent
                    isMobileMenuOpen={isMenuOpen}
                    onCloseMobileMenu={closeMenu} // Use the new closeMenu function
                  />{" "}
                  {/* UserMenuContent for mobile */}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}