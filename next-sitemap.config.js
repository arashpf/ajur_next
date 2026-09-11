// // const siteUrl = 'https://ajur.app';

// // module.exports = {
// //   siteUrl,
  
// //   // Disable auto-generated sitemap.xml (we'll create it manually)
// //   generateIndexSitemap: false,
  
// //   // Exclude dynamic sitemaps from auto-scan
// //   exclude: [
// //     "/404",
// //     "/sitemap.xml",                 // Your manual sitemap index
// //     "/sitemap-static.xml",          // Your manual static sitemap
// //     "/server-sitemap.xml",          // Dynamic sitemap
// //     "/cities-sitemap.xml",          // Dynamic sitemap
// //     "/cities-categories-sitemap.xml", // Dynamic sitemap
// //     "/complex-sitmap.xml", // Dynamic sitemap
// //     "/image-sitmap.xml", // Dynamic sitemap
// //     "/cat-city-sitmap.xml", // Dynamic sitemap
// //     "/neighborhoods-sitmap.xml", // Dynamic sitemap
// //     "/agents-sitmap.xml", // Dynamic sitemap
// //     "/agent-sitmap.xml", // Dynamic sitemap
// //   ],
  
// //   generateRobotsTxt: true,
// //   robotsTxtOptions: {
// //     policies: [
// //       {
// //         userAgent: "*",
// //         disallow: ["/404"],
// //       },
// //       { userAgent: "*", allow: "/" },
// //     ],
// //     additionalSitemaps: [
// //       `${siteUrl}/sitemap-static.xml`,
// //       // `${siteUrl}/sitemap.xml`,               // Add this - your main sitemap index
// //       `${siteUrl}/sitemap-static.xml`,        // Add this - your static pages sitemap
// //       `${siteUrl}/server-sitemap.xml`,
// //       `${siteUrl}/cities-sitemap.xml`,
// //       `${siteUrl}/cities-categories-sitemap.xml`,
// //       `${siteUrl}/complex-sitmap.xml`,
// //       `${siteUrl}/image-sitmap.xml`,
// //       `${siteUrl}/agent-sitmap.xml`,
// //       `${siteUrl}/agents-sitmap.xml`,
// //       `${siteUrl}/cat-city-sitmap.xml`,
// //       `${siteUrl}/neighborhoods-sitmap.xml`,
// //     ],
// //   },
// // };




// const siteUrl = "https://ajur.app";

// module.exports = {
//   siteUrl,

//   /*
//    * false یعنی next-sitemap یک فایل معمولی sitemap.xml می‌سازد،
//    * نه Sitemap Index چندبخشی.
//    */
//   generateIndexSitemap: false,

//   /*
//    * این مسیرها نباید به‌عنوان صفحات عادی سایت
//    * داخل sitemap.xml تولیدشده قرار بگیرند.
//    */
//   exclude: [
//     "/404",
//     "/server-sitemap.xml",
//     "/cities-sitemap.xml",
//     "/cities-categories-sitemap.xml",
//     "/complex-sitmap.xml",
//     "/image-sitmap.xml",
//     "/cat-city-sitmap.xml",
//     "/neighborhoods-sitmap.xml",
//     "/agents-sitmap.xml",
//     "/agent-sitmap.xml",
//   ],

//   generateRobotsTxt: true,

//   robotsTxtOptions: {
//     policies: [
//       {
//         userAgent: "*",
//         allow: "/",
//         disallow: ["/404"],
//       },
//     ],

//     /*
//      * فقط Sitemapهای جداگانه را وارد کن.
//      * sitemap.xml اصلی به‌صورت خودکار به robots.txt اضافه می‌شود.
//      */
//     additionalSitemaps: [
//       `${siteUrl}/sitemap-static.xml`,
//       `${siteUrl}/server-sitemap.xml`,
//       `${siteUrl}/cities-sitemap.xml`,
//       `${siteUrl}/cities-categories-sitemap.xml`,
//       `${siteUrl}/complex-sitmap.xml`,
//       `${siteUrl}/image-sitmap.xml`,
//       `${siteUrl}/agent-sitmap.xml`,
//       `${siteUrl}/agents-sitmap.xml`,
//       `${siteUrl}/cat-city-sitmap.xml`,
//       `${siteUrl}/neighborhoods-sitmap.xml`,
//     ],
//   },
// };


const siteUrl = "https://ajur.app";

module.exports = {
    siteUrl,
    generateIndexSitemap: false,
    generateRobotsTxt: true,
    
    exclude: [
        "/404",
        "/sitemap.xml", // Your hub/index (API route)
        "/server-sitemap.xml",
        "/cities-sitemap.xml",
        "/cities-categories-sitemap.xml",
        "/cities-neighborhoods-sitemap.xml",
        "/complex-sitmap.xml",
        "/image-sitmap.xml",
        "/agent-sitmap.xml",
        "/agents-sitmap.xml",
        "/cat-city-sitmap.xml",
        "/neighborhoods-sitmap.xml",
        // ⚠️ DO NOT exclude sitemap-static.xml - it should be served as a static file
    ],

    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/404"],
            },
        ],
        additionalSitemaps: [
            `${siteUrl}/sitemap.xml`,
            `${siteUrl}/sitemap-static.xml`, // This is your static file
            `${siteUrl}/server-sitemap.xml`,
            `${siteUrl}/cities-sitemap.xml`,
            `${siteUrl}/cities-categories-sitemap.xml`,
            `${siteUrl}/cities-neighborhoods-sitemap.xml`,
            `${siteUrl}/cities-neighborhoods-hub-sitemap.xml`,
            `${siteUrl}/complex-sitmap.xml`,
            `${siteUrl}/image-sitmap.xml`,
            `${siteUrl}/agent-sitmap.xml`,
            `${siteUrl}/agents-sitmap.xml`,
            `${siteUrl}/cat-city-sitmap.xml`,
            `${siteUrl}/neighborhoods-sitmap.xml`,
        ],
    },
};