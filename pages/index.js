import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import Head from "next/head";
import Script from "next/script";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";

import NeighborhoodCard from "../components/cards/neighborhood/NeighborhoodCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import CertificatesFooter from "../components/CertificatesFooter";
import { CityContext } from "../components/parts/CityContext";

// Optimized dynamic imports with better loading
const SearchDiv = dynamic(() => import("../components/others/SearchDiv"), {
  ssr: false,
  loading: () => <div className="search-skeleton" />,
});

const WorkerCard = dynamic(() => import("../components/cards/WorkerCard"), {
  ssr: false,
  loading: () => <div className="card-skeleton" />,
});

const RealStateSmalCard = dynamic(
  () => import("../components/cards/realestate/RealStateSmalCard"),
  {
    ssr: false,
    loading: () => <div className="card-skeleton" />,
  }
);

const DepartmentSmalCard = dynamic(
  () => import("../components/cards/department/DepartmentSmalCard"),
  {
    ssr: false,
    loading: () => <div className="card-skeleton" />,
  }
);

const CatCard = dynamic(() => import("../components/cards/CatCard"), {
  ssr: false,
  loading: () => <div className="card-skeleton" />,
});

const MainCatCard = dynamic(() => import("../components/cards/MainCatCard"), {
  ssr: false,
  loading: () => <div className="card-skeleton" />,
});

const FileRequest = dynamic(() => import("../components/request/FileRequest"), {
  ssr: false,
  loading: () => <div className="section-skeleton" />,
});

const CityChangeAlertDialog = dynamic(
  () => import("../components/dialogs/CityChangeAlertDialog"),
  {
    ssr: false,
  }
);

const FeaturesHub = dynamic(() => import("../components/accesshub"), {
  ssr: false,
  loading: () => <div className="hub-skeleton" />,
});

const BestSection = dynamic(() => import("../components/bestsection"), {
  ssr: false,
  loading: () => <div className="section-skeleton" />,
});

const Cards = dynamic(() => import("../components/Cards"), {
  ssr: false,
  loading: () => (
    <div className="max-w-7xl mx-auto my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-skeleton h-64" />
        ))}
      </div>
    </div>
  ),
});

const Download = dynamic(() => import("../components/Download"), {
  ssr: false,
  loading: () => <div className="section-skeleton h-40" />,
});

const DealButton = dynamic(() => import("../components/parts/DealButton"), {
  ssr: false,
  loading: () => <div className="button-skeleton h-24" />,
});

// Critical CSS inline
const criticalCSS = `
  /* Skeleton loaders */
  .search-skeleton,
  .card-skeleton,
  .section-skeleton,
  .hub-skeleton,
  .button-skeleton {
    background: linear-gradient(90deg, #f5f5f5 25%, #e8e8e8 50%, #f5f5f5 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    border-radius: 8px;
  }

  .search-skeleton {
    height: 56px;
    margin: 16px 0;
  }

  .card-skeleton {
    height: 280px;
    margin: 8px;
  }

  .section-skeleton {
    height: 200px;
    margin: 24px 0;
  }

  .hub-skeleton {
    height: 120px;
    margin: 24px 0;
  }

  .button-skeleton {
    height: 100px;
    margin: 8px;
  }

  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Performance optimizations */
  .above-the-fold {
    opacity: 0;
    animation: fade-in 0.3s ease forwards;
  }

  @keyframes fade-in {
    to { opacity: 1; }
  }
`;

function Home(props) {
  const neighborhoodSwiperRef = useRef(null);
  const router = useRouter();

  // Use CityContext for dynamic city data
  const { allCities, findCityBySlug, findCityByTitle } = useContext(CityContext);

  // City state from cookies and URL
  const [persianCity, setPersianCity] = useState("تهران");
  const [englishCity, setEnglishCity] = useState("tehran");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // City change modal state
  const [cityChangeModal, setCityChangeModal] = useState({
    show: false,
    currentCity: "",
    newCity: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cats, setCats] = useState([]);
  const [mainCats, setMainCats] = useState([]);
  const [subCats, setSubCats] = useState([]);
  const [realestates, setRealestates] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [title3, setTitle3] = useState("");
  const [collection1, setCollection1] = useState([]);
  const [collection2, setCollection2] = useState([]);
  const [collection3, setCollection3] = useState([]);
  const [theCity, setTheCity] = useState("");
  const [theNeighborhoods, setTheNeighborhoods] = useState([]);

  const [cityCategoryNeighborhoods, setCityCategoryNeighborhoods] = useState([]);

  const [favoriteWorkers, setFavoriteWorkers] = useState([]);
  const [historyWorkers, setHistoryWorkers] = useState([]);
  const [SpecialWorkers, setSpecialWorkers] = useState([]);
  const [UrgentWorkers, setUrgentWorkers] = useState([]);
  const [clickedAction, setClickedAction] = useState(null);
  const [showVpnDialog, setShowVpnDialog] = useState(false);

  // Helper function to get Persian city name from English slug using API data
  const getPersianCityFromEnglish = useCallback((citySlug) => {
    if (!citySlug) return "تهران";
    
    // Find city in API data by slug
    const city = findCityBySlug(citySlug);
    return city?.title || citySlug;
  }, [findCityBySlug]);

  // Helper function to get English city slug from Persian name using API data
  const getEnglishCityFromPersian = useCallback((persianCity) => {
    if (!persianCity) return "tehran";
    
    // Find city in API data by title
    const city = findCityByTitle(persianCity);
    return city?.slug || persianCity;
  }, [findCityByTitle]);

  // Utility function to get city from path
  const getCityFromPath = useCallback(() => {
    const path = router.asPath.split('?')[0]; // Remove query params
    if (path === "/" || path === "") return null;
    // Remove leading slash and decode
    const cityFromPath = decodeURIComponent(path.substring(1));
    return cityFromPath || null;
  }, [router.asPath]);

  // Initialize city from URL and cookies
  useEffect(() => {
    const urlCity = getCityFromPath();
    const cookieCity = Cookies.get("city");
    const cookiePersianCity = Cookies.get("persian_city");

    console.log("Initialization - URL City:", urlCity);
    console.log("Initialization - Cookie City:", cookieCity);

    // Case 1: No URL city (root path)
    if (!urlCity) {
      if (cookieCity) {
        // Use cookie city - get Persian name from API
        const persianName = cookiePersianCity || getPersianCityFromEnglish(cookieCity);
        setEnglishCity(cookieCity);
        setPersianCity(persianName);
        // Redirect to city URL if needed
        if (router.asPath === "/") {
          router.push(`/${cookieCity}`, undefined, { shallow: true });
        }
      }
      // If no cookie, keep default (tehran)
      setIsInitialized(true);
      return;
    }

    // Case 2: URL has a city
    // Update state with URL city
    const persianName = getPersianCityFromEnglish(urlCity);
    setEnglishCity(urlCity);
    setPersianCity(persianName);

    // Update cookie if different
    if (cookieCity !== urlCity) {
      Cookies.set("city", urlCity, { expires: 365, path: "/" });
      Cookies.set("persian_city", persianName, { expires: 365, path: "/" });
      console.log("Updated cookies with URL city:", urlCity);
    }

    setIsInitialized(true);
  }, [router.asPath, getCityFromPath, getPersianCityFromEnglish]);

  // Handle city change detection (when URL changes but we're already on a city page)
  useEffect(() => {
    if (!isInitialized) return;

    const urlCity = getCityFromPath();
    if (!urlCity) return;

    const cookieCity = Cookies.get("city");

    // If URL city is different from current state, update state
    if (urlCity !== englishCity) {
      console.log("URL city changed to:", urlCity);
      const persianName = getPersianCityFromEnglish(urlCity);
      setEnglishCity(urlCity);
      setPersianCity(persianName);

      // Update cookies
      Cookies.set("city", urlCity, { expires: 365, path: "/" });
      Cookies.set("persian_city", persianName, { expires: 365, path: "/" });

      // Show modal if cookie exists and is different
      if (cookieCity && cookieCity !== urlCity) {
        setCityChangeModal({
          show: true,
          currentCity: cookieCity,
          newCity: urlCity,
        });
      }
    }
  }, [router.asPath, englishCity, isInitialized, getCityFromPath, getPersianCityFromEnglish]);

  // Handle city change confirmation
  const handleCityChangeConfirm = useCallback(() => {
    const newCity = cityChangeModal.newCity;
    const persianName = getPersianCityFromEnglish(newCity);

    Cookies.set("city", newCity, { expires: 365, path: "/" });
    Cookies.set("persian_city", persianName, { expires: 365, path: "/" });

    setEnglishCity(newCity);
    setPersianCity(persianName);
    setCityChangeModal({ show: false, currentCity: "", newCity: "" });

    // Reload to fetch new data
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, [cityChangeModal, getPersianCityFromEnglish]);

  // Handle city change cancellation
  const handleCityChangeCancel = useCallback(() => {
    const currentCity = cityChangeModal.currentCity;
    router.push(`/${currentCity}`, undefined, { shallow: true });
    setCityChangeModal({ show: false, currentCity: "", newCity: "" });
  }, [cityChangeModal, router]);

  // ✅ SEO-safe city values for bots - ALWAYS use Persian name for display
  const seoEnglishCity = props?.url_city || englishCity || "tehran";
  const seoPersianCity = props?.url_persian_city || persianCity || "تهران";

  // SEO Data - Use Persian city name in title and description
  const seoData = {
    title: `مشاور املاک هوشمند آجر | خرید فروش و اجاره ملک در ${seoPersianCity}`,
    description: `آجر، مشاور املاک هوشمند در ${seoPersianCity}. خرید، فروش و اجاره آپارتمان، خانه ویلایی، مغازه، دفتر کار و زمین در ${seoPersianCity} و سراسر ایران. بیش از ۱۰۰۰۰ آگهی فعال ملک با بهترین قیمت. مشاوره رایگان تخصصی.`,
    keywords: `مشاور املاک, خرید خانه, فروش آپارتمان, اجاره ملک, آجر, ${seoPersianCity}, املاک ${seoPersianCity}, خرید ملک در ${seoPersianCity}, فروش ملک در ${seoPersianCity}`,
    canonical: `https://ajur.app/${seoEnglishCity}`,
    image: "https://ajur.app/logo/ajour-meta-image.jpg",
    imageWidth: "1080",
    imageHeight: "702",
    siteName: "آجر - مشاور املاک هوشمند",
    twitterHandle: "@ajur_app",
  };

  const homepageCardsFeatures = [
    {
      id: 1,
      title: "خرید",
      description: "آگهی‌های خرید ملک، خانه و آپارتمان",
      illustration: "/img/card1.png",
      action: "مشاهده آگهی‌ها",
      onClick: () => {
        selectAction("buy");
      },
    },
    {
      id: 2,
      title: "ثبت آگهی",
      description: "ملک خود را برای فروش یا اجاره در آجر ثبت کنید",
      illustration: "/img/card2.png",
      action: "ثبت آگهی",

      onClick: () => {
        setLoading(true);

        const token = Cookies.get("id_token");
        if (token) {
          router.push("/panel/new");
        } else {
          router.push("/panel/auth/login");
          Cookies.set("destination_before_auth", "/panel/new", { expires: 14 });
          setLoading(false);
        }
      },
    },

    {
      id: 3,
      title: "اجاره",
      description: "آگهی‌های اجاره مسکونی، تجاری و اداری",
      illustration: "/img/card3.png",
      action: "مشاهده آگهی‌ها",
      onClick: () => selectAction("rent"),
    },
  ];

  // Simplified visibility control
  const selectAction = useCallback((type) => {
    setClickedAction(type);
  }, []);

  const clearAction = useCallback(() => {
    setClickedAction(null);
  }, []);

  // Simple cookie utility (unchanged)
  const cookieUtils = {
    get: (name) => {
      if (typeof window === "undefined") return null;
      return Cookies.get(name) || null;
    },
    set: (name, value, days = 365) => {
      if (typeof window === "undefined") return;
      Cookies.set(name, value, { expires: days, path: "/" });
    },
  };

  // Main data fetching effect
  useEffect(() => {
    if (!isInitialized) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.error("Loading timeout - showing error state");
        setLoading(false);
        setError(true);
      }
    }, 20000);

    const selectedCity = englishCity;

    const fetchData = async () => {
      try {
        // Check if we have data from server props
        if (props.initialData && props.initialData !== null) {
          console.log("Using server props data for city:", selectedCity);
          setDataFromCache(props.initialData);
          setLoading(false);
          clearTimeout(timeoutId);
          return;
        }

        const cacheKey = `homeData_${selectedCity}`;
        const cachedData = sessionStorage.getItem(cacheKey);

        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
            console.log("Using cached data");
            setDataFromCache(parsed.data);
            setLoading(false);
            clearTimeout(timeoutId);
            return;
          }
        }

        const apiUrl = `https://api.ajur.app/api/base?city=${selectedCity}`;
        console.log(`Fetching from API: ${apiUrl}`);

        const response = await fetch(apiUrl, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error(
            "Server returned non-JSON response:",
            text.substring(0, 200)
          );
          throw new Error(
            `Server returned HTML instead of JSON. Status: ${response.status}`
          );
        }

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API data received:", data);

        const cacheData = {
          timestamp: Date.now(),
          data: data,
        };
        sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));

        setDataFromCache(data);
        setLoading(false);
        clearTimeout(timeoutId);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("API request failed:", error);

        const cacheKey = `homeData_${selectedCity}`;
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            setDataFromCache(parsed.data);
            setLoading(false);
          } catch (cacheError) {
            console.error("Cache parse error:", cacheError);
            setLoading(false);
            setError(true);
          }
        } else {
          setLoading(false);
          setError(true);
        }

        clearTimeout(timeoutId);
      }
    };

    const setDataFromCache = (data) => {
      setCats(data.cats || []);
      setTheCity(data.the_city || "");
      setTheNeighborhoods(data.the_neighborhoods || []);
      setMainCats(data.main_cats || []);
      setSubCats(data.sub_cats || []);
      setRealestates(data.realstates || []);
      setDepartments(data.departments || []);
      setTitle1(data.title1 || "");
      setTitle2(data.title2 || "");
      setTitle3(data.title3 || "");
      setCollection1(data.collection1 || []);
      setCollection2(data.collection2 || []);
      setCollection3(data.collection3 || []);
      setSpecialWorkers(data.the_city_specials || []);
      setUrgentWorkers(data.the_city_urgents || []);
      setCityCategoryNeighborhoods(data.the_city_category_neighborhoods || []);
    };

    fetchData();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [englishCity, props.initialData, isInitialized, loading]);

  // VPN detection (unchanged)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (cookieUtils.get("hide_vpn_warning")) {
      return;
    }

    const detectVpn = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const res = await fetch("https://ipapi.co/json/", {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) return;

        const contentType = res.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          return;
        }

        const data = await res.json();

        const org = (data.org || data.asn || "").toString().toLowerCase();
        const vpnKeywords = [
          "vpn",
          "proxy",
          "expressvpn",
          "nordvpn",
          "surfshark",
        ];

        for (const k of vpnKeywords) {
          if (org.includes(k)) {
            setShowVpnDialog(true);
            return;
          }
        }
      } catch (e) {
        // Silent fail
      }
    };

    detectVpn();
  }, []);

  const renderDefaultCity = useCallback(() => {
    return englishCity;
  }, [englishCity]);

  // Optimized loading spinner
  const renderSpinner = () => (
    <div
      className="spinnerImageView"
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "400px",
          height: "400px",
          marginBottom: "20px",
        }}
      >
        <Image
          src="/logo/ajour-gif.gif"
          alt="در حال بارگذاری"
          fill
          sizes="400px"
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
    </div>
  );

  // Optimized error state
  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-4">
          <svg
            className="w-10 h-10"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="5" y="9" width="3" height="6" rx="0.5" fill="#B45309" />
            <rect
              x="5.5"
              y="9.5"
              width="2"
              height="5"
              rx="0.3"
              fill="#F59E0B"
            />
            <rect x="16" y="9" width="3" height="6" rx="0.5" fill="#B45309" />
            <rect
              x="16.5"
              y="9.5"
              width="2"
              height="5"
              rx="0.3"
              fill="#F59E0B"
            />
            <circle cx="6.5" cy="10.5" r="0.6" fill="#7C2D12" />
            <circle cx="6.5" cy="12" r="0.6" fill="#7C2D12" />
            <circle cx="6.5" cy="13.5" r="0.6" fill="#7C2D12" />
            <circle cx="17.5" cy="10.5" r="0.6" fill="#7C2D12" />
            <circle cx="17.5" cy="12" r="0.6" fill="#7C2D12" />
            <circle cx="17.5" cy="13.5" r="0.6" fill="#7C2D12" />
            <line
              x1="8"
              y1="9"
              x2="16"
              y2="9"
              stroke="#92400E"
              strokeWidth="0.8"
            />
            <line
              x1="8"
              y1="15"
              x2="16"
              y2="15"
              stroke="#92400E"
              strokeWidth="0.8"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          مشکلی در بارگذاری داده‌ها پیش آمده است
        </h2>
        <p className="text-gray-600 max-w-md">
          متأسفانه در دریافت اطلاعات از سرور مشکل ایجاد شده است. لطفاً اتصال
          اینترنت خود را بررسی کرده و دوباره تلاش کنید.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#b92a31] text-white rounded-lg font-medium hover:bg-[#a0252c] transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          تلاش مجدد
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 border border-gray-300 flex items-center justify-center gap-2"
        >
          بازگشت
        </button>
      </div>
    </div>
  );

  // Render functions
  const renderWorkerSlider = useCallback((workers) => {
    if (!workers.length) return null;

    return workers.map((worker) => (
      <div key={worker.id} style={{ minWidth: "250px", margin: "0 10px" }}>
        <Link href={`/worker/${worker.id}?slug=${worker.slug}`}>
          <WorkerCard worker={worker} />
        </Link>
      </div>
    ));
  }, []);

  const renderSpecialSlider = useCallback((workers) => {
    if (!workers.length) return null;

    return workers.map((worker) => (
      <Grid item xs={12} md={4} key={worker.id}>
        <a href={`/worker/${worker.id}?slug=${worker.slug}`}>
          <WorkerCard worker={worker} />
        </a>
      </Grid>
    ));
  }, []);

  const renderUrgentSlider = useCallback((workers) => {
    if (!workers.length) return null;

    return workers.map((worker) => (
      <div key={worker.id} style={{ minWidth: "250px", margin: "0 10px" }}>
        <Link href={`/worker/${worker.id}?slug=${worker.slug}`}>
          <WorkerCard worker={worker} />
        </Link>
      </div>
    ));
  }, []);

  const renderHistoryWorkers = useCallback(() => {
    if (historyWorkers.length === 0) return null;

    return (
      <div style={{ paddingBottom: 10 }}>
        <div className={styles["title"]}>
          <h2 onClick={() => router.push("/recents")}>آخرین بازدید های شما</h2>
        </div>
        <div style={{ display: "flex", overflowX: "auto", padding: "10px 0" }}>
          {renderWorkerSlider(historyWorkers)}
        </div>
      </div>
    );
  }, [historyWorkers, renderWorkerSlider, router]);

  const renderFavoriteWorkers = useCallback(() => {
    if (favoriteWorkers.length === 0) return null;

    return (
      <div style={{ paddingBottom: 20 }}>
        <div className={styles["title"]}>
          <h2 onClick={() => router.push("/favorites")}>
            آخرین مورد پسند های شما
          </h2>
        </div>
        <div style={{ display: "flex", overflowX: "auto", padding: "10px 0" }}>
          {renderWorkerSlider(favoriteWorkers)}
        </div>
      </div>
    );
  }, [favoriteWorkers, renderWorkerSlider, router]);

  const renderSpecialWorkers = useCallback(() => {
    if (SpecialWorkers.length === 0) return null;

    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <div className={styles["title"]}>
          <h2>فروش ویژه در {persianCity}</h2>
        </div>

        <Grid container spacing={2}>
          {SpecialWorkers.map((worker) => (
            <Grid item xs={12} md={4} key={worker.id}>
              <a href={`/worker/${worker.id}?slug=${worker.slug}`}>
                <WorkerCard worker={worker} />
              </a>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }, [SpecialWorkers, persianCity, router]);

  const renderUrgentWorkers = useCallback(() => {
    if (UrgentWorkers.length === 0) return null;

    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <div className={styles["title"]}>
          <h2>فروش فوری در {persianCity}</h2>
        </div>

        <Grid container spacing={2}>
          {UrgentWorkers.map((worker) => (
            <Grid item xs={12} md={4} key={worker.id}>
              <a href={`/worker/${worker.id}?slug=${worker.slug}`}>
                <WorkerCard worker={worker} />
              </a>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }, [UrgentWorkers, persianCity]);

  const renderNeighborhoodSwiper = useCallback(() => {
    if (!theNeighborhoods || theNeighborhoods.length === 0) return null;

    const goNext = () => {
      neighborhoodSwiperRef.current?.slideNext();
    };

    const goPrevious = () => {
      neighborhoodSwiperRef.current?.slidePrev();
    };

    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <div className={styles.title}>
          <Link href={`/neighborhoods/${englishCity}`} className={styles.titleLink}>
            <h2>محله‌های {persianCity}</h2>
          </Link>
        </div>

        <Box
          sx={{
            position: "relative",
            direction: "ltr",
            px: {
              xs: 0,
              md: 5,
            },
          }}
        >
          {/* Previous / left button */}
          <IconButton
            aria-label="محله قبلی"
            onClick={goPrevious}
            sx={{
              position: "absolute",
              left: {
                xs: -10,
                md: 0,
              },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 5,
              width: 42,
              height: 42,
              bgcolor: "rgba(20, 20, 20, 0.72)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
              "&:hover": {
                bgcolor: "#7a1f2b",
              },
            }}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>

          {/* Next / right button */}
          <IconButton
            aria-label="محله بعدی"
            onClick={goNext}
            sx={{
              position: "absolute",
              right: {
                xs: -10,
                md: 0,
              },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 5,
              width: 42,
              height: 42,
              bgcolor: "rgba(20, 20, 20, 0.72)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
              "&:hover": {
                bgcolor: "#7a1f2b",
              },
            }}
          >
            <KeyboardArrowRightIcon />
          </IconButton>

          <Swiper
            modules={[FreeMode]}
            onSwiper={(swiper) => {
              neighborhoodSwiperRef.current = swiper;
            }}
            freeMode={{
              enabled: true,
              momentum: true,
            }}
            grabCursor={true}
            slidesPerView="auto"
            spaceBetween={16}
            style={{
              padding: "10px 4px",
            }}
          >
            {theNeighborhoods.map((item) => {
              const slug = item.eng_name || item.slug || item.id;
              const detailUrl = `/neighborhoods/${englishCity}/${slug}`;

              return (
                <SwiperSlide
                  key={slug}
                  style={{
                    width: "280px",
                    direction: "rtl",
                  }}
                >
                  <NeighborhoodCard neighborhood={item} href={detailUrl} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Box>
      </Container>
    );
  }, [theNeighborhoods, persianCity, englishCity]);

  // ----------------------
  // ✅ Structured Data (Schema) - improved with proper Persian city names
  // ----------------------

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "آجر چیست؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: `آجر یک مشاور املاک هوشمند است که به شما در خرید، فروش و اجاره ملک در ${seoPersianCity} و سراسر ایران کمک می‌کند. با بیش از ۱۰۰۰۰ آگهی فعال، می‌توانید بهترین ملک را با مناسب‌ترین قیمت پیدا کنید.`,
        },
      },
      {
        "@type": "Question",
        name: `چگونه می‌توانم در ${seoPersianCity} آگهی ثبت کنم؟`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "برای ثبت آگهی در آجر، کافی است روی دکمه 'ثبت آگهی' کلیک کرده و اطلاعات ملک خود را وارد کنید. آگهی شما پس از بررسی توسط کارشناسان، در سایت نمایش داده می‌شود.",
        },
      },
      {
        "@type": "Question",
        name: "آیا آجر رایگان است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "بله، مشاهده آگهی‌ها در آجر کاملاً رایگان است. همچنین ثبت آگهی برای کاربران عادی رایگان بوده و فقط برای مشاوران املاک حرفه‌ای دارای طرح‌های ویژه است.",
        },
      },
      {
        "@type": "Question",
        name: `بهترین محله‌های ${seoPersianCity} برای خرید ملک کجاست؟`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `در ${seoPersianCity} محله‌های مختلفی برای خرید ملک وجود دارد. با استفاده از آجر می‌توانید آگهی‌های تمام محله‌ها را مشاهده و مقایسه کنید.`,
        },
      },
    ],
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `https://ajur.app/#website`,
    name: seoData.siteName,
    url: "https://ajur.app",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://ajur.app/search?q={search_term_string}&city=${seoEnglishCity}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "آجر",
    url: "https://ajur.app",
    logo: "https://ajur.app/logo/ajur.png",
    sameAs: [
      "https://twitter.com/ajur_app",
      "https://www.instagram.com/ajur.app",
      "https://www.linkedin.com/company/ajur",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+98-938-274-0488",
      contactType: "customer service",
      availableLanguage: ["Persian", "English"],
      areaServed: "IR",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IR",
    },
  };

  // LocalBusiness Schema - Use Persian city name
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: `آجر - مشاور املاک ${seoPersianCity}`,
    image: seoData.image,
    "@id": `${seoData.canonical}#realestateagent`,
    url: seoData.canonical,
    telephone: "+98-938-274-0488",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: seoPersianCity,
      addressCountry: "IR",
    },
    areaServed: {
      "@type": "City",
      name: seoPersianCity,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    sameAs: ["https://twitter.com/ajur_app", "https://www.instagram.com/ajur.app"],
  };

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${seoData.canonical}#webpage`,
    url: seoData.canonical,
    name: seoData.title,
    description: seoData.description,
    inLanguage: "fa-IR",
    isPartOf: { "@id": `https://ajur.app/#website` },
    about: {
      "@type": "Place",
      name: seoPersianCity,
    },
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "آجر", item: "https://ajur.app" },
      {
        "@type": "ListItem",
        position: 2,
        name: `املاک ${seoPersianCity}`,
        item: seoData.canonical,
      },
    ],
  };

  const renderCityNeighborhoodSections = useCallback(() => {
    if (!cityCategoryNeighborhoods || cityCategoryNeighborhoods.length === 0)
      return null;

    // group by category
    const grouped = {};

    cityCategoryNeighborhoods.forEach((item) => {
      if (!grouped[item.cat_slug]) {
        grouped[item.cat_slug] = {
          name: item.cat_name,
          items: [],
        };
      }

      grouped[item.cat_slug].items.push(item);
    });

    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {Object.entries(grouped).map(([catSlug, catData]) => (
          <div key={catSlug} style={{ marginBottom: "40px" }}>
            <div className={styles["title"]}>
              <h2>
                <Link href={`/${englishCity}/${catSlug}`}>
                  {catData.name} در محله‌های {persianCity}
                </Link>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
              {catData.items.slice(0, 12).map((item) => (
                <Link
                  key={`${item.cat_slug}-${item.neighborhood_slug}`}
                  href={`/${item.city_slug}/${item.cat_slug}/${item.neighborhood_slug}`}
                  className="block border rounded-lg p-3 text-center hover:bg-gray-50 transition"
                >
                  {item.cat_name} در {item.neighborhood_name} {item.city_name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </Container>
    );
  }, [cityCategoryNeighborhoods, persianCity, englishCity]);

  // Main content render
  const renderContent = () => (
    <div className="above-the-fold">
      <main className={styles["main"]}>
        <div className={`max-w-7xl mx-auto text-center ${styles.sectionSpacing}`}>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
            <span style={{ color: "#b92a31" }}>آجر</span>، مشاور املاک هوشمند در{" "}
            {persianCity}
          </h1>
        </div>

        <div className={styles.sectionSpacing}>
          <Cards features={homepageCardsFeatures} />
        </div>

        {renderSpecialWorkers()}
        {renderUrgentWorkers()}
        {renderNeighborhoodSwiper()}
        {renderCityNeighborhoodSections()}

        <div className="w-full flex justify-center items-center my-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              خدمات آجر در {persianCity}
            </h2>
          </div>
        </div>

        <div className={styles.sectionSpacing}>
          <FeaturesHub />
        </div>

        <div className="w-full flex justify-center items-center my-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              بهترین‌های آجر در {persianCity}
            </h2>
          </div>
        </div>

        <div className={styles.sectionSpacing}>
          <BestSection englishCity={englishCity} />
        </div>

        <div className={styles.sectionSpacing}>
          <FileRequest
            onCallClick={() => (window.location.href = "tel:+989382740488")}
            onActionClick={() => router.push("/file-request")}
          />
        </div>

        <div className={styles.sectionSpacing}>
          <Download />
          <CertificatesFooter />
        </div>

        {(clickedAction === "buy" || clickedAction === "rent") && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="sticky top-0 mt-5 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between shadow-sm z-10">
              <button
                onClick={clearAction}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                aria-label="بازگشت"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 12 H8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9 7 L4 12 L9 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="mr-2 text-sm font-medium">بازگشت</span>
              </button>

              <div className="text-xl font-bold text-gray-900">
                {clickedAction === "buy"
                  ? "دسته‌بندی‌های خرید"
                  : "دسته‌بندی‌های اجاره"}
              </div>

              <button
                onClick={clearAction}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="بستن"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="p-2 md:p-4 lg:p-6">
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 md:gap-4 max-w-6xl mx-auto px-3 md:px-6">
                {subCats
                  .filter((c) =>
                    clickedAction === "buy" ? c.type === "sell" : c.type === "rent"
                  )
                  .map((cat, idx) => (
                    <div key={cat.id} className="aspect-square">
                      <DealButton
                        title={cat.name}
                        src={`/cats_image/sub-cats/${cat.id}.png`}
                        onClick={() => {
                          setIsNavigating(true);
                          router.push(`/${englishCity}/${encodeURIComponent(cat.eng_name)}`);
                        }}
                        style={{ animationDelay: `${idx * 70}ms` }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );

  // Only render when initialized
  if (!isInitialized) {
    return renderSpinner();
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
        <meta httpEquiv="Content-Language" content="fa" />
        <meta name="language" content="fa" />

        {/* Preload critical resources */}
        <link rel="preload" href="/logo/ajour-gif.gif" as="image" />
        <link rel="preconnect" href="https://api.ajur.app" />
        <link rel="dns-prefetch" href="https://api.ajur.app" />

        {/* Critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />

        {/* SEO Meta Tags */}
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="author" content="آجر" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1"
        />
        <meta
          name="googlebot"
          content="index, follow, max-image-preview:large, max-snippet:-1"
        />

        {/* Canonical URL - This is critical for SEO */}
        <link rel="canonical" href={seoData.canonical} />

        {/* Alternate language versions */}
        <link rel="alternate" href={`https://ajur.app/${seoEnglishCity}`} hrefLang="fa-IR" />
        <link rel="alternate" href={`https://ajur.app/${seoEnglishCity}`} hrefLang="x-default" />

        {/* Open Graph */}
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:site_name" content={seoData.siteName} />
        <meta property="og:image" content={seoData.image} />
        <meta property="og:image:width" content={seoData.imageWidth} />
        <meta property="og:image:height" content={seoData.imageHeight} />
        <meta
          property="og:image:alt"
          content={`آجر - مشاور املاک ${seoPersianCity}`}
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={seoData.twitterHandle} />
        <meta name="twitter:creator" content={seoData.twitterHandle} />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.image} />

        {/* Geo tags */}
        <meta name="geo.region" content="IR" />
        <meta name="geo.placename" content={seoPersianCity} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* PWA */}
        <meta name="theme-color" content="#b92a31" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Verification */}
        <meta name="ir-site-verification-token" content="ajur-verification" />
      </Head>

      {/* Structured Data - JSON-LD */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Script
        id="website-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <Script
        id="webpage-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Script
        id="organization-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <Script
        id="local-business-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className={styles.container}>
        <CityChangeAlertDialog
          open={cityChangeModal.show}
          onClose={handleCityChangeCancel}
          onConfirm={handleCityChangeConfirm}
          currentCity={cityChangeModal.currentCity}
          newCity={cityChangeModal.newCity}
        />

        {showVpnDialog && (
          <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="mr-3">
                <h3 className="text-sm font-medium text-gray-900">توجه</h3>
                <p className="mt-1 text-sm text-gray-600">
                  برای استفاده بهتر از آجر، لطفاً فیلترشکن خود را خاموش کنید
                </p>
              </div>
              <button
                onClick={() => {
                  cookieUtils.set("hide_vpn_warning", "1", 1);
                  setShowVpnDialog(false);
                }}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {(loading || isNavigating) && renderSpinner()}
        {error && !loading && !isNavigating && renderError()}
        {!loading && !error && !isNavigating && renderContent()}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;

  // Get city from URL - using the actual URL path
  let city = "tehran";
  const path = req.url || "";
  const pathParts = path.split('?')[0].split('/');

  // Check if the path has a city segment (not empty and not the root)
  if (pathParts.length > 1 && pathParts[1] !== "") {
    city = decodeURIComponent(pathParts[1]);
  }

  console.log("----------------- Homepage SSR - City from URL:", city);
  console.log("----------------- Full URL:", req.url);

  // Cache for 5 minutes on CDN
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

  try {
    // First, fetch all cities to validate and get Persian name
    const citiesResponse = await fetch('https://api.ajur.app/api/search-cities', {
      headers: {
        Accept: "application/json",
        "User-Agent": req.headers["user-agent"] || "Ajur-SSR",
      },
    });

    let url_persian_city = city; // fallback to the slug
    
    if (citiesResponse.ok) {
      const citiesData = await citiesResponse.json();
      const cityData = citiesData.items?.find(c => c.slug === city);
      
      if (cityData) {
        url_persian_city = cityData.title;
        console.log(`Found Persian name for city ${city}: ${url_persian_city}`);
      } else {
        console.warn(`City "${city}" not found in API, using fallback`);
        // If city not found, you might want to redirect to default
        // return {
        //   redirect: {
        //     destination: '/tehran',
        //     permanent: false,
        //   },
        // };
      }
    }

    // Fetch main data
    const apiUrl = `https://api.ajur.app/api/base?city=${city}`;
    console.log("Fetching from:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": req.headers["user-agent"] || "Ajur-SSR",
      },
    });

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return {
        props: {
          url_city: city,
          url_persian_city,
          initialData: null,
          error: true,
        },
      };
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      console.error("API returned non-JSON response");
      return {
        props: {
          url_city: city,
          url_persian_city,
          initialData: null,
          error: true,
        },
      };
    }

    const data = await response.json();
    console.log("API data received successfully");

    return {
      props: {
        url_city: city,
        url_persian_city,
        initialData: data || null,
      },
    };
  } catch (error) {
    console.error("Server-side API error:", error);
    return {
      props: {
        url_city: city,
        url_persian_city: city,
        initialData: null,
        error: true,
      },
    };
  }
}

export default Home;