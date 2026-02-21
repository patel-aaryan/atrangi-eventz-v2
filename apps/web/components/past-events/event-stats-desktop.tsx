import { Calendar, MapPin, Users, Clock, Award, Heart } from "lucide-react";

interface EventStatsDesktopProps {
  attendees: string;
  sponsors: string;
  volunteers: string;
  duration: string;
  location: string;
  formattedDate: string;
}

export function EventStatsDesktop({
  attendees,
  sponsors,
  volunteers,
  duration,
  location,
  formattedDate,
}: Readonly<EventStatsDesktopProps>) {
  return (
    <>
      <div className="hidden md:grid grid-cols-3 gap-4 pt-2">
        <div className="flex items-center gap-3 text-sm">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Attendees</span>
            <span className="font-semibold text-sm">{attendees}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Sponsors</span>
            <span className="font-semibold text-sm">{sponsors}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
            <Heart className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Volunteers</span>
            <span className="font-semibold text-sm">{volunteers}</span>
          </div>
        </div>
      </div>

      <div className="hidden md:grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-3 text-sm">
          <div className="p-1.5 rounded-md bg-muted">
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Date</span>
            <span className="font-medium text-foreground">{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="p-1.5 rounded-md bg-muted">
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Duration</span>
            <span className="font-medium text-foreground">{duration}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="p-1.5 rounded-md bg-muted">
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs text-muted-foreground">Location</span>
            <span className="font-medium text-foreground truncate">
              {location}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
