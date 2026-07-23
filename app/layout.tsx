import type { Metadata } from "next";
import "@/app/globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { getSiteUrl, shouldIndexSite } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const allowIndexing = shouldIndexSite();

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
  openGraph: { title: "Mid-Atlantic CRE Intelligence", description: "Commercial real estate, explained through local data.", type: "website", url: "/", siteName: "Mid-Atlantic CRE Intelligence", images: [{ url: "/og.png", width: 1732, height: 996, alt: "Mid-Atlantic CRE Intelligence — Commercial Real Estate, Explained Through Local Data" }] },
  twitter: { card: "summary_large_image", title: "Mid-Atlantic CRE Intelligence", description: "Commercial real estate, explained through local data.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Mid-Atlantic CRE Intelligence", url: siteUrl, description: metadata.description },
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "Mid-Atlantic CRE Intelligence", publisher: { "@id": `${siteUrl}/#organization` }, inLanguage: "en-US" },
    ],
  };
  return <html lang="en"><body><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3">Skip to content</a><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><SiteHeader /><main id="main-content" tabIndex={-1}>{children}</main><SiteFooter /></body></html>;
}
