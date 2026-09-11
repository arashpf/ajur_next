// // pages/sitemap.xml.js
// export async function getServerSideProps({ res }) {
//     const baseUrl = 'https://ajur.app';
//     const currentDate = new Date().toISOString();
    
//     const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
//       <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//         <sitemap>
//           <loc>${baseUrl}/sitemap-static.xml</loc>
//           <lastmod>${currentDate}</lastmod>
//         </sitemap>
//         <sitemap>
//           <loc>${baseUrl}/server-sitemap.xml</loc>
//           <lastmod>${currentDate}</lastmod>
//         </sitemap>
//         <sitemap>
//           <loc>${baseUrl}/cities-sitemap.xml</loc>
//           <lastmod>${currentDate}</lastmod>
//         </sitemap>
//         <sitemap>
//           <loc>${baseUrl}/cities-categories-sitemap.xml</loc>
//           <lastmod>${currentDate}</lastmod>
//         </sitemap>

//         <sitemap>
//         <loc>${baseUrl}/complex-sitmap.xml</loc>
//         <lastmod>${currentDate}</lastmod>
//       </sitemap>
        
//       </sitemapindex>`;
  
//     res.setHeader('Content-Type', 'text/xml');
//     res.write(sitemap);
//     res.end();
  
//     return { props: {} };
//   }
  
//   export default function SitemapIndex() { 
//     return null; 
//   }


// pages/sitemap.xml.js





// pages/sitemap.xml.js

export async function getServerSideProps({ res }) {
  const baseUrl = 'https://ajur.app';
  const currentDate = new Date().toISOString();
  
  // List ALL your sitemaps
  const allSitemaps = [
      'sitemap-static.xml', // ✅ This should be here
      'server-sitemap.xml',
      'cities-sitemap.xml',
      'cities-categories-sitemap.xml',
      'cities-neighborhoods-sitemap.xml',
      'cities-neighborhoods-hub-sitemap.xml',
      'complex-sitmap.xml',
      'image-sitmap.xml',
      'agent-sitmap.xml',
      'agents-sitmap.xml',
      'cat-city-sitmap.xml',
      'neighborhoods-sitmap.xml'
  ];
  
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemaps.map(file => `    <sitemap>
      <loc>${baseUrl}/${file}</loc>
      <lastmod>${currentDate}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
  
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemapIndex);
  res.end();
  
  return { props: {} };
}

export default function SitemapIndex() { 
  return null; 
}