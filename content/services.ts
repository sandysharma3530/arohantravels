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
    title: "Family and friends",
    description:
      "One coach from your Greater Noida, Ghaziabad or Delhi address, with room for elders, children and the bags that never fit in two cars.",
    icon: "users",
  },
  {
    id: "corporate",
    slug: "corporate-travel",
    title: "Office offsites",
    description:
      "A single pickup for the team — offsite, plant visit or conference transfer — timed to the agenda your organiser already has.",
    icon: "briefcase",
  },
  {
    id: "wedding",
    slug: "wedding-transportation",
    title: "Wedding guest movement",
    description:
      "Baraat support, venue hops and guest drops on the wedding day, with a presentable cabin and a contact who stays on WhatsApp.",
    icon: "heart",
  },
  {
    id: "airport",
    slug: "airport-transfers",
    title: "Airport group pickups",
    description:
      "Meet a family or a full guest list at Delhi airports and take them to one address, or the other way round for a departure.",
    icon: "plane",
  },
  {
    id: "religious",
    slug: "religious-journeys",
    title: "Temple and yatra travel",
    description:
      "Darshan runs and longer yatras planned around your timing, with honest notes on hill roads, crowds and how far the coach can go.",
    icon: "temple",
  },
  {
    id: "school",
    slug: "school-college-trips",
    title: "School and college groups",
    description:
      "A coach and a driver for the educational or picnic day, with the departure, headcount and return fixed before the students board.",
    icon: "graduation",
  },
  {
    id: "outstation",
    slug: "customized-outstation-travel",
    title: "Outstation routes you name",
    description:
      "Multi-day driving across North India shaped by your dates and stops. The quote covers the coach, not a hotel bundle.",
    icon: "map",
  },
];

export const whyChooseUs = [
  {
    id: "vehicles",
    title: "Coaches checked before rollout",
    description:
      "Seats, cooling and luggage space are looked over before the group boards in Greater Noida or at your pickup.",
  },
  {
    id: "drivers",
    title: "Drivers who know these highways",
    description:
      "Hill and highway days are driven by people used to NCR departures toward Uttarakhand, Himachal and Rajasthan.",
  },
  {
    id: "gps",
    title: "GPS on equipped coaches",
    description:
      "When the assigned vehicle has tracking, organisers can follow the journey instead of guessing.",
  },
  {
    id: "cctv",
    title: "Cabin camera where fitted",
    description:
      "Ask us to confirm a camera for your date. We only promise it on coaches that actually have one.",
  },
  {
    id: "pricing",
    title: "Fare written before you confirm",
    description:
      "The number follows the route, dates, vehicle and waiting time. Nothing is listed as a package price on this site.",
  },
  {
    id: "ontime",
    title: "A pickup window we agree",
    description:
      "We set the departure with you, including a buffer when the group is coming from more than one address.",
  },
  {
    id: "clean",
    title: "Cabin cleaned for each group",
    description:
      "Interiors are prepared for families, wedding guests and office teams, not left over from the previous trip.",
  },
  {
    id: "support",
    title: "One desk on phone and WhatsApp",
    description:
      "The Greater Noida desk stays available for the enquiry and for updates once the trip is on.",
  },
  {
    id: "flexible",
    title: "Your route, not a set tour",
    description:
      "Destinations on this site are places we drive to. Nights, hotels and sightseeing stay yours to decide.",
  },
] as const;
