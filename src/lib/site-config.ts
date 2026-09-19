/**
 * Single source of truth for site-wide facts used by metadata, JSON-LD structured
 * data, and the sitemap/robots files. Business contact details below are pulled
 * from the real content already shown in the site footer (src/components/shared/Footer.tsx).
 *
 * `siteUrl` is inferred from the support email domain (support@purepool.es) since no
 * production URL is configured anywhere in the project yet. Override it by setting
 * NEXT_PUBLIC_SITE_URL once the real production domain is confirmed.
 */
export const siteConfig = {
  name: "Pure Pool",
  title: "Pure Pool | Professional Pool Maintenance & Care in Madrid",
  description:
    "Expert pool maintenance and cleaning in Madrid. Real-time visit photos, chemical balance tracking, and certified pool technicians.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://purepool.es",
  ogImage: "/images/homepage/heroBackground.jpg",
  contact: {
    phone: "+34 910 882 140",
    email: "support@purepool.es",
    address: {
      streetAddress: "Calle de Velázquez 94, 1º Izq",
      addressLocality: "Madrid",
      postalCode: "28006",
      addressCountry: "ES",
    },
  },
  areaServed: "Madrid",
} as const;
