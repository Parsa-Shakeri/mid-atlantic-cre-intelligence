import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/app/globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { getSiteUrl, shouldIndexSite } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const allowIndexing = shouldIndexSite();
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const geist = Geist({ display: "swap", subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ display: "swap", subsets: ["latin"], variable: "--font-geist-mono" });
const newsreader = Newsreader({ display: "swap", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-newsreader", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Mid-Atlantic CRE Intelligence", template: "%s | Mid-Atlantic CRE Intelligence" },
  description: "Independent student research on commercial real estate across Maryland, Washington, D.C., and Northern Virginia.",
  applicationName: "Mid-Atlantic CRE Intelligence",
  generator: "Next.js",
  creator: "Mid-Atlantic CRE Intelligence",
  publisher: "Mid-Atlantic CRE Intelligence",
  category: "Commercial real estate research",
  keywords: ["commercial real estate", "Maryland", "Washington DC", "Northern Virginia", "property transactions", "market research"],
  referrer: "strict-origin-when-cross-origin",
  robots: { index: allowIndexing, follow: allowIndexing, googleBot: { index: allowIndexing, follow: allowIndexing, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  alternates: { canonical: "/" },
  openGraph: { title: "Mid-Atlantic CRE Intelligence", description: "Commercial real estate, explained through local data.", type: "website", url: "/", siteName: "Mid-Atlantic CRE Intelligence" },
  twitter: { card: "summary_large_image", title: "Mid-Atlantic CRE Intelligence", description: "Commercial real estate, explained through local data." },
  verification: googleVerification ? { google: googleVerification } : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Mid-Atlantic CRE Intelligence", url: siteUrl, description: metadata.description },
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "Mid-Atlantic CRE Intelligence", publisher: { "@id": `${siteUrl}/#organization` }, inLanguage: "en-US" },
    ],
  };
  return <html lang="en"><body className={`${geist.variable} ${geistMono.variable} ${newsreader.variable}`}><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3">Skip to content</a><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><ScrollProgress /><SiteHeader /><main id="main-content" tabIndex={-1}>{children}</main><SiteFooter /><Analytics /><SpeedInsights /></body></html>;
}
