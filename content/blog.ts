export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  coverImage: string;
  coverAlt: string;
  tags: string[];
  content: string[];
  gallery?: { src: string; alt: string; caption?: string }[];
};

/**
 * Informational blog content — general guidance only.
 * Do not fabricate business case studies or unverified claims.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-the-right-traveller-for-a-group-trip",
    title: "How to Choose the Right Traveller for a Group Trip",
    excerpt:
      "A practical checklist for matching vehicle size, comfort features and route needs when planning group travel from Delhi NCR.",
    date: "2026-03-15",
    readingTime: "5 min read",
    coverImage: "/images/blog/choose-traveller.jpg",
    coverAlt: "Group travel vehicle parked for a family trip",
    tags: ["Traveller rental", "Group travel", "Planning"],
    content: [
      "Choosing between coaches starts with how many people are travelling and how long they will sit. From our Greater Noida desk, a Force Urbania is the usual answer for a long highway day. A 21-seat Force Traveller is the answer when the guest list no longer fits.",
      "List your must-haves before requesting quotes: air conditioning, pushback or recliner seats, charging points, luggage space, GPS tracking and CCTV. Share pickup points, destination and approximate return timing so the quotation can reflect realistic driving days.",
      "Avoid comparing only on headline price. Ask how rest stops, hill stretches, night driving preferences and waiting time are handled. A clear custom quotation is usually more useful than a fixed package that may not match your group.",
      "Finally, confirm the vehicle category you are booking, the driver arrangement and what is included in the quoted amount. Transparent details help groups travel with fewer surprises.",
    ],
  },
  {
    slug: "traveller-safety-checklist-before-a-hill-journey",
    title: "Traveller Safety Checklist Before a Hill Journey",
    excerpt:
      "Simple preparation tips for safer, more comfortable hill travel with a group vehicle.",
    date: "2026-02-28",
    readingTime: "4 min read",
    coverImage: "/images/blog/hill-safety.jpg",
    coverAlt: "Winding mountain road suitable for planned hill journeys",
    tags: ["Safety", "Hill travel", "Checklist"],
    content: [
      "Hill days from Greater Noida go better when the driving stays in daylight and the daily distance is honest. Tell the desk the pace you want before the fare is written.",
      "Pack motion-sickness essentials if needed, keep water accessible and plan short breaks. Confirm that luggage is secured and aisles remain clear for safer movement inside the vehicle.",
      "Ask about vehicle readiness for hills: brakes, tyres, air conditioning performance and driver familiarity with the route. GPS tracking and communication plans add reassurance for families and organisers.",
      "If monsoon or winter conditions are expected, build buffer time into the itinerary and remain flexible with viewpoint or temple visit windows.",
    ],
  },
  {
    slug: "places-to-visit-around-tungnath-and-chopta",
    title: "Places to Visit Around Tungnath and Chopta",
    excerpt:
      "An orientation guide to popular spots near Chopta and Tungnath for groups planning a customized trip.",
    date: "2026-01-20",
    readingTime: "6 min read",
    coverImage: "/images/blog/chopta-guide.jpg",
    coverAlt: "Green meadows and mountains near Chopta",
    tags: ["Chopta", "Tungnath", "Uttarakhand"],
    content: [
      "Chopta is the meadow stop, and Tungnath is the temple walk above it. Groups usually split the day between the two, then decide how much rest the elders need.",
      "Nearby areas can include viewpoints and small local markets depending on the season. Always verify open trails, weather and local guidance before finalising daily plans.",
      "Because Arohan Travels quotes only the coach, you can shape the days around the group — more rest, more time at the temple, or a shorter weekend.",
      "When requesting a quotation, mention passenger count, preferred travel month and whether elders or children are joining so vehicle comfort and pacing recommendations stay practical.",
    ],
  },
  {
    slug: "group-travel-planning-tips-from-delhi-ncr",
    title: "Group Travel Planning Tips from Delhi NCR",
    excerpt:
      "How families, corporates and organisers can plan smoother outstation group travel from Noida, Greater Noida and Delhi.",
    date: "2025-12-10",
    readingTime: "5 min read",
    coverImage: "/images/blog/delhi-ncr-planning.jpg",
    coverAlt: "Highway travel planning from Delhi NCR",
    tags: ["Delhi NCR", "Planning", "Outstation"],
    content: [
      "One person should collect the brief: where you want to go, the dates, how many seats, and how much luggage. That is what the Greater Noida desk needs before it can price a coach.",
      "From Delhi NCR, early departures often reduce first-day fatigue on popular Uttarakhand, Himachal and Rajasthan routes. Build meal and rest stops into the plan rather than improvising every break.",
      "Decide whether you need a single destination stay or a multi-stop route. Customized outstation travel works best when the vehicle plan matches how the group actually wants to move.",
      "Request a quote with pickup address, destination, return date and preferred vehicle. Clear inputs lead to clearer pricing conversations.",
    ],
  },
  {
    slug: "traveller-rental-checklist-for-wedding-transportation",
    title: "Traveller Rental Checklist for Wedding Transportation",
    excerpt:
      "Coordination tips for wedding guest transfers, venue shuttles and family travel on celebration days.",
    date: "2025-11-05",
    readingTime: "4 min read",
    coverImage: "/images/blog/wedding-transport.jpg",
    coverAlt: "Decorated venue driveway ready for guest transportation",
    tags: ["Wedding", "Guest transfers", "Checklist"],
    content: [
      "Wedding transport works when every pickup, venue and buffer is written down before the coach is booked. Rituals run long. The fare should assume that.",
      "Share guest headcount by vehicle, luggage or gift items, and whether elders need easier boarding. A presentable, clean Traveller helps guests feel looked after.",
      "Confirm points of contact for the wedding day, WhatsApp updates and contingency timing if ceremonies shift. Clear communication reduces stress for families and planners.",
      "Ask for a custom quotation that reflects waiting time, multiple stops and decoration constraints if any. Avoid assuming a fixed package will match a unique wedding schedule.",
    ],
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllPosts() {
  return [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
