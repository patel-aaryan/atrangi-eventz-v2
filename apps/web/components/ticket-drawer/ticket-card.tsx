"use client";

import { motion } from "framer-motion";
import { Card, Button, Badge } from "@atrangi/ui";
import { Minus, Plus } from "lucide-react";
import type { TicketType } from "@/types/checkout";
import { LOW_STOCK_THRESHOLD } from "@/constants/checkout";

interface TicketCardProps {
  ticket: TicketType;
  quantity: number;
  onQuantityChange: (ticketId: string, delta: number) => void;
}

export function TicketCard({
  ticket,
  quantity,
  onQuantityChange,
}: Readonly<TicketCardProps>) {
  const isLowStock = ticket.available < LOW_STOCK_THRESHOLD;

  return (
    <motion.div layout>
      <Card className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{ticket.name}</h4>
              {isLowStock && (
                <Badge variant="destructive" className="text-xs">
                  {ticket.available} left
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {ticket.description}
            </p>
            {ticket.features && ticket.features.length > 0 && (
              <ul className="text-xs text-muted-foreground space-y-1">
                {ticket.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <span className="text-primary">✓</span> {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              ${ticket.price.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Max {ticket.maxQuantity} per order
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onQuantityChange(ticket.id, -1)}
              disabled={quantity === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="w-12 text-center font-semibold">{quantity}</div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onQuantityChange(ticket.id, 1)}
              disabled={
                quantity >= ticket.maxQuantity || quantity >= ticket.available
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

