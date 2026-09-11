import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { CityContext } from "./CityContext";
import CitySelector from "./CitySelector";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import SmallCard from "../cards/SmallCard";
import { Snackbar, Alert } from "@mui/material";
import SupportIcon from '@mui/icons-material/Support';

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

const categoriesData = [
  {
    id: 3,
    name: "خرید صنعتی",
    eng_name: "buy-industrial",
    description: null,
    status: "1",
    has_parent: "0",
    has_child: "0",
    parent_id: "0",
    sort_order: "1",
    avatar: "industry",
    created_at: "2021-01-03T21:56:25.000000Z",
    updated_at: "2021-01-03T21:56:25.000000Z",
    type: "sell",
  },
  {
    id: 6,
    name: "اجاره صنعتی",
    eng_name: "rent-industrial",
    description: "اجاره انواع واحد های صنعتی",
    status: "1",
    has_parent: "0",
    has_child: "0",
    parent_id: "0",
    sort_order: "27",
    avatar: "rent_industrial",
    created_at: "2024-04-06T16:01:02.000000Z",
    updated_at: "2024-04-06T16:01:02.000000Z",
    type: "rent",
  },
  {
    id: 16,
    name: "خرید آپارتمان",
    eng_name: "buy-apartment",
    description: null,
    status: "1",
    has_parent: "1",
    has_child: "0",
    parent_id: "1",
    sort_order: "16",
    avatar: "sell_apartment",
    created_at: null,
    updated_at: null,
    type: "sell",
  },
  {
    id: 17,
    name: "خرید خانه ویلایی",
    eng_name: "buy-villa",
    description: "فروش انواع خانه های ویلایی",
    status: "1",
    has_parent: "1",
    has_child: "0",
    parent_id: "1",
    sort_order: "17",
    avatar: "sell_industrial_land",
    created_at: "2024-04-06T15:18:54.000000Z",
    updated_at: "2024-04-06T15:18:54.000000Z",
    type: "sell",
  },
  {
    id: 18,
    name: "خرید زمین مسکونی",
    eng_name: "buy-residential-land",
    description: null,
    status: "1",
    has_parent: "1",
    has_child: "0",
    parent_id: "2",
    sort_order: "18",
    avatar: "sell_residental_land",
    created_at: "2021-01-03T21:56:25.000000Z",
    updated_at: "2021-01-03T21:56:25.000000Z",
    type: "sell",
  },
  {
    id: 19,
    name: "خرید زمین تجاری و اداری",
    eng_name: "buy-commercial-office-land",
    description: "دسته بندی زمین های تجاری و اداری",
    status: "1",
    has_parent: "1",
    has_child: "0",
    parent_id: "2",
    sort_order: "19",
    avatar: "sell_office_land",
    created_at: "2024-04-06T15:11:50.000000Z",
    updated_at: "2024-04-06T15:11:50.000000Z",
    type: "sell",
  },
  {
    id: 20,
    name: "خرید زمین صنعتی",
    eng_name: "buy-industrial-land",
    description: null,
    status: "1",
    has_parent: "1",
    has_child: "0",
    parent_id: "2",
    sort_order: "20",
    avatar: "sell_industrial_land",
    created_at: "2024-04-06T15:13:10.000000Z",
    updated_at: "2024-04-06T15:13:10.000000Z",
    type: "sell",
  },
  {
    id: 21,
    name: "خرید باغ و باغچه",
    eng_name: "buy-garden",
    description: "فروش انواع باغ و باغچه",
    status: "1",
    has_parent: "1",
    has_child: "0",
    parent_id: "2",
    sort_order: "21",
    avatar: "sell_industrial",
    created_at: "2024-04-06T15:54:38.000000Z",
    updated_at: "2024-04-06T15:54:38.000000Z",
    type: "sell",
  },
  {
    id: 22,
    name: "خرید زمین زراعی",
    eng_name: "buy-agricultural-land",
    description: null,
    status: "1",
    has_parent: "1",
    has_child: "0",
    parent_id: "2",
    sort_order: "22",
    avatar: "sell_farm_land",
    created_at: "2024-04-06T15:15:48.000000Z",
    updated_at: "2024-04-06T15:15:48.000000Z",
    type: "sell",
  },
  {
    id: 23,
    name: "خرید مغازه",
    eng_name: "buy-shop",
    description: null,
    status: "1",
    has_parent: "1",
    has_child: "0",
    parent_id: "4",
    sort_order: "23",
    avatar: "sell_store",
    created_at: "2024-04-06T15:48:19.000000Z",
    updated_at: "2024-04-06T15:48:19.000000Z",
    type: "sell",
  },
  {
    id: 24,
    name: "خرید دفتر کار و اداری",
    eng_name: "buy-office",
    description: "انواع دفتر کار ، سالن و اداری",
    status: "1",
    has_parent: "1",
    has_child: "0",
    parent_id: "4",
    sort_order: "24",
    avatar: "sell_office",
    created_at: "2024-04-06T15:50:53.000000Z",
    updated_at: "2024-04-06T15:50:53.000000Z",
    type: "sell",
  },
  {
    id: 25,
    name: "اجاره آپارتمان",
    eng_name: "rent-apartment",
    description: "اجاره انواع آپارتمان",
    status: "1",
    has_parent: "1",
    has_child: "0",
    parent_id: "5",
    sort_order: "25",
    avatar: "rent_apartment",
    created_at: "2024-04-06T15:59:02.000000Z",
    updated_at: "2024-04-06T15:59:02.000000Z",
    type: "rent",
  },
  {
    id: 26,
    name: "اجاره خانه ویلایی",
    eng_name: "rent-villa",
    description: "اجاره انواع خانه های ویلایی",
    status: "1",
    has_parent: "1",
    has_child: "0",
    parent_id: "5",
    sort_order: "26",
    avatar: "rent_villa",
    created_at: "2024-04-06T15:56:47.000000Z",
    updated_at: "2024-04-06T15:56:47.000000Z",
    type: "rent",
  },
  {
    id: 27,
    name: "اجاره مغازه",
    eng_name: "rent-shop",
    description: "اجاره انواع مغازه",
    status: "1",
    has_parent: "1",
    has_child: "0",
    parent_id: "7",
    sort_order: "27",
    avatar: "sell_store",
    created_at: "2024-04-06T16:08:35.000000Z",
    updated_at: "2024-04-06T16:08:35.000000Z",
    type: "rent",
  },
  {
    id: 28,
    name: "اجاره دفتر کار و اداری",
    eng_name: "rent-office",
    description: "اجاره انواع دفتر کار، مطب و واحد اداری",
    status: "1",
    has_parent: "1",
    has_child: "0",
    parent_id: "7",
    sort_order: "28",
    avatar: "rent_office",
    created_at: "2024-04-06T16:09:35.000000Z",
    updated_at: "2024-04-06T16:09:35.000000Z",
    type: "rent",
  },
  {
    id: 65,
    name: "زمین هکتاری",
    eng_name: "hectare-land",
    description: "زمین هکتاری",
    status: "1",
    has_parent: "1",
    has_child: "0",
    parent_id: "2",
    sort_order: "1",
    avatar: "hectare_land",
    created_at: "2025-02-12T18:19:41.000000Z",
    updated_at: "2025-02-12T18:19:41.000000Z",
    type: "sell",
  },
];

const SearchBars = ({ realstates }) => {
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
  const [networkStatus, setNetworkStatus] = useState({
    isConnected: true,
    isInternetReachable: true,
  });
  const [search_category, set_search_category] = useState([]);
  const [search_neighborhoods, set_search_neighborhoods] = useState([]);
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

  const [cities, setCities] = useState([]);

  const getDefaultCities = () => [
    { id: 1, title: "تهران", slug: "tehran" },
    { id: 2, title: "رباط کریم", slug: "robat-karim" },
    { id: 3, title: "کرج", slug: "karaj" },
    { id: 4, title: "اصفهان", slug: "esfahan" },
    { id: 5, title: "مشهد", slug: "mashhad" },
  ];

  // Helper function to normalize text for comparison
  const normalizeText = (text) => {
    if (!text) return '';
    return text
      .trim()
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/[،]/g, '')
      .normalize('NFC');
  };

  // Helper function to convert Persian to English slug (for neighborhoods)
  const convertToEnglishSlug = (persianText) => {
    if (!persianText) return '';
    
    const mapping = {
      'آپارتمان': 'apartment',
      'ویلایی': 'villa',
      'مغازه': 'shop',
      'زمین': 'land',
      'صنعتی': 'industrial',
      'تجاری': 'commercial',
      'اداری': 'office',
      'خرید': 'buy',
      'اجاره': 'rent',
      'مسکونی': 'residential',
      'باغ': 'garden',
      'باغچه': 'small-garden',
      'زراعی': 'agricultural',
      'هکتاری': 'hectare',
      'دفتر': 'office',
      'کار': 'work',
    };
    
    // Convert each word
    return persianText
      .split(' ')
      .map(word => mapping[word] || word.toLowerCase())
      .join('-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Fixed function to find matching categories
  const findMatchingCategories = (query) => {
    if (!query || typeof query !== 'string') {
      return [];
    }
    
    const normalizedQuery = normalizeText(query);
    const matchedCategories = [];
    
    categoriesData.forEach(category => {
      const categoryName = normalizeText(category.name);
      
      // Split query and category into words
      const queryWords = normalizedQuery.split(' ').filter(word => word.length > 1);
      const categoryWords = categoryName.split(' ').filter(word => word.length > 1);
      
      // Check for exact matches or significant overlaps
      let matchScore = 0;
      
      // Check if any query word is in category name or vice versa
      queryWords.forEach(queryWord => {
        categoryWords.forEach(categoryWord => {
          if (categoryWord.includes(queryWord) || queryWord.includes(categoryWord)) {
            matchScore += 1;
          }
        });
      });
      
      // Check for full match
      if (categoryName.includes(normalizedQuery) || normalizedQuery.includes(categoryName)) {
        matchScore += 2;
      }
      
      // Check for common Persian real estate patterns
      const commonPatterns = [
        { pattern: 'آپارتمان', category: 'آپارتمان' },
        { pattern: 'ویلایی', category: 'خانه ویلایی' },
        { pattern: 'مغازه', category: 'مغازه' },
        { pattern: 'زمین', category: 'زمین' },
        { pattern: 'صنعتی', category: 'صنعتی' },
        { pattern: 'تجاری', category: 'تجاری' },
        { pattern: 'اداری', category: 'اداری' },
        { pattern: 'خرید', category: 'خرید' },
        { pattern: 'اجاره', category: 'اجاره' },
      ];
      
      commonPatterns.forEach(pattern => {
        if (normalizedQuery.includes(pattern.pattern) && categoryName.includes(pattern.category)) {
          matchScore += 1;
        }
      });
      
      if (matchScore > 0) {
        matchedCategories.push({
          ...category,
          matchScore,
          isExactMatch: categoryName === normalizedQuery || normalizedQuery === categoryName
        });
      }
    });
    
    // Sort by match score and exact matches first
    return matchedCategories
      .sort((a, b) => {
        if (a.isExactMatch && !b.isExactMatch) return -1;
        if (!a.isExactMatch && b.isExactMatch) return 1;
        return b.matchScore - a.matchScore;
      });
  };

  // Effects
  useEffect(() => {
    if (currentCity && !isLoading) {
      console.log('Current city loaded:', currentCity);
    }
  }, [currentCity, isLoading]);

  useEffect(() => {
    // Reset redirecting spinner when route changes complete
    const handleRouteChangeComplete = () => {
      setIsRedirecting(false);
    };

    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router]);

  useEffect(() => {
    if (lastHintPressed) {
      handleSearch(true);
    }
  }, [lastHintPressed]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const history = localStorage.getItem("realEstateSearchHistory");
        if (history) {
          const parsedHistory = JSON.parse(history);
          // Keep only the last 3 searches
          const recentHistory = parsedHistory.slice(0, 3);
          setSearchHistory(recentHistory);
        }
      } catch (error) {
        console.error("Failed to load search history", error);
      }
    };
    loadSearchHistory();
  }, []);

  // Fixed suggestion interval effect
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

  // Effect to reset search when query is deleted
  useEffect(() => {
    if (showModal && !searchQuery.trim() && properties.length > 0) {
      // Reset properties and show default state when query is cleared
      setProperties([]);
      setSearchStatus("جستجو...");
      setShowAllNeighborhoods(false);
      
      // Reset to default tab state
      if (activeTab === "buySell") {
        // Clear any intervals and reset suggestion
        if (suggestionIntervalRef.current) {
          clearInterval(suggestionIntervalRef.current);
        }
        // Restart suggestion animation
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
      }
    }
  }, [searchQuery, showModal, activeTab, properties.length]);

  // Helper functions
  const handleSnackbar = (message) => {
    setSnack(message);
    setSnackOpen(true);
  };

  const renderSnackBar = () => {
    return (
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            fontSize: "1.2rem",
            padding: "16px 24px",
            minWidth: "400px",
          },
        }}
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
  };

  const fetch_cities_from_data_base = async () =>  {
    try {
      const response = await axios.get(
        "https://api.ajur.app/api/search-cities",
        {
          params: { title: '' || "" },
          timeout: 5000,
        }
      );
      // Ensure cities have both Persian title and English slug
      const citiesWithSlugs = (response.data?.items || getDefaultCities()).map(city => ({
        ...city,
        slug: city.slug || city.title.toLowerCase().replace(/\s+/g, '-')
      }));
      setCities(citiesWithSlugs);
      console.log("Cities loaded:", citiesWithSlugs);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities(getDefaultCities());
    }
  }

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
      getAgentsCall("all", currentCity.id);
    }
    setActiveTab(tabId);
    setSearchQuery("");
    setInputValue(""); // Clear input value
    setSearchStatus("جستجو...");
    setProperties([]);
    setShowAllNeighborhoods(false);
    
    // Restart suggestion animation
    if (suggestionIntervalRef.current) {
      clearInterval(suggestionIntervalRef.current);
    }
    
    suggestionIntervalRef.current = setInterval(() => {
      setSuggestionDirection("up");
      setTimeout(() => {
        setCurrentSuggestionIndex((prev) =>
          prev >= suggestionsMap[tabId].length - 1 ? 0 : prev + 1
        );
        setTimeout(() => {
          setSuggestionDirection("down");
        }, 100);
      }, 500);
    }, 3000);
  };

  const handleCloseModal = () => {
    setActiveTab("buySell");
    setShowModal(false);
    setIsRedirecting(false);
    setSearchQuery("");
    setInputValue(""); // Clear input value
    setProperties([]);
    clearTimeout(loadingTimeoutRef.current);
    clearInterval(progressIntervalRef.current);
  };

  const handleHintPress = (hint) => {
    setSearchQuery(hint);
    setInputValue(hint);
    setLastHintPressed(hint);
    handleSearch(true);
  };

  // Fixed text change handler
  const handleTextChange = (text) => {
    setInputValue(text);
    setSearchQuery(text);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (text.trim().length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        handleSearch(false);
      }, TYPING_DELAY);
    } else {
      // When query is cleared, reset the display
      setProperties([]);
      setSearchStatus("جستجو...");
      setShowAllNeighborhoods(false);
      
      // Reset to default suggestion animation
      if (suggestionIntervalRef.current) {
        clearInterval(suggestionIntervalRef.current);
      }
      
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
    }
  };

  const getAgentsCall = async (searchTerm) => {
    try {
      setLoadingAgents(true);
      setSearchStatus("در حال جستجوی مشاورین...");
      
      // Use city ID for API call
      const response = await axios.get(
        "https://api.ajur.app/api/agents-search",
        {
          params: { 
            title: searchTerm, 
            limit: 20, 
            city: currentCity.id 
          },
          timeout: SEARCH_TIMEOUT,
        }
      );
      
      setAgents(response.data.agents || []);
      // Display Persian city name to user
      setSearchStatus(`${response.data.agents.length} مشاور در ${currentCity.title} یافت شد`);
    } catch (error) {
      console.error("Agent search failed:", error);
      setSearchStatus("خطا در جستجوی مشاورین");
    } finally {
      setLoadingAgents(false);
    }
  };

  const navigateToCategory = (persianCategoryName, neighborhoodName = null, englishCategoryName = null) => {
    if (!persianCategoryName || !currentCity) {
      console.error("Missing category name or city");
      handleSnackbar("خطا در انتقال به صفحه دسته‌بندی");
      return;
    }

    handleCloseModal();
    
    // Use English name for URL
    const categorySlug = englishCategoryName;
    
    if (!categorySlug) {
      console.error("No English category name provided");
      handleSnackbar("خطا در ایجاد آدرس");
      return;
    }
    
    let path = `/${currentCity.slug}/${encodeURIComponent(categorySlug)}`;
    
    // Add neighborhood if provided
    if (neighborhoodName) {
      const neighborhoodSlug = convertToEnglishSlug(neighborhoodName);
      path += `/${encodeURIComponent(neighborhoodSlug)}`;
    }
    
    const searchContext = {
      originalQuery: searchQuery,
      selectedCategory: persianCategoryName,
      selectedCategoryEnglish: categorySlug,
      city: currentCity.title,
      citySlug: currentCity.slug,
      neighborhood: neighborhoodName,
      timestamp: Date.now()
    };
    
    localStorage.setItem("lastSearchContext", JSON.stringify(searchContext));
    
    console.log("Navigating to:", path, "Persian:", persianCategoryName, "English:", categorySlug);
    
    setIsRedirecting(true);
    
    router.push(path);
  };

  const handleSearch = async (isManualSearch = true) => {
    if (!currentCity || isLoading) {
      setSearchStatus("لطفاً ابتدا یک شهر را انتخاب کنید");
      return;
    }
    
    const query = searchQuery.trim();
    if (!query) {
      setProperties([]);
      setSearchStatus("جستجو...");
      return;
    }

    console.log(`Searching for "${query}" in ${currentCity.title} (${currentCity.slug})`);

    // Store last query to avoid duplicate searches
    if (lastSearchQueryRef.current === query) {
      console.log("Same query, skipping search");
      return;
    }
    
    lastSearchQueryRef.current = query;

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
        case "buySell":
          try {
            // Find matching categories
            const matchedCategories = findMatchingCategories(query);
            console.log("Found matching categories:", matchedCategories);
            
            if (matchedCategories.length === 0) {
              // Display Persian city name to user
              setSearchStatus(`هیچ دسته‌بندی‌ای برای "${query}" در ${currentCity.title} یافت نشد`);
              setProperties([]);
              break;
            }
            
            // Create display items for each matched category
            const displayItems = await Promise.all(
              matchedCategories.map(async (category, index) => {
                try {
                  // Fetch neighborhoods for this category
                  const response = await axios.post(
                    "https://api.ajur.app/api/search-intent",
                    {
                      query: category.name,
                      original_query: query,
                      cityid: currentCity.id,
                      city_slug: currentCity.slug,
                      category_id: category.id,
                      fuzzy_match: true,
                    },
                    { 
                      timeout: 10000,
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    }
                  );
                  
                  let neighborhoods = [];
                  let totalProperties = 0;
                  
                  // Handle response formats
                  if (response.data && Array.isArray(response.data)) {
                    const categoryData = response.data[0];
                    neighborhoods = categoryData?.neighborhoods || [];
                    totalProperties = neighborhoods.reduce((sum, n) => sum + (n.property_count || 0), 0);
                  } else if (response.data && response.data.neighborhoods) {
                    neighborhoods = response.data.neighborhoods;
                    totalProperties = neighborhoods.reduce((sum, n) => sum + (n.property_count || 0), 0);
                  }
                  
                  console.log(`Category ${category.name}: ${totalProperties} properties found`);
                  
                  return {
                    id: `category-${category.id}-${Date.now()}`,
                    category: category.name, // Persian name for display
                    category_eng: category.eng_name, // English name for URL (from server)
                    category_array: category,
                    categories_array: matchedCategories,
                    neighborhoods: neighborhoods,
                    propertyCounts: neighborhoods.reduce((acc, curr) => {
                      acc[curr.name] = curr.property_count || 0;
                      return acc;
                    }, {}),
                    totalProperties: totalProperties,
                    filters: { category_name: category.name },
                    chips: neighborhoods
                      .filter((n) => (n.property_count || 0) > 0)
                      .slice(0, 5)
                      .map((n) => ({
                        label: `${n.name} (${n.property_count || 0})`,
                        value: n.name,
                      })),
                    isEmpty: neighborhoods.length === 0,
                    hasProperties: totalProperties > 0,
                    isPrimary: index === 0,
                  };
                } catch (error) {
                  console.error(`Error fetching neighborhoods for ${category.name}:`, error);
                  
                  // Return empty but valid category item
                  return {
                    id: `error-${category.id}-${Date.now()}`,
                    category: category.name,
                    category_eng: category.eng_name,
                    category_array: category,
                    categories_array: matchedCategories,
                    neighborhoods: [],
                    propertyCounts: {},
                    totalProperties: 0,
                    filters: { category_name: category.name },
                    chips: [],
                    isEmpty: true,
                    hasProperties: false,
                    isPrimary: index === 0,
                  };
                }
              })
            );
            
            setProperties(displayItems);

            // Update search status with accurate property counts
            const categoriesWithProperties = displayItems.filter(item => item.hasProperties);
            const totalAllProperties = displayItems.reduce((sum, item) => sum + item.totalProperties, 0);
            
            if (displayItems.length === 1) {
              const item = displayItems[0];
              if (item.hasProperties) {
                // Display Persian city name to user
                setSearchStatus(
                  `${item.category} در ${currentCity.title} (${item.totalProperties} ملک)`
                );
              } else {
                setSearchStatus(
                  `${item.category} در ${currentCity.title} ( )`
                );
              }
            } else {
              if (categoriesWithProperties.length > 0) {
                const categoryNames = categoriesWithProperties.map(item => item.category).join("، ");
                setSearchStatus(
                  `${categoriesWithProperties.length} دسته‌بندی با ${totalAllProperties} ملک در ${currentCity.title}: ${categoryNames}`
                );
              } else {
                setSearchStatus(
                  `${displayItems.length} دسته‌بندی در ${currentCity.title} یافت شد (هیچ ملکی یافت نشد)`
                );
              }
            }
            
          } catch (error) {
            console.error("Search error:", error);
            
            // Fallback: Try to find categories without API call
            const matchedCategories = findMatchingCategories(query);
            if (matchedCategories.length > 0) {
              const displayItems = matchedCategories.map((category, index) => ({
                id: `fallback-${category.id}-${Date.now()}`,
                category: category.name,
                category_eng: category.eng_name,
                category_array: category,
                categories_array: matchedCategories,
                neighborhoods: [],
                propertyCounts: {},
                totalProperties: 0,
                filters: { category_name: category.name },
                chips: [],
                isEmpty: true,
                hasProperties: false,
                isPrimary: index === 0,
              }));
              
              setProperties(displayItems);
              setSearchStatus(`${matchedCategories.length} دسته‌بندی در ${currentCity.title} یافت شد (هیچ ملکی یافت نشد)`);
            } else {
              setSearchStatus("خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید");
              setProperties([]);
            }
          }
          break;

        case "agents":
          await getAgentsCall(query);
          break;

        default:
          setSearchStatus("لطفاً یک تب معتبر را انتخاب کنید");
          return;
      }
    } catch (error) {
      console.error("Search error:", error);
      clearTimeout(loadingTimeoutRef.current);
      clearInterval(progressIntervalRef.current);
      setSearchStatus("خطا در جستجو");
    } finally {
      setLoading(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  const set_modal_active = (status) => {
    if (!currentCity || isLoading) {
      handleSnackbar("لطفاً ابتدا یک شهر را انتخاب کنید");
      const citySelectorButton = document.querySelector(
        '[data-testid="citySelectorButton"]'
      );
      if (citySelectorButton) {
        citySelectorButton.click();
      }
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

  const renderCategoryCard = (item, itemIndex) => {
    const hasMultipleCategories = item.categories_array && item.categories_array.length > 1;
    const totalProperties = item.totalProperties || 
      Object.values(item.propertyCounts).reduce((sum, count) => sum + count, 0);
    
    return (
      <div
        key={item.id}
        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4"
      >
        <div className="flex flex-row-reverse items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex flex-col items-end">
            <button 
              onClick={() => navigateToCategory(item.category, null, item.category_eng)}
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
              onClick={() => navigateToCategory(item.category, null, item.category_eng)}
            >
              <span className="text-sm ml-1">همه موارد</span>
              <span>‹</span>
            </button>
          )}
        </div>

        {/* Neighborhoods - only show if there are actual neighborhoods */}
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
                      ? 'bg-green-50 text-gray-700 border-green-200 hover:bg-green-100' 
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                  onClick={() =>
                    navigateToCategory(item.category, neighborhood.name, item.category_eng)
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

        {/* Show all neighborhoods button - only if there are neighborhoods */}
        {item.neighborhoods.length > 5 && !showAllNeighborhoods && (
          <button
            className="w-full py-2 text-center text-blue-600 hover:text-blue-800 text-sm mt-2 focus:outline-none"
            onClick={() => setShowAllNeighborhoods(true)}
          >
            نمایش همه محلات ({item.neighborhoods.length - 5} مورد دیگر)
          </button>
        )}
        
        {/* No properties message - only show if API returned no neighborhoods */}
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
                {/* Show recent searches before showing properties */}
                {searchHistory.length > 0 && properties.length === 0 && !loading && (
                  <div className="text-right mb-6">
                    <h3 className="text-gray-500 text-sm mb-2">جستجوهای اخیر:</h3>
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
                
                {/* Show search hints before properties */}
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
                
                {/* Show matched properties */}
                {properties.length > 0 && (
                  <div className="space-y-4">
                    {properties.map((item, index) => renderCategoryCard(item, index))}
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
                مشاوری در {currentCity?.title || 'این شهر'} یافت نشد
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
        handleCitySelect={(city) => {
          setShowAllNeighborhoods(false);
        }}
      />

      {/* پشتیبانی Button - Added Here */}
      <button
        onClick={() => router.push('/support')}
        className="flex items-center gap-1 px-2 py-3 rounded-xl bg-blue-100 hover:bg-blue-100 text-back-600 border border-blue-200 transition-colors focus:outline-none"
        aria-label="پشتیبانی"
      >
        <SupportIcon style={{ fontSize: 16 }} />
        <span className="text-[12px] font-medium">پشتیبانی</span>
      </button>

      <div
        className="flex-1 flex flex-row-reverse items-center bg-gray-50 rounded-2xl border border-gray-300 h-14 px-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        onClick={() => set_modal_active(true)}
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
          onClick={() => set_modal_active(true)}
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
          <div
            className={`absolute top-0 left-0 right-0 bg-white rounded-b-3xl p-6 max-h-[90vh] overflow-auto flex flex-col animate__animated animate__slideInDown`}
          >
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
                  handleCitySelect={(city) => {
                    setShowAllNeighborhoods(false);
                    if (searchQuery) {
                      handleSearch(true);
                    }
                  }}
                />
              </div>
            </div>

            {/* Fixed input with controlled value and proper RTL handling */}
            <div className="flex flex-row-reverse items-center bg-white border-2 border-red-500 rounded-2xl h-14 mb-6 px-4">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 h-full text-right text-gray-800 text-base outline-none px-3 bg-white rtl"
                style={{ 
                  backgroundColor: "white",
                  textAlign: 'right',
                  direction: 'rtl'
                }}
                placeholder={getCurrentSuggestion() + (currentCity?.title ? ` در ${currentCity.title}` : '')}
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
            style={{
              width: "150px",
              height: "150px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBars;