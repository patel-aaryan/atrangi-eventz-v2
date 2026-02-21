"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ("scrollRestoration" in globalThis.history) {
      globalThis.history.scrollRestoration = "manual";
    }

    // Scroll to top on initial mount and on every client-side route change
    globalThis.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
