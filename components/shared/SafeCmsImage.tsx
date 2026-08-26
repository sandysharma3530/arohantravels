"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

function shouldSkipOptimizer(src: string) {
  return (
    src.startsWith("/images/uploads/") ||
    src.includes("/storage/v1/object/public/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:")
  );
}

type SafeCmsImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt?: string | null;
  fallbackClassName?: string;
};

/**
 * CMS/media-safe image: skips broken empty srcs and avoids re-optimizing
 * already-compressed uploads.
 */
export function SafeCmsImage({
  src,
  alt,
  className,
  fallbackClassName,
  onError,
  fill,
  ...rest
}: SafeCmsImageProps) {
  const [failed, setFailed] = useState(false);
  const usable = Boolean(src && String(src).trim() && !failed);

  if (!usable) {
    return (
      <div
        className={cn(
          "bg-slate-200",
          fill && "absolute inset-0",
          className,
          fallbackClassName,
        )}
        aria-hidden="true"
      />
    );
  }

  const resolved = String(src);

  return (
    <Image
      {...rest}
      fill={fill}
      src={resolved}
      alt={alt || ""}
      className={className}
      unoptimized={Boolean(shouldSkipOptimizer(resolved) || rest.unoptimized)}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
