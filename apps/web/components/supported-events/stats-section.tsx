"use client";

import { motion, Variants } from "framer-motion";
import { Users, Building2 } from "lucide-react";

interface StatsSectionProps {
  readonly fadeInUp: Variants;
}

export function StatsSection({ fadeInUp }: StatsSectionProps) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16 py-12 mb-12"
    >
      <div className="flex flex-col items-center gap-2">
        <Users className="w-10 h-10 text-primary mb-2" />
        <span className="text-4xl md:text-5xl font-bold text-foreground">
          20k+
        </span>
        <span className="text-muted-foreground text-lg">Attendees</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Building2 className="w-10 h-10 text-primary mb-2" />
        <span className="text-4xl md:text-5xl font-bold text-foreground">
          11
        </span>
        <span className="text-muted-foreground text-lg">Organizations</span>
      </div>
    </motion.div>
  );
}
