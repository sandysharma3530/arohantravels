import type { MetadataRoute } from "next";
import { getBlogPosts, getCmsSite, getDestinations, getFleetVehicles } from "@/lib/cms/content";
import { isNavHrefEnabled } from "@/lib/cms/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getCmsSite();
  const blogPosts = await getBlogPosts();
  const destinations = await getDestinations();
  const fleetVehicles = await getFleetVehicles();
  const baseUrl = site.siteUrl.replace(/\/$/, "");
  const now = new Date();
  const navEnabled = (href: string) => isNavHrefEnabled(site.nav, href);

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", href: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/about", href: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/fleet", href: "/fleet", priority: 0.9, changeFrequency: "monthly" as const },
    {
      path: "/destinations",
      href: "/destinations",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    { path: "/gallery", href: "/gallery", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/reviews", href: "/reviews", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/blog", href: "/blog", priority: 0.75, changeFrequency: "weekly" as const },
    { path: "/contact", href: "/contact", priority: 0.95, changeFrequency: "monthly" as const },
    { path: "/privacy", href: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", href: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ]
    .filter((route) => route.href === "/privacy" || route.href === "/terms" || navEnabled(route.href))
    .map((route) => ({
      url: `${baseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));

  const fleetRoutes: MetadataRoute.Sitemap = navEnabled("/fleet")
    ? fleetVehicles.map((vehicle) => ({
        url: `${baseUrl}/fleet/${vehicle.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.85,
      }))
    : [];

  const destinationRoutes: MetadataRoute.Sitemap = navEnabled("/destinations")
    ? destinations.map((destination) => ({
        url: `${baseUrl}/destinations/${destination.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: destination.featuredOnHome ? 0.85 : 0.7,
      }))
    : [];

  const blogRoutes: MetadataRoute.Sitemap = navEnabled("/blog")
    ? blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.65,
      }))
    : [];

  return [...staticRoutes, ...fleetRoutes, ...destinationRoutes, ...blogRoutes];
}
