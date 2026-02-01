"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@atrangi/ui";
import { Mail } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/metadata";

interface ContactCTASectionProps {
  readonly fadeInUp: Variants;
}

export function ContactCTASection({ fadeInUp }: ContactCTASectionProps) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="text-center p-12 mb-8 rounded-3xl bg-linear-to-br from-primary/10 via-background to-highlight/10 border border-border"
    >
      <Mail className="w-16 h-16 text-primary mx-auto mb-6" />
      <h3 className="text-3xl font-bold mb-4">Interested in Sponsoring?</h3>
      <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
        We&apos;d love to discuss how we can create a mutually beneficial
        partnership. Reach out to learn more about our sponsorship
        opportunities.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          asChild
          size="lg"
          className="bg-linear-to-r from-primary to-highlight hover:opacity-90"
        >
          <a href={`mailto:${siteConfig.email}?subject=Sponsorship Inquiry`}>
            <Mail className="w-5 h-5 mr-2" />
            Contact Us
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/past-events">View Our Events</Link>
        </Button>
      </div>
    </motion.div>
  );
}
