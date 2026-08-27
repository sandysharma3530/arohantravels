"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePublicSite } from "@/components/cms/PublicSiteProvider";
import { resolveBranding } from "@/lib/cms/branding";

/**
 * Compact square brand mark — used at 40–48px.
 */
type LogoMarkProps = {
  className?: string;
  title?: string;
};

export function LogoMark({
  className,
  title = "Aamantran by Arohan Travels",
}: LogoMarkProps) {
  const branding = resolveBranding(usePublicSite());

  return (
    <span
      className={cn(
        "relative inline-block h-10 w-10 overflow-hidden rounded-2xl bg-navy",
        className,
      )}
    >
      <Image
        src={branding.icon}
        alt={title}
        fill
        sizes="64px"
        className="object-contain"
        unoptimized
      />
    </span>
  );
}
