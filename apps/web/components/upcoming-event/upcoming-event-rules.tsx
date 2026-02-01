"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import type { UpcomingEventItem } from "@atrangi/types";

interface UpcomingEventRulesProps {
  readonly event: UpcomingEventItem;
}

export function UpcomingEventRules({ event }: UpcomingEventRulesProps) {
  console.log(event.title);
  // Default event rules
  const eventRules = [
    "Valid government-issued ID required for entry verification",
    "Doors open 30 minutes before event start time - please arrive early",
    "Zero-tolerance policy for harassment, discrimination, or disruptive behavior",
    "No outside food or beverages permitted",
  ];

  return (
    <motion.section
      id="rules"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-purple-500" />
          <h2 className="text-3xl sm:text-4xl font-bold">
            Event Rules & Guidelines
          </h2>
        </div>
        <p className="text-muted-foreground text-lg">
          Please review these important rules before attending
        </p>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Event Rules</h3>
        <ul className="space-y-3">
          {eventRules.map((rule, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 text-base"
            >
              <span className="text-primary font-bold mt-1 text-lg">•</span>
              <span>{rule}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div className="pt-4 border-t">
        <p className="text-muted-foreground">
          If you have any questions or concerns about the event, please
          don&apos;t hesitate to reach out to us. We&apos;re here to help ensure
          you have the best experience possible!
        </p>
      </div>
    </motion.section>
  );
}
