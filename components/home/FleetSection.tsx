import { getFleetVehicles } from "@/lib/cms/content";
import { FleetCard } from "@/components/fleet/FleetCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

type FleetSectionProps = {
  className?: string;
};

export async function FleetSection({ className }: FleetSectionProps) {
  const fleetVehicles = await getFleetVehicles();
  return (
    <section className={cn("section-pad bg-bg-light", className)}>
      <div className="container-site">
        <SectionHeader
          title="Coaches we arrange"
          subtitle="An Urbania for the longer day, or a 21-seat Traveller when the guest list grows. The exact vehicle is confirmed with the fare."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {fleetVehicles.map((vehicle) => (
            <FleetCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
