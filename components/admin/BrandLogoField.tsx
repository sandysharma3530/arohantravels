"use client";

import { useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { SafeCmsImage } from "@/components/shared/SafeCmsImage";
import {
  DEFAULT_BRANDING,
  resolveBranding,
  type CmsBranding,
} from "@/lib/cms/branding";
import type { CmsSite } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

type BrandLogoFieldProps = {
  site: CmsSite;
  onChange: (branding: CmsBranding) => void;
};

export function BrandLogoField({ site, onChange }: BrandLogoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const branding = resolveBranding(site);

  async function handleFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setInfo("Creating header, tab, and app icons…");

    const form = new FormData();
    form.set("folder", "brand");
    form.set("variant", "brand");
    form.append("files", file);

    try {
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
      if (!data.branding?.logo || !data.branding?.icon) {
        setError("Upload completed but logo variants were not returned.");
        return;
      }
      onChange(data.branding as CmsBranding);
      setInfo(
        `Logo ready · header ${data.branding.width}×${data.branding.height} · tab and app icons generated. Click Publish live to update the website.`,
      );
    } catch {
      setError("Upload failed. Try a PNG, JPG, or WebP under 12MB.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-dashed border-slate-300 bg-bg-light p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-navy">Website logo</p>
          <p className="mt-1 max-w-xl text-xs text-text-muted">
            Upload one image. It is kept in full for the header and footer, then
            padded (not cropped) into square tab, Apple, and app icons.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={uploading}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Uploading…" : "Upload logo"}
          </button>
          <button
            type="button"
            disabled={uploading}
            className="h-9 rounded-xl px-3 text-sm font-semibold text-navy hover:bg-white"
            onClick={() => {
              onChange({ ...DEFAULT_BRANDING });
              setInfo("Restored the default Aamantran logo. Publish live to apply.");
              setError("");
            }}
          >
            Use default
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(event) => handleFile(event.target.files)}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <PreviewFrame label="Header" hint="Auto-fits the header height">
          <div className="flex h-24 items-center bg-navy px-3">
            <div className="relative h-16 w-24 overflow-hidden">
              <SafeCmsImage
                src={branding.logo}
                alt=""
                fill
                className="object-contain object-left"
                sizes="144px"
              />
            </div>
          </div>
        </PreviewFrame>
        <PreviewFrame label="Browser tab" hint="Square, full logo visible">
          <div className="flex h-24 items-center justify-center gap-3 bg-white">
            <div className="relative h-8 w-8 overflow-hidden rounded-sm border border-slate-200 bg-navy">
              <SafeCmsImage
                src={branding.icon}
                alt=""
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
            <div className="relative h-4 w-4 overflow-hidden rounded-[2px] border border-slate-200 bg-navy">
              <SafeCmsImage
                src={branding.icon}
                alt=""
                fill
                className="object-contain"
                sizes="16px"
              />
            </div>
          </div>
        </PreviewFrame>
        <PreviewFrame label="Home screen" hint="180×180 Apple / PWA">
          <div className="flex h-24 items-center justify-center bg-white">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-navy shadow-sm">
              <SafeCmsImage
                src={branding.appleIcon}
                alt=""
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
          </div>
        </PreviewFrame>
      </div>

      {info ? <p className="text-xs font-medium text-teal">{info}</p> : null}
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

function PreviewFrame({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {children}
      <div className="border-t border-slate-100 px-3 py-2">
        <p className="text-xs font-semibold text-navy">{label}</p>
        <p className="text-[11px] text-text-muted">{hint}</p>
      </div>
    </div>
  );
}
