export type Service = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: "users" | "briefcase" | "heart" | "plane" | "temple" | "graduation" | "map";
};

export const services: Service[] = [
  {
    id: "family",
    slug: "family-group-trips",
    title: "Family and Group Trips",
    description:
      "Comfortable Traveller travel for family vacations and friend groups with door-to-door pickup planning.",
    icon: "users",
  },
  {
    id: "corporate",
    slug: "corporate-travel",
    title: "Corporate Travel",
    description:
      "Reliable group transportation for offsites, conferences, team outings and staff transfers.",
    icon: "briefcase",
  },
  {
    id: "wedding",
    slug: "wedding-transportation",
    title: "Wedding Transportation",
    description:
      "Coordinated guest transfers and wedding-day travel support with spacious, presentable vehicles.",
    icon: "heart",
  },
  {
    id: "airport",
    slug: "airport-transfers",
    title: "Airport Transfers",
    description:
      "Group airport pickup and drop for families, teams and wedding guests across Delhi NCR airports.",
    icon: "plane",
  },
  {
    id: "religious",
    slug: "religious-journeys",
    title: "Religious Journeys",
    description:
      "Thoughtful planning for pilgrimages and temple visits with attention to comfort and timing.",
    icon: "temple",
  },
  {
    id: "school",
    slug: "school-college-trips",
    title: "School and College Trips",
    description:
      "Organised group travel for educational and recreational trips with clear coordination.",
    icon: "graduation",
  },
  {
    id: "outstation",
    slug: "customized-outstation-travel",
    title: "Customized Outstation Travel",
    description:
      "Flexible outstation journeys across North India planned around your dates, route and group size.",
    icon: "map",
  },
];

export const whyChooseUs = [
  {
    id: "vehicles",
    title: "Well-Maintained Vehicles",
    description: "Clean, spacious Traveller options prepared for comfortable group journeys.",
  },
  {
    id: "drivers",
    title: "Experienced and Verified Drivers",
    description: "Professional drivers focused on safe, courteous and dependable travel.",
  },
  {
    id: "gps",
    title: "GPS Tracking",
    description: "Journey visibility that supports peace of mind for families and organisers.",
  },
  {
    id: "cctv",
    title: "CCTV-Enabled Vehicle",
    description: "Added monitoring support on equipped vehicles for safer group travel.",
  },
  {
    id: "pricing",
    title: "Transparent Pricing",
    description: "Clear custom quotations based on route, dates, vehicle and passenger needs.",
  },
  {
    id: "ontime",
    title: "On-Time Pickup",
    description: "Punctual coordination so your group can travel with less waiting and stress.",
  },
  {
    id: "clean",
    title: "Clean Interiors",
    description: "Sanitized, presentable cabins suited for families, guests and corporate teams.",
  },
  {
    id: "support",
    title: "Customer Support",
    description: "Helpful enquiry support before and during your travel planning.",
  },
  {
    id: "flexible",
    title: "Flexible Destination Planning",
    description: "Routes shaped around your preferred destinations — not fixed tour packages.",
  },
] as const;
