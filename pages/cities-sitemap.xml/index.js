import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://ajur.app"
  ).replace(/\/$/, "");

  try {
    const response = await fetch(
      "https://api.ajur.app/api/active-cities",
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data?.items)) {
      throw new Error("Invalid active-cities API response");
    }

    const sitemapFields = data.items
      .filter(
        (item) =>
          item?.slug &&
          Number(item.property_amount) > 0
      )
      .map((item) => {
        const updatedAt = item.updated_at
          ? new Date(item.updated_at)
          : null;

        const isValidDate =
          updatedAt !== null &&
          !Number.isNaN(updatedAt.getTime());

        return {
          loc: `${baseUrl}/${String(item.slug)}`,
          ...(isValidDate && {
            lastmod: updatedAt.toISOString(),
          }),
          changefreq: "weekly",
          priority: 0.9,
        };
      });

    return getServerSideSitemap(ctx, sitemapFields);
  } catch (error) {
    console.error("Active cities sitemap error:", error);

    return getServerSideSitemap(ctx, []);
  }
};

export default function Site() {
  return null;
}
