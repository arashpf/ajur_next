import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  const res = await fetch("https://api.ajur.app/api/active-complexes");
  const data = await res.json();

  const baseUrl = "https://ajur.app";

  const fields = data.items.map((item) => ({
    loc: `${baseUrl}/complex/${item.complex_name}`,
    lastmod: item.updated_at,
    changefreq: "daily",
    priority: 0.9,
  }));

  return getServerSideSitemap(ctx, fields);
};

export default function Site() {}
