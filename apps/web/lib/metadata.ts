import type { Metadata } from "next";

export const siteConfig = {
  name: "Atrangi Eventz",
  description:
    "Uniting Gujarati Students of Ontario with exciting Bollywood club parties, vibrant garba events, and much more!",
  url: "https://www.atrangieventz.com",
  ogImage: "/android-chrome-512x512.png", // TODO: Change to the actual og image
  email: process.env.NEXT_PUBLIC_EMAIL || "outreach.atrangieventz@gmail.com",
  links: {
    tiktok: "https://www.tiktok.com/@atrangieventz",
    instagram: "https://www.instagram.com/atrangieventz",
    youtube: "https://www.youtube.com/@atrangieventz",
  },
};

export const generateSEOMetadata = (): Metadata => {
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
    description: siteConfig.description,
    keywords: [
      "Atrangi Eventz",
      "Gujarati Students",
      "Ontario",
      "Bollywood Parties",
      "Garba Events",
      "Student Organization",
      "Indian Events",
      "Cultural Events",
    ],
    authors: [{ name: "Atrangi Eventz" }],
    creator: "Atrangi Eventz",
    openGraph: {
      type: "website",
      locale: "en_CA",
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", sizes: "any" },
      ],
      apple: "/apple-icon.png",
      other: [{ rel: "manifest", url: "/manifest.json" }],
    },
  };
};

interface PageMetadataProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
}

export const generatePageMetadata = ({
  title,
  description,
  path,
  keywords = [],
  ogImage,
}: PageMetadataProps): Metadata => {
  const url = `${siteConfig.url}${path}`;
  const image = ogImage || siteConfig.ogImage;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    keywords: ["Atrangi Eventz", "Gujarati Students", "Ontario", ...keywords],
    authors: [{ name: "Atrangi Eventz" }],
    creator: "Atrangi Eventz",
    openGraph: {
      type: "website",
      locale: "en_CA",
      url,
      title: `${title} | ${siteConfig.name}`,
      description,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
};
