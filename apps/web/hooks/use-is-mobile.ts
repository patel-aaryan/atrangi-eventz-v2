import { useState, useEffect } from "react";

/**
 * Returns true when viewport width is ≤768px (mobile breakpoint).
 * Updates on resize; initial value is set asynchronously to avoid cascading renders.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 768px)");
    const handler = () => setIsMobile(m.matches);
    const id = requestAnimationFrame(() => handler());
    m.addEventListener("change", handler);
    return () => {
      cancelAnimationFrame(id);
      m.removeEventListener("change", handler);
    };
  }, []);
  return isMobile;
}
