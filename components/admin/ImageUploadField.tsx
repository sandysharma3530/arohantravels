"use client";

import { useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { SafeCmsImage } from "@/components/shared/SafeCmsImage";
import { cn } from "@/lib/utils";

type UploadResult = {
  url: string;
  width?: number;
  height?: number;
  bytes?: number;
  quality?: number;
};

type ImageUploadFieldProps = {
  label: string;
  hint?: string;
  folder: "destinations" | "fleet" | "gallery" | "blog" | "hero" | "uploads";
  variant?: "cover" | "gallery" | "hero" | "general";
  multiple?: boolean;
  value?: string;
  onUploaded: (urls: string[], files: UploadResult[]) => void;
  className?: string;
};

const VARIANT_LIMITS = {
  cover: { maxEdge: 1920, quality: 0.82 },
  gallery: { maxEdge: 1600, quality: 0.8 },
  hero: { maxEdge: 1920, quality: 0.82 },
  general: { maxEdge: 1600, quality: 0.8 },
} as const;

function formatBytes(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function compressForUpload(
  file: File,
  variant: keyof typeof VARIANT_LIMITS,
): Promise<File> {
  const limits = VARIANT_LIMITS[variant] || VARIANT_LIMITS.general;

  // Skip tiny already-optimized files
  if (file.size < 350_000 && file.type === "image/webp") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, limits.maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", limits.quality),
    );
    if (!blob || blob.size >= file.size) return file;

    const base = file.name.replace(/\.[a-z0-9]+$/i, "") || "image";
    return new File([blob], `${base}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

export function ImageUploadField({
  label,
  hint,
  folder,
  variant = "general",
  multiple = false,
  value,
  onUploaded,
  className,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setUploading(true);
    setError("");
    setInfo("Compressing images…");

    const form = new FormData();
    form.set("folder", folder);
    form.set("variant", variant);

    try {
      const sourceFiles = Array.from(fileList);
      for (const file of sourceFiles) {
        const compressed = await compressForUpload(file, variant);
        form.append("files", compressed);
      }

      setInfo("Uploading…");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
        credentials: "same-origin",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }
      const files = (data.files || []) as UploadResult[];
      const urls = files.map((file) => file.url).filter(Boolean);
      if (!urls.length) {
        setError("Upload completed but no image URL was returned.");
        return;
      }
      onUploaded(urls, files);
      const first = files[0];
      setInfo(
        first
          ? `Optimized WebP${first.width && first.height ? ` ${first.width}×${first.height}` : ""}${
              first.quality ? ` @ q${first.quality}` : ""
            }${first.bytes ? ` · ${formatBytes(first.bytes)}` : ""}${
              files.length > 1 ? ` · ${files.length} files` : ""
            }`
          : "Upload complete.",
      );
    } catch {
      setError("Upload failed. Try a smaller image or fewer files at once.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("space-y-2 rounded-xl border border-dashed border-slate-300 bg-bg-light p-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-navy">{label}</p>
          <p className="text-xs text-text-muted">
            {hint ||
              "Images are compressed in-browser, then resized to WebP on the server for fast loading."}
          </p>
        </div>
        <button
          type="button"
          disabled={uploading}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : multiple ? "Upload images" : "Upload image"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        multiple={multiple}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      {value ? (
        <div className="relative h-28 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <SafeCmsImage src={value} alt="" fill className="object-cover" sizes="176px" />
        </div>
      ) : null}

      {info ? <p className="text-xs font-medium text-teal">{info}</p> : null}
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
