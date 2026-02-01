"use client";

import { motion } from "framer-motion";
import { Ticket, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@atrangi/ui";
import type { TicketTier } from "@atrangi/types";

interface EventTicketTiersProps {
  tiers: TicketTier[];
  currency: string;
  isCompleted: boolean;
}

export function EventTicketTiers({
  tiers,
  currency,
  isCompleted,
}: Readonly<EventTicketTiersProps>) {
  if (!tiers || tiers.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: currency || "CAD",
    }).format(price);
  };

  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">
          <span className="bg-linear-to-r from-primary to-highlight bg-clip-text text-transparent">
            {isCompleted ? "Ticket Tiers" : "Get Your Tickets"}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier, index) => {
            const isSoldOut = tier.remaining === 0;
            const remaining = tier.remaining;

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className={`relative overflow-hidden h-full ${isSoldOut ? "opacity-75" : ""
                    }`}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-highlight" />

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Ticket className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{tier.name}</CardTitle>
                      </div>
                      {isSoldOut && (
                        <Badge variant="destructive">Sold Out</Badge>
                      )}
                    </div>
                    <p className="text-3xl font-bold text-primary">
                      {formatPrice(tier.price)}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {tier.description && (
                      <p className="text-muted-foreground text-sm">
                        {tier.description}
                      </p>
                    )}

                    {tier.features && tier.features.length > 0 && (
                      <ul className="space-y-2">
                        {tier.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Check className="w-4 h-4 text-green-500 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {!isCompleted && !isSoldOut && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {remaining.toLocaleString()}
                          </span>{" "}
                          tickets remaining
                        </p>
                      </div>
                    )}

                    {isCompleted && isSoldOut && (
                      <div className="pt-2 border-t">
                        <Badge
                          variant="default"
                          className="w-full justify-center"
                        >
                          Event Completed - Sold Out
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
