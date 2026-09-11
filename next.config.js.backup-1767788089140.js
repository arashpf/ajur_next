/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  
  experimental: {
    turbo: true,
  },
  
  images: {
    domains: [
      "api.ajur.app", 
      "www.api.ajur.app",
      "localhost",
      "127.0.0.1",
      "via.placeholder.com",
      "images.unsplash.com",
    ],
    unoptimized: true,
  },
  
  async headers() {
    return [
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json'
          }
        ],
      },
    ]
  },
  
  async redirects() {
    return [
      {
        source: '/%D8%A2%D8%B3%D8%AA%D8%A7%D9%86%D9%87%20%D8%A7%D8%B4%D8%B1%D9%81%DB%8C%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/astane-ashrafiye/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d8%a2%d8%b3%d8%aa%d8%a7%d9%86%d9%87%20%d8%a7%d8%b4%d8%b1%d9%81%db%8c%d9%87/%d8%ae%d8%b1%db%8c%d8%af%20%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/astane-ashrafiye/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D8%A2%D8%B3%D8%AA%D8%A7%D9%86%D9%87-%D8%A7%D8%B4%D8%B1%D9%81%DB%8C%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/astane-ashrafiye/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d8%a2%d8%b3%d8%aa%d8%a7%d9%86%d9%87-%d8%a7%d8%b4%d8%b1%d9%81%db%8c%d9%87/%d8%ae%d8%b1%db%8c%d8%af-%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/astane-ashrafiye/buy-apartment',
        permanent: true,
      },
      {
        source: '/آستانه اشرفیه/خرید آپارتمان',
        destination: '/astane-ashrafiye/buy-apartment',
        permanent: true,
      },
      {
        source: '/آستانه-اشرفیه/خرید-آپارتمان',
        destination: '/astane-ashrafiye/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D8%A2%D8%B3%D8%AA%D8%A7%D9%86%D9%87%20%D8%A7%D8%B4%D8%B1%D9%81%DB%8C%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/astane-ashrafiye/buy-villa',
        permanent: true,
      },
      {
        source: '/%d8%a2%d8%b3%d8%aa%d8%a7%d9%86%d9%87%20%d8%a7%d8%b4%d8%b1%d9%81%db%8c%d9%87/%d8%ae%d8%b1%db%8c%d8%af%20%d8%ae%d8%a7%d9%86%d9%87%20%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/astane-ashrafiye/buy-villa',
        permanent: true,
      },
      {
        source: '/%D8%A2%D8%B3%D8%AA%D8%A7%D9%86%D9%87-%D8%A7%D8%B4%D8%B1%D9%81%DB%8C%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%AE%D8%A7%D9%86%D9%87-%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/astane-ashrafiye/buy-villa',
        permanent: true,
      },
      {
        source: '/%d8%a2%d8%b3%d8%aa%d8%a7%d9%86%d9%87-%d8%a7%d8%b4%d8%b1%d9%81%db%8c%d9%87/%d8%ae%d8%b1%db%8c%d8%af-%d8%ae%d8%a7%d9%86%d9%87-%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/astane-ashrafiye/buy-villa',
        permanent: true,
      },
      {
        source: '/آستانه اشرفیه/خرید خانه ویلایی',
        destination: '/astane-ashrafiye/buy-villa',
        permanent: true,
      },
      {
        source: '/آستانه-اشرفیه/خرید-خانه-ویلایی',
        destination: '/astane-ashrafiye/buy-villa',
        permanent: true,
      },
      {
        source: '/%D8%A2%D8%B3%D8%AA%D8%A7%D9%86%D9%87%20%D8%A7%D8%B4%D8%B1%D9%81%DB%8C%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/astane-ashrafiye/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%d8%a2%d8%b3%d8%aa%d8%a7%d9%86%d9%87%20%d8%a7%d8%b4%d8%b1%d9%81%db%8c%d9%87/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b2%d9%85%db%8c%d9%86%20%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/astane-ashrafiye/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D8%A2%D8%B3%D8%AA%D8%A7%D9%86%D9%87-%D8%A7%D8%B4%D8%B1%D9%81%DB%8C%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/astane-ashrafiye/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%d8%a2%d8%b3%d8%aa%d8%a7%d9%86%d9%87-%d8%a7%d8%b4%d8%b1%d9%81%db%8c%d9%87/%d8%ae%d8%b1%db%8c%d8%af-%d8%b2%d9%85%db%8c%d9%86-%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/astane-ashrafiye/buy-residential-land',
        permanent: true,
      },
      {
        source: '/آستانه اشرفیه/خرید زمین مسکونی',
        destination: '/astane-ashrafiye/buy-residential-land',
        permanent: true,
      },
      {
        source: '/آستانه-اشرفیه/خرید-زمین-مسکونی',
        destination: '/astane-ashrafiye/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D8%A2%D8%B3%D8%AA%D8%A7%D9%86%D9%87%20%D8%A7%D8%B4%D8%B1%D9%81%DB%8C%D9%87/%D8%B2%D9%85%DB%8C%D9%86%20%D9%87%DA%A9%D8%AA%D8%A7%D8%B1%DB%8C',
        destination: '/astane-ashrafiye/land-by-the-hectare',
        permanent: true,
      },
      {
        source: '/%d8%a2%d8%b3%d8%aa%d8%a7%d9%86%d9%87%20%d8%a7%d8%b4%d8%b1%d9%81%db%8c%d9%87/%d8%b2%d9%85%db%8c%d9%86%20%d9%87%da%a9%d8%aa%d8%a7%d8%b1%db%8c',
        destination: '/astane-ashrafiye/land-by-the-hectare',
        permanent: true,
      },
      {
        source: '/%D8%A2%D8%B3%D8%AA%D8%A7%D9%86%D9%87-%D8%A7%D8%B4%D8%B1%D9%81%DB%8C%D9%87/%D8%B2%D9%85%DB%8C%D9%86-%D9%87%DA%A9%D8%AA%D8%A7%D8%B1%DB%8C',
        destination: '/astane-ashrafiye/land-by-the-hectare',
        permanent: true,
      },
      {
        source: '/%d8%a2%d8%b3%d8%aa%d8%a7%d9%86%d9%87-%d8%a7%d8%b4%d8%b1%d9%81%db%8c%d9%87/%d8%b2%d9%85%db%8c%d9%86-%d9%87%da%a9%d8%aa%d8%a7%d8%b1%db%8c',
        destination: '/astane-ashrafiye/land-by-the-hectare',
        permanent: true,
      },
      {
        source: '/آستانه اشرفیه/زمین هکتاری',
        destination: '/astane-ashrafiye/land-by-the-hectare',
        permanent: true,
      },
      {
        source: '/آستانه-اشرفیه/زمین-هکتاری',
        destination: '/astane-ashrafiye/land-by-the-hectare',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%B4%D8%AA/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/rasht/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%b4%d8%aa/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b2%d9%85%db%8c%d9%86%20%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/rasht/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%B4%D8%AA/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/rasht/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%b4%d8%aa/%d8%ae%d8%b1%db%8c%d8%af-%d8%b2%d9%85%db%8c%d9%86-%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/rasht/buy-residential-land',
        permanent: true,
      },
      {
        source: '/رشت/خرید زمین مسکونی',
        destination: '/rasht/buy-residential-land',
        permanent: true,
      },
      {
        source: '/رشت/خرید-زمین-مسکونی',
        destination: '/rasht/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%B4%D8%AA/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
        destination: '/rasht/buy-industrial-land',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%b4%d8%aa/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b2%d9%85%db%8c%d9%86%20%d8%b5%d9%86%d8%b9%d8%aa%db%8c',
        destination: '/rasht/buy-industrial-land',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%B4%D8%AA/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
        destination: '/rasht/buy-industrial-land',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%b4%d8%aa/%d8%ae%d8%b1%db%8c%d8%af-%d8%b2%d9%85%db%8c%d9%86-%d8%b5%d9%86%d8%b9%d8%aa%db%8c',
        destination: '/rasht/buy-industrial-land',
        permanent: true,
      },
      {
        source: '/رشت/خرید زمین صنعتی',
        destination: '/rasht/buy-industrial-land',
        permanent: true,
      },
      {
        source: '/رشت/خرید-زمین-صنعتی',
        destination: '/rasht/buy-industrial-land',
        permanent: true,
      },
      {
        source: '/%D9%85%D8%B4%D9%87%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/mashhad/buy-villa',
        permanent: true,
      },
      {
        source: '/%d9%85%d8%b4%d9%87%d8%af/%d8%ae%d8%b1%db%8c%d8%af%20%d8%ae%d8%a7%d9%86%d9%87%20%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/mashhad/buy-villa',
        permanent: true,
      },
      {
        source: '/%D9%85%D8%B4%D9%87%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%AE%D8%A7%D9%86%D9%87-%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/mashhad/buy-villa',
        permanent: true,
      },
      {
        source: '/%d9%85%d8%b4%d9%87%d8%af/%d8%ae%d8%b1%db%8c%d8%af-%d8%ae%d8%a7%d9%86%d9%87-%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/mashhad/buy-villa',
        permanent: true,
      },
      {
        source: '/مشهد/خرید خانه ویلایی',
        destination: '/mashhad/buy-villa',
        permanent: true,
      },
      {
        source: '/مشهد/خرید-خانه-ویلایی',
        destination: '/mashhad/buy-villa',
        permanent: true,
      },
      {
        source: '/%D9%85%D8%B4%D9%87%D8%AF/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/mashhad/rent-apartment',
        permanent: true,
      },
      {
        source: '/%d9%85%d8%b4%d9%87%d8%af/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87%20%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/mashhad/rent-apartment',
        permanent: true,
      },
      {
        source: '/%D9%85%D8%B4%D9%87%D8%AF/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/mashhad/rent-apartment',
        permanent: true,
      },
      {
        source: '/%d9%85%d8%b4%d9%87%d8%af/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87-%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/mashhad/rent-apartment',
        permanent: true,
      },
      {
        source: '/مشهد/اجاره آپارتمان',
        destination: '/mashhad/rent-apartment',
        permanent: true,
      },
      {
        source: '/مشهد/اجاره-آپارتمان',
        destination: '/mashhad/rent-apartment',
        permanent: true,
      },
      {
        source: '/%D9%84%D8%A7%D9%87%DB%8C%D8%AC%D8%A7%D9%86/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/lahijan/buy-villa',
        permanent: true,
      },
      {
        source: '/%d9%84%d8%a7%d9%87%db%8c%d8%ac%d8%a7%d9%86/%d8%ae%d8%b1%db%8c%d8%af%20%d8%ae%d8%a7%d9%86%d9%87%20%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/lahijan/buy-villa',
        permanent: true,
      },
      {
        source: '/%D9%84%D8%A7%D9%87%DB%8C%D8%AC%D8%A7%D9%86/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%AE%D8%A7%D9%86%D9%87-%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/lahijan/buy-villa',
        permanent: true,
      },
      {
        source: '/%d9%84%d8%a7%d9%87%db%8c%d8%ac%d8%a7%d9%86/%d8%ae%d8%b1%db%8c%d8%af-%d8%ae%d8%a7%d9%86%d9%87-%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/lahijan/buy-villa',
        permanent: true,
      },
      {
        source: '/لاهیجان/خرید خانه ویلایی',
        destination: '/lahijan/buy-villa',
        permanent: true,
      },
      {
        source: '/لاهیجان/خرید-خانه-ویلایی',
        destination: '/lahijan/buy-villa',
        permanent: true,
      },
      {
        source: '/%DA%86%D8%A7%D9%81%20%D9%88%20%DA%86%D9%85%D8%AE%D8%A7%D9%84%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/chaf-chamkhale/buy-apartment',
        permanent: true,
      },
      {
        source: '/%da%86%d8%a7%d9%81%20%d9%88%20%da%86%d9%85%d8%ae%d8%a7%d9%84%d9%87/%d8%ae%d8%b1%db%8c%d8%af%20%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/chaf-chamkhale/buy-apartment',
        permanent: true,
      },
      {
        source: '/%DA%86%D8%A7%D9%81-%D9%88-%DA%86%D9%85%D8%AE%D8%A7%D9%84%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/chaf-chamkhale/buy-apartment',
        permanent: true,
      },
      {
        source: '/%da%86%d8%a7%d9%81-%d9%88-%da%86%d9%85%d8%ae%d8%a7%d9%84%d9%87/%d8%ae%d8%b1%db%8c%d8%af-%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/chaf-chamkhale/buy-apartment',
        permanent: true,
      },
      {
        source: '/چاف و چمخاله/خرید آپارتمان',
        destination: '/chaf-chamkhale/buy-apartment',
        permanent: true,
      },
      {
        source: '/چاف-و-چمخاله/خرید-آپارتمان',
        destination: '/chaf-chamkhale/buy-apartment',
        permanent: true,
      },
      {
        source: '/%DA%86%D8%A7%D9%81%20%D9%88%20%DA%86%D9%85%D8%AE%D8%A7%D9%84%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/chaf-chamkhale/buy-villa',
        permanent: true,
      },
      {
        source: '/%da%86%d8%a7%d9%81%20%d9%88%20%da%86%d9%85%d8%ae%d8%a7%d9%84%d9%87/%d8%ae%d8%b1%db%8c%d8%af%20%d8%ae%d8%a7%d9%86%d9%87%20%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/chaf-chamkhale/buy-villa',
        permanent: true,
      },
      {
        source: '/%DA%86%D8%A7%D9%81-%D9%88-%DA%86%D9%85%D8%AE%D8%A7%D9%84%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%AE%D8%A7%D9%86%D9%87-%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/chaf-chamkhale/buy-villa',
        permanent: true,
      },
      {
        source: '/%da%86%d8%a7%d9%81-%d9%88-%da%86%d9%85%d8%ae%d8%a7%d9%84%d9%87/%d8%ae%d8%b1%db%8c%d8%af-%d8%ae%d8%a7%d9%86%d9%87-%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/chaf-chamkhale/buy-villa',
        permanent: true,
      },
      {
        source: '/چاف و چمخاله/خرید خانه ویلایی',
        destination: '/chaf-chamkhale/buy-villa',
        permanent: true,
      },
      {
        source: '/چاف-و-چمخاله/خرید-خانه-ویلایی',
        destination: '/chaf-chamkhale/buy-villa',
        permanent: true,
      },
      {
        source: '/%DA%86%D8%A7%D9%81%20%D9%88%20%DA%86%D9%85%D8%AE%D8%A7%D9%84%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/chaf-chamkhale/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%da%86%d8%a7%d9%81%20%d9%88%20%da%86%d9%85%d8%ae%d8%a7%d9%84%d9%87/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b2%d9%85%db%8c%d9%86%20%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/chaf-chamkhale/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%DA%86%D8%A7%D9%81-%D9%88-%DA%86%D9%85%D8%AE%D8%A7%D9%84%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/chaf-chamkhale/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%da%86%d8%a7%d9%81-%d9%88-%da%86%d9%85%d8%ae%d8%a7%d9%84%d9%87/%d8%ae%d8%b1%db%8c%d8%af-%d8%b2%d9%85%db%8c%d9%86-%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/chaf-chamkhale/buy-residential-land',
        permanent: true,
      },
      {
        source: '/چاف و چمخاله/خرید زمین مسکونی',
        destination: '/chaf-chamkhale/buy-residential-land',
        permanent: true,
      },
      {
        source: '/چاف-و-چمخاله/خرید-زمین-مسکونی',
        destination: '/chaf-chamkhale/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D8%A7%D9%87%D9%88%D8%A7%D8%B2/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/ahvaz/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d8%a7%d9%87%d9%88%d8%a7%d8%b2/%d8%ae%d8%b1%db%8c%d8%af%20%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/ahvaz/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D8%A7%D9%87%D9%88%D8%A7%D8%B2/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/ahvaz/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d8%a7%d9%87%d9%88%d8%a7%d8%b2/%d8%ae%d8%b1%db%8c%d8%af-%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/ahvaz/buy-apartment',
        permanent: true,
      },
      {
        source: '/اهواز/خرید آپارتمان',
        destination: '/ahvaz/buy-apartment',
        permanent: true,
      },
      {
        source: '/اهواز/خرید-آپارتمان',
        destination: '/ahvaz/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D9%82%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/ghom/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%d9%82%d9%85/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b2%d9%85%db%8c%d9%86%20%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/ghom/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D9%82%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/ghom/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%d9%82%d9%85/%d8%ae%d8%b1%db%8c%d8%af-%d8%b2%d9%85%db%8c%d9%86-%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/ghom/buy-residential-land',
        permanent: true,
      },
      {
        source: '/قم/خرید زمین مسکونی',
        destination: '/ghom/buy-residential-land',
        permanent: true,
      },
      {
        source: '/قم/خرید-زمین-مسکونی',
        destination: '/ghom/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D8%A2%D9%85%D9%84/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/amol/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%d8%a2%d9%85%d9%84/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b2%d9%85%db%8c%d9%86%20%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/amol/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D8%A2%D9%85%D9%84/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/amol/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%d8%a2%d9%85%d9%84/%d8%ae%d8%b1%db%8c%d8%af-%d8%b2%d9%85%db%8c%d9%86-%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/amol/buy-residential-land',
        permanent: true,
      },
      {
        source: '/آمل/خرید زمین مسکونی',
        destination: '/amol/buy-residential-land',
        permanent: true,
      },
      {
        source: '/آمل/خرید-زمین-مسکونی',
        destination: '/amol/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A7%D9%85%D8%B3%D8%B1/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/ramsar/buy-villa',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a7%d9%85%d8%b3%d8%b1/%d8%ae%d8%b1%db%8c%d8%af%20%d8%ae%d8%a7%d9%86%d9%87%20%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/ramsar/buy-villa',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A7%D9%85%D8%B3%D8%B1/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%AE%D8%A7%D9%86%D9%87-%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/ramsar/buy-villa',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a7%d9%85%d8%b3%d8%b1/%d8%ae%d8%b1%db%8c%d8%af-%d8%ae%d8%a7%d9%86%d9%87-%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/ramsar/buy-villa',
        permanent: true,
      },
      {
        source: '/رامسر/خرید خانه ویلایی',
        destination: '/ramsar/buy-villa',
        permanent: true,
      },
      {
        source: '/رامسر/خرید-خانه-ویلایی',
        destination: '/ramsar/buy-villa',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A7%D9%85%D8%B3%D8%B1/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A8%D8%A7%D8%BA%20%D9%88%20%D8%A8%D8%A7%D8%BA%DA%86%D9%87',
        destination: '/ramsar/buy-garden',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a7%d9%85%d8%b3%d8%b1/%d8%ae%d8%b1%db%8c%d8%af%20%d8%a8%d8%a7%d8%ba%20%d9%88%20%d8%a8%d8%a7%d8%ba%da%86%d9%87',
        destination: '/ramsar/buy-garden',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A7%D9%85%D8%B3%D8%B1/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A8%D8%A7%D8%BA-%D9%88-%D8%A8%D8%A7%D8%BA%DA%86%D9%87',
        destination: '/ramsar/buy-garden',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a7%d9%85%d8%b3%d8%b1/%d8%ae%d8%b1%db%8c%d8%af-%d8%a8%d8%a7%d8%ba-%d9%88-%d8%a8%d8%a7%d8%ba%da%86%d9%87',
        destination: '/ramsar/buy-garden',
        permanent: true,
      },
      {
        source: '/رامسر/خرید باغ و باغچه',
        destination: '/ramsar/buy-garden',
        permanent: true,
      },
      {
        source: '/رامسر/خرید-باغ-و-باغچه',
        destination: '/ramsar/buy-garden',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
        destination: '/tehran/buy-industrial',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b5%d9%86%d8%b9%d8%aa%db%8c',
        destination: '/tehran/buy-industrial',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
        destination: '/tehran/buy-industrial',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%ae%d8%b1%db%8c%d8%af-%d8%b5%d9%86%d8%b9%d8%aa%db%8c',
        destination: '/tehran/buy-industrial',
        permanent: true,
      },
      {
        source: '/تهران/خرید صنعتی',
        destination: '/tehran/buy-industrial',
        permanent: true,
      },
      {
        source: '/تهران/خرید-صنعتی',
        destination: '/tehran/buy-industrial',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/tehran/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%ae%d8%b1%db%8c%d8%af%20%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/tehran/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/tehran/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%ae%d8%b1%db%8c%d8%af-%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/tehran/buy-apartment',
        permanent: true,
      },
      {
        source: '/تهران/خرید آپارتمان',
        destination: '/tehran/buy-apartment',
        permanent: true,
      },
      {
        source: '/تهران/خرید-آپارتمان',
        destination: '/tehran/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/tehran/buy-villa',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%ae%d8%b1%db%8c%d8%af%20%d8%ae%d8%a7%d9%86%d9%87%20%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/tehran/buy-villa',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%AE%D8%A7%D9%86%D9%87-%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/tehran/buy-villa',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%ae%d8%b1%db%8c%d8%af-%d8%ae%d8%a7%d9%86%d9%87-%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/tehran/buy-villa',
        permanent: true,
      },
      {
        source: '/تهران/خرید خانه ویلایی',
        destination: '/tehran/buy-villa',
        permanent: true,
      },
      {
        source: '/تهران/خرید-خانه-ویلایی',
        destination: '/tehran/buy-villa',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D8%AA%D8%AC%D8%A7%D8%B1%DB%8C%20%D9%88%20%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/tehran/buy-office-land',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b2%d9%85%db%8c%d9%86%20%d8%aa%d8%ac%d8%a7%d8%b1%db%8c%20%d9%88%20%d8%a7%d8%af%d8%a7%d8%b1%db%8c',
        destination: '/tehran/buy-office-land',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D8%AA%D8%AC%D8%A7%D8%B1%DB%8C-%D9%88-%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/tehran/buy-office-land',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%ae%d8%b1%db%8c%d8%af-%d8%b2%d9%85%db%8c%d9%86-%d8%aa%d8%ac%d8%a7%d8%b1%db%8c-%d9%88-%d8%a7%d8%af%d8%a7%d8%b1%db%8c',
        destination: '/tehran/buy-office-land',
        permanent: true,
      },
      {
        source: '/تهران/خرید زمین تجاری و اداری',
        destination: '/tehran/buy-office-land',
        permanent: true,
      },
      {
        source: '/تهران/خرید-زمین-تجاری-و-اداری',
        destination: '/tehran/buy-office-land',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A8%D8%A7%D8%BA%20%D9%88%20%D8%A8%D8%A7%D8%BA%DA%86%D9%87',
        destination: '/tehran/buy-garden',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%ae%d8%b1%db%8c%d8%af%20%d8%a8%d8%a7%d8%ba%20%d9%88%20%d8%a8%d8%a7%d8%ba%da%86%d9%87',
        destination: '/tehran/buy-garden',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A8%D8%A7%D8%BA-%D9%88-%D8%A8%D8%A7%D8%BA%DA%86%D9%87',
        destination: '/tehran/buy-garden',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%ae%d8%b1%db%8c%d8%af-%d8%a8%d8%a7%d8%ba-%d9%88-%d8%a8%d8%a7%d8%ba%da%86%d9%87',
        destination: '/tehran/buy-garden',
        permanent: true,
      },
      {
        source: '/تهران/خرید باغ و باغچه',
        destination: '/tehran/buy-garden',
        permanent: true,
      },
      {
        source: '/تهران/خرید-باغ-و-باغچه',
        destination: '/tehran/buy-garden',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/tehran/rent-apartment',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87%20%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/tehran/rent-apartment',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/tehran/rent-apartment',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87-%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/tehran/rent-apartment',
        permanent: true,
      },
      {
        source: '/تهران/اجاره آپارتمان',
        destination: '/tehran/rent-apartment',
        permanent: true,
      },
      {
        source: '/تهران/اجاره-آپارتمان',
        destination: '/tehran/rent-apartment',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
        destination: '/tehran/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87%20%d9%85%d8%ba%d8%a7%d8%b2%d9%87',
        destination: '/tehran/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87-%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
        destination: '/tehran/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87-%d9%85%d8%ba%d8%a7%d8%b2%d9%87',
        destination: '/tehran/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/تهران/اجاره مغازه',
        destination: '/tehran/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/تهران/اجاره-مغازه',
        destination: '/tehran/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D8%AF%D9%81%D8%AA%D8%B1%20%DA%A9%D8%A7%D8%B1%20%D9%88%20%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/tehran/rent-office',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87%20%d8%af%d9%81%d8%aa%d8%b1%20%da%a9%d8%a7%d8%b1%20%d9%88%20%d8%a7%d8%af%d8%a7%d8%b1%db%8c',
        destination: '/tehran/rent-office',
        permanent: true,
      },
      {
        source: '/%D8%AA%D9%87%D8%B1%D8%A7%D9%86/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87-%D8%AF%D9%81%D8%AA%D8%B1-%DA%A9%D8%A7%D8%B1-%D9%88-%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/tehran/rent-office',
        permanent: true,
      },
      {
        source: '/%d8%aa%d9%87%d8%b1%d8%a7%d9%86/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87-%d8%af%d9%81%d8%aa%d8%b1-%da%a9%d8%a7%d8%b1-%d9%88-%d8%a7%d8%af%d8%a7%d8%b1%db%8c',
        destination: '/tehran/rent-office',
        permanent: true,
      },
      {
        source: '/تهران/اجاره دفتر کار و اداری',
        destination: '/tehran/rent-office',
        permanent: true,
      },
      {
        source: '/تهران/اجاره-دفتر-کار-و-اداری',
        destination: '/tehran/rent-office',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1%20%D8%AC%D8%AF%DB%8C%D8%AF%20%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
        destination: '/parand/buy-industrial',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1%20%d8%ac%d8%af%db%8c%d8%af%20%d9%be%d8%b1%d9%86%d8%af/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b5%d9%86%d8%b9%d8%aa%db%8c',
        destination: '/parand/buy-industrial',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1-%D8%AC%D8%AF%DB%8C%D8%AF-%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
        destination: '/parand/buy-industrial',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1-%d8%ac%d8%af%db%8c%d8%af-%d9%be%d8%b1%d9%86%d8%af/%d8%ae%d8%b1%db%8c%d8%af-%d8%b5%d9%86%d8%b9%d8%aa%db%8c',
        destination: '/parand/buy-industrial',
        permanent: true,
      },
      {
        source: '/شهر جدید پرند/خرید صنعتی',
        destination: '/parand/buy-industrial',
        permanent: true,
      },
      {
        source: '/شهر-جدید-پرند/خرید-صنعتی',
        destination: '/parand/buy-industrial',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
        destination: '/parand/buy-industrial',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
        destination: '/parand/buy-industrial',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1%20%D8%AC%D8%AF%DB%8C%D8%AF%20%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/parand/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1%20%d8%ac%d8%af%db%8c%d8%af%20%d9%be%d8%b1%d9%86%d8%af/%d8%ae%d8%b1%db%8c%d8%af%20%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/parand/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1-%D8%AC%D8%AF%DB%8C%D8%AF-%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/parand/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1-%d8%ac%d8%af%db%8c%d8%af-%d9%be%d8%b1%d9%86%d8%af/%d8%ae%d8%b1%db%8c%d8%af-%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/parand/buy-apartment',
        permanent: true,
      },
      {
        source: '/شهر جدید پرند/خرید آپارتمان',
        destination: '/parand/buy-apartment',
        permanent: true,
      },
      {
        source: '/شهر-جدید-پرند/خرید-آپارتمان',
        destination: '/parand/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/parand/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/parand/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1%20%D8%AC%D8%AF%DB%8C%D8%AF%20%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/parand/buy-villa',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1%20%d8%ac%d8%af%db%8c%d8%af%20%d9%be%d8%b1%d9%86%d8%af/%d8%ae%d8%b1%db%8c%d8%af%20%d8%ae%d8%a7%d9%86%d9%87%20%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/parand/buy-villa',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1-%D8%AC%D8%AF%DB%8C%D8%AF-%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%AE%D8%A7%D9%86%D9%87-%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/parand/buy-villa',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1-%d8%ac%d8%af%db%8c%d8%af-%d9%be%d8%b1%d9%86%d8%af/%d8%ae%d8%b1%db%8c%d8%af-%d8%ae%d8%a7%d9%86%d9%87-%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/parand/buy-villa',
        permanent: true,
      },
      {
        source: '/شهر جدید پرند/خرید خانه ویلایی',
        destination: '/parand/buy-villa',
        permanent: true,
      },
      {
        source: '/شهر-جدید-پرند/خرید-خانه-ویلایی',
        destination: '/parand/buy-villa',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/parand/buy-villa',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%AE%D8%A7%D9%86%D9%87-%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/parand/buy-villa',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1%20%D8%AC%D8%AF%DB%8C%D8%AF%20%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/parand/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1%20%d8%ac%d8%af%db%8c%d8%af%20%d9%be%d8%b1%d9%86%d8%af/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b2%d9%85%db%8c%d9%86%20%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/parand/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1-%D8%AC%D8%AF%DB%8C%D8%AF-%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/parand/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1-%d8%ac%d8%af%db%8c%d8%af-%d9%be%d8%b1%d9%86%d8%af/%d8%ae%d8%b1%db%8c%d8%af-%d8%b2%d9%85%db%8c%d9%86-%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/parand/buy-residential-land',
        permanent: true,
      },
      {
        source: '/شهر جدید پرند/خرید زمین مسکونی',
        destination: '/parand/buy-residential-land',
        permanent: true,
      },
      {
        source: '/شهر-جدید-پرند/خرید-زمین-مسکونی',
        destination: '/parand/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/parand/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/parand/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1%20%D8%AC%D8%AF%DB%8C%D8%AF%20%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D8%AA%D8%AC%D8%A7%D8%B1%DB%8C%20%D9%88%20%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/parand/buy-office-land',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1%20%d8%ac%d8%af%db%8c%d8%af%20%d9%be%d8%b1%d9%86%d8%af/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b2%d9%85%db%8c%d9%86%20%d8%aa%d8%ac%d8%a7%d8%b1%db%8c%20%d9%88%20%d8%a7%d8%af%d8%a7%d8%b1%db%8c',
        destination: '/parand/buy-office-land',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1-%D8%AC%D8%AF%DB%8C%D8%AF-%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D8%AA%D8%AC%D8%A7%D8%B1%DB%8C-%D9%88-%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/parand/buy-office-land',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1-%d8%ac%d8%af%db%8c%d8%af-%d9%be%d8%b1%d9%86%d8%af/%d8%ae%d8%b1%db%8c%d8%af-%d8%b2%d9%85%db%8c%d9%86-%d8%aa%d8%ac%d8%a7%d8%b1%db%8c-%d9%88-%d8%a7%d8%af%d8%a7%d8%b1%db%8c',
        destination: '/parand/buy-office-land',
        permanent: true,
      },
      {
        source: '/شهر جدید پرند/خرید زمین تجاری و اداری',
        destination: '/parand/buy-office-land',
        permanent: true,
      },
      {
        source: '/شهر-جدید-پرند/خرید-زمین-تجاری-و-اداری',
        destination: '/parand/buy-office-land',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D8%AA%D8%AC%D8%A7%D8%B1%DB%8C%20%D9%88%20%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/parand/buy-office-land',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D8%AA%D8%AC%D8%A7%D8%B1%DB%8C-%D9%88-%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/parand/buy-office-land',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1%20%D8%AC%D8%AF%DB%8C%D8%AF%20%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
        destination: '/parand/buy-commercial-property',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1%20%d8%ac%d8%af%db%8c%d8%af%20%d9%be%d8%b1%d9%86%d8%af/%d8%ae%d8%b1%db%8c%d8%af%20%d9%85%d8%ba%d8%a7%d8%b2%d9%87',
        destination: '/parand/buy-commercial-property',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1-%D8%AC%D8%AF%DB%8C%D8%AF-%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
        destination: '/parand/buy-commercial-property',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1-%d8%ac%d8%af%db%8c%d8%af-%d9%be%d8%b1%d9%86%d8%af/%d8%ae%d8%b1%db%8c%d8%af-%d9%85%d8%ba%d8%a7%d8%b2%d9%87',
        destination: '/parand/buy-commercial-property',
        permanent: true,
      },
      {
        source: '/شهر جدید پرند/خرید مغازه',
        destination: '/parand/buy-commercial-property',
        permanent: true,
      },
      {
        source: '/شهر-جدید-پرند/خرید-مغازه',
        destination: '/parand/buy-commercial-property',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
        destination: '/parand/buy-commercial-property',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
        destination: '/parand/buy-commercial-property',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1%20%D8%AC%D8%AF%DB%8C%D8%AF%20%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AF%D9%81%D8%AA%D8%B1%20%DA%A9%D8%A7%D8%B1%20%D9%88%20%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/parand/buy-office',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1%20%d8%ac%d8%af%db%8c%d8%af%20%d9%be%d8%b1%d9%86%d8%af/%d8%ae%d8%b1%db%8c%d8%af%20%d8%af%d9%81%d8%aa%d8%b1%20%da%a9%d8%a7%d8%b1%20%d9%88%20%d8%a7%d8%af%d8%a7%d8%b1%db%8c',
        destination: '/parand/buy-office',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1-%D8%AC%D8%AF%DB%8C%D8%AF-%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%AF%D9%81%D8%AA%D8%B1-%DA%A9%D8%A7%D8%B1-%D9%88-%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/parand/buy-office',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1-%d8%ac%d8%af%db%8c%d8%af-%d9%be%d8%b1%d9%86%d8%af/%d8%ae%d8%b1%db%8c%d8%af-%d8%af%d9%81%d8%aa%d8%b1-%da%a9%d8%a7%d8%b1-%d9%88-%d8%a7%d8%af%d8%a7%d8%b1%db%8c',
        destination: '/parand/buy-office',
        permanent: true,
      },
      {
        source: '/شهر جدید پرند/خرید دفتر کار و اداری',
        destination: '/parand/buy-office',
        permanent: true,
      },
      {
        source: '/شهر-جدید-پرند/خرید-دفتر-کار-و-اداری',
        destination: '/parand/buy-office',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AF%D9%81%D8%AA%D8%B1%20%DA%A9%D8%A7%D8%B1%20%D9%88%20%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/parand/buy-office',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%AF%D9%81%D8%AA%D8%B1-%DA%A9%D8%A7%D8%B1-%D9%88-%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/parand/buy-office',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1%20%D8%AC%D8%AF%DB%8C%D8%AF%20%D9%BE%D8%B1%D9%86%D8%AF/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/parand/rent-apartment',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1%20%d8%ac%d8%af%db%8c%d8%af%20%d9%be%d8%b1%d9%86%d8%af/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87%20%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/parand/rent-apartment',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1-%D8%AC%D8%AF%DB%8C%D8%AF-%D9%BE%D8%B1%D9%86%D8%AF/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/parand/rent-apartment',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1-%d8%ac%d8%af%db%8c%d8%af-%d9%be%d8%b1%d9%86%d8%af/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87-%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/parand/rent-apartment',
        permanent: true,
      },
      {
        source: '/شهر جدید پرند/اجاره آپارتمان',
        destination: '/parand/rent-apartment',
        permanent: true,
      },
      {
        source: '/شهر-جدید-پرند/اجاره-آپارتمان',
        destination: '/parand/rent-apartment',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/parand/rent-apartment',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/parand/rent-apartment',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1%20%D8%AC%D8%AF%DB%8C%D8%AF%20%D9%BE%D8%B1%D9%86%D8%AF/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
        destination: '/parand/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1%20%d8%ac%d8%af%db%8c%d8%af%20%d9%be%d8%b1%d9%86%d8%af/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87%20%d9%85%d8%ba%d8%a7%d8%b2%d9%87',
        destination: '/parand/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1-%D8%AC%D8%AF%DB%8C%D8%AF-%D9%BE%D8%B1%D9%86%D8%AF/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87-%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
        destination: '/parand/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1-%d8%ac%d8%af%db%8c%d8%af-%d9%be%d8%b1%d9%86%d8%af/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87-%d9%85%d8%ba%d8%a7%d8%b2%d9%87',
        destination: '/parand/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/شهر جدید پرند/اجاره مغازه',
        destination: '/parand/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/شهر-جدید-پرند/اجاره-مغازه',
        destination: '/parand/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
        destination: '/parand/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/%D9%BE%D8%B1%D9%86%D8%AF/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87-%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
        destination: '/parand/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
        destination: '/robat-karim/buy-industrial',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b5%d9%86%d8%b9%d8%aa%db%8c',
        destination: '/robat-karim/buy-industrial',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
        destination: '/robat-karim/buy-industrial',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af-%d8%b5%d9%86%d8%b9%d8%aa%db%8c',
        destination: '/robat-karim/buy-industrial',
        permanent: true,
      },
      {
        source: '/رباط کریم/خرید صنعتی',
        destination: '/robat-karim/buy-industrial',
        permanent: true,
      },
      {
        source: '/رباط-کریم/خرید-صنعتی',
        destination: '/robat-karim/buy-industrial',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
        destination: '/robat-karim/rent-industrial',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87%20%d8%b5%d9%86%d8%b9%d8%aa%db%8c',
        destination: '/robat-karim/rent-industrial',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87-%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
        destination: '/robat-karim/rent-industrial',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87-%d8%b5%d9%86%d8%b9%d8%aa%db%8c',
        destination: '/robat-karim/rent-industrial',
        permanent: true,
      },
      {
        source: '/رباط کریم/اجاره صنعتی',
        destination: '/robat-karim/rent-industrial',
        permanent: true,
      },
      {
        source: '/رباط-کریم/اجاره-صنعتی',
        destination: '/robat-karim/rent-industrial',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/robat-karim/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af%20%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/robat-karim/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/robat-karim/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af-%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/robat-karim/buy-apartment',
        permanent: true,
      },
      {
        source: '/رباط کریم/خرید آپارتمان',
        destination: '/robat-karim/buy-apartment',
        permanent: true,
      },
      {
        source: '/رباط-کریم/خرید-آپارتمان',
        destination: '/robat-karim/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/robat-karim/buy-villa',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af%20%d8%ae%d8%a7%d9%86%d9%87%20%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/robat-karim/buy-villa',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%AE%D8%A7%D9%86%D9%87-%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/robat-karim/buy-villa',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af-%d8%ae%d8%a7%d9%86%d9%87-%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/robat-karim/buy-villa',
        permanent: true,
      },
      {
        source: '/رباط کریم/خرید خانه ویلایی',
        destination: '/robat-karim/buy-villa',
        permanent: true,
      },
      {
        source: '/رباط-کریم/خرید-خانه-ویلایی',
        destination: '/robat-karim/buy-villa',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/robat-karim/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b2%d9%85%db%8c%d9%86%20%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/robat-karim/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/robat-karim/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af-%d8%b2%d9%85%db%8c%d9%86-%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/robat-karim/buy-residential-land',
        permanent: true,
      },
      {
        source: '/رباط کریم/خرید زمین مسکونی',
        destination: '/robat-karim/buy-residential-land',
        permanent: true,
      },
      {
        source: '/رباط-کریم/خرید-زمین-مسکونی',
        destination: '/robat-karim/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D8%AA%D8%AC%D8%A7%D8%B1%DB%8C%20%D9%88%20%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/robat-karim/buy-office-land',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b2%d9%85%db%8c%d9%86%20%d8%aa%d8%ac%d8%a7%d8%b1%db%8c%20%d9%88%20%d8%a7%d8%af%d8%a7%d8%b1%db%8c',
        destination: '/robat-karim/buy-office-land',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D8%AA%D8%AC%D8%A7%D8%B1%DB%8C-%D9%88-%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/robat-karim/buy-office-land',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af-%d8%b2%d9%85%db%8c%d9%86-%d8%aa%d8%ac%d8%a7%d8%b1%db%8c-%d9%88-%d8%a7%d8%af%d8%a7%d8%b1%db%8c',
        destination: '/robat-karim/buy-office-land',
        permanent: true,
      },
      {
        source: '/رباط کریم/خرید زمین تجاری و اداری',
        destination: '/robat-karim/buy-office-land',
        permanent: true,
      },
      {
        source: '/رباط-کریم/خرید-زمین-تجاری-و-اداری',
        destination: '/robat-karim/buy-office-land',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
        destination: '/robat-karim/buy-industrial-land',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b2%d9%85%db%8c%d9%86%20%d8%b5%d9%86%d8%b9%d8%aa%db%8c',
        destination: '/robat-karim/buy-industrial-land',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
        destination: '/robat-karim/buy-industrial-land',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af-%d8%b2%d9%85%db%8c%d9%86-%d8%b5%d9%86%d8%b9%d8%aa%db%8c',
        destination: '/robat-karim/buy-industrial-land',
        permanent: true,
      },
      {
        source: '/رباط کریم/خرید زمین صنعتی',
        destination: '/robat-karim/buy-industrial-land',
        permanent: true,
      },
      {
        source: '/رباط-کریم/خرید-زمین-صنعتی',
        destination: '/robat-karim/buy-industrial-land',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A8%D8%A7%D8%BA%20%D9%88%20%D8%A8%D8%A7%D8%BA%DA%86%D9%87',
        destination: '/robat-karim/buy-garden',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af%20%d8%a8%d8%a7%d8%ba%20%d9%88%20%d8%a8%d8%a7%d8%ba%da%86%d9%87',
        destination: '/robat-karim/buy-garden',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A8%D8%A7%D8%BA-%D9%88-%D8%A8%D8%A7%D8%BA%DA%86%D9%87',
        destination: '/robat-karim/buy-garden',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af-%d8%a8%d8%a7%d8%ba-%d9%88-%d8%a8%d8%a7%d8%ba%da%86%d9%87',
        destination: '/robat-karim/buy-garden',
        permanent: true,
      },
      {
        source: '/رباط کریم/خرید باغ و باغچه',
        destination: '/robat-karim/buy-garden',
        permanent: true,
      },
      {
        source: '/رباط-کریم/خرید-باغ-و-باغچه',
        destination: '/robat-karim/buy-garden',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D8%B2%D8%B1%D8%A7%D8%B9%DB%8C',
        destination: '/robat-karim/buy-farming-land',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b2%d9%85%db%8c%d9%86%20%d8%b2%d8%b1%d8%a7%d8%b9%db%8c',
        destination: '/robat-karim/buy-farming-land',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D8%B2%D8%B1%D8%A7%D8%B9%DB%8C',
        destination: '/robat-karim/buy-farming-land',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af-%d8%b2%d9%85%db%8c%d9%86-%d8%b2%d8%b1%d8%a7%d8%b9%db%8c',
        destination: '/robat-karim/buy-farming-land',
        permanent: true,
      },
      {
        source: '/رباط کریم/خرید زمین زراعی',
        destination: '/robat-karim/buy-farming-land',
        permanent: true,
      },
      {
        source: '/رباط-کریم/خرید-زمین-زراعی',
        destination: '/robat-karim/buy-farming-land',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF%20%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
        destination: '/robat-karim/buy-commercial-property',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af%20%d9%85%d8%ba%d8%a7%d8%b2%d9%87',
        destination: '/robat-karim/buy-commercial-property',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF-%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
        destination: '/robat-karim/buy-commercial-property',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af-%d9%85%d8%ba%d8%a7%d8%b2%d9%87',
        destination: '/robat-karim/buy-commercial-property',
        permanent: true,
      },
      {
        source: '/رباط کریم/خرید مغازه',
        destination: '/robat-karim/buy-commercial-property',
        permanent: true,
      },
      {
        source: '/رباط-کریم/خرید-مغازه',
        destination: '/robat-karim/buy-commercial-property',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AF%D9%81%D8%AA%D8%B1%20%DA%A9%D8%A7%D8%B1%20%D9%88%20%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/robat-karim/buy-office',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af%20%d8%af%d9%81%d8%aa%d8%b1%20%da%a9%d8%a7%d8%b1%20%d9%88%20%d8%a7%d8%af%d8%a7%d8%b1%db%8c',
        destination: '/robat-karim/buy-office',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%AF%D9%81%D8%AA%D8%B1-%DA%A9%D8%A7%D8%B1-%D9%88-%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/robat-karim/buy-office',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%ae%d8%b1%db%8c%d8%af-%d8%af%d9%81%d8%aa%d8%b1-%da%a9%d8%a7%d8%b1-%d9%88-%d8%a7%d8%af%d8%a7%d8%b1%db%8c',
        destination: '/robat-karim/buy-office',
        permanent: true,
      },
      {
        source: '/رباط کریم/خرید دفتر کار و اداری',
        destination: '/robat-karim/buy-office',
        permanent: true,
      },
      {
        source: '/رباط-کریم/خرید-دفتر-کار-و-اداری',
        destination: '/robat-karim/buy-office',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/robat-karim/rent-apartment',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87%20%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/robat-karim/rent-apartment',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/robat-karim/rent-apartment',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87-%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/robat-karim/rent-apartment',
        permanent: true,
      },
      {
        source: '/رباط کریم/اجاره آپارتمان',
        destination: '/robat-karim/rent-apartment',
        permanent: true,
      },
      {
        source: '/رباط-کریم/اجاره-آپارتمان',
        destination: '/robat-karim/rent-apartment',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/robat-karim/rent-villa',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87%20%d8%ae%d8%a7%d9%86%d9%87%20%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/robat-karim/rent-villa',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87-%D8%AE%D8%A7%D9%86%D9%87-%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/robat-karim/rent-villa',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87-%d8%ae%d8%a7%d9%86%d9%87-%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/robat-karim/rent-villa',
        permanent: true,
      },
      {
        source: '/رباط کریم/اجاره خانه ویلایی',
        destination: '/robat-karim/rent-villa',
        permanent: true,
      },
      {
        source: '/رباط-کریم/اجاره-خانه-ویلایی',
        destination: '/robat-karim/rent-villa',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
        destination: '/robat-karim/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87%20%d9%85%d8%ba%d8%a7%d8%b2%d9%87',
        destination: '/robat-karim/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87-%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
        destination: '/robat-karim/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87-%d9%85%d8%ba%d8%a7%d8%b2%d9%87',
        destination: '/robat-karim/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/رباط کریم/اجاره مغازه',
        destination: '/robat-karim/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/رباط-کریم/اجاره-مغازه',
        destination: '/robat-karim/rent-commercial-property',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D8%AF%D9%81%D8%AA%D8%B1%20%DA%A9%D8%A7%D8%B1%20%D9%88%20%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/robat-karim/rent-office',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87%20%d8%af%d9%81%d8%aa%d8%b1%20%da%a9%d8%a7%d8%b1%20%d9%88%20%d8%a7%d8%af%d8%a7%d8%b1%db%8c',
        destination: '/robat-karim/rent-office',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87-%D8%AF%D9%81%D8%AA%D8%B1-%DA%A9%D8%A7%D8%B1-%D9%88-%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
        destination: '/robat-karim/rent-office',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%a7%d8%ac%d8%a7%d8%b1%d9%87-%d8%af%d9%81%d8%aa%d8%b1-%da%a9%d8%a7%d8%b1-%d9%88-%d8%a7%d8%af%d8%a7%d8%b1%db%8c',
        destination: '/robat-karim/rent-office',
        permanent: true,
      },
      {
        source: '/رباط کریم/اجاره دفتر کار و اداری',
        destination: '/robat-karim/rent-office',
        permanent: true,
      },
      {
        source: '/رباط-کریم/اجاره-دفتر-کار-و-اداری',
        destination: '/robat-karim/rent-office',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%B2%D9%85%DB%8C%D9%86%20%D9%87%DA%A9%D8%AA%D8%A7%D8%B1%DB%8C',
        destination: '/robat-karim/land-by-the-hectare',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7%20%da%a9%d8%b1%db%8c%d9%85/%d8%b2%d9%85%db%8c%d9%86%20%d9%87%da%a9%d8%aa%d8%a7%d8%b1%db%8c',
        destination: '/robat-karim/land-by-the-hectare',
        permanent: true,
      },
      {
        source: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%B2%D9%85%DB%8C%D9%86-%D9%87%DA%A9%D8%AA%D8%A7%D8%B1%DB%8C',
        destination: '/robat-karim/land-by-the-hectare',
        permanent: true,
      },
      {
        source: '/%d8%b1%d8%a8%d8%a7%d8%b7-%da%a9%d8%b1%db%8c%d9%85/%d8%b2%d9%85%db%8c%d9%86-%d9%87%da%a9%d8%aa%d8%a7%d8%b1%db%8c',
        destination: '/robat-karim/land-by-the-hectare',
        permanent: true,
      },
      {
        source: '/رباط کریم/زمین هکتاری',
        destination: '/robat-karim/land-by-the-hectare',
        permanent: true,
      },
      {
        source: '/رباط-کریم/زمین-هکتاری',
        destination: '/robat-karim/land-by-the-hectare',
        permanent: true,
      },
      {
        source: '/%D8%A7%D9%86%D8%AF%DB%8C%D8%B4%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/andishe/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d8%a7%d9%86%d8%af%db%8c%d8%b4%d9%87/%d8%ae%d8%b1%db%8c%d8%af%20%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/andishe/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D8%A7%D9%86%D8%AF%DB%8C%D8%B4%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/andishe/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d8%a7%d9%86%d8%af%db%8c%d8%b4%d9%87/%d8%ae%d8%b1%db%8c%d8%af-%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/andishe/buy-apartment',
        permanent: true,
      },
      {
        source: '/اندیشه/خرید آپارتمان',
        destination: '/andishe/buy-apartment',
        permanent: true,
      },
      {
        source: '/اندیشه/خرید-آپارتمان',
        destination: '/andishe/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D8%A7%D9%86%D8%AF%DB%8C%D8%B4%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/andishe/buy-villa',
        permanent: true,
      },
      {
        source: '/%d8%a7%d9%86%d8%af%db%8c%d8%b4%d9%87/%d8%ae%d8%b1%db%8c%d8%af%20%d8%ae%d8%a7%d9%86%d9%87%20%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/andishe/buy-villa',
        permanent: true,
      },
      {
        source: '/%D8%A7%D9%86%D8%AF%DB%8C%D8%B4%D9%87/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%AE%D8%A7%D9%86%D9%87-%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/andishe/buy-villa',
        permanent: true,
      },
      {
        source: '/%d8%a7%d9%86%d8%af%db%8c%d8%b4%d9%87/%d8%ae%d8%b1%db%8c%d8%af-%d8%ae%d8%a7%d9%86%d9%87-%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/andishe/buy-villa',
        permanent: true,
      },
      {
        source: '/اندیشه/خرید خانه ویلایی',
        destination: '/andishe/buy-villa',
        permanent: true,
      },
      {
        source: '/اندیشه/خرید-خانه-ویلایی',
        destination: '/andishe/buy-villa',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1%DB%8C%D8%A7%D8%B1/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/shahriyar/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1%db%8c%d8%a7%d8%b1/%d8%ae%d8%b1%db%8c%d8%af%20%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/shahriyar/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1%DB%8C%D8%A7%D8%B1/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/shahriyar/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1%db%8c%d8%a7%d8%b1/%d8%ae%d8%b1%db%8c%d8%af-%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/shahriyar/buy-apartment',
        permanent: true,
      },
      {
        source: '/شهریار/خرید آپارتمان',
        destination: '/shahriyar/buy-apartment',
        permanent: true,
      },
      {
        source: '/شهریار/خرید-آپارتمان',
        destination: '/shahriyar/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1%DB%8C%D8%A7%D8%B1/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A8%D8%A7%D8%BA%20%D9%88%20%D8%A8%D8%A7%D8%BA%DA%86%D9%87',
        destination: '/shahriyar/buy-garden',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1%db%8c%d8%a7%d8%b1/%d8%ae%d8%b1%db%8c%d8%af%20%d8%a8%d8%a7%d8%ba%20%d9%88%20%d8%a8%d8%a7%d8%ba%da%86%d9%87',
        destination: '/shahriyar/buy-garden',
        permanent: true,
      },
      {
        source: '/%D8%B4%D9%87%D8%B1%DB%8C%D8%A7%D8%B1/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A8%D8%A7%D8%BA-%D9%88-%D8%A8%D8%A7%D8%BA%DA%86%D9%87',
        destination: '/shahriyar/buy-garden',
        permanent: true,
      },
      {
        source: '/%d8%b4%d9%87%d8%b1%db%8c%d8%a7%d8%b1/%d8%ae%d8%b1%db%8c%d8%af-%d8%a8%d8%a7%d8%ba-%d9%88-%d8%a8%d8%a7%d8%ba%da%86%d9%87',
        destination: '/shahriyar/buy-garden',
        permanent: true,
      },
      {
        source: '/شهریار/خرید باغ و باغچه',
        destination: '/shahriyar/buy-garden',
        permanent: true,
      },
      {
        source: '/شهریار/خرید-باغ-و-باغچه',
        destination: '/shahriyar/buy-garden',
        permanent: true,
      },
      {
        source: '/%D9%86%D9%88%D8%B4%D9%87%D8%B1/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/noshahr/buy-villa',
        permanent: true,
      },
      {
        source: '/%d9%86%d9%88%d8%b4%d9%87%d8%b1/%d8%ae%d8%b1%db%8c%d8%af%20%d8%ae%d8%a7%d9%86%d9%87%20%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/noshahr/buy-villa',
        permanent: true,
      },
      {
        source: '/%D9%86%D9%88%D8%B4%D9%87%D8%B1/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%AE%D8%A7%D9%86%D9%87-%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
        destination: '/noshahr/buy-villa',
        permanent: true,
      },
      {
        source: '/%d9%86%d9%88%d8%b4%d9%87%d8%b1/%d8%ae%d8%b1%db%8c%d8%af-%d8%ae%d8%a7%d9%86%d9%87-%d9%88%db%8c%d9%84%d8%a7%db%8c%db%8c',
        destination: '/noshahr/buy-villa',
        permanent: true,
      },
      {
        source: '/نوشهر/خرید خانه ویلایی',
        destination: '/noshahr/buy-villa',
        permanent: true,
      },
      {
        source: '/نوشهر/خرید-خانه-ویلایی',
        destination: '/noshahr/buy-villa',
        permanent: true,
      },
      {
        source: '/%D9%86%D9%88%D8%B4%D9%87%D8%B1/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/noshahr/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%d9%86%d9%88%d8%b4%d9%87%d8%b1/%d8%ae%d8%b1%db%8c%d8%af%20%d8%b2%d9%85%db%8c%d9%86%20%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/noshahr/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D9%86%D9%88%D8%B4%D9%87%D8%B1/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%B2%D9%85%DB%8C%D9%86-%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
        destination: '/noshahr/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%d9%86%d9%88%d8%b4%d9%87%d8%b1/%d8%ae%d8%b1%db%8c%d8%af-%d8%b2%d9%85%db%8c%d9%86-%d9%85%d8%b3%da%a9%d9%88%d9%86%db%8c',
        destination: '/noshahr/buy-residential-land',
        permanent: true,
      },
      {
        source: '/نوشهر/خرید زمین مسکونی',
        destination: '/noshahr/buy-residential-land',
        permanent: true,
      },
      {
        source: '/نوشهر/خرید-زمین-مسکونی',
        destination: '/noshahr/buy-residential-land',
        permanent: true,
      },
      {
        source: '/%D9%85%D9%84%D8%A7%D8%B1%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/malard/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d9%85%d9%84%d8%a7%d8%b1%d8%af/%d8%ae%d8%b1%db%8c%d8%af%20%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/malard/buy-apartment',
        permanent: true,
      },
      {
        source: '/%D9%85%D9%84%D8%A7%D8%B1%D8%AF/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
        destination: '/malard/buy-apartment',
        permanent: true,
      },
      {
        source: '/%d9%85%d9%84%d8%a7%d8%b1%d8%af/%d8%ae%d8%b1%db%8c%d8%af-%d8%a2%d9%be%d8%a7%d8%b1%d8%aa%d9%85%d8%a7%d9%86',
        destination: '/malard/buy-apartment',
        permanent: true,
      },
      {
        source: '/ملارد/خرید آپارتمان',
        destination: '/malard/buy-apartment',
        permanent: true,
      },
      {
        source: '/ملارد/خرید-آپارتمان',
        destination: '/malard/buy-apartment',
        permanent: true,
      }
    ];
  },

  transpilePackages: ['swiper', 'ssr-window', 'dom7', '@mui/material', '@mui/icons-material'],
}

module.exports = nextConfig