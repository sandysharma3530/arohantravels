"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryCategory, GalleryItem } from "@/content/gallery";
import { cn } from "@/lib/utils";

export function GalleryGrid({
  items,
  categories,
}: {
  items: GalleryItem[];
  categories: { id: GalleryCategory; label: string }[];
}) {
  const galleryItems = items;
  const galleryCategories = categories;
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return galleryItems;
    return galleryItems.filter((item) =>
      item.categories.includes(activeCategory),
    );
  }, [activeCategory]);

  const activeItem = filteredItems[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (filteredItems.length === 0) return;
      setActiveIndex((index + filteredItems.length) % filteredItems.length);
    },
    [filteredItems.length],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  function openLightbox(index: number) {
    setActiveIndex(index);
    setLightboxOpen(true);
  }

  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxOpen(false);
      else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrev, lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleTab(event: KeyboardEvent) {
      if (event.key !== "Tab" || focusable.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    modal.addEventListener("keydown", handleTab);
    return () => modal.removeEventListener("keydown", handleTab);
  }, [lightboxOpen]);

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const deltaX = event.changedTouches[0]?.clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < 50) return;
    if (deltaX > 0) goPrev();
    else goNext();
  }

  return (
    <>
      <div
        className="mb-8 flex flex-wrap justify-center gap-2"
        role="tablist"
        aria-label="Gallery categories"
      >
        {galleryCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              activeCategory === category.id
                ? "bg-teal text-white shadow-sm"
                : "bg-white text-navy ring-1 ring-slate-200 hover:bg-slate-50",
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-center text-text-muted">
          No photos in this category yet. Check back soon.
        </p>
      ) : (
        <div
          className="columns-1 gap-4 sm:columns-2 lg:columns-3"
          aria-live="polite"
        >
          {filteredItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openLightbox(index)}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-slate-100 bg-white shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
              aria-label={`Open ${item.caption}`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
              </div>
              <p className="px-3 py-2 text-left text-sm text-text-muted">
                {item.caption}
              </p>
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && activeItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-lightbox-title"
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 md:px-6">
              <div>
                <h2
                  id="gallery-lightbox-title"
                  className="text-lg font-bold text-navy"
                >
                  Photo Gallery
                </h2>
                <p className="text-sm text-text-muted">
                  {activeIndex + 1} of {filteredItems.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="rounded-full p-2 text-navy transition hover:bg-slate-100"
                aria-label="Close gallery"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative aspect-[16/10] bg-navy">
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 960px"
              />

              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-navy shadow"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-navy shadow"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <p className="px-4 py-3 text-center text-sm text-text-muted md:px-6">
              {activeItem.caption}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
