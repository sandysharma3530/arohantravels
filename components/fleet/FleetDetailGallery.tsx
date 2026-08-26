"use client";

import { useState } from "react";
import { Images } from "lucide-react";
import type { FleetVehicle } from "@/content/fleet";
import { FleetGalleryModal } from "@/components/fleet/FleetGalleryModal";
import { Button } from "@/components/ui/button";
import { SafeCmsImage } from "@/components/shared/SafeCmsImage";

type FleetDetailGalleryProps = {
  vehicle: FleetVehicle;
};

export function FleetDetailGallery({ vehicle }: FleetDetailGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  function openAt(index: number) {
    setInitialIndex(index);
    setIsOpen(true);
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vehicle.gallery.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => openAt(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-100 bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            aria-label={`Open ${image.caption || image.alt || "gallery image"}`}
          >
            <SafeCmsImage
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
              loading="lazy"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent px-3 py-2 text-left text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
              {image.caption}
            </span>
          </button>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="md"
        className="mt-6"
        onClick={() => openAt(0)}
      >
        <Images className="h-4 w-4" aria-hidden="true" />
        View Full Gallery
      </Button>

      <FleetGalleryModal
        vehicle={vehicle}
        isOpen={isOpen}
        initialIndex={initialIndex}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
