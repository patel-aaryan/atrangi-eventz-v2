"use client";

import { motion } from "framer-motion";
import { Clock, Loader2 } from "lucide-react";

interface ReservationTimerProps {
  minutes: number;
  seconds: number;
  isWarning: boolean;
  isLoading?: boolean;
}

export function ReservationTimer({
  minutes,
  seconds,
  isWarning,
  isLoading = false,
}: Readonly<ReservationTimerProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto mb-8"
    >
      <div
        className={`flex items-center justify-center gap-3 p-4 rounded-lg border ${
          isWarning
            ? "bg-destructive/10 border-destructive/30 text-destructive"
            : "bg-primary/5 border-primary/20 text-primary"
        }`}
      >
        <Clock className={`w-5 h-5 ${isWarning ? "animate-pulse" : ""}`} />
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">Reservation expires in:</span>
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <span className="text-2xl font-bold tabular-nums">
              {minutes}:{String(seconds).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>
      {isWarning && !isLoading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-destructive mt-2"
        >
          ⚠️ Please complete your payment soon to secure your tickets
        </motion.p>
      )}
    </motion.div>
  );
}
