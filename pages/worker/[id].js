// pages/worker/[id].jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";
import Script from "next/script";
import Cookies from "js-cookie";
import { trackEvent } from "../../lib/track";
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
import ShareIcon from "@mui/icons-material/Share";
import Link from "next/link";
import axios from "axios";
import CallIcon from "@mui/icons-material/Call";

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

  const parts = [details.name, details.category_name];
  if (details.city) parts.push(`در ${details.city}`);
  if (details.region && details.region !== details.city) parts.push(details.region);
  parts.push("| آجر");

  return parts.join(" - ");
};

const getPropertyType = (details) => {
  const text = `${details.category_name || ""} ${details.name || ""}`.toLowerCase();
  if (text.includes("آپارتمان") || text.includes("apartment")) return "Apartment";
  if (text.includes("ویلا") || text.includes("villa")) return "House";
  if (text.includes("خانه") || text.includes("house")) return "House";
  return "Residence";
};

// -------------------- Dynamic Components --------------------
const WorkerMedia = dynamic(() => import("../../components/workers/WorkerMedia"), {
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

const WorkerDetails = dynamic(() => import("../../components/workers/WorkerDetails"), {
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

// ⚠️ MAP DISABLED
// const LocationNoSsr = dynamic(() => import("../../components/map/Location"), {
//   ssr: false,
//   loading: () => (
//     <div
//       style={{
//         height: 300,
//         backgroundColor: "#f5f5f5",
//         borderRadius: "8px",
//       }}
//     />
//   ),
// });

// Import other components
import WorkerCard from "../../components/cards/WorkerCard";
import WorkerRealstateCard from "../../components/cards/realestate/WorkerRealstateCard";
import LazyLoader from "../../components/lazyLoader/Loading";
import Breadcrumb from "../../components/common/Breadcrumb";

// Styles
import Styles from "../../components/styles/WorkerSingle.module.css";

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

// -------------------- Unavailable Notice (status 2 & 4) --------------------
const UnavailableNotice = ({ reason, details }) => {
  const isUnderReview = reason === "under_review";

  const title = isUnderReview
    ? "این آگهی در حال بررسی است"
    : "این آگهی در دسترس نیست";

  const message = isUnderReview
    ? "این ملک در حال حاضر در حال بازبینی توسط کارشناسان آجر است و به‌زودی در دسترس قرار می‌گیرد. لطفاً بعداً مراجعه کنید."
    : "این ملک دیگر در دسترس نیست. ممکن است آگهی حذف شده باشد یا معامله انجام شده باشد.";

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "Vazir, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          background: "#fff",
          border: "1px solid #f0dede",
          borderRadius: 20,
          boxShadow: "0 12px 40px rgba(185, 42, 49, 0.08)",
          padding: "40px 28px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: isUnderReview ? "#FFF3E0" : "#FFEBEE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
          }}
          aria-hidden="true"
        >
          {isUnderReview ? "⏳" : "🚫"}
        </div>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#b92a31",
            margin: "0 0 12px",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.9,
            color: "#555",
            margin: "0 0 24px",
          }}
        >
          {message}
        </p>

        {details?.name && (
          <p
            style={{
              fontSize: 13,
              color: "#999",
              margin: "0 0 24px",
            }}
          >
            {/* «{details.name}» */}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/" legacyBehavior>
            <a
              style={{
                background: "#b92a31",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              بازگشت به صفحه اصلی
            </a>
          </Link>

          <button
            onClick={() => window.history.back()}
            style={{
              background: "#fff",
              color: "#b92a31",
              border: "1.5px solid #b92a31",
              padding: "12px 28px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            صفحه قبل
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------- Transient Error Notice --------------------
// Shown when the API is temporarily unreachable (not a real 404).
const TransientErrorNotice = ({ onRetry }) => {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "Vazir, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 20,
          boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
          padding: "40px 28px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "#FFF3E0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
          }}
          aria-hidden="true"
        >
          ⏱️
        </div>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#b92a31",
            margin: "0 0 12px",
          }}
        >
          ارتباط با سرور برقرار نشد
        </h1>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.9,
            color: "#555",
            margin: "0 0 24px",
          }}
        >
          لطفاً چند لحظه دیگر دوباره تلاش کنید. این مشکل موقتی است.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onRetry}
            style={{
              background: "#b92a31",
              color: "#fff",
              border: "none",
              padding: "12px 28px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            تلاش مجدد
          </button>

          <Link href="/" legacyBehavior>
            <a
              style={{
                background: "#fff",
                color: "#b92a31",
                border: "1.5px solid #b92a31",
                padding: "12px 28px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              بازگشت به صفحه اصلی
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

// -------------------- Stale Listing Modal (status 5) --------------------
const StaleListingModal = ({ open, onClose, onCall }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="stale-modal-title"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "18px",
          padding: 0,
          overflow: "hidden",
        },
      }}
    >
      <div
        dir="rtl"
        style={{
          fontFamily: "Vazir, sans-serif",
          padding: "28px 24px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            margin: "0 auto 16px",
            borderRadius: "50%",
            background: "#FFF3E0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
          }}
          aria-hidden="true"
        >
          ⚠️
        </div>

        <h2
          id="stale-modal-title"
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#b92a31",
            margin: "0 0 12px",
          }}
        >
          توجه: این آگهی قدیمی است
        </h2>

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.9,
            color: "#555",
            margin: "0 0 24px",
          }}
        >
          بیش از ۲ ماه از بروزرسانی این ملک گذشته است. ممکن است این ملک دیگر
          موجود نباشد و یا قیمت‌ها تغییر کرده باشد.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: "#b92a31",
              color: "#fff",
              border: "none",
              padding: "12px 16px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            متوجه شدم
          </button>

          {onCall && (
            <button
              onClick={onCall}
              style={{
                flex: 1,
                background: "#fff",
                color: "#b92a31",
                border: "1.5px solid #b92a31",
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              تماس با مشاور
            </button>
          )}
        </div>
      </div>
    </Dialog>
  );
};

const WorkerSingle = (props) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [staleModalOpen, setStaleModalOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState("");
  const [isActionsPinned, setIsActionsPinned] = useState(false);

  const mediaWrapperRef = useRef(null);

  const router = useRouter();
  const { slug } = router.query;

  // -------- Clean props (SSR-safe) --------
  const { details, cleanRealstate, images, videos, virtual_tours, properties, relateds } = useMemo(() => {
    const {
      details: rawDetails = {},
      properties: rawProperties = [],
      realstate: rawRealstate = {},
      relateds: rawRelateds = [],
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
    };
  }, [props]);

  useEffect(() => {
    if (!router.isReady) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    });
  }, [router.isReady, details?.id]);

  // -------- SEO data --------
  const seoData = useMemo(() => {
    const pageTitle = generatePageTitle(details);
    const metaDescription = generateMetaDescription(details);

    const keywords =
      details.seo_keywords ||
      [details.name, details.category_name, details.city, details.region, details.neighbourhood, "املاک", "خرید", "فروش", "اجاره"]
        .filter(Boolean)
        .join("، ");

    const canonicalUrl = `https://ajur.app/worker/${details.id}`;

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
      url: canonicalUrl,
      name: details.name || `${details.category_name} در ${details.city || ""}`.trim(),
      description: seoData.metaDescription,
      ...(imagesForSchema.length ? { image: imagesForSchema.slice(0, 10) } : {}),
      ...(details.created_at ? { datePosted: new Date(details.created_at).toISOString() } : {}),
      ...(details.updated_at ? { dateModified: new Date(details.updated_at).toISOString() } : {}),
      ...(details.address || details.city
        ? {
            address: {
              "@type": "PostalAddress",
              streetAddress: details.address || details.neighbourhood || "",
              addressLocality: details.city || "",
              addressRegion: details.region || "",
              addressCountry: "IR",
            },
          }
        : {}),
      ...(hasGeo
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: lat,
              longitude: lng,
            },
            hasMap: `https://maps.google.com/?q=${lat},${lng}`,
          }
        : {}),
      mainEntity: {
        "@type": propertyType,
        name: details.name || undefined,
        ...(imagesForSchema.length ? { image: imagesForSchema.slice(0, 10) } : {}),
        ...(details.address || details.city
          ? {
              address: {
                "@type": "PostalAddress",
                streetAddress: details.address || details.neighbourhood || "",
                addressLocality: details.city || "",
                addressRegion: details.region || "",
                addressCountry: "IR",
              },
            }
          : {}),
        ...(hasGeo
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: lat,
                longitude: lng,
              },
            }
          : {}),
      },
      ...(priceValue
        ? {
            offers: {
              "@type": "Offer",
              price: priceValue,
              priceCurrency: "IRR",
              availability: "https://schema.org/InStock",
              url: canonicalUrl,
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

  useEffect(() => {
    setIsNavigating(false);
  }, [props.details?.id]);

  useEffect(() => {
    if (props.unavailableReason) return;
    if (props.__transientError) return;

    try {
      const favorited = Cookies.get("favorited");
      if (favorited) {
        const favoriteItems = JSON.parse(favorited);
        setIsFavorite(Array.isArray(favoriteItems) && favoriteItems.includes(details.id));
      }
    } catch (error) {
      console.error("Favorites load failed:", error);
    }

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
  }, [details.id, props.unavailableReason, props.__transientError]);

  useEffect(() => {
    if (props.staleWarning) {
      const t = setTimeout(() => setStaleModalOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, [props.staleWarning]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (props.unavailableReason) return;
    if (props.__transientError) return;

    const handleScroll = () => {
      const el = mediaWrapperRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const shouldPin = rect.bottom <= 0;
      setIsActionsPinned((prev) => (prev !== shouldPin ? shouldPin : prev));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [props.unavailableReason, props.__transientError]);

  const handlePropertyCall = async () => {
    const phone = cleanRealstate?.phone || details.cellphone;

    // ─── Analytics: fire before navigation (sendBeacon survives unload) ───
    trackEvent(
      "listing_call",
      {
        listing_id: details.id,
        phone: phone || null,
        realstate_id: cleanRealstate?.id || null,
        source: "worker-page",
      },
      props.__clientIp
    );

    // ─── Existing server-side call log — keep for backward compat ───
    try {
      await axios.post("https://api.ajur.app/api/track/worker-call", {
        worker_id: details.id,
      });
    } catch (error) {
      console.error("Worker call tracking failed:", error);
    }

    // ─── Trigger the dialer ───
    if (phone) window.location.href = `tel:${phone}`;
  };

  const toggleFavorite = useCallback(() => {
    try {
      let favorited = Cookies.get("favorited") || "[]";
      let favoriteItems = JSON.parse(favorited);
      if (!Array.isArray(favoriteItems)) favoriteItems = [];

      // `isFavorite` reflects the state BEFORE the toggle, so:
      //   isFavorite === true  → user is removing
      //   isFavorite === false → user is adding
      const action = isFavorite ? "remove" : "add";

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

      // ─── Analytics ───
      trackEvent(
        "listing_favorite",
        {
          listing_id: details.id,
          action,
        },
        props.__clientIp
      );
    } catch (error) {
      console.error("Failed to update favorites:", error);
    }
  }, [isFavorite, details.id, props.__clientIp]);

  const handleShare = useCallback(async () => {
    alert('sharing');
    const shareUrl =
      typeof window !== "undefined"
        ? window.location.href
        : seoData.canonicalUrl;

    const shareTitle = details.name || seoData.pageTitle || "آگهی ملک در آجر";
    const shareText = details.name
      ? `${details.name} - ${details.category_name || ""} در ${
          details.city || ""
        }`.trim()
      : seoData.metaDescription;

    const sharePayload = {
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    };

    try {
      // ── 1. Native share (mobile + supported desktop browsers) ──
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        await navigator.share(sharePayload);

        // ─── Analytics: native share path ───
        trackEvent(
          "listing_share",
          {
            listing_id: details.id,
            channel: "native",
          },
          props.__clientIp
        );
        return;
      }

      // ── 2. Clipboard fallback ──
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {
        await navigator.clipboard.writeText(shareUrl);
        setShareFeedback("لینک کپی شد");
        setTimeout(() => setShareFeedback(""), 2000);

        // ─── Analytics: clipboard path ───
        trackEvent(
          "listing_share",
          {
            listing_id: details.id,
            channel: "clipboard",
          },
          props.__clientIp
        );
        return;
      }

      // ── 3. Prompt fallback ──
      if (typeof window !== "undefined") {
        window.prompt("لینک را کپی کنید:", shareUrl);

        // ─── Analytics: prompt path ───
        trackEvent(
          "listing_share",
          {
            listing_id: details.id,
            channel: "prompt",
          },
          props.__clientIp
        );
      }
    } catch (error) {
      // User cancelled the native share sheet — no analytics, that's correct.
      if (error && error.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  }, [details, seoData, props.__clientIp]);

  const openDirections = useCallback(() => {
    if (details.latitude && details.longitude) {
      window.open(`https://maps.google.com/?q=${details.latitude},${details.longitude}`, "_blank", "noopener,noreferrer");
    } else if (details.address) {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(details.address)}`, "_blank", "noopener,noreferrer");
    }
  }, [details.latitude, details.longitude, details.address]);

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
          <Grid
            item
            md={4}
            xs={12}
            key={worker.id}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Link
              href={`/worker/${worker.id}`}
              prefetch={false}
              aria-label={`مشاهده ${worker.name}`}
              onClick={() => setIsNavigating(true)}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                height: "100%",
                width: "100%",
                maxWidth: 400,
                cursor: "pointer",
              }}
            >
              <MemoizedWorkerCard worker={worker} />
            </Link>
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

  // ─── Transient error view (API timeout / 5xx / network — NOT a real 404) ───
  if (props.__transientError) {
    return (
      <>
        <Head>
          <title>خطای موقت | آجر</title>
          <meta name="robots" content="noindex, nofollow" />
          <meta
            name="description"
            content="ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
          <meta name="theme-color" content="#b92a31" />
        </Head>

        <TransientErrorNotice onRetry={() => window.location.reload()} />
      </>
    );
  }

  if (props.unavailableReason) {
    const isUnderReview = props.unavailableReason === "under_review";
    return (
      <>
        <Head>
          <title>
            {isUnderReview ? "آگهی در حال بررسی | آجر" : "آگهی در دسترس نیست | آجر"}
          </title>
          <meta name="robots" content="noindex, nofollow" />
          <meta
            name="description"
            content={
              isUnderReview
                ? "این آگهی در حال بررسی است و به‌زودی در دسترس قرار می‌گیرد."
                : "این آگهی دیگر در دسترس نیست."
            }
          />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
          <meta name="theme-color" content="#b92a31" />
        </Head>

        <UnavailableNotice reason={props.unavailableReason} details={details} />
      </>
    );
  }

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://api.ajur.app" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.ajur.app" />
        <link rel="preconnect" href="https://maps.googleapis.com" />

        {details.thumb && <link rel="preload" as="image" href={details.thumb} fetchPriority="high" />}

        <title>{seoData.pageTitle}</title>
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

      <div
        className={`${Styles["scroll-div"]} ${Styles["worker-single"]} worker-single-page`}
        style={{ margin: "10px 20px", minHeight: "100vh" }}
      >
        <Breadcrumb
          persianCategory={details.category_name}
          englishCategory={details.category_eng_name}
          englishCity={details.city_slug}
          currentPage={details.name}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={5}>
              <div
                ref={mediaWrapperRef}
                className={Styles["media-wrapper"]}
                style={{ position: "relative" }}
              >
                <WorkerMedia
                  details={details}
                  images={images}
                  videos={videos}
                  virtual_tours={virtual_tours}
                />

                <div
                  id="action-buttons-container"
                  style={{
                    position: isActionsPinned ? "fixed" : "absolute",
                    top: isActionsPinned
                      ? "calc(env(safe-area-inset-top, 0px) + 82px)"
                      : 10,
                    right: isActionsPinned ? 12 : 10,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    zIndex: isActionsPinned ? 1000 : 10,
                    pointerEvents: "auto",
                    transition: "top 0.15s ease, right 0.15s ease",
                  }}
                >
                  <button
                    type="button"
                    onClick={toggleFavorite}
                    aria-label={
                      isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
                    }
                    title={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                    style={{
                      position: "static",
                      top: "auto",
                      right: "auto",
                      left: "auto",
                      bottom: "auto",
                      background: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      minWidth: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: 0,
                      boxShadow: isActionsPinned
                        ? "0 4px 14px rgba(0,0,0,0.18)"
                        : "0 2px 8px rgba(0,0,0,0.15)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      WebkitTapHighlightColor: "transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {isFavorite ? (
                      <FavoriteIcon style={{ color: "#b92a31", fontSize: 22 }} />
                    ) : (
                      <FavoriteBorderIcon style={{ color: "#666", fontSize: 22 }} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="اشتراک‌گذاری این آگهی"
                    title="اشتراک‌گذاری"
                    style={{
                      position: "static",
                      top: "auto",
                      right: "auto",
                      left: "auto",
                      bottom: "auto",
                      background: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      minWidth: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: 0,
                      boxShadow: isActionsPinned
                        ? "0 4px 14px rgba(0,0,0,0.18)"
                        : "0 2px 8px rgba(0,0,0,0.15)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      WebkitTapHighlightColor: "transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <ShareIcon style={{ color: "#666", fontSize: 22 }} />
                  </button>
                </div>

                {shareFeedback && (
                  <div
                    role="status"
                    aria-live="polite"
                    style={{
                      position: isActionsPinned ? "fixed" : "absolute",
                      top: isActionsPinned
                        ? "calc(env(safe-area-inset-top, 0px) + 62px)"
                        : "auto",
                      bottom: isActionsPinned ? "auto" : 12,
                      right: isActionsPinned ? 12 : "auto",
                      left: isActionsPinned ? "auto" : "50%",
                      transform: isActionsPinned ? "none" : "translateX(-50%)",
                      background: "rgba(0,0,0,0.8)",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 600,
                      zIndex: 1001,
                      pointerEvents: "none",
                      whiteSpace: "nowrap",
                      transition: "opacity 0.2s",
                    }}
                  >
                    {shareFeedback}
                  </div>
                )}
              </div>

              {cleanRealstate.id && (
                <Box sx={{ display: { xs: "none", md: "block" }, mt: 3 }}>
                  <Link
                    href={`/realestates/${cleanRealstate.id}?slug=${cleanRealstate.slug}`}
                    passHref
                    legacyBehavior
                    prefetch={false}
                  >
                    <MemoizedWorkerRealstateCard realstate={cleanRealstate} />
                  </Link>
                </Box>
              )}
            </Grid>

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

                <WorkerDetails
                  isFavorite={isFavorite}
                  onFavoriteToggle={toggleFavorite}
                  details={details}
                  properties={properties}
                  realstate={cleanRealstate}
                />
              </div>

              {cleanRealstate.id && (
                <Box sx={{ display: { xs: "block", md: "none" }, mt: 3 }}>
                  <Link
                    href={`/realestates/${cleanRealstate.id}?slug=${cleanRealstate.slug}`}
                    passHref
                    legacyBehavior
                    prefetch={false}
                  >
                    <MemoizedWorkerRealstateCard realstate={cleanRealstate} />
                  </Link>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>

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

              <span style={{ lineHeight: 1 }}>
                تماس: {cleanRealstate?.phone || details.cellphone}
              </span>
            </div>
          </Box>
        )}

        <div style={{ marginTop: "40px", marginBottom: "80px" }}>
          <h2
            className={Styles["title"]}
            style={{
              fontSize: "22px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {details.category_name}های مشابه در {details.neighbourhood || details.city}
          </h2>
          <div style={{ marginTop: "10px" }}>
            {renderRelatedWorkers()}
          </div>
        </div>
      </div>

      <StaleListingModal
        open={staleModalOpen}
        onClose={() => setStaleModalOpen(false)}
        onCall={
          cleanRealstate?.phone || details.cellphone
            ? () => {
                setStaleModalOpen(false);
                handlePropertyCall();
              }
            : null
        }
      />

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
              background:
                "linear-gradient(90deg, #b92a31 25%, #d84343 50%, #b92a31 75%)",
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
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  images: PropTypes.array,
  videos: PropTypes.array,
  virtual_tours: PropTypes.array,
  properties: PropTypes.array,
  realstate: PropTypes.object,
  relateds: PropTypes.array,
  unavailableReason: PropTypes.oneOf(["under_review", "removed", null]),
  staleWarning: PropTypes.bool,
  __clientIp: PropTypes.string,
  __transientError: PropTypes.bool,
};

// =====================================================================
// Server-side data fetching + analytics
// =====================================================================

const CACHE_TTL_MS = 60 * 1000;
const API_TIMEOUT_MS = 6000;
const API_RETRIES = 2;
const CACHE_MAX_ENTRIES = 500;
const PING_TIMEOUT_MS = 3000;
const SSR_ANALYTICS_DEDUPE_MS = 60 * 1000;

const globalCache =
  globalThis.__workerPostCache ||
  (globalThis.__workerPostCache = new Map());

// Dedupe SSR listing_view analytics per (ip, listing) within a short window.
const globalViewDedupe =
  globalThis.__workerViewDedupe ||
  (globalThis.__workerViewDedupe = new Map());

function getCached(id) {
  const hit = globalCache.get(String(id));
  if (!hit) return null;
  if (Date.now() - hit.t > CACHE_TTL_MS) {
    globalCache.delete(String(id));
    return null;
  }
  return hit.v;
}

function setCached(id, value) {
  globalCache.set(String(id), { v: value, t: Date.now() });
  if (globalCache.size > CACHE_MAX_ENTRIES) {
    const oldestKey = globalCache.keys().next().value;
    globalCache.delete(oldestKey);
  }
}

// ─── Client-IP extraction ───
function getClientIp(req) {
  const headers = req.headers || {};

  const candidates = [
    headers["cf-connecting-ip"],
    headers["true-client-ip"],
    headers["x-real-ip"],
    headers["x-client-ip"],
    headers["x-forwarded-for"],
    headers["forwarded"],
    headers["x-forwarded"],
    headers["forwarded-for"],
    headers["x-cluster-client-ip"],
    headers["fastly-client-ip"],
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const first = String(value).split(",")[0].trim();
    if (!first) continue;

    if (first === "::1") continue;
    if (first === "127.0.0.1") continue;
    if (first === "localhost") continue;
    if (first.startsWith("::ffff:127.")) continue;
    if (first.startsWith("10.")) continue;
    if (first.startsWith("192.168.")) continue;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(first)) continue;

    return first;
  }

  const sock = req.socket && req.socket.remoteAddress;
  if (sock && sock !== "::1" && sock !== "127.0.0.1") {
    return sock;
  }

  return null;
}

// ─── First-party cookie parser ───
function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("=") || "")];
    })
  );
}

// ─── Build the analytics context from the incoming browser request ───
function buildClientContext(context, listingId) {
  const { req, query } = context;
  const cookies = parseCookies(req.headers.cookie);

  // Read attribution cookie (referrer / UTM)
  let attribution = null;
  const rawAttr = cookies["ajur_attribution"];
  if (rawAttr) {
    try {
      attribution = JSON.parse(rawAttr);
    } catch {
      attribution = null;
    }
  }

  return {
    clientIp: getClientIp(req),
    userAgent: req.headers["user-agent"] || null,
    referer: req.headers["referer"] || req.headers["referrer"] || null,
    acceptLanguage: req.headers["accept-language"] || null,
    position: query?.position || null,
    source: query?.source || "worker-page",
    pageUrl: `https://ajur.app/worker/${listingId}`,
    anonymousId: cookies["ajur_anonymous_id"] || null,
    sessionId: cookies["ajur_session_id"] || null,
    attribution,   // ← ADD
  };
}

// ─── Generic SSR event helper ───
async function fireSsrEvent(eventName, payload, ctx) {
  const headers = {
    Accept: "application/json",
    "X-Client-From-Page": "1",
    ...(ctx.clientIp ? { "X-Client-Ip": ctx.clientIp } : {}),
    ...(ctx.userAgent ? { "X-Client-User-Agent": ctx.userAgent } : {}),
    ...(ctx.referer ? { "X-Client-Referer": ctx.referer } : {}),
    ...(ctx.acceptLanguage
      ? { "X-Client-Accept-Language": ctx.acceptLanguage }
      : {}),
    ...(ctx.position ? { "X-Client-Position": String(ctx.position) } : {}),
    ...(ctx.source ? { "X-Client-Source": ctx.source } : {}),
    ...(ctx.pageUrl ? { "X-Client-Page-Url": ctx.pageUrl } : {}),
    ...(ctx.anonymousId ? { "X-Client-Anonymous-Id": ctx.anonymousId } : {}),
    ...(ctx.sessionId ? { "X-Client-Session-Id": ctx.sessionId } : {}),
  };

  // Enrich payload with attribution if available
  const enrichedPayload = {
    ...payload,
    ...(ctx.attribution ? { attribution: ctx.attribution } : {}),
  };

  await axios.post(
    "https://api.ajur.app/api/analytics/track",
    {
      event_name: eventName,
      platform: "web",
      payload: enrichedPayload,
    },
    {
      timeout: PING_TIMEOUT_MS,
      headers,
    }
  );
}

// ─── Data fetch with retry ───
async function fetchPostWithRetry(id) {
  let lastError = null;

  for (let attempt = 0; attempt <= API_RETRIES; attempt++) {
    try {
      const response = await axios.get(
        `https://api.ajur.app/api/posts/${id}`,
        {
          timeout: API_TIMEOUT_MS,
          headers: { Accept: "application/json" },
        }
      );

      if (response?.data?.details?.id) {
        return response.data;
      }

      lastError = new Error("Malformed API payload");
      break;
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;

      const isRetryable =
        !status || status >= 500 || error?.code === "ECONNABORTED";

      if (!isRetryable || attempt === API_RETRIES) {
        throw error;
      }

      const delay = 300 * Math.pow(3, attempt);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError || new Error("API fetch failed");
}

export async function getServerSideProps(context) {
  const { params, res } = context;
  const id = params.id;

  const clientContext = buildClientContext(context, id);

  // ─── DEBUG: SSR side ───
  // eslint-disable-next-line no-console
  console.log("[ssr] context resolved", {
    id,
    clientIp: clientContext.clientIp,
    userAgent: clientContext.userAgent?.slice(0, 40),
    xff: context.req.headers["x-forwarded-for"] || null,
    cfConnectingIp: context.req.headers["cf-connecting-ip"] || null,
    xRealIp: context.req.headers["x-real-ip"] || null,
    arRealIp: context.req.headers["ar-real-ip"] || null,
    socketRemote: (context.req.socket && context.req.socket.remoteAddress) || null,
  });
  // ─── END DEBUG ───

  // Also set the legacy cookie (kept for backward compat, harmless if stripped).
  if (clientContext.clientIp) {
    res.setHeader(
      "Set-Cookie",
      `ajur_client_ip=${encodeURIComponent(clientContext.clientIp)}; Path=/; Max-Age=1800; SameSite=Lax`
    );
  }

  // ─── Analytics: fire listing_view (deduped per ip+listing within a window) ───
  if (clientContext.clientIp || clientContext.userAgent) {
    const dedupeKey = `${clientContext.clientIp || "anon"}:${id}`;
    const now = Date.now();
    const last = globalViewDedupe.get(dedupeKey);

    if (!last || now - last > SSR_ANALYTICS_DEDUPE_MS) {
      globalViewDedupe.set(dedupeKey, now);
      if (globalViewDedupe.size > 2000) {
        globalViewDedupe.delete(globalViewDedupe.keys().next().value);
      }

      fireSsrEvent(
        "listing_view",
        { listing_id: Number(id) },
        clientContext
      ).catch((err) => {
        // eslint-disable-next-line no-console
        console.warn(
          "[ssr] analytics ping failed:",
          err?.response?.status || err?.message || err
        );
      });
    }
  }

  // -------- Cache hit path --------
  const cached = getCached(id);

  if (cached) {
    const status = Number(cached.details?.status ?? 1);

    if (status === 4) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
      return {
        props: {
          unavailableReason: "removed",
          details: cached.details || {},
          images: [],
          videos: [],
          virtual_tours: [],
          properties: [],
          realstate: {},
          relateds: [],
          staleWarning: false,
        },
      };
    }

    if (status === 2) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
      return {
        props: {
          unavailableReason: "under_review",
          details: cached.details || {},
          images: [],
          videos: [],
          virtual_tours: [],
          properties: [],
          realstate: {},
          relateds: [],
          staleWarning: false,
        },
      };
    }

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.setHeader("X-Robots-Tag", "index, follow");
    res.setHeader("X-Content-Type-Options", "nosniff");

    return {
      props: {
        details: cached.details || {},
        images: cached.images || [],
        videos: cached.videos || [],
        virtual_tours: cached.virtual_tours || [],
        properties: cached.properties || [],
        realstate: cached.realstate || {},
        relateds: cached.relateds || [],
        unavailableReason: null,
        staleWarning: status === 5,
        __clientIp: clientContext.clientIp,   // ← passed to browser for click events
      },
    };
  }

  // -------- Cache miss path --------
  try {
    const data = await fetchPostWithRetry(id);

    if (!data?.details?.id || !data?.details?.name) {
      return { notFound: true };
    }

    setCached(id, data);

    const status = Number(data.details.status ?? 1);

    if (status === 4) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
      return {
        props: {
          unavailableReason: "removed",
          details: data.details || {},
          images: [],
          videos: [],
          virtual_tours: [],
          properties: [],
          realstate: {},
          relateds: [],
          staleWarning: false,
        },
      };
    }

    if (status === 2) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
      return {
        props: {
          unavailableReason: "under_review",
          details: data.details || {},
          images: [],
          videos: [],
          virtual_tours: [],
          properties: [],
          realstate: {},
          relateds: [],
          staleWarning: false,
        },
      };
    }

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.setHeader("X-Robots-Tag", "index, follow");
    res.setHeader("X-Content-Type-Options", "nosniff");

    return {
      props: {
        details: data.details || {},
        images: data.images || [],
        videos: data.videos || [],
        virtual_tours: data.virtual_tours || [],
        properties: data.properties || [],
        realstate: data.realstate || {},
        relateds: data.relateds || [],
        unavailableReason: null,
        staleWarning: status === 5,
        __clientIp: clientContext.clientIp,   // ← passed to browser for click events
      },
    };
  } catch (error) {
    console.error("Error fetching worker data:", error?.message || error);

    const status = error?.response?.status;

    // Real 404 — the listing truly doesn't exist.
    if (status === 404) {
      return { notFound: true };
    }

    // Transient failure (timeout, 5xx, network, rate limit) — do NOT
    // fake a 404. Serve a no-store error page that lets the user retry.
    res.setHeader("Cache-Control", "no-store, must-revalidate");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.setHeader("X-Content-Type-Options", "nosniff");

    return {
      props: {
        __transientError: true,
        details: {},
        images: [],
        videos: [],
        virtual_tours: [],
        properties: [],
        realstate: {},
        relateds: [],
        unavailableReason: null,
        staleWarning: false,
        __clientIp: clientContext.clientIp,
      },
    };
  }
}

export default React.memo(WorkerSingle);