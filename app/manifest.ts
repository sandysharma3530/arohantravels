import type { MetadataRoute } from "next";
import { getCmsSite } from "@/lib/cms/content";
import { resolveBranding } from "@/lib/cms/branding";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getCmsSite();
  const branding = resolveBranding(site);

  return {
    name: site.businessName,
    short_name: "Arohan Travels",
    description: site.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#061b36",
    theme_color: "#061b36",
    orientation: "portrait-primary",
    categories: ["travel", "transportation"],
    lang: "en-IN",
    icons: [
      {
        src: branding.icon192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: branding.icon,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: branding.icon,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
