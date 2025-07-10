import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  // let posts = await fetch("https://jsonplaceholder.typicode.com/posts");
  let cities = await fetch("https://api.ajur.app/api/active-category-cities");
  let type_pre = '/';
  cities = await cities.json();
  const newsSitemaps = cities.items.map((item) => ({
    loc: `${process.env.NEXT_PUBLIC_DOMAIN_URL}`+''+`${item.city.toString()}`+type_pre+`${item.cat.toString()}`,
    lastmod: item.updated_at,
    changefreq: 'daily',
    priority: .9,

  }));

  const fields = [...newsSitemaps];

  return getServerSideSitemap(ctx, fields);
};

export default function Site() {}
