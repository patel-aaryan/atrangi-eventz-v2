/**
 * Handles click events for links with hash fragments.
 * If the user is already on the target page, it will scroll to the element
 * instead of triggering a navigation event.
 *
 * @param e - The click event
 * @param href - The href of the link
 * @param pathname - The current pathname from usePathname()
 * @param onNavigate - Optional callback to run before scrolling (e.g., to close a menu)
 */
export function handleHashNavigation(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  pathname: string,
  onNavigate?: () => void,
) {
  // Check if the href contains a hash
  if (href.includes("#")) {
    const [path, hash] = href.split("#");

    // Ensure hash is defined and not empty
    if (!hash) return;

    // If we're already on the same path (or it's the home page)
    if (pathname === path || (path === "/" && pathname === "/")) {
      e.preventDefault();

      // Run optional callback (e.g., close mobile menu)
      if (onNavigate) onNavigate();

      // Scroll to the element
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }
}
