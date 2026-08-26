import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/content/site-config";

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
  showTagline?: boolean;
  /** When true, shows HTML SMART SQUAD / TRAVELS text beside the mark. */
  showWordmark?: boolean;
};

/**
 * Brand lockup — logo image by default (no HTML wordmark).
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
        "group inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2",
        isLight
          ? "focus-visible:ring-offset-navy"
          : "focus-visible:ring-offset-white",
        className,
      )}
      aria-label={`${siteConfig.businessName} — Home`}
    >
      <span className="relative block h-[3.75rem] w-[4.85rem] shrink-0 transition-transform duration-300 group-hover:scale-[1.03] sm:h-16 sm:w-[5.2rem] md:h-[4.5rem] md:w-[5.85rem]">
        <Image
          src="/images/brand/logo-header.png"
          alt=""
          fill
          sizes="(max-width: 640px) 78px, (max-width: 768px) 84px, 94px"
          className="object-contain object-left"
          priority
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
            SMART SQUAD
          </span>
          <span
            className={cn(
              "mt-1 text-[10px] font-semibold tracking-[0.28em] sm:text-[11px]",
              isLight ? "text-teal-light" : "text-teal",
            )}
          >
            TRAVELS
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
