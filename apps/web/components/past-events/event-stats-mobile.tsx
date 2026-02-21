import { Calendar, MapPin, Users, Clock } from "lucide-react";

interface EventStatsMobileProps {
  attendees: string;
  sponsors: string;
  volunteers: string;
  duration: string;
  location: string;
  formattedDate: string;
}

export function EventStatsMobile({
  attendees,
  duration,
  location,
  formattedDate,
}: Readonly<EventStatsMobileProps>) {
  return (
    <div className="grid grid-cols-[auto_fit-content(100%)] md:hidden gap-3 pt-4 border-t border-border/50">
      <div className="flex items-center gap-1.5 text-sm min-w-0">
        <div className="p-1.5 rounded-md bg-primary/10 shrink-0">
          <Calendar className="w-4 h-4 text-primary" />
        </div>
        <span className="font-medium text-foreground truncate">
          {formattedDate}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-sm min-w-0">
        <div className="p-1.5 rounded-md bg-primary/10 shrink-0">
          <Users className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold truncate">{attendees}</span>
        <span className="text-xs text-muted-foreground">Attendees</span>
      </div>

      <div className="flex items-center gap-1.5 text-sm min-w-0">
        <div className="p-1.5 rounded-md bg-highlight/10 shrink-0">
          <Clock className="w-4 h-4 text-highlight" />
        </div>
        <span className="font-medium text-foreground truncate">{duration}</span>
      </div>

      <div className="flex items-center gap-1.5 text-sm min-w-0">
        <div className="p-1.5 rounded-md bg-pink-500/10 shrink-0">
          <MapPin className="w-4 h-4 text-pink-500" />
        </div>
        <span className="font-medium text-foreground truncate">{location}</span>
      </div>
    </div>
  );
}
