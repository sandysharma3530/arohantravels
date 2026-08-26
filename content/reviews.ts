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
    text: "Smooth Force Traveller experience for our family trip. The vehicle was clean and the driver was professional throughout.",
    tripRoute: "Noida → Nainital",
    date: "2025-11-12",
    isDemo: true,
    avatarInitials: "RS",
  },
  {
    id: "demo-2",
    name: "Neha Verma",
    rating: 5,
    text: "We used the Traveller for a wedding guest transfer. Coordination was clear and the vehicle looked presentable for guests.",
    tripRoute: "Greater Noida wedding transfers",
    date: "2025-12-03",
    isDemo: true,
    avatarInitials: "NV",
  },
  {
    id: "demo-3",
    name: "Vikram Mehta",
    rating: 5,
    text: "Helpful quotation process for our corporate outing. Comfortable seats and on-time pickup made the day easier for the team.",
    tripRoute: "Delhi NCR corporate outing",
    date: "2026-01-18",
    isDemo: true,
    avatarInitials: "VM",
  },
  {
    id: "demo-4",
    name: "Ananya Gupta",
    rating: 5,
    text: "Requested a custom quote for Haridwar–Rishikesh and got clear options without pressure to buy a fixed package.",
    tripRoute: "Delhi → Haridwar & Rishikesh",
    date: "2026-02-09",
    isDemo: true,
    avatarInitials: "AG",
  },
  {
    id: "demo-5",
    name: "Suresh Patel",
    rating: 4,
    text: "Good overall experience for a pilgrimage group. Spacious luggage area and steady driving on longer stretches.",
    tripRoute: "Noida → Kedarnath route planning",
    date: "2025-10-21",
    isDemo: true,
    avatarInitials: "SP",
  },
  {
    id: "demo-6",
    name: "Priya Nair",
    rating: 5,
    text: "Transparent communication from enquiry to travel day. Would recommend for group trips from Greater Noida.",
    tripRoute: "Greater Noida → Jaipur",
    date: "2026-03-02",
    isDemo: true,
    avatarInitials: "PN",
  },
];

export function getFeaturedReviews(limit = 3) {
  return reviews.slice(0, limit);
}
