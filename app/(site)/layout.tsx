import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { BackToTop } from "@/components/shared/BackToTop";
import { MobileStickyBar } from "@/components/shared/MobileStickyBar";
import { JsonLd } from "@/components/shared/JsonLd";
import { PublicSiteProvider } from "@/components/cms/PublicSiteProvider";
import {
  localBusinessJsonLd,
  organizationJsonLd,
  serviceJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { getCmsSite, getPublicContent } from "@/lib/cms/content";
import { brandAssetUrl, resolveBranding } from "@/lib/cms/branding";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const branding = resolveBranding(await getCmsSite());
  return {
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
  };
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getPublicContent();

  return (
    <PublicSiteProvider site={content.site}>
      <JsonLd
        data={[
          organizationJsonLd(content.site),
          localBusinessJsonLd(content.site),
          websiteJsonLd(),
          serviceJsonLd(),
        ]}
      />
      <div className="pb-20 md:pb-0">
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppButton />
        <BackToTop />
        <MobileStickyBar />
      </div>
    </PublicSiteProvider>
  );
}
