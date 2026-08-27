import { getCmsSite } from "@/lib/cms/content";
import { DEFAULT_BRANDING, resolveBranding } from "@/lib/cms/branding";
import { renderSquareBrandPng } from "@/lib/cms/brand-assets";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const revalidate = 60;

export default async function Icon() {
  const branding = resolveBranding(await getCmsSite());
  const src = branding.icon || branding.logo || DEFAULT_BRANDING.icon;
  const png = await renderSquareBrandPng(src, size.width);
  return new Response(Uint8Array.from(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=60, must-revalidate",
    },
  });
}
