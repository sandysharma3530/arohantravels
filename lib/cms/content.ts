import { cache } from "react";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { readBundle } from "@/lib/cms/store";
import { getSeedBundle } from "@/lib/cms/seed";
import { sanitizePublicBundle } from "@/lib/cms/sanitize";
import { isNavHrefEnabled, type CmsBundle } from "@/lib/cms/types";

export const CMS_CACHE_TAG = "cms-public";

const loadCachedPublishedBundle = unstable_cache(
  async () => {
    const { bundle } = await readBundle({ includeDrafts: false });
    return sanitizePublicBundle(bundle);
  },
  ["cms-public-bundle"],
  { tags: [CMS_CACHE_TAG], revalidate: 60 },
);

/** Bust public CMS data and page caches after a publish/reset. */
export function revalidatePublicContent() {
  revalidateTag(CMS_CACHE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/manifest.webmanifest");
  revalidatePath("/icon");
  revalidatePath("/apple-icon");
}

/** Published content only — safe for generateStaticParams and build. */
export async function getPublishedContent(): Promise<CmsBundle> {
  try {
    return await loadCachedPublishedBundle();
  } catch (error) {
    console.error("[cms] published load failed; using seed", error);
    return sanitizePublicBundle(getSeedBundle());
  }
}

/** Public site always uses published content (never drafts). */
export const getPublicContent = cache(async (): Promise<CmsBundle> => {
  try {
    return await getPublishedContent();
  } catch (error) {
    console.error("[cms] content load failed; serving seed", error);
    return sanitizePublicBundle(getSeedBundle());
  }
});

export async function getCmsSite() {
  return (await getPublicContent()).site;
}

export async function isPublicNavEnabled(href: string) {
  return isNavHrefEnabled((await getCmsSite()).nav, href);
}

export async function getHomeContent() {
  return (await getPublicContent()).home;
}

export async function getDestinations() {
  const list = (await getPublicContent()).destinations;
  return [...list].sort((a, b) => a.homeOrder - b.homeOrder);
}

export async function getHomeDestinations(limit = 9) {
  return (await getDestinations())
    .filter((item) => item.featuredOnHome)
    .slice(0, limit);
}

export async function getDestinationBySlug(slug: string) {
  return (await getDestinations()).find((item) => item.slug === slug);
}

export async function getFleetVehicles(options?: { includeDisabled?: boolean }) {
  const fleet = (await getPublicContent()).fleet;
  if (options?.includeDisabled) return fleet;
  return fleet.filter((item) => item.available);
}

export async function getFleetBySlug(slug: string) {
  return (await getPublicContent()).fleet.find((item) => item.slug === slug);
}

export async function getServicesContent() {
  return (await getPublicContent()).services;
}

export async function getFaqs() {
  return (await getPublicContent()).faqs;
}

export async function getReviews() {
  return (await getPublicContent()).reviews;
}

export async function getFeaturedReviews(limit = 3) {
  return (await getReviews()).slice(0, limit);
}

export async function getBlogPosts() {
  return [...(await getPublicContent()).blog].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getPostBySlug(slug: string) {
  return (await getBlogPosts()).find((item) => item.slug === slug);
}

export async function getGalleryContent() {
  return (await getPublicContent()).gallery;
}

export async function getPageContent() {
  return (await getPublicContent()).pages;
}
