"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CmsSite } from "@/lib/cms/types";
import { siteConfig } from "@/content/site-config";

const SiteContext = createContext<CmsSite | null>(null);

export function PublicSiteProvider({
  site,
  children,
}: {
  site: CmsSite;
  children: ReactNode;
}) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export function usePublicSite(): CmsSite {
  const value = useContext(SiteContext);
  if (value) return value;
  return siteConfig as unknown as CmsSite;
}
