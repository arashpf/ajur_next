import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  // let posts = await fetch("https://jsonplaceholder.typicode.com/posts");
  let cities = await fetch("https://api.ajur.app/api/search-cities");
  let type_pre = '';
  cities = await cities.json();
  const newsSitemaps = cities.items.map((item) => ({
    loc: `${process.env.NEXT_PUBLIC_DOMAIN_URL}`+type_pre+`${item.title.toString()}`,
    lastmod: item.updated_at,
    changefreq: 'weekly',
    priority: .9,

  }));

  const fields = [...newsSitemaps];

  return getServerSideSitemap(ctx, fields);
};

export default function Site() {}
