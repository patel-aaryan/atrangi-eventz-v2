"use client";

import { motion } from "framer-motion";
import { Button, Card, CardContent } from "@atrangi/ui";
import { ProgressIndicator } from "@/components/payment";
import { CHECKOUT_STEPS } from "@/constants/checkout";
import { ChevronLeft, ShoppingCart } from "lucide-react";

interface EmptyCartStateProps {
  onBrowseEvents: () => void;
}

export function EmptyCartState({
  onBrowseEvents,
}: Readonly<EmptyCartStateProps>) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-highlight/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={2} steps={CHECKOUT_STEPS} />

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center min-h-[60vh]"
        >
          <Card className="max-w-md w-full">
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mb-6"
              >
                <div className="rounded-full bg-primary/10 p-6">
                  <ShoppingCart className="w-16 h-16 text-primary" />
                </div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-2xl font-bold mb-2"
              >
                Your cart is empty
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-muted-foreground mb-6"
              >
                You haven&apos;t selected any tickets yet. Browse our events and
                add tickets to your cart to continue.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button
                  size="lg"
                  onClick={onBrowseEvents}
                  className="bg-linear-to-r from-primary to-highlight hover:opacity-90"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Browse Events
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
