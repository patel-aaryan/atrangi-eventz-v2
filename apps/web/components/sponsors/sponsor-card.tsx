"use client";

import type { Sponsor } from "@atrangi/types";
import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@atrangi/ui";
import Link from "next/link";
import Image from "next/image";

interface SponsorCardProps {
  isLoading: boolean;
  error: Error | null;
  sponsors: Sponsor[];
  fadeInUp: Variants;
}

interface SponsorCardContentProps {
  image_url: string | null;
  company_name: string;
}

function SponsorCardContent({
  image_url,
  company_name,
}: Readonly<SponsorCardContentProps>) {
  return (
    <Card
      className="group relative w-full overflow-hidden border-0 bg-linear-to-br from-gray-900
              to-black p-0 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
    >
      {/* Sponsor Image — 7:4 aspect ratio */}
      <div className="relative aspect-[7/4] w-full overflow-hidden flex items-center justify-center bg-black">
        {image_url ? (
          <Image
            src={image_url}
            alt={company_name}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-gray-700 to-gray-800 text-white text-6xl font-bold">
            {company_name.charAt(0).toUpperCase()}
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Sponsor Info */}
      <CardHeader className="px-4 pb-3">
        <CardTitle className="text-base font-semibold text-white">
          {company_name}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export function SponsorCard({
  isLoading,
  error,
  sponsors,
  fadeInUp,
}: Readonly<SponsorCardProps>) {
  let message = "";

  if (isLoading) {
    message = "Loading sponsors...";
  } else if (error) {
    message =
      error instanceof Error
        ? error.message
        : "Failed to load sponsors. Please try again later.";
  } else if (!sponsors || !Array.isArray(sponsors) || sponsors.length === 0) {
    message =
      "Our sponsor showcase will be updated soon. We're actively seeking partnerships for our upcoming events.";
  }

  if (message)
    return (
      <motion.div initial="initial" animate="animate" variants={fadeInUp}>
        <Card className="bg-background/50 backdrop-blur">
          <CardContent className="p-12 text-center">
            <p className="text-xl text-muted-foreground">{message}</p>
          </CardContent>
        </Card>
      </motion.div>
    );

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto"
    >
      {sponsors.map((sponsor) =>
        sponsor.website_url ? (
          <Link
            key={sponsor.id}
            href={sponsor.website_url ?? ""}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <SponsorCardContent
              image_url={sponsor.image_url}
              company_name={sponsor.company_name}
            />
          </Link>
        ) : (
          <SponsorCardContent
            key={sponsor.id}
            image_url={sponsor.image_url}
            company_name={sponsor.company_name}
          />
        ),
      )}
    </motion.div>
  );
}
