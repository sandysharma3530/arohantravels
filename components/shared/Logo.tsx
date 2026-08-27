"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePublicSite } from "@/components/cms/PublicSiteProvider";
import { brandAssetUrl, resolveBranding } from "@/lib/cms/branding";

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
  showTagline?: boolean;
  /** When true, shows HTML Aamantran / Arohan Travels text beside the mark. */
  showWordmark?: boolean;
  priority?: boolean;
};

const HEADER_LOGO_HEIGHT_PX = 84;
const HEADER_LOGO_MAX_WIDTH_PX = 200;

/**
 * Brand lockup — Aamantran by Arohan Travels.
 * Native img + explicit pixel size so the header flex bar cannot collapse it.
 */
export function Logo({
  variant = "dark",
  className,
  showTagline = false,
  showWordmark = false,
  priority = false,
}: LogoProps) {
  const site = usePublicSite();
  const isLight = variant === "light";
  const branding = resolveBranding(site);
  const naturalWidth = branding.width || 320;
  const naturalHeight = branding.height || 265;
  const displayWidth = Math.round(
    Math.min(
      HEADER_LOGO_MAX_WIDTH_PX,
      HEADER_LOGO_HEIGHT_PX * (naturalWidth / naturalHeight),
    ),
  );

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex shrink-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
        isLight
          ? "focus-visible:ring-offset-navy"
          : "focus-visible:ring-offset-white",
        className,
      )}
      aria-label={`${site.businessName} — Home`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brandAssetUrl(branding.logo)}
        alt="Aamantran by Arohan Travels"
        width={displayWidth}
        height={HEADER_LOGO_HEIGHT_PX}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        style={{
          display: "block",
          width: displayWidth,
          height: HEADER_LOGO_HEIGHT_PX,
          maxWidth: HEADER_LOGO_MAX_WIDTH_PX,
          objectFit: "contain",
          objectPosition: "left center",
        }}
      />

      {showWordmark ? (
        <span className="flex flex-col justify-center leading-none">
          <span
            className={cn(
              "font-heading text-[13px] font-bold tracking-[0.04em] sm:text-[15px]",
              isLight ? "text-white" : "text-navy",
            )}
          >
            AAMANTRAN
          </span>
          <span
            className={cn(
              "mt-1 text-[10px] font-semibold tracking-[0.18em] text-gold sm:text-[11px]",
            )}
          >
            AROHAN TRAVELS
          </span>
          {showTagline ? (
            <span
              className={cn(
                "mt-1.5 text-[10px] font-medium tracking-wide",
                isLight ? "text-white/70" : "text-text-muted",
              )}
            >
              {site.tagline}
            </span>
          ) : null}
        </span>
      ) : null}
    </Link>
  );
}
