"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageview } from "@/lib/analytics";

/**
 * One pageview per path. Mounted in the root layout so it covers every page,
 * including client side navigations.
 */
export default function Analytics() {
  const pathname = usePathname();
  const seen = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || seen.current === pathname) return;
    seen.current = pathname;
    void trackPageview(pathname);
  }, [pathname]);

  return null;
}
