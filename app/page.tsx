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
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const FURNITURE_SHOWCASE = [
  {
    id: 1,
    title: "Green Panel Wallbed with Cabinets",
    description: "Featuring integrated long cabinets on each side ",
    image: "/images/display3.png",
  },
  {
    id: 2,
    title: "Light Wood Wallbed with Cupboard",
    description:
      "Featuring integrated cabinets and shelving on each side, finished in a light wood veneer.",
    image: "/images/display1.png",
  },
  {
    id: 3,
    title: "Luxury Vanity Station",
    description:
      "This modern vanity room showcases a light wood dressing table and cabinetry, creating a bright and sophisticated space.",
    image: "/images/display6.png",
  },
  {
    id: 4,
    title: "Modern Ribbed Wood Kitchen",
    description:
      "A warm and inviting kitchen featuring natural wood cabinets with a distinctive vertical ribbed design.",
    image: "/images/display5.png",
  },
  {
    id: 6,
    title: "Modern Greenish-Grey Wallbed",
    description:
      "This modern wallbed showcases a sleek,  enhanced by slim cabinets seamlessly integrated on either side.",
    image: "/images/display2.png",
  },
  {
    id: 5,
    title: " Panelled Elegance Wallbed",
    description:
      "A modern wallbed with four top cabinets and sleek side panels, offering both style and ample storage.",
    image: "/images/display44.png",
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex flex-col items-center justify-center gap-8 md:gap-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4 md:px-0 w-full"
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-white to-pink-200">
              AI Furniture Designer
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-2xl text-zinc-300 mb-4 max-w-3xl mx-auto"
            >
              Transform your living space with our innovative AI-powered
              furniture design solutions
            </motion.p>
          </motion.div>

          {/* Carousel Container */}
          <div
            className="relative w-full max-w-[1400px] mx-auto rounded-2xl overflow-hidden shadow-2xl bg-zinc-900/80 border border-pink-500/10"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full">
              <div className="w-full pb-[56.25%] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={FURNITURE_SHOWCASE[currentIndex].image}
                      alt={FURNITURE_SHOWCASE[currentIndex].title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
                        <motion.h2
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-xl md:text-4xl font-bold mb-2 md:mb-4"
                        >
                          {FURNITURE_SHOWCASE[currentIndex].title}
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-sm md:text-xl text-zinc-200 max-w-2xl line-clamp-2 md:line-clamp-none"
                        >
                          {FURNITURE_SHOWCASE[currentIndex].description}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-pink-900/30 hover:bg-pink-900/50 text-pink-100 p-2 md:p-3 rounded-full backdrop-blur-sm transition-all z-10"
              >
                <ChevronLeft className="h-4 w-4 md:h-8 md:w-8" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-pink-900/30 hover:bg-pink-900/50 text-pink-100 p-2 md:p-3 rounded-full backdrop-blur-sm transition-all z-10"
              >
                <ChevronRight className="h-4 w-4 md:h-8 md:w-8" />
              </button>

              {/* Progress Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {FURNITURE_SHOWCASE.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-pink-400 w-4 md:w-8"
                        : "bg-zinc-400 hover:bg-zinc-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto px-4">
            <Link href="/wallbed" className="group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 p-1"
              >
                <div className="relative overflow-hidden rounded-xl bg-zinc-950 p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 rounded-xl bg-pink-500/10">
                        <Bed className="h-8 w-8 text-pink-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        Design Custom Wallbed
                      </h3>
                    </div>
                    <p className="text-zinc-400 mb-6">
                      Create your perfect wall bed design with our AI-powered
                      customization tool
                    </p>
                    <div className="flex items-center text-pink-400 group-hover:text-pink-300 transition-colors">
                      <span className="font-medium">Start Designing</span>
                      <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            <Link href="/chat" className="group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-1"
              >
                <div className="relative overflow-hidden rounded-xl bg-zinc-950 p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 rounded-xl bg-pink-500/10">
                        <MessageSquare className="h-8 w-8 text-pink-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        Chat with AI Designer
                      </h3>
                    </div>
                    <p className="text-zinc-400 mb-6">
                      Get personalized furniture design recommendations from our
                      AI expert
                    </p>
                    <div className="flex items-center text-pink-400 group-hover:text-pink-300 transition-colors">
                      <span className="font-medium">Start Chat</span>
                      <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
