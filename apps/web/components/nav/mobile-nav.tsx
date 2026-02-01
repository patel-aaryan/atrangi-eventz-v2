import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@atrangi/ui";
import { ShoppingCartDropdown } from "./shopping-cart-dropdown";

const ENABLE_TICKETING = process.env.NEXT_PUBLIC_ENABLE_TICKETING === "true"; // TODO: REMOVE THIS IN NEXT RELEASE

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/#about" },
  { name: "Past Events", href: "/past-events" },
  { name: "Supported Events", href: "/supported-events" },
  // TODO: REMOVE THIS IN NEXT RELEASE
  ...(ENABLE_TICKETING
    ? [{ name: "Upcoming Event", href: "/upcoming-event" }]
    : []),
  /////////////////////////////////////
  { name: "Sponsors", href: "/sponsors" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-75 sm:w-100">
        <SheetHeader>
          <SheetTitle className="text-left">
            <span className="text-2xl font-bold text-primary">
              Atrangi Eventz
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-base"
              >
                {item.name}
              </Button>
            </Link>
          ))}
          {/* TODO: REMOVE CONDITIONAL RENDERING IN NEXT RELEASE */}
          {ENABLE_TICKETING && (
            <div className="mt-4">
              <ShoppingCartDropdown />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
