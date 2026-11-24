export const heroSlides = [
  {
    id: 1,
    eyebrow: "FROM GREATER NOIDA.",
    headingLines: [
      { text: "THE GROUP", accent: false },
      { text: "IS INVITED.", accent: true },
    ],
    description:
      "Arohan Travels arranges Force Urbania and 21-seat Force Traveller coaches for families, weddings, offices and temple trips leaving Greater Noida, Ghaziabad and Delhi NCR.",
    image: "/images/hero/slide-1.jpg",
    imageAlt: "Force Traveller parked before a group departure from Greater Noida",
    showTrustPoints: true,
    showCtas: true,
    enabled: true,
  },
  {
    id: 2,
    eyebrow: "ONE COACH. YOUR STOPS.",
    headingLines: [
      { text: "HILL DAYS", accent: false },
      { text: "WITHOUT A PACKAGE.", accent: true },
    ],
    description:
      "Name the date, the headcount and the places you actually want to see. We price the driving plan for Uttarakhand, Himachal, Rajasthan or a same-day NCR run.",
    image: "/images/hero/slide-2.jpg",
    imageAlt: "Group coach prepared for a family or office outing",
    showTrustPoints: false,
    showCtas: true,
    enabled: true,
  },
  {
    id: 3,
    eyebrow: "URBANIA WHEN THE DAY IS LONG.",
    headingLines: [
      { text: "RECLINER SEATS", accent: false },
      { text: "FOR THE HIGHWAY.", accent: true },
    ],
    description:
      "For longer outstation days we usually suggest a Force Urbania. Larger parties move to the Traveller once seats and luggage are clear.",
    image: "/images/hero/slide-3.jpg",
    imageAlt: "Hill road of the kind Arohan groups take from Delhi NCR",
    showTrustPoints: false,
    showCtas: true,
    enabled: true,
  },
  {
    id: 4,
    eyebrow: "WEDDINGS, OFFICES, AIRPORTS.",
    headingLines: [
      { text: "GUESTS MOVE", accent: false },
      { text: "AS ONE GROUP.", accent: true },
    ],
    description:
      "Guest shuttles, terminal pickups and office outings are coordinated from our Greater Noida desk, with the fare written down before you confirm.",
    image: "/images/fleet/urbania/cover.jpg",
    imageAlt: "Force Urbania used for guest and office group travel",
    showTrustPoints: false,
    showCtas: true,
    enabled: true,
  },
] as const;

export const heroTrustPoints = [
  { id: "gps", label: "GPS on equipped coaches", icon: "satellite" as const },
  { id: "cctv", label: "Cabin camera where fitted", icon: "cctv" as const },
  { id: "drivers", label: "Drivers briefed on the route", icon: "user" as const },
  {
    id: "vehicles",
    label: "Checked before departure",
    icon: "shield" as const,
  },
];

export const trustBarItems = [
  { id: "support", label: "Phone support around the clock", icon: "headset" as const },
  {
    id: "door",
    label: "Pickup at home or office",
    icon: "mapPin" as const,
  },
  { id: "pricing", label: "Fare shared in writing", icon: "receipt" as const },
  { id: "ontime", label: "Departure time we agree", icon: "clock" as const },
  {
    id: "clean",
    label: "Cabin cleaned before boarding",
    icon: "sparkles" as const,
  },
  {
    id: "safe",
    label: "Steady pace for mixed-age groups",
    icon: "shieldCheck" as const,
  },
] as const;
