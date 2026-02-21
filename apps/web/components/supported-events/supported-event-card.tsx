"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, Button } from "@atrangi/ui";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { SupportedEventItem } from "@/types/supported-event";

interface SupportedEventCardProps {
  item: SupportedEventItem;
  variants?: Variants;
}

export function SupportedEventCard({
  item,
  variants,
}: Readonly<SupportedEventCardProps>) {
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();

  const containerVariants = variants ?? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      {...(variants == null
        ? { initial: "initial" as const, animate: "animate" as const }
        : {})}
      variants={containerVariants}
      className="h-full"
    >
      <Link
        href={item.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
      >
        <motion.div
          onHoverStart={() => !isMobile && setHovered(true)}
          onHoverEnd={() => !isMobile && setHovered(false)}
          whileHover={isMobile ? undefined : { scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Card className="group relative w-full h-full overflow-hidden border-0 bg-linear-to-br from-gray-900 to-black p-0 rounded-xl aspect-4/5 shadow-lg hover:shadow-xl hover:shadow-primary/30">
            {/* Artist image background */}
            <div className="absolute inset-0">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>

            {/* Diagonal overlay - always visible on mobile (no hover); slide + fade on desktop */}
            <motion.div
              className="absolute -inset-px flex flex-col items-end justify-end pb-6 pr-6 pl-12 pt-12 bg-secondary/60 rounded-xl"
              style={{
                clipPath: "polygon(0 100%, 0 70%, 100% 50%, 100% 100%)",
              }}
              initial={isMobile ? false : { opacity: 0, x: "100%", y: "100%" }}
              animate={
                isMobile
                  ? { opacity: 1, x: "0%", y: "0%" }
                  : {
                      opacity: hovered ? 1 : 0,
                      x: hovered ? "0%" : "100%",
                      y: hovered ? "0%" : "100%",
                    }
              }
              transition={
                isMobile
                  ? { duration: 0 }
                  : { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
              }
            >
              <div className="flex flex-col items-end text-right max-w-[85%]">
                <h3 className="text-xl font-bold text-white mb-1 leading-tight">
                  {item.name}
                </h3>
                <p className="text-white/90 text-sm mb-4">{item.monthYear}</p>
                <Button size="sm" variant="outline" asChild>
                  <span>View More</span>
                </Button>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
}
