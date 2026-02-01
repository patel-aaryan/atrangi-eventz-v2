"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea } from "@atrangi/ui";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { Mail, Send } from "lucide-react";
import { siteConfig } from "@/lib/metadata";
import { usePathname } from "next/navigation";
import { submitContactForm } from "@/lib/api/contact";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/lib/validation/contact";

const ENABLE_TICKETING = process.env.NEXT_PUBLIC_ENABLE_TICKETING === "true"; // TODO: REMOVE THIS IN NEXT RELEASE

const QUICK_LINKS = [
  { name: "Home", href: "/" },

  // TODO: REMOVE THIS IN NEXT RELEASE
  ...(ENABLE_TICKETING
    ? [{ name: "Upcoming Events", href: "/upcoming-event" }]
    : []),
  /////////////////////////////////////
  { name: "Past Events", href: "/past-events" },
  { name: "Supported Events", href: "/supported-events" },
  { name: "Sponsors", href: "/sponsors" },
];

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    icon: FaInstagram,
    href: siteConfig.links.instagram,
    color: "hover:text-pink-500",
  },
  {
    name: "YouTube",
    icon: FaYoutube,
    href: siteConfig.links.youtube,
    color: "hover:text-red-600",
  },
  {
    name: "TikTok",
    icon: FaTiktok,
    href: siteConfig.links.tiktok,
    color: "hover:text-foreground",
  },
];

export function Footer() {
  const pathname = usePathname();
  const routesToHideFooter = ["/checkout", "/payment"];
  const hideFooter = routesToHideFooter.includes(pathname);

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ContactFormInput) => {
    try {
      await submitContactForm(data);
      setSubmitStatus("success");
      reset();
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };


  if (hideFooter) return null;

  return (
    <footer className="bg-card/50 border-t border-border px-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-6">
          {/* Info & Links Section */}
          <div className="space-y-8">
            {/* Brand */}
            <div>
              <h2 className="text-3xl font-bold bg-linear-to-r from-primary to-highlight bg-clip-text text-transparent pb-4">
                Atrangi Eventz
              </h2>
              <p className="text-muted-foreground mb-6">
                Uniting Gujarati Students of Ontario through vibrant cultural
                experiences, exciting events, and lasting connections.
              </p>

              {/* Social Links (left) & Quick Links (right) - line by line, side by side on mobile */}
              <div className="flex flex-nowrap gap-x-16 lg:gap-x-24 gap-y-6 md:flex-wrap">
                {/* Social Links - left, stacked; narrower on mobile */}
                <div className="min-w-32 shrink-0 md:min-w-64">
                  <h3 className="text-lg font-semibold mb-2 md:mb-4">Follow Us</h3>
                  <ul className="flex flex-col gap-1.5 md:gap-2">
                    {SOCIAL_LINKS.map((social) => (
                      <li key={social.name}>
                        <Link
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1.5 px-2 py-2 rounded-full bg-background border border-border md:gap-2 md:px-4 md:py-3 ${social.color} transition-all hover:scale-105 text-xs text-muted-foreground hover:text-foreground md:text-sm`}
                          aria-label={social.name}
                        >
                          <social.icon className="w-4 h-4 shrink-0 md:w-5 md:h-5" />
                          <span>{social.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Links - right, stacked */}
                <div className="min-w-0 shrink-0">
                  <h3 className="text-lg font-semibold mb-2 md:mb-4">Quick Links</h3>
                  <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                    {QUICK_LINKS.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="hover:text-foreground transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold">Get In Touch</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Have questions or want to collaborate? We&apos;d love to hear from
              you!
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  {...register("message")}
                  rows={6}
                  className={`resize-none min-h-32 ${errors.message ? "border-red-500" : ""}`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {submitStatus === "success" && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/50 text-green-600 dark:text-green-400 text-sm">
                  Message sent successfully! We&apos;ll get back to you soon.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 text-sm">
                  Something went wrong. Please try again.
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full sm:w-auto bg-linear-to-r from-primary to-highlight hover:opacity-90"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
