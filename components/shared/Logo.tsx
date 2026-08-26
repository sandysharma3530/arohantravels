import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/content/site-config";

/** Bump this whenever the logo file changes so browsers do not keep the old Smart Squad image. */
export const LOGO_SRC = "/images/brand/arohan-logo.png";

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
  showTagline?: boolean;
  /** When true, shows HTML Aamantran / Arohan Travels text beside the mark. */
  showWordmark?: boolean;
};

/**
 * Brand lockup — Aamantran by Arohan Travels.
 * Uses an unoptimized PNG so Next.js image cache cannot serve the previous logo.
 */
export function Logo({
  variant = "dark",
  className,
  showTagline = false,
  showWordmark = false,
}: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
        isLight
          ? "focus-visible:ring-offset-navy"
          : "focus-visible:ring-offset-white",
        className,
      )}
      aria-label={`${siteConfig.businessName} — Home`}
    >
      <span className="relative block h-[4.6rem] w-[5.6rem] shrink-0 overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-[1.03] sm:h-[5.1rem] sm:w-[6.2rem] md:h-[5.35rem] md:w-[6.5rem]">
        <Image
          src={LOGO_SRC}
          alt="Aamantran by Arohan Travels"
          fill
          sizes="(max-width: 640px) 90px, 104px"
          className="object-contain object-left"
          priority
          unoptimized
        />
      </span>

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
              {siteConfig.tagline}
            </span>
          ) : null}
        </span>
      ) : null}
    </Link>
  );
}
