// pages/agents/[citySlug].js
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import SmallCard from "../../components/cards/SmallCard";

const SEARCH_TIMEOUT = 15000;
const DEBOUNCE_DELAY = 1000;

const RealStateIndex = () => {
  const router = useRouter();
  const { citySlug } = router.query;
  
  const [city, setCity] = useState(null);
  const [agents, setAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [searchStatus, setSearchStatus] = useState("");
  const debounceTimeout = useRef(null);

  // Fetch city info from slug
  useEffect(() => {
    if (!citySlug) return;
    
    const fetchCityInfo = async () => {
      try {
        // First, get city info from the slug
        const cityResponse = await axios.get(`https://api.ajur.app/api/cities/slug/${citySlug}`);
        setCity(cityResponse.data);
      } catch (error) {
        console.error("Error fetching city:", error);
        // If city not found, use slug as city name
        setCity({ title: citySlug, slug: citySlug, id: null });
      }
    };
    
    fetchCityInfo();
  }, [citySlug]);

  const persianCity = city?.title || citySlug || "تهران";
  const englishCity = city?.slug || citySlug || "tehran";
  const cityId = city?.id || null;

  const getAgentsCall = async (searchTerm = "all") => {
    try {
      setLoadingAgents(true);
      setSearchStatus(searchTerm === "all" ? "در حال دریافت لیست مشاورین..." : "در حال جستجوی مشاورین...");

      // Build params - send citySlug as parameter
      const params = { 
        title: searchTerm, 
        limit: 20
      };
      
      // Send the city slug as parameter to API
      if (citySlug) {
        params.city_slug = citySlug;
      }
      
      const response = await axios.get("https://api.ajur.app/api/agents-search", {
        params: params,
        timeout: SEARCH_TIMEOUT,
      });

      const result = response.data?.agents || [];
      setAgents(result);
      
      if (result.length === 0) {
        setSearchStatus(`هیچ مشاوری در ${persianCity} یافت نشد`);
      } else {
        setSearchStatus(`${result.length} مشاور در ${persianCity} یافت شد`);
      }
    } catch (error) {
      console.error("API Error:", error);
      setSearchStatus("خطا در بارگذاری اطلاعات");
      setAgents([]);
    } finally {
      setLoadingAgents(false);
    }
  };

  const handleSearchInput = (value) => {
    setSearchQuery(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      getAgentsCall(value.trim() === "" ? "all" : value.trim());
    }, DEBOUNCE_DELAY);
  };

  useEffect(() => {
    if (citySlug) {
      getAgentsCall("all");
    }
  }, [citySlug]);

  // Dynamic SEO Data
  const seoData = {
    title: `لیست مشاورین املاک ${persianCity} | آجر - مشاهده شماره تماس و آدرس`,
    description: `بانک اطلاعات مشاورین املاک ${persianCity}. لیست بهترین بنگاه‌های املاک و مشاورین برتر ${persianCity} به همراه آدرس، شماره تماس و سوابق فعالیت در سامانه آجر.`,
    keywords: `مشاور املاک ${persianCity}, املاک ${persianCity}, لیست مشاورین املاک ${persianCity}, بنگاه املاک ${persianCity}, بهترین مشاور املاک ${persianCity}`,
    canonical: `https://ajur.app/agents/${englishCity}`,
    image: "https://ajur.app/logo/ajour-meta-image.jpg",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "آجر", "item": "https://ajur.app" },
      { "@type": "ListItem", "position": 2, "name": `املاک ${persianCity}`, "item": `https://ajur.app/agents/${englishCity}` },
      { "@type": "ListItem", "position": 3, "name": "مشاورین املاک", "item": seoData.canonical }
    ]
  };

  const itemListSchema = agents.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `لیست مشاورین املاک ${persianCity}`,
    "numberOfItems": agents.length,
    "itemListElement": agents.map((agent, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": agent.name || "مشاور املاک",
        "image": agent.profile_url || seoData.image,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": persianCity,
          "addressCountry": "IR"
        }
      }
    }))
  } : null;

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />
        
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:image" content={seoData.image} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {itemListSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
        )}
      </Head>

      <main className="w-full p-6 bg-gray-50 min-h-screen" dir="rtl">
        <section className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2 text-gray-900">
            مشاورین املاک {persianCity}
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-3xl">
            به دنبال بهترین مشاور املاک در {persianCity} هستید؟ در این صفحه لیستی از حرفه‌ای‌ترین مشاورین 
            و بنگاه‌های املاک {persianCity} را گردآوری کرده‌ایم تا بتوانید با اطمینان کامل معاملات ملکی خود را انجام دهید.
          </p>
        </section>

        <div className="flex flex-row-reverse gap-2 mb-8 sticky top-4 z-10">
          <input
            type="text"
            className="flex-1 border-2 border-red-100 focus:border-red-500 outline-none rounded-xl p-4 text-right bg-white shadow-sm transition-all"
            placeholder={`جستجوی نام مشاور یا محله در ${persianCity}...`}
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
          />
          <button
            onClick={() => getAgentsCall(searchQuery.trim() === "" ? "all" : searchQuery.trim())}
            className="bg-red-500 hover:bg-red-600 text-white px-8 rounded-xl font-bold transition-colors shadow-lg"
          >
            جستجو
          </button>
        </div>

        {searchStatus && (
          <div className="bg-white inline-block px-4 py-1 rounded-full text-xs text-gray-500 mb-6 shadow-sm border">
            {searchStatus}
          </div>
        )}

        {loadingAgents && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500"></div>
          </div>
        )}

        {!loadingAgents && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {agents.map((agent, index) => (
              <article key={agent.id || index}>
                <SmallCard
                  realEstate={agent}
                  profileImageKey="profile_url"
                  compact={true}
                />
              </article>
            ))}
          </div>
        )}

        {!loadingAgents && agents.length === 0 && (
          <div className="text-center text-gray-500 py-20 bg-white rounded-3xl border-2 border-dashed">
            مشاوری در شهر {persianCity} یافت نشد.
          </div>
        )}

        {!loadingAgents && agents.length > 0 && (
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-800">راهنمای انتخاب مشاور املاک در {persianCity}</h2>
            <div className="text-gray-600 text-sm leading-7 space-y-4">
              <p>
                انتخاب یک مشاور املاک خبره در <strong>{persianCity}</strong> می‌تواند تفاوت بزرگی در سودآوری 
                معامله شما ایجاد کند. در سامانه آجر، ما تلاش می‌کنیم تا با بررسی سوابق و تخصص هر مشاور، 
                فضایی شفاف برای مقایسه خدمات آن‌ها فراهم کنیم.
              </p>
              <p>
                شما می‌توانید با کلیک بر روی کارت هر مشاور، اطلاعات تکمیلی از جمله <strong>آدرس دفتر املاک</strong>، 
                <strong>تلفن تماس</strong> و لیست آگهی‌های فعال آن‌ها را مشاهده نمایید.
              </p>
            </div>
          </footer>
        )}
      </main>
    </>
  );
};

export default RealStateIndex;