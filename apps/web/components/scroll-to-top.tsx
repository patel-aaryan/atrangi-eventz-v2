"use client";

import { useEffect } from "react";

export function ScrollToTop() {
  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ("scrollRestoration" in globalThis.history) {
      globalThis.history.scrollRestoration = "manual";
    }

    // Always scroll to top on mount/refresh
    globalThis.scrollTo(0, 0);
  }, []);

  return null;
}
