// pages/worker/[id].jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";
import Script from "next/script";
import Cookies from "js-cookie";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsIcon from "@mui/icons-material/Directions";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Link from "next/link";
import axios from "axios";
import CallIcon from "@mui/icons-material/Call";

import AgentSwiper from "../../../components/swipers/AgentSwiper";

// -------------------- Helpers --------------------
const cleanText = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/&[a-z]+;/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const cleanNumber = (value) => {
  if (value === null || value === undefined) return null;
  const num = String(value).replace(/[^\d.]/g, "");
  if (!num) return null;
  const n = Number(num);
  return Number.isFinite(n) ? n : null;
};

const generateMetaDescription = (details) => {
  if (details.seo_description) return details.seo_description;

  let description = details.description || "";
  if (description.length > 160) return description.substring(0, 157) + "...";

  if (description.length < 50) {
    return `${details.name} - ${details.category_name} در ${details.region || details.city}. برای مشاوره و راهنمایی در زمینه خرید، فروش و اجاره ملک در ${details.city}.`;
  }
  return description;
};

const generatePageTitle = (details) => {
  if (details.seo_title) return details.seo_title;
  // تغییر فرمت عنوان به: محله {نام محله} در {نام شهر} -- آجر
  const neighborhoodName = details.name || "";
  const cityName = details.city_name || "";
  if (neighborhoodName && cityName) {
    return ` ${neighborhoodName}  -- آجر`;
  }
  return `${neighborhoodName || ""} -- آجر`;
};

const getPropertyType = (details) => {
  const text = `${details.category_name || ""} ${details.name || ""}`.toLowerCase();
  if (text.includes("آپارتمان") || text.includes("apartment")) return "Apartment";
  if (text.includes("ویلا") || text.includes("villa")) return "House";
  if (text.includes("خانه") || text.includes("house")) return "House";
  return "Residence";
};

// -------------------- Dynamic Components --------------------
const WorkerMedia = dynamic(() => import("../../../components/workers/WorkerMedia"), {
  ssr: true,
  loading: () => (
    <div
      style={{
        height: 400,
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    />
  ),
});

const ComplexDetails = dynamic(() => import("../../../components/workers/ComplexDetails"), {
  ssr: true,
  loading: () => (
    <div
      style={{
        height: 300,
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    />
  ),
});

const LocationNoSsr = dynamic(() => import("../../../components/map/Location"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 300,
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    />
  ),
});

// Import other components
import WorkerCard from "../../../components/cards/WorkerCard";
import WorkerRealstateCard from "../../../components/cards/realestate/WorkerRealstateCard";
import LazyLoader from "../../../components/lazyLoader/Loading";
import Breadcrumb from "../../../components/common/Breadcrumb";

// Styles
import Styles from "../../../components/styles/WorkerSingle.module.css";

// Create optimized Item component
const Item = React.memo(
  styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }))
);

const MemoizedWorkerCard = React.memo(WorkerCard);
const MemoizedWorkerRealstateCard = React.memo(WorkerRealstateCard);

const WorkerSingle = (props) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  // -------- Clean props (SSR-safe) --------
  const { details, cleanRealstate, images, videos, virtual_tours, properties, relateds,related_agents } = useMemo(() => {
    const {
      details: rawDetails = {},
      properties: rawProperties = [],
      realstate: rawRealstate = {},
      relateds: rawRelateds = [],
      related_agents: rawRelatedAgents = [],
      images: rawImages = [],
      videos: rawVideos = [],
      virtual_tours: rawVirtualTours = [],
    } = props;

    const cleanedDetails = {
      ...rawDetails,
      name: cleanText(rawDetails.name || ""),
      category_name: cleanText(rawDetails.category_name || ""),
      region: cleanText(rawDetails.region || ""),
      city: cleanText(rawDetails.city || ""),
      neighbourhood: cleanText(rawDetails.neighbourhood || ""),
      address: cleanText(rawDetails.address || ""),
      description: cleanText(rawDetails.description || ""),
      seo_title: rawDetails.seo_title || "",
      seo_description: rawDetails.seo_description || "",
      seo_keywords: rawDetails.seo_keywords || "",
      city_slug: rawDetails.city_slug || rawDetails.city || "tehran",
      category_eng_name: rawDetails.category_eng_name || "",
      // Keep coords as-is; don't force Tehran if not present (schema will include only if valid)
      latitude: rawDetails.latitude ?? null,
      longitude: rawDetails.longitude ?? null,
    };

    const cleanedRealstate = rawRealstate
      ? {
          ...rawRealstate,
          name: cleanText(rawRealstate.name || ""),
          slug: rawRealstate.slug || "",
        }
      : {};

    return {
      details: cleanedDetails,
      cleanRealstate: cleanedRealstate,
      images: rawImages || [],
      videos: rawVideos || [],
      virtual_tours: rawVirtualTours || [],
      properties: rawProperties || [],
      relateds: rawRelateds || [],
      related_agents: rawRelatedAgents || [],
    };
  }, [props]);

  // -------- SEO data --------
  const seoData = useMemo(() => {
    const pageTitle = generatePageTitle(details);
    const metaDescription = generateMetaDescription(details);

    const keywords =
      details.seo_keywords ||
      [details.name, details.category_name, details.city, details.region, details.neighbourhood, "املاک", "خرید", "فروش", "اجاره"]
        .filter(Boolean)
        .join("، ");

    // canonical (keep stable; optionally keep ?slug if you want a single canonical format)
    const canonicalUrl = `https://ajur.app/worker/${details.id}`;

    // prefer thumb; else fallback
    const shareImage = details.thumb || "https://api.ajur.app/logo/og-default.jpg";
    const siteName = "آجر";

    return {
      pageTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      shareImage,
      siteName,
    };
  }, [details]);

  // -------- Schema JSON-LD --------
  const structuredData = useMemo(() => {
    const canonicalUrl = seoData.canonicalUrl;

    // images array for schema (best effort)
    const imagesForSchema = Array.isArray(images)
      ? images
          .map((img) => {
            if (typeof img === "string") return img;
            return img?.url || img?.image || img?.thumb || null;
          })
          .filter(Boolean)
      : [];

    if (details.thumb && !imagesForSchema.includes(details.thumb)) {
      imagesForSchema.unshift(details.thumb);
    }

    const propertyType = getPropertyType(details);

    // Try to detect a numeric price if your API provides it (adjust keys if needed)
    const priceValue =
      cleanNumber(details.price) ||
      cleanNumber(details.amount) ||
      cleanNumber(details.specialvalue2) ||
      null;

    const lat = details.latitude !== null ? Number(details.latitude) : null;
    const lng = details.longitude !== null ? Number(details.longitude) : null;
    const hasGeo = Number.isFinite(lat) && Number.isFinite(lng);

    const listingSchema = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "@id": `${canonicalUrl}#listing`,
      "url": canonicalUrl,
      "name": details.name || `${details.category_name} در ${details.city || ""}`.trim(),
      "description": seoData.metaDescription,
      ...(imagesForSchema.length ? { image: imagesForSchema.slice(0, 10) } : {}),
      ...(details.created_at ? { datePosted: new Date(details.created_at).toISOString() } : {}),
      ...(details.updated_at ? { dateModified: new Date(details.updated_at).toISOString() } : {}),
      ...(details.address || details.city
        ? {
            address: {
              "@type": "PostalAddress",
              "streetAddress": details.address || details.neighbourhood || "",
              "addressLocality": details.city || "",
              "addressRegion": details.region || "",
              "addressCountry": "IR",
            },
          }
        : {}),
      ...(hasGeo
        ? {
            geo: {
              "@type": "GeoCoordinates",
              "latitude": lat,
              "longitude": lng,
            },
            hasMap: `https://maps.google.com/?q=${lat},${lng}`,
          }
        : {}),
      // The property itself
      "mainEntity": {
        "@type": propertyType,
        "name": details.name || undefined,
        ...(imagesForSchema.length ? { image: imagesForSchema.slice(0, 10) } : {}),
        ...(details.address || details.city
          ? {
              address: {
                "@type": "PostalAddress",
                "streetAddress": details.address || details.neighbourhood || "",
                "addressLocality": details.city || "",
                "addressRegion": details.region || "",
                "addressCountry": "IR",
              },
            }
          : {}),
        ...(hasGeo
          ? {
              geo: {
                "@type": "GeoCoordinates",
                "latitude": lat,
                "longitude": lng,
              },
            }
          : {}),
      },
      ...(priceValue
        ? {
            offers: {
              "@type": "Offer",
              "price": priceValue,
              "priceCurrency": "IRR",
              "availability": "https://schema.org/InStock",
              "url": canonicalUrl,
            },
          }
        : {}),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: "https://ajur.app" },
        {
          "@type": "ListItem",
          position: 2,
          name: details.city || "تهران",
          item: `https://ajur.app/${details.city_slug || "tehran"}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: details.category_name || "املاک",
          item: `https://ajur.app/${details.city_slug || "tehran"}/${details.category_eng_name || ""}`,
        },
        { "@type": "ListItem", position: 4, name: details.name || "آگهی", item: canonicalUrl },
      ],
    };

    // Optional: agency/agent schema if you have realstate info
    const agentSchema = cleanRealstate?.id
      ? {
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "@id": `${canonicalUrl}#agent`,
          name: cleanRealstate.name || "مشاور املاک",
          ...(cleanRealstate.phone ? { telephone: cleanRealstate.phone } : {}),
          url: `https://ajur.app/realestates/${cleanRealstate.id}?slug=${cleanRealstate.slug || ""}`,
        }
      : null;

    return { listingSchema, breadcrumbSchema, agentSchema };
  }, [seoData, details, images, cleanRealstate]);

  // -------- Client-only favorites/history (do NOT block rendering) --------
  useEffect(() => {
    // favorites
    try {
      const favorited = Cookies.get("favorited");
      if (favorited) {
        const favoriteItems = JSON.parse(favorited);
        setIsFavorite(Array.isArray(favoriteItems) && favoriteItems.includes(details.id));
      }
    } catch (error) {
      console.error("Favorites load failed:", error);
    }

    // history (deferred)
    const updateHistory = () => {
      try {
        let history = Cookies.get("history") || "[]";
        let historyItems = JSON.parse(history);
        if (!Array.isArray(historyItems)) historyItems = [];

        historyItems = historyItems.filter((item) => item !== details.id);
        historyItems.push(details.id);

        if (historyItems.length > 10) historyItems = historyItems.slice(-10);

        Cookies.set("history", JSON.stringify(historyItems), { expires: 30 });
      } catch (error) {
        console.error("History update failed:", error);
      }
    };

    const t = setTimeout(updateHistory, 1500);
    return () => clearTimeout(t);
  }, [details.id]);

  const handlePropertyCall = async () => {
    const phone = cleanRealstate?.phone || details.cellphone;

    try {
      await axios.post("https://api.ajur.app/api/track/worker-call", {
        worker_id: details.id,
      });
    } catch (error) {
      console.error("Worker call tracking failed:", error);
    }

    if (phone) window.location.href = `tel:${phone}`;
  };

  const toggleFavorite = useCallback(() => {
    try {
      let favorited = Cookies.get("favorited") || "[]";
      let favoriteItems = JSON.parse(favorited);
      if (!Array.isArray(favoriteItems)) favoriteItems = [];

      if (isFavorite) {
        favoriteItems = favoriteItems.filter((item) => item !== details.id);
      } else {
        if (!favoriteItems.includes(details.id)) {
          favoriteItems.push(details.id);
          if (favoriteItems.length > 20) favoriteItems = favoriteItems.slice(-20);
        }
      }

      Cookies.set("favorited", JSON.stringify(favoriteItems), { expires: 365 });
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error("Failed to update favorites:", error);
    }
  }, [isFavorite, details.id]);

  const openDirections = useCallback(() => {
    if (details.latitude && details.longitude) {
      window.open(`https://maps.google.com/?q=${details.latitude},${details.longitude}`, "_blank", "noopener,noreferrer");
    } else if (details.address) {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(details.address)}`, "_blank", "noopener,noreferrer");
    }
  }, [details.latitude, details.longitude, details.address]);


  const renderRelatedAgents  = useCallback(() => {
    if (!Array.isArray(related_agents) || related_agents.length === 0) {
      reeturn ();
      // return (
      //   <div
      //     style={{
      //       textAlign: "center",
      //       padding: "40px 20px",
      //       backgroundColor: "#f9f9f9",
      //       borderRadius: "8px",
      //       margin: "20px 0",
      //     }}
      //   >
      //     <p style={{ color: "#666", fontSize: "16px" }}>مشاور فعالی برای این محله وجود ندارد</p>
      //   </div>
      // );
    }

    return (
      <AgentSwiper agents={related_agents} />
    );
  }, [related_agents]);

  const renderRelatedWorkers = useCallback(() => {
    if (!Array.isArray(relateds) || relateds.length === 0) {
      return (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            margin: "20px 0",
          }}
        >
          <p style={{ color: "#666", fontSize: "16px" }}>مورد مشابه دیگری در این منطقه یافت نشد</p>
        </div>
      );
    }

    return (
      <LazyLoader
        items={relateds}
        itemsPerPage={8}
        delay={300}
        renderItem={(worker) => (
          <Grid item md={4} xs={12} key={worker.id}>
            <div
              onClick={() => {
                setIsNavigating(true);
                window.location.href = `/worker/${worker.id}?slug=${worker.slug}`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsNavigating(true);
                  window.location.href = `/worker/${worker.id}?slug=${worker.slug}`;
                }
              }}
              role="link"
              tabIndex={0}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                height: "100%",
                cursor: "pointer",
              }}
              aria-label={`مشاهده ${worker.name}`}
            >
              <MemoizedWorkerCard worker={worker} />
            </div>
          </Grid>
        )}
        loadingComponent={
          <div style={{ textAlign: "center", padding: "30px", gridColumn: "1 / -1" }}>
            <div
              style={{
                display: "inline-block",
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                backgroundSize: "200% 100%",
                animation: "shine 1.5s infinite linear",
              }}
            />
          </div>
        }
        endComponent={
          <div style={{ textAlign: "center", padding: "20px", color: "#666", gridColumn: "1 / -1", fontSize: "14px" }}>
            همه موارد مشابه بارگذاری شدند
          </div>
        }
        grid={true}
        gridProps={{ spacing: 2 }}
        itemProps={{ xl: 3, md: 4, xs: 12 }}
      />
    );
  }, [relateds]);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://api.ajur.app" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.ajur.app" />
        <link rel="preconnect" href="https://maps.googleapis.com" />

        {details.thumb && <link rel="preload" as="image" href={details.thumb} fetchPriority="high" />}

        <title>{seoData.pageTitle} </title>
        <meta name="description" content={seoData.metaDescription} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="author" content={cleanRealstate?.name || seoData.siteName} />

        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large" />

        <link rel="canonical" href={seoData.canonicalUrl} />
        <link rel="alternate" href={seoData.canonicalUrl} hrefLang="fa" />

        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content={seoData.siteName} />
        <meta property="og:title" content={seoData.pageTitle} />
        <meta property="og:description" content={seoData.metaDescription} />
        <meta property="og:url" content={seoData.canonicalUrl} />
        <meta property="og:image" content={seoData.shareImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={details.name || seoData.pageTitle} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.pageTitle} />
        <meta name="twitter:description" content={seoData.metaDescription} />
        <meta name="twitter:image" content={seoData.shareImage} />

        {details.created_at && <meta property="article:published_time" content={new Date(details.created_at).toISOString()} />}
        {details.updated_at && <meta property="article:modified_time" content={new Date(details.updated_at).toISOString()} />}

        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="theme-color" content="#b92a31" />
      </Head>

      {/* JSON-LD (Property Listing + Breadcrumb + optional Agent) */}
      <Script
        id="jsonld-listing"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.listingSchema) }}
      />
      <Script
        id="jsonld-breadcrumb"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumbSchema) }}
      />
      {structuredData.agentSchema && (
        <Script
          id="jsonld-agent"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.agentSchema) }}
        />
      )}

      <div className={`${Styles["scroll-div"]} ${Styles["worker-single"]} worker-single-page`} style={{ margin: "10px 20px", minHeight: "100vh" }}>
        <Breadcrumb persianCategory={details.category_name} englishCategory={details.category_eng_name} englishCity={details.city_slug} currentPage={details.name} />

        {/* Visible H1 (important for SEO) 
        <div style={{ marginTop: "10px", marginBottom: "10px", textAlign: "center" }}>
          <h1 style={{ fontSize: "18px", color: "#222", margin: 0, lineHeight: 1.8, fontWeight: 700 }}>{details.name}</h1>
          <p style={{ marginTop: "6px", marginBottom: 0, color: "#666", fontSize: "13px", lineHeight: 1.9 }}>
            {details.category_name} {details.city ? `در ${details.city}` : ""}
            {details.neighbourhood ? `، ${details.neighbourhood}` : ""}
          </p>
        </div>
      */}

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {/* Left Column - Media & Map */}
            <Grid item xs={12} md={5}>
              <div className={Styles["media-wrapper"]}>
                <WorkerMedia details={details} images={images} videos={videos} virtual_tours={virtual_tours} />

                <button
                  className={Styles["favorite-icon"]}
                  onClick={toggleFavorite}
                  aria-label={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    zIndex: 10,
                  }}
                >
                  {isFavorite ? <FavoriteIcon style={{ color: "#b92a31" }} /> : <FavoriteBorderIcon style={{ color: "#666" }} />}
                </button>
              </div>

              <Box sx={{ display: { xs: "none", md: "block" }, mt: 3 }}>
                <h2 className={Styles["title"]} style={{ fontSize: "18px", marginBottom: "12px" }}>
                  موقعیت روی نقشه
                </h2>
                <button
                  onClick={() => setMapModalOpen(true)}
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    border: "none",
                    padding: 0,
                    background: "none",
                    position: "relative",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #e0e0e0",
                  }}
                  className="map-container"
                  aria-label="نمایش موقعیت روی نقشه"
                >
                  <LocationNoSsr details={details} />
                </button>
              </Box>

              {cleanRealstate.id && (
                <Box sx={{ display: { xs: "none", md: "block" }, mt: 3 }}>
                  <Link href={`/realestates/${cleanRealstate.id}?slug=${cleanRealstate.slug}`} passHref legacyBehavior prefetch={false}>
                    <MemoizedWorkerRealstateCard realstate={cleanRealstate} />
                  </Link>
                </Box>
              )}
            </Grid>

            {/* Right Column - Details */}
            <Grid item xs={12} md={7}>
              <div className={Styles["worker-single-details"]}>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  {details.is_special && (
                    <span
                      style={{
                        backgroundColor: "#ff9800",
                        color: "#fff",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      آگهی ویژه
                    </span>
                  )}
                  {details.is_urgent && (
                    <span
                      style={{
                        backgroundColor: "#fff3e0",
                        color: "#e65100",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      آگهی فوری
                    </span>
                  )}
                </div>

                <ComplexDetails isFavorite={isFavorite} onFavoriteToggle={toggleFavorite} details={details} properties={properties} realstate={cleanRealstate} />
              </div>

              <Box sx={{ display: { xs: "block", md: "none" }, mt: 3 }}>
                <h2 className={Styles["title"]} style={{ fontSize: "18px", marginBottom: "12px" }}>
                  موقعیت روی نقشه
                </h2>
                <button
                  onClick={() => setMapModalOpen(true)}
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    border: "none",
                    padding: 0,
                    background: "none",
                    position: "relative",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #e0e0e0",
                  }}
                  className="map-container"
                  aria-label="نمایش موقعیت روی نقشه"
                >
                  <LocationNoSsr details={details} />
                </button>
              </Box>

              {cleanRealstate.id && (
                <Box sx={{ display: { xs: "block", md: "none" }, mt: 3 }}>
                  <Link href={`/realestates/${cleanRealstate.id}?slug=${cleanRealstate.slug}`} passHref legacyBehavior prefetch={false}>
                    <MemoizedWorkerRealstateCard realstate={cleanRealstate} />
                  </Link>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Sticky Call Button - Mobile Only */}
        {(cleanRealstate?.phone || details.cellphone) && (
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "16px 20px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 -2px 20px rgba(0,0,0,0.1)",
              zIndex: 10001,
              transform: "translateZ(0)",
            }}
            className="sticky-call-button"
          >
            <div
              onClick={(e) => {
                e.preventDefault();
                handlePropertyCall();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "14px 16px",
                background: "linear-gradient(135deg, #b92a31 0%, #d84343 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "18px",
                cursor: "pointer",
                transition: "all 0.2s",
                width: "100%",
                boxShadow: "0 4px 12px rgba(185, 42, 49, 0.3)",
                WebkitTapHighlightColor: "transparent",
              }}
              aria-label={`تماس با ${cleanRealstate?.name || details.name}`}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#a92b31",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "0 0 36px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                <CallIcon style={{ fontSize: "20px", color: "#fff" }} />
              </div>

              <span style={{ lineHeight: 1 }}>تماس: {cleanRealstate?.phone || details.cellphone}</span>
            </div>
          </Box>
        )}

        {/* Map Modal */}
        <Dialog
          open={mapModalOpen}
          onClose={() => setMapModalOpen(false)}
          maxWidth="lg"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              height: "90vh",
              maxHeight: "90vh",
              margin: { xs: "10px", sm: "20px" },
            },
          }}
          aria-labelledby="map-dialog-title"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              backgroundColor: "#f5f5f5",
              borderBottom: "1px solid #ddd",
            }}
          >
            <IconButton onClick={openDirections} title="مسیریابی در Google Maps" aria-label="مسیریابی در Google Maps" sx={{ color: "#b92a31" }}>
              <DirectionsIcon />
            </IconButton>
            <IconButton onClick={() => setMapModalOpen(false)} aria-label="بستن نقشه" sx={{ color: "#666" }}>
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent sx={{ padding: 0, height: "calc(100% - 64px)" }}>
            <LocationNoSsr details={details} mapHeight="100%" />
          </DialogContent>
        </Dialog>


        <div style={{ marginTop: "40px", marginBottom: "20px" }}>
          <h2 className={Styles["title"]} style={{ fontSize: "22px", marginBottom: "20px" }}>
            {/* {details.category_name}های مشابه در {details.neighbourhood || details.city} */}
                 مشاورین فعال آجر  در   {details.name}

          </h2>
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ marginTop: "10px" }}>
            {renderRelatedAgents()}
          </Grid>
        </div>

        {/* Related Workers Section */}
        <div style={{ marginTop: "40px", marginBottom: "20px" }}>
          <h2 className={Styles["title"]} style={{ fontSize: "22px", marginBottom: "20px" }}>
            {/* {details.category_name}های مشابه در {details.neighbourhood || details.city} */}
                 ملک های موجود در   {details.name}

          </h2>
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ marginTop: "10px" }}>
            {renderRelatedWorkers()}
          </Grid>
        </div>
      </div>

      {/* Loading Overlay */}
      {isNavigating && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "linear-gradient(90deg, #b92a31 25%, #d84343 50%, #b92a31 75%)",
              backgroundSize: "200% 100%",
              animation: "spin 1s infinite linear",
              boxShadow: "0 4px 20px rgba(185, 42, 49, 0.3)",
            }}
          />
        </div>
      )}

      <style jsx global>{`
        @keyframes shine {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .worker-single-page .swiper {
          padding: 0 !important;
        }
        .map-container {
          transition: transform 0.2s;
        }
        .map-container:hover {
          transform: scale(1.02);
        }
        .map-container:focus-visible {
          outline: 2px solid #b92a31;
          outline-offset: 2px;
        }
        .favorite-icon {
          transition: transform 0.2s;
        }
        .favorite-icon:hover {
          transform: scale(1.1);
        }
        .favorite-icon:active {
          transform: scale(0.95);
        }
        @media (max-width: 600px) {
          .worker-single-page {
            margin: 0 10px !important;
          }
        }
      `}</style>
    </>
  );
};

WorkerSingle.propTypes = {
  details: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    category_name: PropTypes.string,
    region: PropTypes.string,
    city: PropTypes.string,
    neighbourhood: PropTypes.string,
    address: PropTypes.string,
    description: PropTypes.string,
    thumb: PropTypes.string,
    phone: PropTypes.string,
    cellphone: PropTypes.string,
    email: PropTypes.string,
    latitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    longitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    city_slug: PropTypes.string,
    category_eng_name: PropTypes.string,
    seo_title: PropTypes.string,
    seo_description: PropTypes.string,
    seo_keywords: PropTypes.string,
    price_range: PropTypes.string,
  }).isRequired,
  images: PropTypes.array,
  videos: PropTypes.array,
  virtual_tours: PropTypes.array,
  properties: PropTypes.array,
  realstate: PropTypes.object,
  relateds: PropTypes.array,
  related_agents: PropTypes.array,
};

// SSR (already SSR) - keep and simplify a bit
export async function getServerSideProps(context) {
  const { params, res } = context;
  const id = params.id;

  // caching headers
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  res.setHeader("X-Robots-Tag", "index, follow");
  res.setHeader("X-Content-Type-Options", "nosniff");

  try {
    const response = await axios.get(`https://api.ajur.app/api/neighborhoods/${id}`, {
      timeout: 15000,
      headers: { Accept: "application/json" },
    });

    const data = response.data;

    if (!data?.details?.id || !data?.details?.name) {
      return { notFound: true };
    }

    return {
      props: {
        details: data.details || {},
        images: data.images || [],
        videos: data.videos || [],
        virtual_tours: data.virtual_tours || [],
        properties: data.properties || [],
        realstate: data.realstate || {},
        relateds: data.relateds || [],
        related_agents: data.related_agents || [],
      },
    };
  } catch (error) {
    console.error("Error fetching worker data:", error?.message || error);
    return { notFound: true };
  }
}

export default React.memo(WorkerSingle);
