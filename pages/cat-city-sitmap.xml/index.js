import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  let cities = await fetch("https://api.ajur.app/api/active-category-cities");
  cities = await cities.json();
  
  const baseUrl = 'https://ajur.app'; // Hardcoded domain
  
  const newsSitemaps = cities.items.map((item) => ({
    loc: `${baseUrl}/${item.slug.toString()}/${item.eng_cat.toString()}`,
    lastmod: item.updated_at,
    changefreq: 'daily',
    priority: 1,
  }));

  return getServerSideSitemap(ctx, newsSitemaps);
};

export default function Site() {}