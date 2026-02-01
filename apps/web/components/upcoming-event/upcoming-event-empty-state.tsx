"use client";

import { motion } from "framer-motion";
import { CalendarX, Sparkles } from "lucide-react";
import { Button } from "@atrangi/ui";
import Link from "next/link";

export function UpcomingEventEmptyState() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 max-w-2xl"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex justify-center"
        >
          <div className="p-6 rounded-full bg-muted">
            <CalendarX className="w-20 h-20 text-muted-foreground" />
          </div>
        </motion.div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-linear-to-r from-primary via-highlight to-purple-500 bg-clip-text text-transparent">
              No Upcoming Events
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            We don&apos;t have any events scheduled at the moment, but stay
            tuned! We&apos;re always planning something exciting.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6 bg-linear-to-r from-primary to-highlight hover:opacity-90"
          >
            <Link href="/past-events">
              <Sparkles className="mr-2 h-5 w-5" />
              View Past Events
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 border-2"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        {/* Follow Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-8 space-y-3"
        >
          <p className="text-sm text-muted-foreground">
            Follow us on social media to be the first to know about our next
            event!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
