"use client";

import { EventsHeader, PastEventsList } from "@/components/past-events";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function EventsPage() {
  return (
    <section className="relative overflow-hidden pt-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-highlight/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EventsHeader fadeInUp={fadeInUp} staggerContainer={staggerContainer} />
        <PastEventsList />
      </div>
    </section>
  );
}
