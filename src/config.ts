/**
 * @file config.ts — Single source of truth for site-wide configuration.
 * Used by BaseLayout (metadata, OG tags, JSON-LD), Footer (contact info),
 * and any component that needs org-level data.
 */

export const siteConfig = {
  name: "GAMEC",
  legalName: "GAMEC Inc.",
  url: "https://igamec.org",
  description:
    "GAMEC (Global Association of Muslim Eritrean Communities) is a 501(c)(3) non-profit voluntary membership association serving the Eritrean Muslim community.",
  tagline:
    "Strengthening the global Muslim Eritrean community through faith, education, and service.",
  logo: "https://igamec.org/images/logo-bg.png",
  locale: "en_US",
  contact: {
    email: "contact@igamec.org",
    phone: "+1 (202) 440-9089",
    address: {
      street: "3420 13th St SE",
      city: "Washington",
      state: "DC",
      zip: "20032",
      country: "US",
    },
  },
  social: {
    facebook: "https://www.facebook.com/TheOfficialGAMEC/",
    twitter: "#",
    instagram: "#",
  },
  org: {
    type: "NonprofitOrganization" as const,
    taxStatus: "501(c)(3)",
    founded: "2023",
  },
} as const;

export type SiteConfig = typeof siteConfig;
