"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@atrangi/ui";

export function EventDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/10 via-background to-highlight/10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-16 w-3/4 max-w-2xl" />
            <Skeleton className="h-6 w-full max-w-xl" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-32" />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </section>

      {/* Ticket Tiers Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-10 w-56 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </section>
    </div>
  );
}
