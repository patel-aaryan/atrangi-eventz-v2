"use client";

import { motion, Variants } from "framer-motion";
import { MagicCard } from "@atrangi/ui";
import { Calendar, Music, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AboutSectionProps {
  fadeInUp: Variants;
  staggerContainer: Variants;
}

const features = [
  {
    icon: Users,
    title: "Cultural Celebrations",
    description:
      "Hosting vibrant Bollywood parties and traditional Garba nights throughout the year.",
    href: "/past-events",
  },
  {
    icon: Music,
    title: "Community Building",
    description:
      "Creating and expanding the Gujarati student community across university campuses in Ontario",
    href: "/supported-events",
  },
  {
    icon: Calendar,
    title: "Our Supporters",
    description:
      "Meet the supporters and partners who make our vision come to life.",
    href: "/sponsors",
  },
];

export function AboutSection({
  fadeInUp,
  staggerContainer,
}: Readonly<AboutSectionProps>) {
  return (
    <section id="about" className="py-24 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-16"
        >
          <motion.div variants={fadeInUp} className="text-center space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              About{" "}
              <span className="bg-linear-to-r from-primary to-highlight bg-clip-text text-transparent">
                Atrangi Eventz
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Founded in 2024, Atrangi Eventz is a group of passionate students
              committed to fostering a strong sense of community and cultural
              connection among the Gujarati student community. Our mission is to
              celebrate and share the rich vibrancy of Gujarati heritage with
              all communities through exciting events and meaningful
              experiences.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Link href={feature.href} className="block h-full group">
                  <MagicCard className="h-full rounded-xl cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="p-8 relative">
                      <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-2xl font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                      <ArrowRight className="w-5 h-5 text-primary absolute top-8 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </MagicCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
