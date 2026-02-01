"use client";

import { motion, Variants } from "framer-motion";

interface EventsHeaderProps {
  fadeInUp: Variants;
  staggerContainer: Variants;
}

export function EventsHeader({
  fadeInUp,
  staggerContainer,
}: Readonly<EventsHeaderProps>) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="text-center space-y-6 mb-16"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
          <span className="block bg-linear-to-r from-primary via-highlight to-highlight bg-clip-text text-transparent">
            Past Events
          </span>
        </h1>
      </motion.div>

      <motion.p
        variants={fadeInUp}
        className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
      >
        Explore our past events and relive the memories of the amazing events
        we&apos;ve hosted.
      </motion.p>
    </motion.div>
  );
}
