import React, { useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import SmallCard from "../../components/cards/SmallCard";

const API_URL = "https://api.ajur.app/api/city-agents-search";
const SITE_URL = "https://ajur.app";
const DEFAULT_IMAGE = `${SITE_URL}/logo/ajour-meta-image.jpg`;

const SEARCH_TIMEOUT = 15000;
const DEBOUNCE_DELAY = 1000;
const INITIAL_AGENTS_LIMIT = 50;

/**
 * Convert API data into plain JSON-safe data for Next.js props.
 */
const makeSerializable = (value) =>
  JSON.parse(JSON.stringify(value ?? null));

/**
 * Encode a single URL path segment safely.
 */
const encodePathSegment = (value) =>
  encodeURIComponent(String(value || "").trim());

const RealStateIndex = ({
  citySlug,
  initialCity,
  initialAgents,
  initialServerError,
}) => {
  /*
   * Because the page receives citySlug through getServerSideProps,
   * it is available during the first render.
   *
   * We no longer need router.query.citySlug, so canonical and metadata
   * will not initially render with missing or incomplete values.
   */
  const [city, setCity] = useState(initialCity || null);
  const [agents, setAgents] = useState(initialAgents || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingAgents, setLoadingAgents] = useState(false);

  const [searchStatus, setSearchStatus] = useState(() => {
    if (initialServerError) {
      return "در حال حاضر دریافت اطلاعات این صفحه امکان‌پذیر نیست.";
    }

    return `${initialAgents?.length || 0} مشاور یافت شد`;
  });

  /*
   * pageAvailable controls the robots metadata.
   *
   * A normal search error must not change the page to noindex.
   * It only becomes false when the initial SSR request failed.
   */
  const [pageAvailable, setPageAvailable] = useState(
    !initialServerError && Boolean(initialCity)
  );

  const debounceTimeoutRef = useRef(null);
  const activeRequestRef = useRef(null);
  const requestIdRef = useRef(0);

  /*
   * Only the Persian API title is used in visible content, metadata
   * and structured data.
   *
   * The English slug is used only in URLs.
   */
  const titleCity =
    typeof city?.title === "string" ? city.title.trim() : "";

  const encodedCitySlug = useMemo(
    () => encodePathSegment(citySlug),
    [citySlug]
  );

  const canonical = useMemo(
    () => `${SITE_URL}/agents/${encodedCitySlug}`,
    [encodedCitySlug]
  );

  const seoData = useMemo(() => {
    if (!titleCity) {
      return {
        title: "لیست مشاورین املاک | آجر",
        description:
          "جستجو و مشاهده لیست مشاورین املاک فعال در سامانه املاک آجر.",
        canonical,
        image: DEFAULT_IMAGE,
      };
    }

    return {
      title: `مشاور املاک ${titleCity} | لیست مشاورین فعال | آجر`,
      description: `لیست مشاورین املاک ${titleCity} را در آجر مشاهده کنید. اطلاعات مشاوران و دفاتر املاک فعال در ${titleCity} را بررسی و مشاور موردنظر خود را پیدا کنید.`,
      canonical,
      image: DEFAULT_IMAGE,
    };
  }, [titleCity, canonical]);

  /*
   * A city page remains indexable even when agents.length is zero.
   *
   * Indexability depends on:
   * 1. The city being valid.
   * 2. The Persian city data being available.
   * 3. The initial SSR request not having failed.
   */
  const shouldIndexPage = pageAvailable && Boolean(titleCity);

  const robotsContent = shouldIndexPage
    ? "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
    : "noindex,follow";

  /*
   * Search agents on the client.
   *
   * The initial page load does not call this function automatically,
   * because initialCity and initialAgents are already server-rendered.
   */
  const getAgentsCall = async (searchTerm = "all") => {
    if (!citySlug) return;

    /*
     * Cancel the previous request. This prevents an older search response
     * from replacing a newer search response.
     */
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }

    const controller = new AbortController();
    activeRequestRef.current = controller;

    const currentRequestId = ++requestIdRef.current;

    try {
      setLoadingAgents(true);

      setSearchStatus(
        searchTerm === "all"
          ? "در حال دریافت لیست مشاورین..."
          : "در حال جستجوی مشاورین..."
      );

      const response = await axios.get(API_URL, {
        params: {
          title: searchTerm,
          limit: INITIAL_AGENTS_LIMIT,
          city: citySlug,
        },
        timeout: SEARCH_TIMEOUT,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      /*
       * Ignore the response if a newer request has already started.
       */
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      const result = Array.isArray(response.data?.agents)
        ? response.data.agents
        : [];

      const cityData = response.data?.city || null;

      setAgents(result);

      /*
       * Normally the city is already available from SSR.
       * Updating it here also allows recovery after a temporary SSR error.
       */
      if (cityData?.title) {
        setCity(cityData);
        setPageAvailable(true);
      }

      if (searchTerm === "all") {
        setSearchStatus(`${result.length} مشاور یافت شد`);
      } else {
        setSearchStatus(
          result.length > 0
            ? `${result.length} مشاور برای «${searchTerm}» یافت شد`
            : `هیچ مشاوری برای «${searchTerm}» یافت نشد`
        );
      }
    } catch (error) {
      const requestWasCanceled =
        error?.code === "ERR_CANCELED" ||
        error?.name === "CanceledError" ||
        axios.isCancel?.(error);

      if (requestWasCanceled) {
        return;
      }

      console.error("Agent search failed:", error);

      /*
       * Do not clear the current list after a temporary search failure.
       * Keeping the existing SSR results is better for users.
       */
      setSearchStatus(
        "جستجو با خطا مواجه شد. لطفاً دوباره تلاش کنید."
      );
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoadingAgents(false);
        activeRequestRef.current = null;
      }
    }
  };

  /*
   * Clear timers and cancel active requests when leaving the page.
   */
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
  }, []);

  const handleSearchInput = (value) => {
    setSearchQuery(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const normalizedSearchTerm = value.trim();
      getAgentsCall(normalizedSearchTerm || "all");
    }, DEBOUNCE_DELAY);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    const normalizedSearchTerm = searchQuery.trim();
    getAgentsCall(normalizedSearchTerm || "all");
  };

  const handleRetry = () => {
    getAgentsCall("all");
  };

  /*
   * Create stable structured data only when a valid Persian city name
   * is available.
   */
  const jsonLd = useMemo(() => {
    if (!titleCity || !pageAvailable) {
      return null;
    }

    const itemListElements = agents
      .slice(0, INITIAL_AGENTS_LIMIT)
      .map((agent, index) => {
        const fullName = [agent?.name, agent?.family]
          .filter(Boolean)
          .join(" ")
          .trim();

        const agentName =
          fullName ||
          agent?.realstate ||
          agent?.title ||
          "مشاور املاک";

        const agentSlug = agent?.slug
          ? encodePathSegment(agent.slug)
          : "";

        return {
          "@type": "ListItem",
          position: index + 1,
          name: agentName,
          ...(agentSlug
            ? {
                url: `${SITE_URL}/real-estate/${agentSlug}`,
              }
            : {}),
        };
      });

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${seoData.canonical}#collectionpage`,
          url: seoData.canonical,
          name: `لیست مشاورین املاک ${titleCity}`,
          headline: `مشاور املاک ${titleCity}`,
          description: seoData.description,
          image: seoData.image,
          inLanguage: "fa-IR",

          isPartOf: {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: "آجر",
            inLanguage: "fa-IR",
          },

          about: {
            "@type": "Place",
            name: titleCity,
            address: {
              "@type": "PostalAddress",
              addressLocality: titleCity,
              addressCountry: "IR",
            },
          },

          breadcrumb: {
            "@id": `${seoData.canonical}#breadcrumb`,
          },

          mainEntity: {
            "@type": "ItemList",
            name: `لیست مشاورین املاک ${titleCity}`,
            numberOfItems: itemListElements.length,
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            itemListElement: itemListElements,
          },
        },

        {
          "@type": "BreadcrumbList",
          "@id": `${seoData.canonical}#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "آجر",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "مشاورین املاک",
              item: `${SITE_URL}/agents`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: `مشاورین املاک ${titleCity}`,
              item: seoData.canonical,
            },
          ],
        },
      ],
    };
  }, [
    agents,
    pageAvailable,
    seoData.canonical,
    seoData.description,
    seoData.image,
    titleCity,
  ]);

  /*
   * Replacing "<" protects the JSON-LD script against accidental
   * script-tag injection from API-provided values.
   */
  const serializedJsonLd = useMemo(() => {
    if (!jsonLd) return "";

    return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
  }, [jsonLd]);

  return (
    <>
      <Head>
        <title>{seoData.title}</title>

        <meta
          name="description"
          content={seoData.description}
        />

        <meta
          name="robots"
          content={robotsContent}
        />

        <link
          rel="canonical"
          href={seoData.canonical}
        />

        <meta
          property="og:locale"
          content="fa_IR"
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:site_name"
          content="آجر"
        />

        <meta
          property="og:title"
          content={seoData.title}
        />

        <meta
          property="og:description"
          content={seoData.description}
        />

        <meta
          property="og:url"
          content={seoData.canonical}
        />

        <meta
          property="og:image"
          content={seoData.image}
        />

        <meta
          property="og:image:alt"
          content={
            titleCity
              ? `مشاورین املاک ${titleCity} در آجر`
              : "مشاورین املاک در آجر"
          }
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content={seoData.title}
        />

        <meta
          name="twitter:description"
          content={seoData.description}
        />

        <meta
          name="twitter:image"
          content={seoData.image}
        />

        {serializedJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serializedJsonLd,
            }}
          />
        )}
      </Head>

      <main
        className="w-full p-6"
        dir="rtl"
      >
        <header className="mb-6 text-right">
          <h1 className="mb-3 text-xl font-bold">
            {titleCity
              ? `مشاورین املاک ${titleCity}`
              : "مشاورین املاک"}
          </h1>

          <p className="text-sm leading-7 text-gray-600">
            {titleCity
              ? `لیست مشاورین املاک فعال در ${titleCity} را مشاهده کنید و مشاور موردنظر خود را بر اساس نام جستجو کنید.`
              : "در حال دریافت اطلاعات شهر و فهرست مشاورین املاک..."}
          </p>
        </header>

        <form
          role="search"
          aria-label={
            titleCity
              ? `جستجوی مشاورین املاک ${titleCity}`
              : "جستجوی مشاورین املاک"
          }
          className="mb-6 flex flex-row-reverse gap-2"
          onSubmit={handleSearchSubmit}
        >
          <label
            htmlFor="agent-search"
            className="sr-only"
          >
            {titleCity
              ? `نام مشاور املاک در ${titleCity}`
              : "نام مشاور املاک"}
          </label>

          <input
            id="agent-search"
            type="search"
            name="agent-search"
            autoComplete="off"
            className="flex-1 rounded-xl border bg-white p-3 text-right"
            placeholder={
              titleCity
                ? `جستجوی نام مشاور در ${titleCity}`
                : "نام مشاور را جستجو کنید..."
            }
            value={searchQuery}
            onChange={(event) =>
              handleSearchInput(event.target.value)
            }
          />

          <button
            type="submit"
            disabled={loadingAgents}
            className="rounded-xl bg-red-500 px-6 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingAgents ? "در حال جستجو..." : "جستجو"}
          </button>
        </form>

        {searchStatus && (
          <p
            className="mb-4 text-right text-gray-500"
            role="status"
            aria-live="polite"
          >
            {searchStatus}
          </p>
        )}

        {loadingAgents && (
          <div
            className="flex justify-center py-10"
            role="status"
            aria-label="در حال بارگذاری مشاورین املاک"
          >
            <div
              className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-500"
              aria-hidden="true"
            />
          </div>
        )}

        {!loadingAgents && initialServerError && !pageAvailable && (
          <section className="py-10 text-center">
            <p className="mb-4 text-gray-500">
              در حال حاضر دریافت اطلاعات مشاورین این شهر امکان‌پذیر
              نیست.
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="rounded-xl bg-red-500 px-6 py-3 text-white"
            >
              تلاش دوباره
            </button>
          </section>
        )}

        {!loadingAgents && pageAvailable && agents.length > 0 && (
          <section
            aria-label={
              titleCity
                ? `لیست مشاورین املاک ${titleCity}`
                : "لیست مشاورین املاک"
            }
          >
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {agents.map((agent, index) => (
                <SmallCard
                  key={agent?.id || agent?.slug || index}
                  realEstate={agent}
                  profileImageKey="profile_url"
                  compact
                />
              ))}
            </div>
          </section>
        )}

        {!loadingAgents &&
          pageAvailable &&
          agents.length === 0 && (
            <section className="py-10 text-center">
              <p className="text-gray-500">
                {searchQuery.trim()
                  ? `مشاوری مطابق جستجوی شما در ${titleCity} یافت نشد.`
                  : `در حال حاضر مشاور فعالی برای ${titleCity} ثبت نشده است.`}
              </p>
            </section>
          )}
      </main>
    </>
  );
};

/**
 * This wrapper forces React to remount the page when citySlug changes
 * during client-side navigation.
 *
 * Without the key, useState could temporarily retain the previous
 * city's agents and title.
 */
const RealStatePage = (props) => (
  <RealStateIndex
    key={props.citySlug}
    {...props}
  />
);

export default RealStatePage;

export async function getServerSideProps(context) {
  const rawCitySlug = context.params?.citySlug;

  const citySlug = Array.isArray(rawCitySlug)
    ? rawCitySlug[0]
    : rawCitySlug;

  /*
   * Reject missing or malformed route parameters.
   */
  if (
    typeof citySlug !== "string" ||
    !citySlug.trim()
  ) {
    return {
      notFound: true,
    };
  }

  const normalizedCitySlug = citySlug.trim();

  /*
   * Always run SSR for the current request instead of serving a stale
   * city response from the browser or an intermediary cache.
   *
   * If server load becomes high later, this can be replaced with a
   * controlled CDN revalidation strategy.
   */
  context.res.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate"
  );

  try {
    const response = await axios.get(API_URL, {
      params: {
        title: "all",
        limit: INITIAL_AGENTS_LIMIT,
        city: normalizedCitySlug,
      },
      timeout: SEARCH_TIMEOUT,
      headers: {
        Accept: "application/json",
      },
    });

    const city = response.data?.city || null;

    const agents = Array.isArray(response.data?.agents)
      ? response.data.agents
      : [];

    /*
     * If the API confirms that the city does not exist by returning
     * no city object, serve a real Next.js 404 page.
     *
     * This prevents unknown URLs such as /agents/random-value from
     * becoming soft-404 pages.
     */
    if (!city?.title) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        citySlug: normalizedCitySlug,
        initialCity: makeSerializable(city),
        initialAgents: makeSerializable(agents) || [],
        initialServerError: false,
      },
    };
  } catch (error) {
    /*
     * An explicit API 404 means the city does not exist.
     */
    if (error?.response?.status === 404) {
      return {
        notFound: true,
      };
    }

    console.error(
      `SSR agents request failed for city "${normalizedCitySlug}":`,
      error?.message || error
    );

    /*
     * A temporary API error should not create an indexable empty page.
     *
     * HTTP 503 asks search engines to try again later.
     */
    context.res.statusCode = 503;
    context.res.setHeader("Retry-After", "300");

    return {
      props: {
        citySlug: normalizedCitySlug,
        initialCity: null,
        initialAgents: [],
        initialServerError: true,
      },
    };
  }
}
