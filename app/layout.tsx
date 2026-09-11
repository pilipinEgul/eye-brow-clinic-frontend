import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import "primeicons/primeicons.css";
import { SiteShell } from "@/components/SiteShell";
import { JsonLd } from "@/components/JsonLd";
import { ToastProvider } from "@/lib/toast";
import { getSiteSettings } from "@/lib/site-settings";
import { api } from "@/lib/api";
import { normalizeTheme, themeCss } from "@/lib/theme";
import { ThemeSync } from "@/components/ThemeSync";
import { localBusinessSchema } from "@/lib/schemas";
import { site } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#f8d8b6",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "brows in Imus",
    "best aesthetic clinic Imus",
    "brow studio Cavite",
    "lip blush Imus",
    "lash extensions Imus",
    "permanent makeup Cavite",
    "facial treatment Imus",
    "ombre brows Philippines",
  ],
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  alternates: { canonical: site.url },
  robots: { index: true, follow: true },
  // Paste the token from Google Search Console / Bing Webmaster Tools into .env
  // (GOOGLE_SITE_VERIFICATION / BING_SITE_VERIFICATION) to verify ownership.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [siteSettings, themeRes] = await Promise.all([getSiteSettings(), api.theme()]);
  const theme = normalizeTheme(themeRes.data);

  // Apply mode before first paint — no flash. Priority: the visitor's saved
  // toggle → the admin default → (when default is "system") the device setting.
  const noFlash = `(function(){try{var s=localStorage.getItem('emcey-theme-mode');var d='${theme.default_mode}';var sys=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';var m=(s==='light'||s==='dark')?s:(d==='system'?sys:d);document.documentElement.setAttribute('data-theme',m);}catch(e){}})();`;
  const ssrMode = theme.default_mode === "dark" ? "dark" : "light";

  return (
    <html
      lang="en"
      data-theme={ssrMode}
      suppressHydrationWarning
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        <style id="emcey-theme" dangerouslySetInnerHTML={{ __html: themeCss(theme) }} />
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body className="min-h-full flex flex-col bg-cream-100 text-ink-900">
        <ThemeSync defaultMode={theme.default_mode} />
        <ToastProvider>
          <SiteShell settings={siteSettings}>{children}</SiteShell>
        </ToastProvider>
        <JsonLd data={localBusinessSchema()} />
      </body>
    </html>
  );
}
