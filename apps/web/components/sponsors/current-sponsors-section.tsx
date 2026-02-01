"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, Variants } from "framer-motion";
import { getSponsors } from "@/lib/api/sponsors";
import { SponsorCard } from "./sponsor-card";

interface CurrentSponsorsSectionProps {
  fadeInUp: Variants;
}

export function CurrentSponsorsSection({
  fadeInUp,
}: Readonly<CurrentSponsorsSectionProps>) {
  const {
    data: sponsors = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sponsors"],
    queryFn: getSponsors,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    refetchOnWindowFocus: false, // Don't refetch when user returns to tab
  });

  return (
    <div className="mb-20">
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Our{" "}
          <span className="bg-linear-to-r from-primary to-highlight bg-clip-text text-transparent">
            Partners
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We&apos;re grateful to work with amazing partners who believe in our
          mission.
        </p>
      </motion.div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={{
          initial: {},
          animate: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <SponsorCard
          isLoading={isLoading}
          error={error}
          sponsors={sponsors}
          fadeInUp={fadeInUp}
        />
      </motion.div>
    </div>
  );
}
