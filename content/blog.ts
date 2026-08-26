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
      "Choosing the right Traveller starts with passenger count, luggage volume and trip duration. A 21-seater Force Traveller often suits mid-size family or corporate groups, while a premium option like Force Urbania may feel better for longer journeys where seating comfort matters more.",
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
      "Hill journeys benefit from daylight-focused driving plans, weather awareness and realistic daily distances. Share your preferred pace when requesting a quote so travel days are not overloaded.",
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
      "Chopta is known for meadow landscapes and access toward Tungnath, often described as one of the highest Shiva temples. Groups usually balance temple time, short walks and rest depending on fitness levels.",
      "Nearby areas can include viewpoints and small local markets depending on the season. Always verify open trails, weather and local guidance before finalising daily plans.",
      "Because Smart Squad Travels does not sell fixed tour packages, you can shape the journey around your group's priorities — more rest, more temple time, or a tighter weekend window.",
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
      "Start with a shared group brief: destination shortlist, dates, passenger count, luggage estimate and must-visit priorities. One organiser collecting requirements speeds up accurate quotations.",
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
      "Wedding transportation succeeds with timing discipline. List every pickup point, venue arrival window and buffer for photos or rituals that may run long.",
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
