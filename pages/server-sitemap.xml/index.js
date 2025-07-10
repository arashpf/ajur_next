import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  // let posts = await fetch("https://jsonplaceholder.typicode.com/posts");
  let posts = await fetch("https://api.ajur.app/api/active-posts");
  let type_pre = '/worker/';
  posts = await posts.json();
  const newsSitemaps = posts.map((item) => ({
    loc: `${process.env.NEXT_PUBLIC_DOMAIN_URL}`+type_pre+`${item.id.toString()}`,
    lastmod: item.updated_at,
    changefreq: 'weekly',
    priority: .6,

  }));

  const fields = [...newsSitemaps];

  return getServerSideSitemap(ctx, fields);
};

export default function Site() {}
