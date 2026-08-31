import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/app/globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { getSiteUrl, shouldIndexSite } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const allowIndexing = shouldIndexSite();
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const geist = Geist({ display: "swap", subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ display: "swap", subsets: ["latin"], variable: "--font-geist-mono" });
const newsreader = Newsreader({ display: "swap", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-newsreader", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${BRAND_NAME} | Capital Region CRE Research`, template: `%s | ${BRAND_NAME}` },
  description: BRAND_DESCRIPTION,
  applicationName: BRAND_NAME,
  generator: "Next.js",
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  category: "Commercial real estate research",
  keywords: ["commercial real estate", "Maryland", "Washington DC", "Northern Virginia", "property transactions", "market research"],
  referrer: "strict-origin-when-cross-origin",
  robots: { index: allowIndexing, follow: allowIndexing, googleBot: { index: allowIndexing, follow: allowIndexing, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: { title: `${BRAND_NAME} — ${BRAND_TAGLINE}`, description: BRAND_DESCRIPTION, type: "website", url: "/", siteName: BRAND_NAME },
  twitter: { card: "summary_large_image", title: `${BRAND_NAME} — ${BRAND_TAGLINE}`, description: BRAND_DESCRIPTION },
  verification: googleVerification ? { google: googleVerification } : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: BRAND_NAME, url: siteUrl, description: metadata.description },
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: BRAND_NAME, publisher: { "@id": `${siteUrl}/#organization` }, inLanguage: "en-US" },
    ],
  };
  return <html lang="en"><body className={`${geist.variable} ${geistMono.variable} ${newsreader.variable}`}><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3">Skip to content</a><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><ScrollProgress /><SiteHeader /><main id="main-content" tabIndex={-1}>{children}</main><SiteFooter /><Analytics /><SpeedInsights /></body></html>;
}
