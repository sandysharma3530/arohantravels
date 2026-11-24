/**
 * DEMO REVIEWS — clearly marked sample content for development.
 * Replace with real customer reviews or connect Google Business Profile.
 * Do not present these as verified Google reviews until replaced.
 */
export type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  tripRoute?: string;
  date?: string;
  isDemo: boolean;
  avatarInitials: string;
};

export const reviews: Review[] = [
  {
    id: "demo-1",
    name: "Rajeev Sharma",
    rating: 5,
    text: "Our Nainital weekend started from Greater Noida in a clean Traveller. The driver kept the hill pace steady and the pickup was at the society gate.",
    tripRoute: "Noida → Nainital",
    date: "2025-11-12",
    isDemo: true,
    avatarInitials: "RS",
  },
  {
    id: "demo-2",
    name: "Neha Verma",
    rating: 5,
    text: "Arohan ran the guest shuttles for our Greater Noida wedding. The cabin looked right for family, and WhatsApp updates kept the venues in order.",
    tripRoute: "Greater Noida wedding transfers",
    date: "2025-12-03",
    isDemo: true,
    avatarInitials: "NV",
  },
  {
    id: "demo-3",
    name: "Vikram Mehta",
    rating: 5,
    text: "We sent the headcount and the offsite address and got a fare the same day. The Urbania was on time for the team.",
    tripRoute: "Delhi NCR corporate outing",
    date: "2026-01-18",
    isDemo: true,
    avatarInitials: "VM",
  },
  {
    id: "demo-4",
    name: "Ananya Gupta",
    rating: 5,
    text: "Asked for Haridwar and Rishikesh without a hotel bundle. The desk quoted the coach only and left the aarti timing to us.",
    tripRoute: "Delhi → Haridwar & Rishikesh",
    date: "2026-02-09",
    isDemo: true,
    avatarInitials: "AG",
  },
  {
    id: "demo-5",
    name: "Suresh Patel",
    rating: 4,
    text: "The Kedarnath plan was explained as a roadhead drop, which is what our elders needed. Luggage space was enough for the group.",
    tripRoute: "Noida → Kedarnath route planning",
    date: "2025-10-21",
    isDemo: true,
    avatarInitials: "SP",
  },
  {
    id: "demo-6",
    name: "Priya Nair",
    rating: 5,
    text: "Jaipur was a highway day from Greater Noida. The fare matched what we were told, and the group stayed in one coach.",
    tripRoute: "Greater Noida → Jaipur",
    date: "2026-03-02",
    isDemo: true,
    avatarInitials: "PN",
  },
];

export function getFeaturedReviews(limit = 3) {
  return reviews.slice(0, limit);
}
