export const heroSlides = [
  {
    id: 1,
    eyebrow: "COMFORTABLE JOURNEYS.",
    headingLines: [
      { text: "MEMORABLE", accent: false },
      { text: "EXPERIENCES.", accent: true },
    ],
    description:
      "21-Seater Force Traveller rental for family trips, corporate travel, weddings, airport transfers, pilgrimages and customized outstation journeys.",
    image: "/images/hero/slide-1.jpg",
    imageAlt:
      "Force Traveller van ready for a scenic North India group journey",
    showTrustPoints: true,
    showCtas: true,
    enabled: true,
  },
  {
    id: 2,
    eyebrow: "TRAVEL SMART.",
    headingLines: [
      { text: "TRAVEL TOGETHER.", accent: false },
      { text: "TRAVEL COMFORTABLY.", accent: true },
    ],
    description:
      "Reliable group transportation for family vacations, corporate outings, religious journeys and special occasions.",
    image: "/images/hero/slide-2.jpg",
    imageAlt: "Comfortable group travel vehicle for family and corporate trips",
    showTrustPoints: false,
    showCtas: true,
    enabled: true,
  },
  {
    id: 3,
    eyebrow: "CUSTOM QUOTES.",
    headingLines: [
      { text: "EXPLORE NORTH INDIA", accent: false },
      { text: "YOUR WAY.", accent: true },
    ],
    description:
      "Request a customized quote for destinations across Uttarakhand, Himachal Pradesh, Rajasthan, Uttar Pradesh and Jammu & Kashmir.",
    image: "/images/hero/slide-3.jpg",
    imageAlt: "North India mountain landscape for customized outstation travel",
    showTrustPoints: false,
    showCtas: true,
    enabled: true,
  },
  {
    id: 4,
    eyebrow: "PREMIUM RIDES.",
    headingLines: [
      { text: "FORCE URBANIA", accent: false },
      { text: "FOR SPECIAL JOURNEYS.", accent: true },
    ],
    description:
      "Hire a Force Urbania for weddings, corporate travel and comfortable outstation trips from Delhi NCR.",
    image: "/images/fleet/urbania/cover.jpg",
    imageAlt: "Force Urbania luxury van for premium group travel",
    showTrustPoints: false,
    showCtas: true,
    enabled: true,
  },
] as const;

export const heroTrustPoints = [
  { id: "gps", label: "GPS Tracking", icon: "satellite" as const },
  { id: "cctv", label: "CCTV Enabled", icon: "cctv" as const },
  { id: "drivers", label: "Experienced Drivers", icon: "user" as const },
  {
    id: "vehicles",
    label: "Well-Maintained Vehicles",
    icon: "shield" as const,
  },
];

export const trustBarItems = [
  { id: "support", label: "24x7 Customer Support", icon: "headset" as const },
  {
    id: "door",
    label: "Door-to-Door Pickup & Drop",
    icon: "mapPin" as const,
  },
  { id: "pricing", label: "Transparent Pricing", icon: "receipt" as const },
  { id: "ontime", label: "On-Time Service", icon: "clock" as const },
  {
    id: "clean",
    label: "Clean & Sanitized Vehicles",
    icon: "sparkles" as const,
  },
  {
    id: "safe",
    label: "Safe, Comfortable & Reliable",
    icon: "shieldCheck" as const,
  },
] as const;
