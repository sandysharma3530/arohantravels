import {
  Clock,
  Headset,
  MapPin,
  Receipt,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { getHomeContent } from "@/lib/cms/content";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  headset: Headset,
  mapPin: MapPin,
  receipt: Receipt,
  clock: Clock,
  sparkles: Sparkles,
  shieldCheck: ShieldCheck,
};

type TrustBarProps = {
  className?: string;
};

export async function TrustBar({ className }: TrustBarProps) {
  const { trustBarItems } = await getHomeContent();
  return (
    <div
      className={cn(
        "container-site relative z-20 -mt-8 md:-mt-10",
        className,
      )}
    >
      <div className="rounded-2xl bg-white px-4 py-5 shadow-soft md:px-6 md:py-6">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {trustBarItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <li
                key={item.id}
                className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold leading-snug text-navy sm:text-sm">
                  {item.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
