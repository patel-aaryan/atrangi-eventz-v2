"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Handshake, ChevronDown } from "lucide-react";
import { Button } from "@atrangi/ui";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen bg-neutral-950 overflow-hidden flex items-center justify-center">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-5 -translate-y-16">
        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="text-primary py-4 text-center text-4xl font-bold tracking-tight md:text-7xl"
        >
          Our Sponsors
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.1,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 max-w-3xl text-center text-lg text-zinc-300 sm:text-xl"
        >
          Atrangi Eventz is made possible by the generous support of our
          partners and sponsors who share our vision of celebrating Gujarati
          culture and bringing students together.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1.4,
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="mt-6 flex justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden text-lg px-8 py-6 mt-4 rounded-xl bg-linear-to-r from-primary via-highlight to-purple-500 bg-size-[200%_100%] bg-left hover:bg-right transition-all duration-500 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-highlight/30"
          >
            <Link href="#contact" className="flex items-center gap-2">
              <Handshake className="w-5 h-5 transition-transform group-hover:rotate-12" />
              Partner with us
            </Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1.7,
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="mt-8 flex justify-center"
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-8 h-8 text-zinc-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
