// import { getServerSideSitemap } from "next-sitemap";

// export const getServerSideProps = async (ctx) => {
//   let cities = await fetch("https://api.ajur.app/api/active-category-cities");
//   cities = await cities.json();
  
//   const baseUrl = 'https://ajur.app'; // Hardcoded domain
  
//   const newsSitemaps = cities.items.map((item) => ({
//     loc: `${baseUrl}/${item.slug.toString()}/${item.eng_cat.toString()}`,
//     lastmod: item.updated_at,
//     changefreq: 'daily',
//     priority: 0.9,
//   }));

//   return getServerSideSitemap(ctx, newsSitemaps);
// };

// export default function Site() {}

// pages/sitemap.xml.js (یا نام فایل مربوطه)

import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  const baseUrl = process.env.NEXT_PUBLIC_AJUR_APP_URL || 'https://ajur.app'; // استفاده از متغیر محیطی برای دامنه
  let cities = []; // مقداردهی اولیه خالی

  try {
    // Fetch داده‌ها از API
    const res = await fetch("https://api.ajur.app/api/active-category-cities");
    
    // بررسی وضعیت پاسخ API
    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      // در صورت بروز خطا، سایت‌مپ خالی برگردانده می‌شود
      return getServerSideSitemap(ctx, []);
    }
    
    const data = await res.json();
    cities = data.items || []; // اطمینان از وجود data.items

  } catch (error) {
    console.error("Failed to fetch cities for sitemap:", error);
    // در صورت بروز خطا در fetch یا parse کردن JSON، سایت‌مپ خالی برگردانده می‌شود
    return getServerSideSitemap(ctx, []);
  }

  // پردازش داده‌ها برای ساخت سایت‌مپ
  const newsSitemaps = cities.map((item) => {
    // اطمینان از وجود کلیدهای مورد نیاز در item
    if (!item.slug || !item.eng_cat || !item.updated_at) {
      console.warn("Skipping item due to missing data:", item);
      return null; // این آیتم را نادیده بگیر
    }

    let finalPriority = 0.9; // اولویت پیش‌فرض
    // اولویت‌بندی برای شهرهای مهم (می‌توانید لیست شهرهای مهم را اینجا اضافه کنید)
    // مثلاً شهرهایی که در سابقه چت مطرح شدند یا اهمیت استراتژیک دارند.
    // برای مثال، رباط کریم و تهران را با اولویت بالاتر در نظر می‌گیریم:
    if (item.slug === 'robat-karim' || item.slug === 'tehran') {
      finalPriority = 1.0;
    } else if (item.slug === 'lahijan' || item.slug === 'mashhad') {
      // اگر شهرهای دیگری هم دارید که می‌خواهید اولویت بالاتری داشته باشند
      finalPriority = 0.95; 
    }

    let isoDate = item.updated_at; // مقدار پیش‌فرض
    try {
      // تلاش برای تبدیل تاریخ به فرمت استاندارد ISO 8601
      const date = new Date(item.updated_at);
      // اطمینان از اینکه تاریخ معتبر است قبل از تبدیل
      if (!isNaN(date.getTime())) {
        isoDate = date.toISOString(); 
      } else {
        console.warn(`Invalid date format for item: ${item.slug}/${item.eng_cat}. Using original: ${item.updated_at}`);
        // اگر فرمت تاریخ نامعتبر بود، همان رشته اصلی را نگه می‌دارد
      }
    } catch (dateError) {
      console.error(`Error parsing date for item ${item.slug}/${item.eng_cat}:`, dateError);
      // اگر خطایی در پردازش تاریخ رخ داد، از رشته اصلی استفاده می‌کند
    }

    return {
      loc: `${baseUrl}/${item.slug.toString()}/${item.eng_cat.toString()}`,
      lastmod: isoDate, // تاریخ با فرمت استاندارد
      changefreq: 'daily',
      priority: finalPriority, // اولویت محاسبه شده
    };
  });

  // فیلتر کردن آیتم‌های null که ممکن است به دلیل داده‌های ناقص ایجاد شده باشند
  const validSitemaps = newsSitemaps.filter(item => item !== null);

  // برگرداندن سایت‌مپ
  return getServerSideSitemap(ctx, validSitemaps);
};

// کامپوننت اصلی صفحه که نیازی به رندر ندارد
export default function Site() {}
