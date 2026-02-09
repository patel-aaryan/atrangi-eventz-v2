import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@atrangi/ui";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCartDropdown } from "./shopping-cart-dropdown";
import { Calendar, CalendarCheck, Handshake } from "lucide-react";
import { usePathname } from "next/navigation";
import { handleHashNavigation } from "@/lib/utils/navigation";

const ENABLE_TICKETING = process.env.NEXT_PUBLIC_ENABLE_TICKETING === "true"; // TODO: REMOVE THIS IN NEXT RELEASE

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/#about" },
  {
    name: "Events",
    dropdown: [
      {
        name: "Past Events",
        href: "/past-events",
        description: "Relive our amazing past events",
        icon: Calendar,
      },
      {
        name: "Supported Events",
        href: "/supported-events",
        description: "Check out the events we supported",
        icon: Handshake,
      },
      // TODO: REMOVE THIS IN NEXT RELEASE
      ...(ENABLE_TICKETING
        ? [
            {
              name: "Upcoming Event",
              href: "/upcoming-event",
              description: "Check out what's coming next",
              icon: CalendarCheck,
            },
          ]
        : []),
      /////////////////////////////////////
    ],
  },
  { name: "Sponsors", href: "/sponsors" },
];

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <>
      <NavigationMenu delayDuration={0}>
        <NavigationMenuList>
          {NAV_ITEMS.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <NavigationMenuItem>
                {"dropdown" in item && item.dropdown ? (
                  <>
                    <NavigationMenuTrigger onClick={(e) => e.preventDefault()}>
                      {item.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[280px] gap-2 p-3">
                        {item.dropdown.map((dropdownItem) => {
                          const Icon = dropdownItem.icon;
                          return (
                            <li key={dropdownItem.name}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={dropdownItem.href}
                                  onClick={(e) =>
                                    handleHashNavigation(
                                      e,
                                      dropdownItem.href,
                                      pathname,
                                    )
                                  }
                                  className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-primary/10 hover:to-highlight/10 hover:shadow-md focus:bg-linear-to-r focus:from-primary/10 focus:to-highlight/10 border border-transparent hover:border-primary/20 group"
                                >
                                  <div className="flex items-center gap-2.5">
                                    {Icon && (
                                      <div className="p-1.5 rounded-md bg-linear-to-br from-primary/20 to-highlight/20 group-hover:from-primary/30 group-hover:to-highlight/30 transition-all">
                                        <Icon className="h-4 w-4 text-primary" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="text-sm font-semibold leading-none mb-1 group-hover:bg-linear-to-r group-hover:from-primary group-hover:to-highlight group-hover:bg-clip-text group-hover:text-transparent transition-all">
                                        {dropdownItem.name}
                                      </div>
                                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                        {dropdownItem.description}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          );
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    asChild
                  >
                    <Link
                      href={item.href}
                      onClick={(e) =>
                        handleHashNavigation(e, item.href, pathname)
                      }
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            </motion.div>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      {/* TODO: REMOVE CONDITIONAL RENDERING IN NEXT RELEASE */}
      {ENABLE_TICKETING && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ShoppingCartDropdown />
        </motion.div>
      )}
    </>
  );
}
