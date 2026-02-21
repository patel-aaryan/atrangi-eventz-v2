"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const scrollToTop = () => {
  globalThis.scrollTo(0, 0);
  document.documentElement.scrollTo(0, 0);
  document.body.scrollTo(0, 0);
};

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ("scrollRestoration" in globalThis.history) {
      globalThis.history.scrollRestoration = "manual";
    }

    // Scroll immediately on route change
    scrollToTop();

    // When navigating from the mobile sheet, Radix returns focus to the menu
    // trigger after the sheet closes; the browser then scrolls the focused
    // element into view and applies scroll-padding-top (4rem), which overrides
    // our scroll. Run again after the sheet close animation + focus restore.
    const t1 = setTimeout(scrollToTop, 100);
    const t2 = setTimeout(scrollToTop, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
