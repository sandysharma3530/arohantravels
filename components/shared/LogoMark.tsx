import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Compact brand mark — peacock crest on navy.
 * Designed for sticky headers and small badges (readable at 40–48px).
 */
type LogoMarkProps = {
  className?: string;
  title?: string;
};

export function LogoMark({
  className,
  title = "Aamantran by Arohan Travels",
}: LogoMarkProps) {
  return (
    <span
      className={cn(
        "relative inline-block h-10 w-10 overflow-hidden rounded-2xl bg-navy",
        className,
      )}
    >
      <Image
        src="/images/brand/arohan-icon.png"
        alt={title}
        fill
        sizes="64px"
        className="object-cover"
      />
    </span>
  );
}
