import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Events",
  description:
    "As part of our goal of expanding and promoting the bigger gujarati community we partnered with different organizations to bring unique experiences to gujarati students.",
  path: "/supported-events",
  keywords: [
    "gujarati events supported",
    "community partnerships",
    "gujarati students ontario",
    "cultural events supported",
  ],
});

export default function SupportedEventsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
