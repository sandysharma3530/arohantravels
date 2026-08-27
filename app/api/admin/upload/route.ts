import { NextResponse } from "next/server";
import {
  getMaxInputBytes,
  isAllowedImageType,
  optimizeImageBuffer,
  storeOptimizedImage,
  type ImageUploadFolder,
  type ImageUploadVariant,
} from "@/lib/cms/image-optimize";
import { generateBrandAssets } from "@/lib/cms/brand-assets";
import { assertPersistentBackend } from "@/lib/supabase";

export const runtime = "nodejs";

const FOLDERS = new Set<ImageUploadFolder>([
  "destinations",
  "fleet",
  "gallery",
  "blog",
  "hero",
  "uploads",
  "brand",
]);

const VARIANTS = new Set<ImageUploadVariant>([
  "cover",
  "gallery",
  "hero",
  "general",
  "brand",
]);

function parseFolder(value: FormDataEntryValue | null): ImageUploadFolder {
  const folder = String(value || "uploads");
  return FOLDERS.has(folder as ImageUploadFolder)
    ? (folder as ImageUploadFolder)
    : "uploads";
}

function parseVariant(value: FormDataEntryValue | null): ImageUploadVariant {
  const variant = String(value || "general");
  return VARIANTS.has(variant as ImageUploadVariant)
    ? (variant as ImageUploadVariant)
    : "general";
}

export async function POST(request: Request) {
  try {
    assertPersistentBackend("uploads");
    const form = await request.formData();
    const folder = parseFolder(form.get("folder"));
    const variant = parseVariant(form.get("variant"));
    const files = form
      .getAll("files")
      .concat(form.get("file") ? [form.get("file")!] : [])
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (!files.length) {
      return NextResponse.json({ error: "No image files provided." }, { status: 400 });
    }

    if (files.length > 12) {
      return NextResponse.json(
        { error: "Upload up to 12 images at a time." },
        { status: 400 },
      );
    }

    const maxBytes = getMaxInputBytes();
    const uploaded: Array<{
      url: string;
      width: number;
      height: number;
      bytes: number;
      quality: number;
      storage: "supabase" | "filesystem";
      originalName: string;
    }> = [];

    for (const file of files) {
      if (!isAllowedImageType(file.type)) {
        return NextResponse.json(
          { error: `Unsupported type for ${file.name}. Use JPG, PNG, WebP, GIF, or AVIF.` },
          { status: 400 },
        );
      }
      if (file.size > maxBytes) {
        return NextResponse.json(
          { error: `${file.name} is too large (max ${Math.round(maxBytes / (1024 * 1024))}MB).` },
          { status: 400 },
        );
      }

      const input = Buffer.from(await file.arrayBuffer());

      if (variant === "brand") {
        const assets = await generateBrandAssets(input);
        const [logo, icon, icon192, appleIcon] = await Promise.all([
          storeOptimizedImage({
            buffer: assets.logo.buffer,
            folder: "brand",
            originalName: `${file.name}-logo`,
            contentType: "image/webp",
            extension: "webp",
          }),
          storeOptimizedImage({
            buffer: assets.icon512,
            folder: "brand",
            originalName: `${file.name}-icon-512`,
            contentType: "image/png",
            extension: "png",
          }),
          storeOptimizedImage({
            buffer: assets.icon192,
            folder: "brand",
            originalName: `${file.name}-icon-192`,
            contentType: "image/png",
            extension: "png",
          }),
          storeOptimizedImage({
            buffer: assets.appleIcon,
            folder: "brand",
            originalName: `${file.name}-apple`,
            contentType: "image/png",
            extension: "png",
          }),
        ]);

        return NextResponse.json({
          ok: true,
          files: [
            {
              url: logo.url,
              width: assets.logo.width,
              height: assets.logo.height,
              bytes: assets.logo.bytes,
              quality: 90,
              storage: logo.storage,
              originalName: file.name,
            },
          ],
          url: logo.url,
          branding: {
            logo: logo.url,
            icon: icon.url,
            icon192: icon192.url,
            appleIcon: appleIcon.url,
            width: assets.logo.width,
            height: assets.logo.height,
          },
        });
      }

      const optimized = await optimizeImageBuffer(input, variant);
      const stored = await storeOptimizedImage({
        buffer: optimized.buffer,
        folder,
        originalName: file.name,
        contentType: optimized.contentType,
        extension: optimized.extension,
      });

      uploaded.push({
        url: stored.url,
        width: optimized.width,
        height: optimized.height,
        bytes: optimized.bytes,
        quality: optimized.quality,
        storage: stored.storage,
        originalName: file.name,
      });
    }

    return NextResponse.json({
      ok: true,
      files: uploaded,
      url: uploaded[0]?.url,
    });
  } catch (error) {
    console.error("[cms-upload]", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Image upload failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
