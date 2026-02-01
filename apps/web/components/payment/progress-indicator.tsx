"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Step } from "@/types/checkout";

interface ProgressIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export function ProgressIndicator({
  currentStep,
  steps,
}: Readonly<ProgressIndicatorProps>) {
  return (
    <div className="w-full py-8">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-border" />
          <motion.div
            className="absolute top-5 left-0 h-0.5 bg-linear-to-r from-primary to-highlight"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  {/* Step Circle */}
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 relative z-10 transition-colors ${
                      isCompleted || isCurrent
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-border text-muted-foreground"
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: isCurrent ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <span className="font-semibold">{step.id}</span>
                    )}
                  </motion.div>

                  {/* Step Label */}
                  <div className="text-center max-w-[120px]">
                    <p
                      className={`text-sm font-medium ${
                        isCurrent ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
