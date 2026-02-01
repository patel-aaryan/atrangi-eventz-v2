"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface SuccessHeaderProps {
  contactEmail: string;
}

export function SuccessHeader({ contactEmail }: Readonly<SuccessHeaderProps>) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      className="text-center mb-8"
    >
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-green-500 to-emerald-600 mb-4">
        <CheckCircle2 className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
        <span className="bg-linear-to-r from-primary via-highlight to-purple-500 bg-clip-text text-transparent">
          Payment Successful!
        </span>
      </h1>
      <p className="text-lg text-muted-foreground">
        Your tickets have been sent to{" "}
        <span className="font-semibold text-foreground">{contactEmail}</span>
      </p>
    </motion.div>
  );
}
