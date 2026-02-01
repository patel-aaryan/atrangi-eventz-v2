"use client";

import { motion, Variants } from "framer-motion";
import { MagicCard } from "@atrangi/ui";
import { Calendar, Music, Users } from "lucide-react";

interface AboutSectionProps {
  fadeInUp: Variants;
  staggerContainer: Variants;
}

const features = [
  {
    icon: Users,
    title: "Community Building",
    description:
      "Connecting Gujarati students across Ontario and creating lasting friendships.",
  },
  {
    icon: Music,
    title: "Cultural Celebrations",
    description:
      "Hosting vibrant Bollywood parties and traditional Garba nights throughout the year.",
  },
  {
    icon: Calendar,
    title: "Festive Events",
    description:
      "Organizing exciting events that showcase the richness of our culture and heritage.",
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
              celebrate and share the rich vibrancy of Gujarati heritage with all
              communities through exciting events and meaningful experiences.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <MagicCard className="h-full rounded-xl">
                  <div className="p-8">
                    <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </MagicCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
