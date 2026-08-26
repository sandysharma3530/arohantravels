import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  /** @deprecated use title */
  eyebrow?: string;
  /** @deprecated use subtitle */
  description?: string;
};

export function SectionHeader({
  title,
  subtitle,
  className,
  as: Tag = "h2",
  eyebrow,
  description,
}: SectionHeaderProps) {
  const heading = title || eyebrow || "";
  const support = subtitle || description;

  return (
    <div className={cn("mx-auto mb-10 max-w-3xl text-center", className)}>
      <div className="mb-4 flex items-center justify-center gap-3" aria-hidden="true">
        <span className="h-px w-10 bg-teal" />
        <span className="h-2 w-2 rounded-full bg-teal" />
        <span className="h-px w-10 bg-teal" />
      </div>
      <Tag className="text-balance text-3xl font-bold uppercase tracking-wide text-navy md:text-4xl">
        {heading}
      </Tag>
      {support ? (
        <p className="mt-3 text-balance text-base text-text-muted md:text-lg">
          {support}
        </p>
      ) : null}
    </div>
  );
}
