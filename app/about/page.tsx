"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="container mx-auto px-4 py-20">
        <Button
          onClick={handleGoBack}
          variant="ghost"
          className="absolute top-24 left-4 z-10 p-2 text-zinc-300 hover:text-white hover:bg-zinc-900/30 rounded-full border border-pink-500/20"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-12"
        >
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-white to-pink-200 mb-6">
              About Murphy Al-Saham
            </h1>
            <p className="text-xl text-zinc-300">
              Revolutionizing furniture design through artificial intelligence
            </p>
          </div>

          <div className="grid gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm rounded-xl p-8 border border-pink-500/10"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
              <p className="text-zinc-300 leading-relaxed">
                Founded in 2025, Murphy Al-Saham emerged from a vision to
                transform the furniture industry through cutting-edge AI
                technology. Our journey began with a simple idea: make custom
                furniture design accessible to everyone while maximizing space
                efficiency in modern homes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm rounded-xl p-8 border border-pink-500/10"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Our Mission
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                We are committed to revolutionizing how people design and
                interact with their living spaces. By combining artificial
                intelligence with traditional furniture craftsmanship, we create
                innovative solutions that adapt to modern lifestyles while
                maintaining the highest standards of quality and aesthetics.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm rounded-xl p-8 border border-pink-500/10"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Innovation & Technology
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Our AI-powered platform represents the future of furniture
                design. We utilize advanced machine learning algorithms to
                understand your preferences, space constraints, and lifestyle
                needs, creating personalized furniture solutions that perfectly
                match your vision. From smart wall beds to modular storage
                systems, every piece is thoughtfully designed to enhance your
                living space.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm rounded-xl p-8 border border-pink-500/10"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-zinc-300 leading-relaxed">
                We&apos;re always excited to hear from our customers and
                partners. Whether you have questions about our products, need
                design assistance, or want to explore collaboration
                opportunities, our team is here to help.
              </p>
              <div className="mt-4 text-zinc-300">
                <p>Email: contact@murphyalsaham.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Innovation Drive, Tech Valley, CA 94025</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
