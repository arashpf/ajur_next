// pages/[categories]/index.js
//
// Handles city URLs like /tehran, /robat-karim.
// Renders the homepage component AND fires city_view analytics.

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';
import Index from '../index';
import { buildClientContext, fireSsrEvent } from "../../lib/ssrTrack";

const CityPage = (props) => {
  const router = useRouter();
  const { categories } = router.query;
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    if (categories) {
      Cookies.set('selected_category', categories, { expires: 365 });
      set_loading(false);
    }
  }, [categories]);

  return (
    <div>
      {!loading && <Index trigeredcity={categories} />}
    </div>
  );
};

export default CityPage;

// ─────────────────────────────────────────────────────────────
// SSR: fetch city data + fire city_view analytics
// ─────────────────────────────────────────────────────────────
export async function getServerSideProps(context) {
  const { req, res, params } = context;

  // City slug comes from the URL segment: /tehran → params.categories = "tehran"
  const city = params?.categories || "tehran";

  // ─── Build analytics context (reads cookies, IP, UA) ───
  const pageUrl = `https://ajur.app/${city}`;
  const clientContext = buildClientContext(context, pageUrl);

  // ─── Fetch city data so we can pass it to the page and know counts ───
  let data = null;
  let persianCity = city;
  let cityId = null;
  let specialCount = 0;
  let urgentCount = 0;
  let neighborhoodsCount = 0;

  try {
    // Get Persian name + ID
    const citiesRes = await fetch("https://api.ajur.app/api/search-cities", {
      headers: {
        Accept: "application/json",
        "User-Agent": req.headers["user-agent"] || "Ajur-SSR",
      },
    });

    if (citiesRes.ok) {
      const citiesData = await citiesRes.json();
      const cityData = citiesData.items?.find((c) => c.slug === city);
      if (cityData) {
        persianCity = cityData.title;
        cityId = cityData.id;
      }
    }

    // Get main city data
    const baseRes = await fetch(`https://api.ajur.app/api/base?city=${city}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": req.headers["user-agent"] || "Ajur-SSR",
      },
    });

    if (baseRes.ok) {
      data = await baseRes.json();
      specialCount = Array.isArray(data?.the_city_specials) ? data.the_city_specials.length : 0;
      urgentCount = Array.isArray(data?.the_city_urgents) ? data.the_city_urgents.length : 0;
      neighborhoodsCount = Array.isArray(data?.the_neighborhoods) ? data.the_neighborhoods.length : 0;
    }
  } catch (e) {
    console.error("[city-page] fetch error:", e?.message || e);
  }

  // ─── Fire city_view analytics ───
  if (clientContext.clientIp || clientContext.userAgent) {
    fireSsrEvent(
      "city_view",
      {
        city_slug: city,
        city_id: cityId,
        special_count: specialCount,
        urgent_count: urgentCount,
        neighborhoods_count: neighborhoodsCount,
      },
      clientContext
    ).catch((err) => {
      console.warn("[ssr] city_view failed:", err?.response?.status || err?.message || err);
    });
  }

  // ─── Cache for 5 min on CDN ───
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

  return {
    props: {
      initialData: data || null,
      initialPersianCity: persianCity,
      initialCityId: cityId,
      __clientIp: clientContext.clientIp,
    },
  };
}