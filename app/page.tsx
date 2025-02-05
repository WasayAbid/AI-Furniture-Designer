// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bed,
  MessageSquare,
  ArrowRight,
  TestTube2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const FURNITURE_SHOWCASE = [
  {
    id: 1,
    title: "Classic Brown Wall Bed",
    description:
      "Sophisticated wall bed design featuring rich mahogany panels and integrated storage cabinets, perfect for modern living spaces",
    image: "/images/brown.jpg",
  },
  {
    id: 2,
    title: "Convertible Wall Bed with Sofa",
    description:
      "Versatile wall bed system with a built-in L-shaped sofa in natural oak finish, ideal for multipurpose rooms",
    image: "/images/wallbed_with_sofa.png",
  },
  {
    id: 3,
    title: "Modern Blue Haven Suite",
    description:
      "Contemporary wall bed with integrated workspace, featuring sleek blue paneling and ambient LED lighting",
    image: "/images/blue_wallbed.png",
  },
  {
    id: 4,
    title: "Designer Kitchen Collection",
    description:
      "Premium black modular kitchen with textured panels, featuring geometric patterns and seamless integration",
    image: "/images/kitchen_cabinets.jpg",
  },
  {
    id: 5,
    title: "Luxury Vanity Station",
    description:
      "Elegant dressing table setup with LED-illuminated mirror, multiple storage drawers, and warm wood finishes",
    image: "/images/dressing_table.jpg",
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((current) => (current + 1) % FURNITURE_SHOWCASE.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentIndex((current) => (current + 1) % FURNITURE_SHOWCASE.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (current) =>
        (current - 1 + FURNITURE_SHOWCASE.length) % FURNITURE_SHOWCASE.length
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="p-2 text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-white to-pink-200">
              AI Furniture Designer
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl text-zinc-300 mb-4 max-w-3xl mx-auto"
            >
              Transform your living space with our innovative AI-powered
              furniture design solutions
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-zinc-400 mt-4"
            >
              A product by Murphy Al Saham
            </motion.p>
          </motion.div>

          {/* Carousel Container */}
          <div
            className="relative w-full max-w-[1400px] mx-auto rounded-2xl overflow-hidden shadow-2xl bg-zinc-900/80 border border-pink-500/10"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="aspect-[16/9] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <img
                    src={FURNITURE_SHOWCASE[currentIndex].image}
                    alt={FURNITURE_SHOWCASE[currentIndex].title}
                    className="w-full h-full object-contain"
                  />
                  {/* Content Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-bold mb-4"
                      >
                        {FURNITURE_SHOWCASE[currentIndex].title}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-zinc-200 max-w-2xl"
                      >
                        {FURNITURE_SHOWCASE[currentIndex].description}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-pink-900/30 hover:bg-pink-900/50 text-pink-100 p-3 rounded-full backdrop-blur-sm transition-all"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-pink-900/30 hover:bg-pink-900/50 text-pink-100 p-3 rounded-full backdrop-blur-sm transition-all"
              >
                <ChevronRight className="h-8 w-8" />
              </button>

              {/* Progress Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {FURNITURE_SHOWCASE.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-pink-400 w-8"
                        : "bg-zinc-400 hover:bg-zinc-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/wallbedlogin">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/20"
              >
                <Bed className="mr-2 h-6 w-6" />
                Design Custom Wallbed
                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/chatlogin">
              <Button
                size="lg"
                variant="outline"
                className="group border-2 border-pink-500/20 bg-black text-white  px-8 py-6 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                <MessageSquare className="mr-2 h-6 w-6" />
                Chat to Design any Furniture
                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              {
                icon: <Bed className="h-8 w-8 text-pink-400" />,
                title: "Space Saving Solutions",
                description:
                  "Transform your living space with our innovative wall beds and multi-functional furniture.",
              },
              {
                icon: <MessageSquare className="h-8 w-8 text-white" />,
                title: "Custom Design",
                description:
                  "Create furniture that perfectly matches your style and space requirements.",
              },
              {
                icon: <TestTube2 className="h-8 w-8 text-pink-300" />,
                title: "Expert Guidance",
                description:
                  "Get personalized recommendations from our AI-powered furniture expert.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-6 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-pink-500/5 transition-all duration-300 border border-pink-500/10"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
