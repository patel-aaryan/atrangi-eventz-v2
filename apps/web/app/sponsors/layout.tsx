import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Sponsors",
  description:
    "Partner with Atrangi Eventz to reach 500+ engaged Gujarati students across Ontario. Explore our sponsorship packages and support meaningful cultural events.",
  path: "/sponsors",
  keywords: [
    "event sponsorship ontario",
    "student event sponsors",
    "cultural event partnership",
    "brand visibility students",
    "gujarati community sponsorship",
    "ontario university sponsorship",
    "event marketing ontario",
    "student organization sponsorship",
    "community partnership",
  ],
});

export default function SponsorsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
