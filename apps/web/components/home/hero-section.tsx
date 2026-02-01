"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@atrangi/ui";
import Link from "next/link";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { siteConfig } from "@/lib/metadata";

interface HeroSectionProps {
  fadeInUp: Variants;
  staggerContainer: Variants;
}

export function HeroSection({
  fadeInUp,
  staggerContainer,
}: Readonly<HeroSectionProps>) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-highlight/10" />
        <motion.div
          animate={{
            scale: [1, 1.5, 1.2, 1.5, 1],
            x: [0, 80, -40, 60, 0],
            y: [0, -60, 40, -30, 0],
            rotate: [0, 180, 360, 180, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-md h-112 bg-primary/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.4, 1, 1.3],
            x: [0, -100, 50, -80, 0],
            y: [0, 70, -50, 60, 0],
            rotate: [45, 225, 405, 225, 45],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-md h-112 bg-highlight/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1.6, 1.1],
            x: [0, 120, -100],
            y: [0, -80, 50],
            rotate: [90, 270, 90],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-foreground/12 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center space-y-8"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="inline-block pb-4 text-primary">
                Atrangi Eventz
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-medium">
              Gujarati Student Organization
            </p>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed"
          >
            Uniting{" "}
            <span className="text-primary font-semibold">
              Students of Ontario
            </span>{" "}
            with exciting{" "}
            <span className="text-highlight font-semibold">cultural events</span>
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 bg-linear-to-r from-primary to-highlight hover:opacity-90"
            >
              <Link href="/past-events">Past Events</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2"
            >
              <Link href="#about">About Us</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-pink-500 transition-colors"
              >
                <FaInstagram className="w-6 h-6" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                href={siteConfig.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-red-600 transition-colors"
              >
                <FaYoutube className="w-6 h-6" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                href={siteConfig.links.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-black dark:hover:text-white transition-colors"
              >
                <FaTiktok className="w-6 h-6" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
