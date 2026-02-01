"use client";

import { motion } from "framer-motion";
import { Clock, Loader2 } from "lucide-react";

export function ReservationExpired() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-highlight/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mt-20 text-center"
        >
          <div className="p-8 rounded-lg bg-destructive/10 border border-destructive/20">
            <Clock className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold text-destructive mb-4">
              Reservation Expired
            </h2>
            <p className="text-muted-foreground mb-6">
              Your ticket reservation has expired. Please try again later.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirecting to events page...
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
