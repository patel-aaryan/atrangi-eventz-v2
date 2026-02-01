"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[60vh] bg-neutral-950 overflow-hidden flex items-center justify-center py-16">
      <div className="absolute inset-0 bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950" />

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

      <div className="relative z-10 flex flex-col items-center px-5">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="py-4 text-center text-4xl font-bold tracking-tight md:text-6xl"
        >
          Events We{" "}
          <span className="bg-linear-to-r from-primary to-highlight bg-clip-text text-transparent">
            Supported
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-6 max-w-3xl text-center text-lg text-zinc-300 sm:text-xl"
        >
          As part of our goal of expanding and promoting the bigger gujarati
          community we partnered with different organizations to bring unique
          experiences to gujarati students.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1,
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="mt-8 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
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
