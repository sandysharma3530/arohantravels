/**
 * Lightweight marketing event helpers for GA4 / GTM dataLayer.
 * Safe no-ops when analytics is not configured.
 */

type EnquiryMarketingPayload = {
  reference?: string;
  destination?: string;
  tripType?: string;
  preferredVehicle?: string;
  sourcePage?: string;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEnquirySubmit(payload: EnquiryMarketingPayload) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "generate_lead",
    lead_type: "travel_enquiry",
    enquiry_reference: payload.reference,
    destination: payload.destination,
    trip_type: payload.tripType,
    preferred_vehicle: payload.preferredVehicle,
    source_page: payload.sourcePage,
  });

  if (typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", {
      currency: "INR",
      value: 0,
      lead_source: payload.sourcePage || "website",
    });
  }

  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead", {
      content_name: "Travel Enquiry",
      status: payload.reference || "submitted",
    });
  }
}

export function trackCtaClick(label: string, location: string) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "cta_click",
    cta_label: label,
    cta_location: location,
  });
}
