import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";
import { isConfigured } from "@/lib/placeholders";
import type { Destination } from "@/content/destinations";
import type { FleetVehicle } from "@/content/fleet";
import type { BlogPost } from "@/content/blog";
import type { FaqItem } from "@/content/faqs";
import type { CmsSite } from "@/lib/cms/types";
import { resolveBranding } from "@/lib/cms/branding";

export const defaultTitle =
  "Arohan Travels | Urbania & Traveller Hire from Greater Noida";

export const defaultDescription =
  "Arohan Travels, based in Greater Noida, arranges Force Urbania and 21-seat Force Traveller coaches for families, weddings, offices and yatra groups. Ask for a written fare — hotels and sightseeing stay off the quote.";

/** Light keyword set for secondary engines — keep natural, never stuff into body copy. */
export const primaryKeywords = [
  "Force Urbania hire Greater Noida",
  "Force Traveller from Ghaziabad",
  "21 seater Traveller Greater Noida",
  "group coach Delhi NCR",
  "outstation Urbania hire",
  "wedding guest coach Noida",
  "office offsite transport Greater Noida",
  "airport group pickup Delhi",
  "yatra coach Uttarakhand",
  "Arohan Travels",
] as const;

function absoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

export function createMetadata({
  title,
  description,
  path = "/",
  image = "/images/og-default.jpg",
  noIndex = false,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
} = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${siteConfig.businessName}`
    : defaultTitle;
  const desc = description || defaultDescription;
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image);
  const keywordList = keywords?.length
    ? [...keywords]
    : [...primaryKeywords];

  const verification: Metadata["verification"] = {};
  if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
    verification.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  }
  if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
    verification.other = {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
    };
  }

  return {
    title: {
      absolute: pageTitle,
    },
    description: desc,
    keywords: keywordList,
    applicationName: siteConfig.businessName,
    authors: [{ name: siteConfig.businessName, url: siteConfig.siteUrl }],
    creator: siteConfig.businessName,
    publisher: siteConfig.businessName,
    category: "Travel",
    metadataBase: new URL(siteConfig.siteUrl),
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
        en: url,
      },
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title: pageTitle,
      description: desc,
      url,
      siteName: siteConfig.businessName,
      locale: "en_IN",
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
            ? `${title} — ${siteConfig.businessName}`
            : siteConfig.businessName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: desc,
      images: [ogImage],
    },
    other: {
      "geo.region": "IN-UP",
      "geo.placename": "Greater Noida, Ghaziabad",
      "og:locale:alternate": "en",
    },
    ...(Object.keys(verification).length ? { verification } : {}),
  };
}

export function organizationJsonLd(site: CmsSite = siteConfig as unknown as CmsSite) {
  const logo = absoluteUrl(resolveBranding(site).logo);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.siteUrl}/#organization`,
    name: siteConfig.businessName,
    legalName: siteConfig.legalName,
    url: siteConfig.siteUrl,
    logo: {
      "@type": "ImageObject",
      url: logo,
    },
    image: absoluteUrl("/images/og-default.jpg"),
    description: siteConfig.shortDescription,
    slogan: siteConfig.tagline,
    email: isConfigured(siteConfig.publicEmail)
      ? siteConfig.publicEmail
      : undefined,
    telephone: isConfigured(siteConfig.phoneInternational)
      ? siteConfig.phoneInternational
      : undefined,
    sameAs: [
      siteConfig.social.facebookUrl,
      siteConfig.social.instagramUrl,
      siteConfig.social.youtubeUrl,
      siteConfig.googleBusinessUrl,
    ].filter((url) => isConfigured(url)),
    contactPoint: isConfigured(siteConfig.phoneInternational)
      ? [
          {
            "@type": "ContactPoint",
            telephone: siteConfig.phoneInternational,
            contactType: "customer service",
            areaServed: "IN",
            availableLanguage: ["English", "Hindi"],
          },
        ]
      : undefined,
  };
}

export function localBusinessJsonLd(site: CmsSite = siteConfig as unknown as CmsSite) {
  const rating =
    siteConfig.trustStatistics.googleRating != null &&
    siteConfig.trustStatistics.googleReviewCount != null
      ? {
          "@type": "AggregateRating",
          ratingValue: siteConfig.trustStatistics.googleRating,
          reviewCount: siteConfig.trustStatistics.googleReviewCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TravelAgency"],
    "@id": `${siteConfig.siteUrl}/#localbusiness`,
    name: siteConfig.businessName,
    description: siteConfig.shortDescription,
    url: siteConfig.siteUrl,
    image: [
      absoluteUrl("/images/og-default.jpg"),
      absoluteUrl("/images/fleet/traveller/cover.jpg"),
    ],
    logo: absoluteUrl(resolveBranding(site).logo),
    telephone: isConfigured(siteConfig.phoneInternational)
      ? siteConfig.phoneInternational
      : undefined,
    email: isConfigured(siteConfig.publicEmail)
      ? siteConfig.publicEmail
      : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: isConfigured(siteConfig.address.line1)
        ? siteConfig.address.line1
        : undefined,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: isConfigured(siteConfig.address.postalCode)
        ? siteConfig.address.postalCode
        : undefined,
      addressCountry: "IN",
    },
    areaServed: siteConfig.serviceAreas.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "$$",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Bank Transfer",
    ...(rating ? { aggregateRating: rating } : {}),
    parentOrganization: { "@id": `${siteConfig.siteUrl}/#organization` },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.siteUrl}/#website`,
    name: siteConfig.businessName,
    url: siteConfig.siteUrl,
    description: siteConfig.shortDescription,
    inLanguage: "en-IN",
    publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  const items = (faqs || []).filter(
    (faq) => faq && typeof faq.question === "string" && typeof faq.answer === "string",
  );
  if (!items.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Arohan Travels group coach hire",
    serviceType: "Force Urbania and Force Traveller hire from Greater Noida",
    provider: { "@id": `${siteConfig.siteUrl}/#localbusiness` },
    areaServed: siteConfig.serviceAreas.map((name) => ({
      "@type": "Place",
      name,
    })),
    description: siteConfig.shortDescription,
    url: siteConfig.siteUrl,
  };
}

/**
 * Vehicle service schema without inventing ownership or fixed package prices.
 */
export function vehicleServiceJsonLd(vehicle: FleetVehicle) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${vehicle.name} group transportation`,
    description: vehicle.description,
    image: absoluteUrl(vehicle.coverImage),
    url: absoluteUrl(`/fleet/${vehicle.slug}`),
    provider: { "@id": `${siteConfig.siteUrl}/#localbusiness` },
    serviceType: "Traveller / group vehicle rental",
    category: "Passenger Van / Group Transport Vehicle",
    brand: {
      "@type": "Brand",
      name: "Force Motors",
    },
    areaServed: siteConfig.serviceAreas.map((name) => ({
      "@type": "Place",
      name,
    })),
    ...(vehicle.seatingCapacity
      ? {
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "Seating capacity",
              value: vehicle.seatingCapacity,
            },
          ],
        }
      : {}),
    termsOfService: absoluteUrl("/terms"),
  };
}

export function destinationTouristPlaceJsonLd(destination: Destination) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: destination.name,
    description: destination.introduction,
    image: absoluteUrl(destination.coverImage),
    url: absoluteUrl(`/destinations/${destination.slug}`),
    address: {
      "@type": "PostalAddress",
      addressRegion: destination.region,
      addressCountry: "IN",
    },
    touristType: destination.suitableFor,
  };
}

export function articleJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.coverImage),
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: siteConfig.businessName,
      url: siteConfig.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.businessName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(resolveBranding().logo),
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.tags.join(", "),
    inLanguage: "en-IN",
  };
}
