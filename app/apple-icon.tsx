import { getCmsSite } from "@/lib/cms/content";
import { DEFAULT_BRANDING, resolveBranding } from "@/lib/cms/branding";
import { renderSquareBrandPng } from "@/lib/cms/brand-assets";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const revalidate = 60;

export default async function AppleIcon() {
  const branding = resolveBranding(await getCmsSite());
  const src = branding.appleIcon || branding.icon || DEFAULT_BRANDING.appleIcon;
  const png = await renderSquareBrandPng(src, size.width);
  return new Response(Uint8Array.from(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=60, must-revalidate",
    },
  });
}
