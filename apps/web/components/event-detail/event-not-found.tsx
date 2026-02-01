"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@atrangi/ui";
import Link from "next/link";

interface EventNotFoundProps {
  message?: string;
}

export function EventNotFound({
  message = "The event you're looking for doesn't exist or has been removed.",
}: Readonly<EventNotFoundProps>) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 px-4"
      >
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-destructive/10">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold">Event Not Found</h1>

        <p className="text-muted-foreground max-w-md mx-auto">{message}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild>
            <Link href="/past-events">Browse Events</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
