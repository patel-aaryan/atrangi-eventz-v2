import {
  HeroSection,
  StatsSection,
  SupportedEventsGrid
} from "@/components/supported-events";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function SupportedEventsPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-highlight/20" />
      </div>

      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatsSection fadeInUp={fadeInUp} />
        <SupportedEventsGrid fadeInUp={fadeInUp} />
      </div>
    </section>
  );
}
