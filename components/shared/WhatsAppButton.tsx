"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/content/site-config";
import { usePublicSite } from "@/components/cms/PublicSiteProvider";
import { isConfigured } from "@/lib/placeholders";
import { cn } from "@/lib/utils";

export function WhatsAppButton() {
  const site = usePublicSite();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isConfigured(site.whatsappNumber)) {
    return null;
  }

  return (
    <a
      href={getWhatsAppLink(undefined, site.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed z-40 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:bg-[#1ebe57] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
        "bottom-20 right-4 h-12 w-12 md:bottom-6 md:right-6 md:h-auto md:w-auto md:rounded-xl md:px-4 md:py-3",
        "pb-[max(0px,env(safe-area-inset-bottom))]",
      )}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="hidden text-sm font-semibold md:inline">Chat on WhatsApp</span>
    </a>
  );
}
