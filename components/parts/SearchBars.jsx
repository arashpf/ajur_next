import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { CityContext } from "./CityContext";
import CitySelector from "./CitySelector";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import SmallCard from "../cards/SmallCard";
import { Snackbar, Alert } from "@mui/material";
import { trackEvent } from "../../lib/track";

const RealEstateCard = ({ realstate, circle_size }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
    نمایش کارت املاک
  </div>
);

const suggestionsMap = {
  buySell: [
    "مثلا : خرید خانه ",
    "مثلا : ویلایی ",
    "مثلا تجاری ",
    "مثلا : اجاره آپارتمان",
  ],
  agents: [
    "جستجو مشاور : مثلا محمد دهقان",
    "جستجو مشاور املاک...",
    "مشاور املاک متخصص...",
  ],
};

const estateHints = [
  "آپارتمان",
  "خانه ویلایی",
  "زمین مسکونی",
  "مغازه",
  "اجاره آپارتمان",
  "اجاره خانه ویلایی",
  "باغ و باغچه",
  "زمین صنعتی",
];

const SEARCH_TIMEOUT = 15000;
const TYPING_DELAY = 600;

const SearchBars = ({ realstates, clientIp = null }) => {
  const router = useRouter();
  const { currentCity, isLoading } = useContext(CityContext);

  // State management
  const [activeTab, setActiveTab] = useState("buySell");
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [isInputReady, setIsInputReady] = useState(false);
  const [searchStatus, setSearchStatus] = useState("جستجو...");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showAllNeighborhoods, setShowAllNeighborhoods] = useState(false);
  const [lastHintPressed, setLastHintPressed] = useState(null);
  const [suggestionDirection, setSuggestionDirection] = useState("down");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snack, setSnack] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Refs
  const inputRef = useRef(null);
  const suggestionIntervalRef = useRef(null);
  const loadingTimeoutRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastSearchQueryRef = useRef("");

  // ----------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------
  useEffect(() => {
    if (currentCity && !isLoading) {
      console.log("[SearchBars] currentCity ready:", currentCity);
    }
  }, [currentCity, isLoading]);

  useEffect(() => {
    const handleRouteChangeComplete = () => setIsRedirecting(false);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () =>
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
  }, [router]);

  useEffect(() => {
    if (lastHintPressed) {
      handleSearch(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastHintPressed]);

  // Load search history
  useEffect(() => {
    try {
      const history = localStorage.getItem("realEstateSearchHistory");
      if (history) {
        const parsed = JSON.parse(history);
        setSearchHistory(parsed.slice(0, 3));
      }
    } catch (error) {
      console.error("Failed to load search history", error);
    }
  }, []);

  // Suggestion cycling
  useEffect(() => {
    if (activeTab && !searchQuery.trim() && !showModal) {
      suggestionIntervalRef.current = setInterval(() => {
        setSuggestionDirection("up");

        setTimeout(() => {
          setCurrentSuggestionIndex((prev) =>
            prev >= suggestionsMap[activeTab].length - 1 ? 0 : prev + 1
          );

          setTimeout(() => {
            setSuggestionDirection("down");
          }, 100);
        }, 500);
      }, 3000);
    } else {
      if (suggestionIntervalRef.current) {
        clearInterval(suggestionIntervalRef.current);
      }
      setCurrentSuggestionIndex(0);
      setSuggestionDirection("down");
    }
    return () => {
      if (suggestionIntervalRef.current) {
        clearInterval(suggestionIntervalRef.current);
      }
    };
  }, [activeTab, searchQuery, showModal]);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setIsInputReady(true);
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsInputReady(false);
    }
  }, [showModal]);

  // Clear results when query is cleared
  useEffect(() => {
    if (showModal && !searchQuery.trim() && properties.length > 0) {
      setProperties([]);
      setSearchStatus("جستجو...");
      setShowAllNeighborhoods(false);
    }
  }, [searchQuery, showModal, properties.length]);

  // ----------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------
  const handleSnackbar = (message) => {
    setSnack(message);
    setSnackOpen(true);
  };

  const renderSnackBar = () => (
    <Snackbar
      open={snackOpen}
      autoHideDuration={4000}
      onClose={() => setSnackOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => setSnackOpen(false)}
        severity="warning"
        sx={{ width: "100%" }}
      >
        {snack}
      </Alert>
    </Snackbar>
  );

  const getCurrentSuggestion = () => {
    if (searchQuery) return searchQuery;
    if (!activeTab) return "جستجو...";
    return suggestionsMap[activeTab][currentSuggestionIndex] || "جستجو...";
  };

  const getNextSuggestion = () => {
    if (!activeTab) return "جستجو...";
    const nextIndex =
      currentSuggestionIndex >= suggestionsMap[activeTab].length - 1
        ? 0
        : currentSuggestionIndex + 1;
    return suggestionsMap[activeTab][nextIndex] || "جستجو...";
  };

  const saveToHistory = async (query) => {
    if (!query.trim()) return;
    try {
      const updatedHistory = [
        query,
        ...searchHistory.filter(
          (item) => item.toLowerCase() !== query.toLowerCase()
        ),
      ].slice(0, 3);
      setSearchHistory(updatedHistory);
      localStorage.setItem(
        "realEstateSearchHistory",
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error("Failed to save search history", error);
    }
  };

  const handleTabPress = (tabId) => {
    if (tabId === "agents") {
      if (!currentCity || isLoading) {
        setSearchStatus("لطفاً ابتدا یک شهر را انتخاب کنید");
        return;
      }
      getAgentsCall("all");
    }
    setActiveTab(tabId);
    setSearchQuery("");
    setInputValue("");
    setSearchStatus("جستجو...");
    setProperties([]);
    setShowAllNeighborhoods(false);
  };

  const handleCloseModal = () => {
    setActiveTab("buySell");
    setShowModal(false);
    setIsRedirecting(false);
    setSearchQuery("");
    setInputValue("");
    setProperties([]);
    lastSearchQueryRef.current = "";         // ← FIX: reset dedup guard on close
    clearTimeout(loadingTimeoutRef.current);
    clearInterval(progressIntervalRef.current);
  };

  const handleHintPress = (hint) => {
    setSearchQuery(hint);
    setInputValue(hint);
    setLastHintPressed(hint);
    handleSearch(true, hint);                // ← FIX: pass hint explicitly
  };

  const handleTextChange = (text) => {
    setInputValue(text);
    setSearchQuery(text);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (text.trim().length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        handleSearch(false, text);           // ← FIX: pass current text, not stale state
      }, TYPING_DELAY);
    } else {
      setProperties([]);
      setSearchStatus("جستجو...");
      setShowAllNeighborhoods(false);
    }
  };

  const getAgentsCall = async (searchTerm) => {
    try {
      setLoadingAgents(true);
      setSearchStatus("در حال جستجوی مشاورین...");

      const response = await axios.get(
        "https://api.ajur.app/api/agents-search",
        {
          params: {
            title: searchTerm,
            limit: 20,
            city: currentCity.id,
          },
          timeout: SEARCH_TIMEOUT,
        }
      );

      setAgents(response.data.agents || []);
      setSearchStatus(
        `${response.data.agents.length} مشاور در ${currentCity.title} یافت شد`
      );
      return response.data.agents || [];
    } catch (error) {
      console.error("Agent search failed:", error);
      setSearchStatus("خطا در جستجوی مشاورین");
      return [];
    } finally {
      setLoadingAgents(false);
    }
  };

  // ----------------------------------------------------------------
  // Navigation
  // ----------------------------------------------------------------
  const navigateToCategory = (
    persianCategoryName,
    neighborhoodName = null,
    englishCategoryName = null
  ) => {
    if (!currentCity) {
      handleSnackbar("خطا در انتقال به صفحه");
      return;
    }

    if (!persianCategoryName || !englishCategoryName) {
      handleSnackbar("خطا در انتقال به صفحه دسته‌بندی");
      return;
    }

    handleCloseModal();

    const pathname = `/${currentCity.slug}/${encodeURIComponent(
      englishCategoryName
    )}`;

    const query = {};
    if (neighborhoodName) {
      query.neighborhoods = neighborhoodName;
    }

    try {
      localStorage.setItem(
        "lastSearchContext",
        JSON.stringify({
          originalQuery: searchQuery,
          selectedCategory: persianCategoryName,
          selectedCategoryEnglish: englishCategoryName,
          city: currentCity.title,
          citySlug: currentCity.slug,
          neighborhood: neighborhoodName,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      // ignore
    }

    setIsRedirecting(true);
    router.push(
      { pathname, query },
      undefined,
      { scroll: false }
    );
  };

  // ----------------------------------------------------------------
  // MAIN SEARCH
  // ----------------------------------------------------------------
  const handleSearch = async (isManualSearch = true, queryOverride = null) => {
    if (!currentCity || isLoading) {
      setSearchStatus("لطفاً ابتدا یک شهر را انتخاب کنید");
      return;
    }

    // ─── Use the explicit override when provided ───
    // The typing-debounce and hint-click both pass the CURRENT text as
    // `queryOverride`, so we never read stale React state here.
    const query = (queryOverride !== null ? queryOverride : searchQuery).trim();

    if (!query) {
      setProperties([]);
      setSearchStatus("جستجو...");
      return;
    }

    const cityId = currentCity.id;
    if (!cityId || typeof cityId !== "number") {
      console.error("[SearchBars] invalid cityId:", cityId, currentCity);
      setSearchStatus("خطا: شهر انتخاب‌شده معتبر نیست. لطفاً دوباره انتخاب کنید");
      return;
    }

    console.log("[search-intent] sending:", {
      query: query,
      cityid: cityId,
      city_slug: currentCity.slug,
      city_title: currentCity.title,
    });

    if (lastSearchQueryRef.current === query) {
      console.log("Same query, skipping search");
      return;
    }

    lastSearchQueryRef.current = query;

    // Local variables — populated during the API call, used for analytics AFTER.
    let resultsCount = null;
    let totalProperties = null;

    try {
      setLoading(true);
      setSearchStatus("در حال جستجو...");

      if (isManualSearch) {
        await saveToHistory(query);
      }

      progressIntervalRef.current = setInterval(() => {
        setSearchStatus((prev) =>
          prev.includes("...") ? "در حال جستجو" : prev + "."
        );
      }, 500);

      switch (activeTab) {
        case "buySell": {
          try {
            const response = await axios.post(
              "https://api.ajur.app/api/search-intent",
              {
                query: query,
                cityid: cityId,
              },
              {
                timeout: 10000,
                headers: { "Content-Type": "application/json" },
              }
            );

            clearTimeout(loadingTimeoutRef.current);
            clearInterval(progressIntervalRef.current);

            if (!response.data) {
              throw new Error("پاسخ نامعتبر از سرور دریافت شد");
            }

            const data = response.data;

            const hasNewStructure =
              data.categories !== undefined ||
              data.neighborhoods !== undefined;

            let categoriesWithNeighborhoods = [];
            let neighborhoodResults = [];

            if (hasNewStructure) {
              categoriesWithNeighborhoods = data.categories || [];
              neighborhoodResults = data.neighborhoods || [];
            } else {
              categoriesWithNeighborhoods = Array.isArray(data) ? data : [];
            }

            const displayItems = categoriesWithNeighborhoods.map((c, i) => {
              const categoryName =
                c.category_name || c.category?.name || c.name || "";
              const categoryObj = c.category || null;
              const categoryArray = c.category_array || c.category || null;
              const neighborhoods = c.neighborhoods || [];

              const totalCount = neighborhoods.reduce(
                (sum, n) => sum + (n.property_count || 0),
                0
              );

              return {
                id: `category-${i}-${Date.now()}`,
                category: categoryName,
                category_eng:
                  categoryObj?.eng_name || c.eng_name || c.category_eng || "",
                category_array: categoryArray,
                neighborhoods: neighborhoods,
                propertyCounts: neighborhoods.reduce((acc, curr) => {
                  acc[curr.name] = curr.property_count || 0;
                  return acc;
                }, {}),
                totalProperties: totalCount,
                hasProperties: totalCount > 0,
                isEmpty: totalCount === 0,
              };
            });

            // ─── Compute result counts for analytics ───
            resultsCount = displayItems.length;
            totalProperties = displayItems.reduce(
              (sum, c) => sum + (c.totalProperties || 0),
              0
            );

            setProperties(displayItems);

            let statusText = "";
            if (displayItems.length > 0) {
              statusText = `${displayItems.length} دسته‌بندی یافت شد`;
            } else {
              statusText = `جستجوی "${query}" در ${currentCity.title} نتیجه‌ای نداشت`;
            }
            setSearchStatus(statusText);
          } catch (error) {
            console.error("Search error:", error);
            clearTimeout(loadingTimeoutRef.current);
            clearInterval(progressIntervalRef.current);
            setSearchStatus("خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید");
            setProperties([]);
            // resultsCount remains null — signals API failure in analytics
          }
          break;
        }

        case "agents": {
          const agentsReturned = await getAgentsCall(query);
          resultsCount = agentsReturned.length;
          totalProperties = null; // not applicable for agent searches
          break;
        }

        default:
          setSearchStatus("لطفاً یک تب معتبر را انتخاب کنید");
          return;
      }
    } catch (error) {
      console.error("Search error:", error);
      clearTimeout(loadingTimeoutRef.current);
      clearInterval(progressIntervalRef.current);
      setSearchStatus("خطا در جستجو");
      // resultsCount remains null — signals exception in analytics
    } finally {
      setLoading(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      // ─── Analytics: fire AFTER the API call ───
      // Now we know how many results came back (or null if it failed).
      trackEvent(
        "search",
        {
          query,
          city_slug: currentCity.slug || null,
          city_id: currentCity.id || null,
          tab: activeTab,
          trigger: isManualSearch ? "manual" : "typing",
          results_count: resultsCount,               // number or null
          total_properties: totalProperties,         // number or null
        },
        clientIp
      );
    }
  };

  const set_modal_active = () => {
    if (!currentCity || isLoading) {
      handleSnackbar("لطفاً ابتدا یک شهر را انتخاب کنید");
      const btn = document.querySelector('[data-testid="citySelectorButton"]');
      if (btn) btn.click();
      return;
    }

    setShowAllNeighborhoods(false);
    setProperties([]);
    setSearchQuery("");
    setInputValue("");
    setShowModal(true);

    const timer = setTimeout(() => {
      setIsInputReady(true);
      inputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  const renderSpinner = () => (
    <div className="flex justify-center items-center py-5">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
    </div>
  );

  const renderCategoryCard = (item) => {
    const totalProperties =
      item.totalProperties ||
      Object.values(item.propertyCounts).reduce((sum, count) => sum + count, 0);

    return (
      <div
        key={item.id}
        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4"
      >
        <div className="flex flex-row-reverse items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex flex-col items-end">
            <button
              onClick={() =>
                navigateToCategory(item.category, null, item.category_eng)
              }
              className="text-right hover:text-blue-800 focus:outline-none"
            >
              <div className="text-blue-800 font-bold text-sm">
                {item.category} در {currentCity.title}
                {item.hasProperties && (
                  <span className="text-gray-500 text-sm">
                    {` (${totalProperties} مورد)`}
                  </span>
                )}
              </div>
            </button>
          </div>

          {item.hasProperties && (
            <button
              className="flex flex-row-reverse items-center text-blue-600 hover:text-blue-800 focus:outline-none"
              onClick={() =>
                navigateToCategory(item.category, null, item.category_eng)
              }
            >
              <span className="text-sm ml-1">همه موارد</span>
              <span>‹</span>
            </button>
          )}
        </div>

        {item.neighborhoods.length > 0 && (
          <div className="flex flex-row-reverse flex-wrap gap-2 mt-3">
            {(showAllNeighborhoods
              ? item.neighborhoods
              : item.neighborhoods.slice(0, 5)
            ).map((neighborhood, index) => {
              const propertyCount = neighborhood.property_count || 0;
              return (
                <button
                  key={`${item.id}-${neighborhood.name}-${index}`}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    propertyCount > 0
                      ? "bg-green-50 text-gray-700 border-green-200 hover:bg-green-100"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                  onClick={() =>
                    navigateToCategory(
                      item.category,
                      neighborhood.id,
                      item.category_eng
                    )
                  }
                  disabled={propertyCount === 0}
                >
                  {neighborhood.name}
                  {propertyCount > 0 && (
                    <span className="text-gray-500 text-xs mr-1">
                      {` (${propertyCount} ملک)`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {item.neighborhoods.length > 5 && !showAllNeighborhoods && (
          <button
            className="w-full py-2 text-center text-blue-600 hover:text-blue-800 text-sm mt-2 focus:outline-none"
            onClick={() => setShowAllNeighborhoods(true)}
          >
            نمایش همه محلات ({item.neighborhoods.length - 5} مورد دیگر)
          </button>
        )}

        {item.neighborhoods.length === 0 && (
          <div className="text-center py-3 text-gray-500 text-sm">
            {item.isEmpty ? " " : "در حال بررسی موجودی"}
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "buySell":
        return (
          <div className="flex-1 py-2">
            {loading ? (
              renderSpinner()
            ) : (
              <div className="space-y-4">
                {searchStatus && searchStatus !== "جستجو..." && (
                  <div className="text-center text-gray-500 text-sm mb-2">
                    {searchStatus}
                  </div>
                )}

                {searchHistory.length > 0 &&
                  properties.length === 0 &&
                  !loading && (
                    <div className="text-right mb-6">
                      <h3 className="text-gray-500 text-sm mb-2">
                        جستجوهای اخیر:
                      </h3>
                      <div className="flex flex-row-reverse flex-wrap gap-2">
                        {searchHistory.map((historyItem, index) => (
                          <div
                            key={`history-${index}`}
                            className="flex flex-row-reverse items-center bg-gray-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 border border-gray-300"
                            onClick={() => handleHintPress(historyItem)}
                          >
                            <span className="text-gray-700 text-sm ml-2">
                              {historyItem}
                            </span>
                            <button
                              className="text-gray-500 hover:text-gray-700 text-xs mr-2 focus:outline-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updatedHistory = searchHistory.filter(
                                  (_, i) => i !== index
                                );
                                setSearchHistory(updatedHistory);
                                localStorage.setItem(
                                  "realEstateSearchHistory",
                                  JSON.stringify(updatedHistory)
                                );
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {properties.length === 0 && !loading && (
                  <div className="text-right">
                    <h3 className="text-gray-500 text-sm mb-2">
                      پیشنهادهایی برای جستجو:
                    </h3>
                    <div className="flex flex-row-reverse flex-wrap gap-2">
                      {estateHints.map((hint, index) => (
                        <button
                          key={`hint-${index}`}
                          className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm hover:bg-gray-700 focus:outline-none"
                          onClick={() => handleHintPress(hint)}
                        >
                          {hint}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {properties.length > 0 && (
                  <div className="space-y-4">
                    {properties.map((item) => renderCategoryCard(item))}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case "agents":
        return (
          <div className="flex-1">
            {loadingAgents ? (
              renderSpinner()
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 m-4">
                {agents.map((agent, index) => (
                  <SmallCard
                    key={index}
                    realEstate={agent}
                    profileImageKey="profile_url"
                    compact={true}
                  />
                ))}
              </div>
            )}
            {agents.length === 0 && !loadingAgents && (
              <div className="text-center text-gray-500 py-5 col-span-full">
                مشاوری در {currentCity?.title || "این شهر"} یافت نشد
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex-1 py-2">
            <div className="text-center text-gray-500 py-5">
              لطفاً یک تب را انتخاب کنید
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full py-2 px-3 bg-white">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <CitySelector
              handleCitySelect={() => {
                setShowAllNeighborhoods(false);
              }}
            />

            <div
              className="flex-1 flex flex-row-reverse items-center bg-gray-50 rounded-2xl border border-gray-300 h-14 px-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              onClick={() => set_modal_active()}
            >
              <div className="flex-1 text-right overflow-hidden relative h-6">
                <div
                  className={`absolute inset-0 flex items-center transition-all duration-500 ease-in-out ${
                    suggestionDirection === "up"
                      ? "transform -translate-y-full opacity-0"
                      : "transform translate-y-0 opacity-100"
                  }`}
                >
                  <span className="text-gray-600 text-base overflow-hidden whitespace-nowrap overflow-ellipsis w-full">
                    {getCurrentSuggestion()}
                    {currentCity?.title && ` در ${currentCity.title}`}
                  </span>
                </div>

                <div
                  className={`absolute inset-0 flex items-center transition-all duration-500 ease-in-out ${
                    suggestionDirection === "up"
                      ? "transform translate-y-0 opacity-100"
                      : "transform translate-y-full opacity-0"
                  }`}
                >
                  <span className="text-gray-600 text-base overflow-hidden whitespace-nowrap overflow-ellipsis w-full">
                    {getNextSuggestion()}
                    {currentCity?.title && ` در ${currentCity.title}`}
                  </span>
                </div>
              </div>

              <button
                className="w-10 h-10 rounded-xl flex items-center justify-center mr-2 hover:bg-gray-200 transition-colors focus:outline-none"
                onClick={() => set_modal_active()}
                aria-label="جستجو"
              >
                <SearchIcon style={{ fontSize: 22 }} />
              </button>
            </div>

            <button
              onClick={handleHomeClick}
              className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
              aria-label="رفتن به صفحه اصلی"
            >
              <img
                src="/logo/web-logo-text.png"
                alt="آجر"
                className="h-8 w-auto"
              />
            </button>
          </div>
        </div>
        {renderSnackBar()}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCloseModal}
          />
          <div className="absolute top-0 left-0 right-0 bg-white rounded-b-3xl p-6 max-h-[90vh] overflow-auto flex flex-col animate__animated animate__slideInDown">
            <button
              onClick={handleCloseModal}
              aria-label="بستن"
              className="absolute top-4 right-4 z-80 bg-transparent border-none text-2xl cursor-pointer p-2 leading-none focus:outline-none"
              style={{ fontSize: "1.35rem" }}
            >
              ✕
            </button>

            <div className="flex flex-row-reverse items-center mb-4 gap-3">
              <div className="flex-1 flex justify-between gap-3">
                {Object.entries(suggestionsMap)
                  .filter(([tabId]) => tabId !== "jobs")
                  .map(([tabId]) => (
                    <button
                      key={tabId}
                      className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-colors focus:outline-none ${
                        activeTab === tabId
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                      onClick={() => handleTabPress(tabId)}
                    >
                      {tabId === "buySell" ? "املاک" : "مشاورین"}
                    </button>
                  ))}
              </div>

              <div className="flex-shrink-0">
                <CitySelector
                  handleCitySelect={() => {
                    setShowAllNeighborhoods(false);
                    if (searchQuery) {
                      handleSearch(true);
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex flex-row-reverse items-center bg-white border-2 border-red-500 rounded-2xl h-14 mb-6 px-4">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 h-full text-right text-gray-800 text-base outline-none px-3 bg-white rtl"
                style={{
                  backgroundColor: "white",
                  textAlign: "right",
                  direction: "rtl",
                }}
                placeholder={
                  getCurrentSuggestion() +
                  (currentCity?.title ? ` در ${currentCity.title}` : "")
                }
                value={inputValue}
                onChange={(e) => handleTextChange(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(true)}
                autoFocus={isInputReady}
                dir="rtl"
              />
            </div>

            <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>
          </div>
        </div>
      )}

      {isRedirecting && (
        <div className="fixed inset-0 bg-white bg-opacity-98 flex items-center justify-center z-[9999]">
          <img
            className="spinner-image"
            src="/logo/ajour-gif.gif"
            alt="در حال رفتن به نتایج"
            style={{ width: "150px", height: "150px" }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBars;