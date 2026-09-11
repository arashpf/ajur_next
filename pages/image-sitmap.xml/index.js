export const getServerSideProps = async ({ res }) => {
  const response = await fetch("https://api.ajur.app/api/active-posts-images");
  const json = await response.json();

  const posts = json.data || [];
  const baseUrl = "https://ajur.app";

  // Unicode characters for RTL handling
  const RLE = "\u202B"; // Right-to-Left Embedding
  const PDF = "\u202C"; // Pop Directional Formatting

  const escapeXml = (unsafe = "") =>
    String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const normalizeUrl = (url = "") => {
    try {
      return encodeURI(String(url));
    } catch {
      return String(url);
    }
  };

  const formatLastMod = (dateValue) => {
    try {
      return dateValue
        ? new Date(dateValue).toISOString()
        : new Date().toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${posts
  .map((item) => {
    const images = (item.images || []).filter((img) => img?.url);

    if (!images.length) return "";

    const pageUrl = `${baseUrl}/worker/${item.id}`;

    const imageXml = images
      .map((img) => {
        // Prepare Persian strings
        const rawTitle = item.name || "آجر - خدمات ساختمانی";
        const rawCaption = `${item.name || "آگهی"}${
          item.neighbourhood
            ? ` در ${item.neighbourhood}`
            : item.city
              ? ` در ${item.city}`
              : ""
        }`;

        // Wrap in RTL markers to ensure correct display in Google Images
        const title = `${RLE}${rawTitle}${PDF}`;
        const caption = `${RLE}${rawCaption}${PDF}`;

        return `
    <image:image>
      <image:loc>${escapeXml(normalizeUrl(img.url))}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
    </image:image>`;
      })
      .join("");

    return `
  <url>
    <loc>${escapeXml(pageUrl)}</loc>
    <lastmod>${escapeXml(formatLastMod(item.updated_at))}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${imageXml}
  </url>`;
  })
  .join("")}
</urlset>`;

  res.setHeader("Content-Type", "text/xml; charset=UTF-8");
  res.write(xml);
  res.end();

  return {
    props: {},
  };
};

export default function SiteMap() {
  return null;
}
