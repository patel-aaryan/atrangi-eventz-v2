import { siteConfig } from "@/lib/metadata";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

export const SOCIAL_LINKS = [
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
