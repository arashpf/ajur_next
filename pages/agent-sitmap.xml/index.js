import { getServerSideSitemap } from "next-sitemap";

const API_URL =
  "https://api.ajur.app/api/index-agents-sitemap";

const BASE_URL = "https://ajur.app";

/**
 * اعتبارسنجی و تبدیل شناسه مشاور
 */
const normalizeId = (value) => {
  const id = Number(value);

  return Number.isInteger(id) && id > 0
    ? id
    : null;
};

/**
 * تبدیل تاریخ API به فرمت ISO 8601
 *
 * ورودی نمونه:
 * 2026-07-20 15:30:11
 *
 * خروجی نمونه:
 * 2026-07-20T15:30:11.000Z
 *
 * فرض بر این است که created_at دیتابیس با UTC ذخیره شده است.
 */
const normalizeDate = (value) => {
  if (!value) {
    return null;
  }

  let normalizedValue = String(value).trim();

  // تبدیل فرمت MySQL به ISO و درنظرگرفتن آن به‌عنوان UTC
  if (
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(
      normalizedValue
    )
  ) {
    normalizedValue =
      normalizedValue.replace(" ", "T") + "Z";
  }

  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

export const getServerSideProps = async (ctx) => {
  try {
    // Sitemap همیشه اطلاعات جدید را از API دریافت کند
    ctx.res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );

    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Agents API returned HTTP ${response.status}`
      );
    }

    const data = await response.json();

    const items = Array.isArray(data?.items)
      ? data.items
      : [];

    const fields = items
      .filter((item) => {
        const id = normalizeId(item?.id);
        const workerCount = Number(item?.worker_count);

        return id !== null && workerCount > 0;
      })
      .map((item) => {
        const id = normalizeId(item.id);

        const lastmod = normalizeDate(
          item.latest_active_property_created_at
        );

        const field = {
          loc: `${BASE_URL}/realestates/${id}`,
        };

        // فقط تاریخ معتبر جدیدترین ملک فعال اضافه شود
        if (lastmod) {
          field.lastmod = lastmod;
        }

        return field;
      });

    return getServerSideSitemap(ctx, fields);
  } catch (error) {
    console.error(
      "Agents sitemap generation failed:",
      error
    );

    // اعلام خطای موقتی به موتورهای جست‌وجو
    ctx.res.statusCode = 503;
    ctx.res.setHeader("Retry-After", "300");
    ctx.res.setHeader("Cache-Control", "no-store");

    return getServerSideSitemap(ctx, []);
  }
};

export default function Site() {
  return null;
}
