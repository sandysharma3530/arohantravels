import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import {
  AnalyticsScripts,
  GtmNoscript,
} from "@/components/shared/AnalyticsScripts";
import { createMetadata, defaultTitle } from "@/lib/seo";
import { siteConfig } from "@/content/site-config";
import { getCmsSite } from "@/lib/cms/content";
import { brandAssetUrl, resolveBranding } from "@/lib/cms/branding";
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

export const preferredRegion = "bom1";

export async function generateMetadata(): Promise<Metadata> {
  const branding = resolveBranding(await getCmsSite());

  return {
    ...createMetadata(),
    title: {
      default: defaultTitle,
      template: `%s | ${siteConfig.businessName}`,
    },
    icons: {
      icon: [
        { url: brandAssetUrl(branding.icon), sizes: "512x512", type: "image/png" },
        { url: brandAssetUrl(branding.icon192), sizes: "192x192", type: "image/png" },
        { url: brandAssetUrl("/icon"), sizes: "32x32", type: "image/png" },
        { url: brandAssetUrl("/favicon.ico"), sizes: "48x48" },
      ],
      apple: [
        { url: brandAssetUrl("/apple-icon"), sizes: "180x180", type: "image/png" },
        { url: brandAssetUrl(branding.appleIcon), sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#061B36" },
    { media: "(prefers-color-scheme: dark)", color: "#061B36" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body className={`${manrope.variable} ${inter.variable} antialiased`}>
        <GtmNoscript />
        <AnalyticsScripts />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
