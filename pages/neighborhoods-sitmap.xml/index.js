import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  const res = await fetch("https://api.ajur.app/api/active-neighborhoods");
  const data = await res.json();

  const baseUrl = "https://ajur.app";

  const fields = data.items.map((item) => {
    // Ensure updated_at is a valid Date object before calling toISOString()
    const updatedAt = item.updated_at ? new Date(item.updated_at) : new Date(); // Fallback to current date if missing

    return {
      loc: `${baseUrl}/${item.city_slug}/${item.cat_slug}/${item.neighborhood_slug}`,
      // Standardize the date to ISO 8601 format
      lastmod: updatedAt.toISOString(),
      changefreq: "daily",
      priority: 0.9,
    };
  });

  return getServerSideSitemap(ctx, fields);
};

export default function Site() {}
