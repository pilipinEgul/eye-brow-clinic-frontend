"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import type { SiteSettings } from "@/lib/site-settings";

/**
 * Wraps page content with the marketing chrome (header/footer/floating CTA) —
 * except on the /admin dashboard, which renders bare so it can own its own
 * layout.
 */
export function SiteShell({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: SiteSettings;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <Footer settings={settings} />
      <FloatingCTA />
    </>
  );
}
