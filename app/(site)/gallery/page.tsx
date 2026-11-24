import Link from "next/link";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getGalleryContent } from "@/lib/cms/content";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Coach and trip photos",
  description:
    "Photos of the Force Urbania and Force Traveller coaches Arohan Travels arranges, plus a few of the routes groups ask for.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const gallery = await getGalleryContent();
  return (
    <>
      <section className="bg-gradient-to-br from-navy via-navy-secondary to-navy py-12 md:py-16">
        <div className="container-site">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/70">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-teal-light">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white">Gallery</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Coach and route photos
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
            Cabins, exteriors and a few of the places groups leave Greater Noida
            to see. Open any photo to look closer.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeader
            as="h2"
            title="Sort the photos"
            subtitle="Filter by coach, cabin, exterior, or the kind of trip."
          />
          <GalleryGrid items={gallery.items} categories={gallery.categories} />
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
