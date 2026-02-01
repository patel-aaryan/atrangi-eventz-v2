"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@atrangi/ui";
import Link from "next/link";

export function NavEmptyCartState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-highlight/20 blur-2xl rounded-full" />
        <div className="relative p-6 rounded-full bg-linear-to-r from-primary/10 to-highlight/10 border border-primary/20">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Your cart is empty</h3>
        <p className="text-sm text-muted-foreground max-w-[280px]">
          Add tickets to your cart to get started with your event experience.
        </p>
      </div>

      <Button asChild variant="outline" className="mt-2 border-primary/20 ">
        <Link href="/upcoming-event">Upcoming Event</Link>
      </Button>
    </div>
  );
}
