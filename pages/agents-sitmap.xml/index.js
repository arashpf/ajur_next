import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  const res = await fetch("https://api.ajur.app/api/active-agents-sitemap");
  const data = await res.json();

  const baseUrl = "https://ajur.app";

  const items = Array.isArray(data?.items) ? data.items : [];

  const fields = items
    .filter((item) => item?.city_slug)
    .map((item) => ({
      loc: `${baseUrl}/agents/${item.city_slug}`,
      lastmod: item.updated_at || new Date().toISOString(),
      changefreq: "daily",
      priority: 0.9,
    }));

  return getServerSideSitemap(ctx, fields);
};

export default function Site() {}
