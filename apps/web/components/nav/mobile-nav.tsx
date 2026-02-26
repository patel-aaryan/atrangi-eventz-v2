import Link from "next/link";
import { Menu } from "lucide-react";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SOCIAL_LINKS } from "@/constants/socials";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@atrangi/ui";
import { ShoppingCartDropdown } from "./shopping-cart-dropdown";
import { handleHashNavigation } from "@/lib/utils/navigation";

const ENABLE_TICKETING = process.env.NEXT_PUBLIC_ENABLE_TICKETING === "true"; // TODO: REMOVE THIS IN NEXT RELEASE

const NAV_ITEMS = [
  { name: "Home", href: "/" },
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
  const pathname = usePathname();
  const navigatedFromSheetRef = useRef(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} pathname={pathname}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-75 flex-col sm:w-100"
        onCloseAutoFocus={(e) => {
          if (navigatedFromSheetRef.current) {
            navigatedFromSheetRef.current = false;
            e.preventDefault();
            document
              .getElementById("main-content")
              ?.focus({ preventScroll: true });
          }
        }}
      >
        <SheetHeader>
          <SheetTitle className="text-left">
            <span className="text-2xl font-bold text-primary">
              Atrangi Eventz
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-1 flex-col min-h-0">
          <div className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  const path = item.href.split("#")[0] ?? item.href;
                  const isCurrentRoute =
                    pathname === path || (path === "/" && pathname === "/");
                  if (isCurrentRoute) {
                    e.preventDefault();
                    setIsOpen(false);
                    return;
                  }
                  if (!item.href.includes("#")) {
                    navigatedFromSheetRef.current = true;
                  }
                  handleHashNavigation(e, item.href, pathname, () =>
                    setIsOpen(false),
                  );
                }}
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
          <div className="mt-auto flex justify-center gap-3 border-t border-border pt-6">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <Button
                  key={social.name}
                  variant="outline"
                  size="icon"
                  aria-label={social.name}
                  className="rounded-full"
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
