import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Events",
  description:
    "Get your tickets for the next exciting Atrangi Eventz event! Join Gujarati students across Ontario for an unforgettable cultural experience.",
  path: "/upcoming-event",
  keywords: [
    "upcoming events ontario",
    "gujarati event tickets",
    "bollywood party tickets",
    "student event tickets",
    "cultural events ontario",
    "next event",
    "buy tickets",
    "garba night tickets",
    "indian events ontario",
  ],
});

export default function UpcomingEventLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
