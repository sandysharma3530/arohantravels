import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Inter, Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { BackToTop } from "@/components/shared/BackToTop";
import { MobileStickyBar } from "@/components/shared/MobileStickyBar";
import { JsonLd } from "@/components/shared/JsonLd";
import {
  AnalyticsScripts,
  GtmNoscript,
} from "@/components/shared/AnalyticsScripts";
import { PublicSiteProvider } from "@/components/cms/PublicSiteProvider";
import {
  createMetadata,
  localBusinessJsonLd,
  organizationJsonLd,
  serviceJsonLd,
  websiteJsonLd,
  defaultTitle,
} from "@/lib/seo";
import { getPublicContent } from "@/lib/cms/content";
import { siteConfig } from "@/content/site-config";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  ...createMetadata(),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.businessName}`,
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#061B36" },
    { media: "(prefers-color-scheme: dark)", color: "#061B36" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/sstadmin");
  const content = isAdmin ? null : await getPublicContent();

  return (
    <html lang="en-IN">
      <body
        className={`${manrope.variable} ${inter.variable} antialiased ${isAdmin ? "" : "pb-20 md:pb-0"}`}
      >
        <GtmNoscript />
        <AnalyticsScripts />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {isAdmin ? (
          <main id="main-content">{children}</main>
        ) : (
          <PublicSiteProvider site={content!.site}>
            <JsonLd
              data={[
                organizationJsonLd(),
                localBusinessJsonLd(),
                websiteJsonLd(),
                serviceJsonLd(),
              ]}
            />
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
            <WhatsAppButton />
            <BackToTop />
            <MobileStickyBar />
          </PublicSiteProvider>
        )}
      </body>
    </html>
  );
}
