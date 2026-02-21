"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@atrangi/ui";
import { Calendar, MapPin, Sparkles, Ticket } from "lucide-react";

interface TicketItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface EventDetailsCardProps {
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  tickets: TicketItem[];
}

export function EventDetailsCard({
  eventName,
  eventDate,
  eventTime,
  eventLocation,
  tickets,
}: Readonly<EventDetailsCardProps>) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Event Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold mb-4">{eventName}</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{eventDate}</p>
                <p className="text-sm text-muted-foreground">{eventTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <p className="text-sm">{eventLocation}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Ticket Summary */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Ticket className="w-5 h-5 text-muted-foreground" />
            <h4 className="font-semibold">Your Tickets</h4>
          </div>
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium">{ticket.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {ticket.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  ${(ticket.price * ticket.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
