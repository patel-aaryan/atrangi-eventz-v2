"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { DesktopNav, MobileNav } from "./nav";

export function Navbar() {
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                className="flex items-center space-x-2 cursor-pointer"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Atrangi Eventz"
                  width={180}
                  height={48}
                  className="h-10 w-auto object-contain"
                  priority
                />
                <span className="text-2xl font-bold text-primary">
                  Atrangi Eventz
                </span>
              </motion.div>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center space-x-4"
          >
            <DesktopNav />
          </motion.div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </nav>
  );
}
