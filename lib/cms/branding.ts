import type { CmsBranding, CmsSite } from "@/lib/cms/types";

export type { CmsBranding };

/** Navy used across the header, tab icon, and generated square variants. */
export const BRAND_NAVY = "#061B36";

export const DEFAULT_BRANDING: CmsBranding = {
  logo: "/images/brand/arohan-logo.webp",
  icon: "/images/brand/favicon-512.png",
  icon192: "/images/brand/favicon-192.png",
  appleIcon: "/images/brand/apple-touch.png",
  width: 320,
  height: 265,
};

export function brandAssetUrl(src: string, version = "brand") {
  if (/^https?:\/\//i.test(src)) return src;
  return `${src}${src.includes("?") ? "&" : "?"}v=${version}`;
}

export function resolveBranding(
  site?: Pick<CmsSite, "branding"> | null,
): CmsBranding {
  const branding = site?.branding;
  const hasCustomLogo = Boolean(branding?.logo);

  return {
    logo: branding?.logo || DEFAULT_BRANDING.logo,
    icon: branding?.icon || DEFAULT_BRANDING.icon,
    icon192: branding?.icon192 || DEFAULT_BRANDING.icon192,
    appleIcon: branding?.appleIcon || DEFAULT_BRANDING.appleIcon,
    width:
      branding?.width && branding.width > 0
        ? branding.width
        : hasCustomLogo
          ? undefined
          : DEFAULT_BRANDING.width,
    height:
      branding?.height && branding.height > 0
        ? branding.height
        : hasCustomLogo
          ? undefined
          : DEFAULT_BRANDING.height,
  };
}
