import dayjs from "dayjs";
import type { SupportedEvent } from "@atrangi/types";
import type { SupportedEventItem } from "@/types/supported-event";

export function mapToSupportedEventItem(e: SupportedEvent): SupportedEventItem {
  return {
    name: e.name,
    monthYear: dayjs(e.event_date).format("MMMM, YYYY"),
    imageUrl: e.image_url ?? "https://placehold.co/400x500?text=Event",
    instagramUrl: e.social_url ?? "#",
  };
}
