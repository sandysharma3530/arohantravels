import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.businessName,
    short_name: "Arohan Travels",
    description: siteConfig.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#061b36",
    theme_color: "#061b36",
    orientation: "portrait-primary",
    categories: ["travel", "transportation"],
    lang: "en-IN",
    icons: [
      {
        src: "/images/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
