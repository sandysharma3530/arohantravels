import Link from "next/link";
import { getFleetVehicles } from "@/lib/cms/content";
import { FleetCard } from "@/components/fleet/FleetCard";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Urbania and Traveller options",
  description:
    "Compare the Force Urbania and the 21-seat Force Traveller that Arohan Travels arranges from Greater Noida. Fares are written for your route — nothing is sold as a package.",
  path: "/fleet",
  keywords: [
    "Force Urbania Greater Noida",
    "21 seater Traveller Ghaziabad",
    "group coach hire Delhi NCR",
    "Arohan Travels fleet",
  ],
});

export default async function FleetPage() {
  const fleetVehicles = await getFleetVehicles();
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
              <li className="text-white">Fleet</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Coaches we arrange
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
            The Urbania is our usual suggestion for a long day. The 21-seat
            Traveller is for the bigger guest list. Ask for a fare and we will
            name the vehicle.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeader
            as="h2"
            title="Which coach fits the group"
            subtitle="Photos and seat notes are here. The price is not — it depends on the route and the dates."
          />

          <div className="grid gap-8 lg:grid-cols-2">
            {fleetVehicles.map((vehicle) => (
              <FleetCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {fleetVehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/fleet/${vehicle.slug}`}
                className="text-sm font-semibold text-teal hover:underline"
              >
                {vehicle.name} details →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
