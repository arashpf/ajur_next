import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  CircularProgress,
  Divider,
  Typography,
  Chip,
  Stack,
  Menu,
  MenuItem,
  useMediaQuery,
  Skeleton,
  useTheme,
  TextField,
  Paper,
  InputAdornment,
  Alert,
} from "@mui/material";
import {
  ExpandMore,
  Delete,
  CheckBoxOutlineBlank,
  CheckBox,
  RadioButtonChecked,
  RadioButtonUnchecked,
  Close,
  Tune,
  ArrowBack,
  Sort,
  Refresh,
  Search
} from "@mui/icons-material";


// Utility functions
const convertToPersianDigits = (str) => {
  if (!str) return "";
  return str.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
};

const formatNumber = (num) => {
  if (num === "" || num === null || num === undefined) return "";
  const number = parseFloat(num);
  if (isNaN(number)) return "";

  return convertToPersianDigits(
    number.toLocaleString("en-US", { maximumFractionDigits: 0 })
  );
};

const formatNumberWithWords = (num) => {
  if (num === "" || num === null || num === undefined) return "";
  const number = parseFloat(num);
  if (isNaN(number)) return "";

  // For numbers >= 1 billion
  if (number >= 1000000000) {
    const billions = Math.floor(number / 1000000000);
    const remainder = number % 1000000000;
    let result = `${convertToPersianDigits(billions.toString())} میلیارد`;
    if (remainder > 0) {
      const millions = Math.floor(remainder / 1000000);
      result += ` و ${convertToPersianDigits(millions.toString())} میلیون`;
    }
    return result;
  }

  // For numbers >= 1 million
  if (number >= 1000000) {
    const millions = Math.floor(number / 1000000);
    const remainder = number % 1000000;
    let result = `${convertToPersianDigits(millions.toString())} میلیون`;
    if (remainder > 0) {
      const thousands = Math.floor(remainder / 1000);
      result += ` و ${convertToPersianDigits(thousands.toString())} هزار`;
    }
    return result;
  }

  // For numbers >= 1000
  if (number >= 1000) {
    const thousands = Math.floor(number / 1000);
    const remainder = number % 1000;
    let result = `${convertToPersianDigits(thousands.toString())} هزار`;
    if (remainder > 0) {
      result += ` و ${convertToPersianDigits(remainder.toString())}`;
    }
    return result;
  }

  return convertToPersianDigits(number.toString());
};

// Custom hook for back button handling
const useBackButton = (isFilterOpen, filterLevel, setFilterLevel, setIsFilterOpen) => {
  const historyAdded = useRef(false);
  const cleanupTimeoutRef = useRef(null);

  useEffect(() => {
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }

    if (!isFilterOpen) {
      if (historyAdded.current) {
        cleanupTimeoutRef.current = setTimeout(() => {
          if (window.history.state?.filterModalOpen) {
            window.history.back();
          }
          historyAdded.current = false;
        }, 100);
      }
      return;
    }

    if (!historyAdded.current) {
      window.history.pushState({ filterModalOpen: true, filterLevel }, '');
      historyAdded.current = true;
    }

    const handlePopState = (event) => {
      if (!isFilterOpen) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();

      if (filterLevel !== "base") {
        setFilterLevel("base");
        window.history.replaceState({
          filterModalOpen: true,
          filterLevel: "base"
        }, '');
      } else {
        setIsFilterOpen(false);
        cleanupTimeoutRef.current = setTimeout(() => {
          if (historyAdded.current && window.history.state?.filterModalOpen) {
            window.history.back();
            historyAdded.current = false;
          }
        }, 50);
      }
    };

    window.addEventListener('popstate', handlePopState, true);

    return () => {
      window.removeEventListener('popstate', handlePopState, true);

      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }
    };
  }, [isFilterOpen, filterLevel, setFilterLevel, setIsFilterOpen]);

  useEffect(() => {
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, []);
};

const WorkerFilter = ({
  workers = [],
  onFilteredWorkersChange,
  onLoadingChange = null,
  initialCategory = null,
  onCategoryChange = null,
  city = null,
  appliedFilters = {},
  onFilterCountChange
}) => {
  const router = useRouter();

  if (router && typeof router.pathname === "string" && router.pathname.startsWith("/panel")) {
    return null;
  }

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [rangeFilters, setRangeFilters] = useState([]);
  const [filterLevel, setFilterLevel] = useState("base");
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [focusedField, setFocusedField] = useState(null);
  const [moreFiltersExpanded, setMoreFiltersExpanded] = useState(true);
  const [featuresExpanded, setFeaturesExpanded] = useState(true);
  const [filterError, setFilterError] = useState(null);
  const [filterLoading, setFilterLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  

  // Data
  const [categories, setCategories] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);

  // State for dynamically extracted filters
  const [dynamicRangeFilters, setDynamicRangeFilters] = useState([]);
  const [dynamicFeatures, setDynamicFeatures] = useState([]);

  // Ref for initial category comparison
  const initialCategoryRef = useRef(null);

  // Use the back button hook
  useBackButton(isFilterOpen, filterLevel, setFilterLevel, setIsFilterOpen);

  // Initialize initialCategoryRef when component mounts
  useEffect(() => {
    if (initialCategory && !initialCategoryRef.current) {
      initialCategoryRef.current = initialCategory;
      // console.log('📝 Setting initial category ref:', initialCategory);
    }
  }, [initialCategory]);

  // Set selectedCategory when initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      // console.log('📝 Setting selected category from initialCategory:', initialCategory); 
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (city) {
      // console.log('🏙️ WorkerFilter received city:', city);
    }
  }, [city]);

  useEffect(() => {
    if (isFilterOpen) {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = `-${scrollX}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';

      document.documentElement.style.position = 'fixed';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.width = '100%';
      document.documentElement.style.height = '100%';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        document.documentElement.style.position = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.width = '';
        document.documentElement.style.height = '';

        window.scrollTo(scrollX, scrollY);
      };
    }
  }, [isFilterOpen]);




  // When filters change, update parent and aware him about the amount of filters
  useEffect(() => {
    const count = countActiveFilters();
    onFilterCountChange(count);
  }, [
    selectedCategory,
    selectedNeighborhoods,
    selectedFeatures,
    rangeFilters,
    sortBy
  ]);

  const getSuggestionsByFieldName = (fieldName) => {
    const lowerField = fieldName.toLowerCase();

    if (lowerField.includes("قیمت")) {
      return [
        { value: 500000000, label: "۵۰۰ میلیون" },
        { value: 1000000000, label: "۱ میلیارد" },
        { value: 1500000000, label: "۱/۵ میلیارد" },
        { value: 2000000000, label: "۲ میلیارد" },
        { value: 2500000000, label: "۲/۵ میلیارد" },
        { value: 3000000000, label: "۳ میلیارد" },
        { value: 5000000000, label: "۵ میلیارد" },
        { value: 10000000000, label: "۱۰ میلیارد" },
      ];
    }

    if (lowerField.includes("متراژ")) {
      return [
        { value: 50, label: "۵۰ متر" },
        { value: 70, label: "۷۰ متر" },
        { value: 100, label: "۱۰۰ متر" },
        { value: 120, label: "۱۲۰ متر" },
        { value: 150, label: "۱۵۰ متر" },
        { value: 200, label: "۲۰۰ متر" },
        { value: 250, label: "۲۵۰ متر" },
        { value: 300, label: "۳۰۰ متر" },
      ];
    }

    return [];
  };

  const extractCategoryFilters = (categoryId) => {
    if (!categoryId || !workers || workers.length === 0) {

    
      // setDynamicRangeFilters([]);
      // setDynamicFeatures([]);
      return;
    }

    const categoryWorkers = workers.filter(
      (w) => parseInt(w.category_id) === categoryId
    );

    if (categoryWorkers.length === 0) {
     
      // setDynamicRangeFilters([]);
      // setDynamicFeatures([]);
      return;
    }

    const allProperties = new Map();
    const booleanProperties = new Map();

    categoryWorkers.forEach((worker) => {
      try {
        const props = JSON.parse(worker.json_properties || "[]");
        props.forEach((prop) => {
          if (prop.kind === 1 && !allProperties.has(prop.name)) {
            allProperties.set(prop.name, {
              name: prop.name,
              value: prop.name,
              unit: prop.name === "متراژ" ? "متر" : "تومان",
              kind: 1,
              order: prop.order,
              min: 0,
              max: 10000,
            });
          }
          if (prop.kind === 2 && !booleanProperties.has(prop.name)) {
            booleanProperties.set(prop.name, {
              id: Math.random(),
              name: prop.name,
              value: prop.name,
            });
          }
        });
      } catch (e) {
        console.error("Error parsing json_properties:", e);
      }
    });

    const rangeFilters = Array.from(allProperties.values())
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((field, idx) => ({
        ...field,
        id: idx + 1,
      }));

    const features = Array.from(booleanProperties.values());

    setDynamicRangeFilters(rangeFilters);
    setDynamicFeatures(features);
  };

  useEffect(() => {
    if (selectedCategory) {
      // console.log('🔄 Extracting filters for category:', selectedCategory);
      extractCategoryFilters(selectedCategory.id);
    }
  }, [selectedCategory, workers]);

  const getSuggestions = (fieldId) => {
    const filter = dynamicRangeFilters.find((f) => f.id === fieldId);
    if (!filter) return [];
    return getSuggestionsByFieldName(filter.name);
  };

  const handleSuggestionClick = (fieldId, type, value) => {
    setRangeFilters((prev) =>
      prev.map((f) =>
        f.id === fieldId
          ? {
            ...f,
            [type]: value.toString(),
          }
          : f
      )
    );
    setFocusedField(null);
  };

  // useEffect(() => {
  //   const initialRangeFilters = dynamicRangeFilters.map((field) => ({
  //     ...field,
  //     low: "",
  //     high: "",
  //   }));
  //   setRangeFilters(initialRangeFilters);
  // }, [dynamicRangeFilters]);


  //useEffect(() => {
    // Only initialize if we have dynamicRangeFilters
    //if (dynamicRangeFilters.length === 0) return;

    // Check if we have URL parameters to initialize from
    //const query = router.query;

    //const initialRangeFilters = dynamicRangeFilters.map((field) => {
     // const minParam = `${field.value}_min`;
     // const maxParam = `${field.value}_max`;

     // return {
     //   ...field,
     //   low: query[minParam]?.toString() || "",
     //   high: query[maxParam]?.toString() || ""
    //  };
    //});

    // setRangeFilters(initialRangeFilters);

  
  //}, [dynamicRangeFilters, router.isReady, router.query]);


  useEffect(() => {
    if (!router.isReady || dynamicRangeFilters.length === 0) return;
  
    const initialRangeFilters = dynamicRangeFilters.map((field) => {
      const minParam = `${field.value}_min`;
      const maxParam = `${field.value}_max`;
  
      return {
        ...field,
        low: router.query[minParam]?.toString() || "",
        high: router.query[maxParam]?.toString() || ""
      };
    });
  
    setRangeFilters(initialRangeFilters);
  }, [router.isReady,dynamicRangeFilters.length >0]); // Only runs once when router is ready
  


  useEffect(() => {
    if (dynamicRangeFilters.length === 0) return;
  
    // Only run if URL has range params (initial load from URL)
    const hasRangeParams = dynamicRangeFilters.some((field) => {
      const minParam = `${field.value}_min`;
      const maxParam = `${field.value}_max`;
      return router.query[minParam] || router.query[maxParam];
    });
  
    if (!hasRangeParams) return; // Skip if no range params in URL
  
    const initialRangeFilters = dynamicRangeFilters.map((field) => {
      const minParam = `${field.value}_min`;
      const maxParam = `${field.value}_max`;
  
      return {
        ...field,
        low: router.query[minParam]?.toString() || "",
        high: router.query[maxParam]?.toString() || ""
      };
    });
  
    setRangeFilters(initialRangeFilters);
  }, [dynamicRangeFilters, router.query]);
  


  


  


  




  

  useEffect(() => {
    return;
    if (appliedFilters && Object.keys(appliedFilters).length > 0) {
      // console.log('🔄 Initializing filters from server:', appliedFilters);

      if (appliedFilters.categoryId && categories.length > 0) {
        const category = categories.find(c => c.id == appliedFilters.categoryId);
        if (category) {
          // console.log('✅ Found category from appliedFilters:', category);
          setSelectedCategory(category);
        }
      }

      if (appliedFilters.features) {
        let featureArray = [];

        try {
          const parsed = JSON.parse(appliedFilters.features);
          if (Array.isArray(parsed)) {
            featureArray = parsed.map(feature => ({
              id: Math.random(),
              name: feature,
              value: feature
            }));
          }
        } catch (e) {
          if (typeof appliedFilters.features === 'string') {
            featureArray = appliedFilters.features.split(',').map(feature => ({
              id: Math.random(),
              name: feature.trim(),
              value: feature.trim()
            }));
          }
        }

        setSelectedFeatures(featureArray);
      }

      if (appliedFilters.neighborhoods && neighborhoods.length > 0) {
        let neighborhoodArray = [];

        if (typeof appliedFilters.neighborhoods === 'string') {
          const neighborhoodIds = appliedFilters.neighborhoods.split(',');
          neighborhoodArray = neighborhoodIds.map(id => {
            const neighborhood = neighborhoods.find(n => n.id == id);
            return neighborhood;
          }).filter(Boolean);
        }

        setSelectedNeighborhoods(neighborhoodArray);
      }

      if (appliedFilters.sortBy) {
        setSortBy(appliedFilters.sortBy);
      }

      if (appliedFilters.rangeFilters && dynamicRangeFilters.length > 0) {
        const updatedRangeFilters = [...rangeFilters];

        Object.keys(appliedFilters.rangeFilters).forEach(paramName => {
          if (paramName.includes('_min') || paramName.includes('_max')) {
            const isMin = paramName.includes('_min');
            const propertyName = isMin ?
              paramName.replace('_min', '') :
              paramName.replace('_max', '');

            const value = appliedFilters.rangeFilters[paramName];

            const filterIndex = updatedRangeFilters.findIndex(f =>
              f.value === propertyName || f.name === propertyName
            );

            if (filterIndex !== -1) {
              updatedRangeFilters[filterIndex] = {
                ...updatedRangeFilters[filterIndex],
                [isMin ? 'low' : 'high']: value
              };
            }
          }
        });

        setRangeFilters(updatedRangeFilters);
      }
    }
  }, [appliedFilters, categories, neighborhoods, dynamicRangeFilters]);

  const fetchData = async () => {
    try {
      let apiUrl = "https://api.ajur.app/api/base";

      if (city) {
        apiUrl += `?city=${encodeURIComponent(city)}`;
        // console.log('🌐 Fetching base API with city:', city);
      }

      const response = await axios.get(apiUrl);

      setCategories(response.data.cats || []);
      setNeighborhoods(response.data.the_neighborhoods || []);
    } catch (error) {
      console.error("❌ Error loading filters:", error);
      setCategories([]);
      setNeighborhoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [city]);

  // Find the default category from URL or props
  // Find the default category from URL or props
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      // console.log('🔍 Looking for category:', {
      //   routerQuery: router.query,
      //   categoriesCount: categories.length,
      //   initialCategory: initialCategory
      // });

      // Try to find category by name from URL query parameter 'catname'
      const { catname, name } = router.query;
      const categoryName = catname || name;

      if (categoryName) {
        // console.log('🔍 Searching for category with name:', categoryName);

        // Try to find category by exact name match
        let foundCategory = categories.find(cat =>
          cat.name === categoryName ||
          cat.slug === categoryName ||
          cat.value === categoryName
        );

        // If not found by exact name, try partial match
        if (!foundCategory) {
          foundCategory = categories.find(cat =>
            cat.name.includes(categoryName) ||
            categoryName.includes(cat.name)
          );
        }

        if (foundCategory) {
          // console.log('✅ Found category from URL:', foundCategory);
          setSelectedCategory(foundCategory);
          return;
        }
      }

      // If we have initialCategory from props, use that
      if (initialCategory && initialCategory.id) {
        // console.log('📝 Using initialCategory from props:', initialCategory);

        // Try to find category by id first
        let foundCategory = categories.find(cat => cat.id == initialCategory.id);

        // If not found by id, try by name
        if (!foundCategory && initialCategory.name) {
          foundCategory = categories.find(cat =>
            cat.name === initialCategory.name ||
            cat.value === initialCategory.name
          );
        }

        if (foundCategory) {
          setSelectedCategory(foundCategory);
        } else if (initialCategory.name) {
          // If category not found in categories list but we have a name, use it
          setSelectedCategory(initialCategory);
        }
      }
    }
  }, [categories, router.query, initialCategory, selectedCategory]);

  const handleNeighborhoodRemove = (neighborhoodId) => {
    // Remove from selected neighborhoods
    const newNeighborhoods = selectedNeighborhoods.filter(n => n.id !== neighborhoodId);
    setSelectedNeighborhoods(newNeighborhoods);

    // Update URL immediately
    const query = { ...router.query };

    if (newNeighborhoods.length > 0) {
      // Update neighborhoods parameter
      const neighborhoodIds = newNeighborhoods.map(n => n.id);
      query.neighborhoods = neighborhoodIds.join(',');
    } else {
      // Remove neighborhoods parameter if empty
      delete query.neighborhoods;
    }

    // Reset to page 1 when filters change
    query.page = "1";

    // console.log('🗑️ Removing neighborhood from URL:', query);

    // Update URL
    router.push({
      pathname: router.pathname,
      query: query
    }, undefined, { shallow: true });
  };

  const applyServerSideFilters = () => {
    // console.log('🚀 Applying server-side filters immediately');
    // console.log('Selected Category:', selectedCategory);
    // console.log('Initial Category Ref:', initialCategoryRef.current);
    setSearchQuery('');

    setFilterLevel("base");

    setFilterError(null);
    setFilterLoading(true);

    if (onLoadingChange) {
      onLoadingChange(true);
    }

    // Build query parameters for serverFilteredWorkers API
    const query = { ...router.query };

    // Always reset to page 1 when filters change
    query.page = "1";

    // Add category ID if selected and different from initial
    // if (selectedCategory && selectedCategory.id !== initialCategoryRef.current?.id) {
    //   query.categoryId = selectedCategory.id;
    //   query.category_id = selectedCategory.id; // Backend expects category_id
    //   console.log('📤 Adding category filter:', selectedCategory.id);
    // } else {
    //   delete query.categoryId;
    //   delete query.category_id;
    //   console.log('🗑️ Removing category filter');
    // }

    // Send features as comma-separated string
    if (selectedFeatures.length > 0) {
      const featureNames = selectedFeatures.map(f => f.value);
      query.features = featureNames.join(',');
      // console.log('📤 Sending features:', query.features);
    } else {
      delete query.features;
    }

    // Send neighborhood IDs as comma-separated string
    if (selectedNeighborhoods.length > 0) {
      const neighborhoodIds = selectedNeighborhoods.map(n => n.id);
      query.neighborhoods = neighborhoodIds.join(',');
      // console.log('📤 Sending neighborhood IDs:', query.neighborhoods);
    } else {
      delete query.neighborhoods;
    }

    // Add sort by if not default
    if (sortBy !== "newest") {
      query.sortBy = sortBy;
    } else {
      delete query.sortBy;
    }

    // Remove existing range filter parameters
    Object.keys(query).forEach(key => {
      if (key.includes('_min') || key.includes('_max')) {
        delete query[key];
      }
    });

    // Add new range filter parameters - your backend expects _min/_max
    rangeFilters.forEach(filter => {
      if (filter.low !== "") {
        const paramName = `${filter.value}_min`;
        query[paramName] = filter.low;
      }
      if (filter.high !== "") {
        const paramName = `${filter.value}_max`;
        query[paramName] = filter.high;
      }
    });

    // console.log('📤 Sending query to server:', query);

    // Update URL - this will trigger getServerSideProps with new filters
    router.push({
      pathname: router.pathname,
      query: query
    })
      .then(() => {
        setFilterLoading(false);
        if (onLoadingChange) {
          onLoadingChange(false);
        }
        setIsFilterOpen(false);
      })
      .catch(error => {
        console.error('Error applying filters:', error);
        setFilterError('خطا در اعمال فیلترها. لطفا دوباره تلاش کنید.');
        setFilterLoading(false);
        if (onLoadingChange) {
          onLoadingChange(false);
        }
      });
  };

  useEffect(() => {
    if (!categories.length) return;
  }, [
    selectedCategory,
    selectedNeighborhoods,
    selectedFeatures,
    rangeFilters,
    sortBy,
    categories,
  ]);

  const handleCategoryChange = () => {
    setIsFilterOpen(true);
    setFilterLevel("category");
  };

  const handleCategorySelect = (category) => {
    // console.log('✅ Category selected:', category); 
    if (onCategoryChange) {
      onCategoryChange(category);
    }
    setSelectedCategory(category);
    setFilterLevel("base");
  };

  const handleNeighborhoodToggle = (neighborhood) => {
    setSelectedNeighborhoods((prev) =>
      prev.some((n) => n.id === neighborhood.id)
        ? prev.filter((n) => n.id !== neighborhood.id)
        : [...prev, neighborhood]
    );
  };

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures((prev) =>
      prev.some((f) => f.value === feature.value)
        ? prev.filter((f) => f.value !== feature.value)
        : [...prev, feature]
    );
  };

  const handleRangeFilterChange = (fieldId, type, value) => {
    setRangeFilters((prev) =>
      prev.map((f) =>
        f.id === fieldId
          ? {
            ...f,
            [type]: value,
          }
          : f
      )
    );
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setSortAnchorEl(null);
  };

  const handleResetAll = () => {
    setSortBy("newest");
    setSelectedFeatures([]);
    setSelectedNeighborhoods([]);
    setRangeFilters(dynamicRangeFilters.map(filter => ({ ...filter, low: "", high: "" })));

    // Reset category only if it's not the initial one
    if (selectedCategory && selectedCategory.id !== initialCategoryRef.current?.id) {
      setSelectedCategory(null);
    }

    // Update URL
    // FIX: You need to provide actual values for dynamic segments
    // If your route is /[categories]/[name], you need to provide categories and name values
    const categories = router.query.categories || "sell-apartments"; // You need to determine this
    const name = router.query.name || "default-name"; // You need to determine this

    router.push({
      pathname: `/${categories}/${name}`, // Use actual values, not router.pathname
      query: {
        ...(router.query.catname && { catname: router.query.catname }),
        // ...(router.query.name && { name: router.query.name }),
        ...(router.query.city && { city: router.query.city }),
      },
    }, undefined, { shallow: true });


    setIsFilterOpen(false);
  };




  const countActiveFilters = () => {
    let count = 0;

    // Category filter
    if (selectedCategory && selectedCategory.id !== initialCategoryRef.current?.id) {
      count++;
    }

    // Neighborhood filters
    count += selectedNeighborhoods.length;

    // Feature filters
    count += selectedFeatures.length;

    // Range filters
    count += rangeFilters.filter(f => f.low !== "" || f.high !== "").length;

    // Sort filter
    if (sortBy !== "newest") {
      count++;
    }

    return count - 1;
  };


  const getSortDisplayText = () => {
    const sortTexts = {
      newest: "جدیدترین",
      oldest: "قدیمی ترین",
      most_viewed: "پر بازدید ترین",
    };
    return sortTexts[sortBy] || "مرتب‌سازی";
  };

  const handleModalClose = () => {
    setIsFilterOpen(false);
  }

  const handleModalBackButton = () => {
    if (filterLevel !== "base") {
      setFilterLevel("base");
    } else {
      setIsFilterOpen(false);
    }
  };

  useEffect(() => {
    const handleRouteChangeStart = () => {
      if (onLoadingChange) {
        onLoadingChange(true);
      }
    };

    const handleRouteChangeComplete = () => {
      if (onLoadingChange) {
        onLoadingChange(false);
      }
    };

    const handleRouteChangeError = () => {
      if (onLoadingChange) {
        onLoadingChange(false);
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router.events, onLoadingChange]);







  const renderSelectedFilters = () => {
    // Compare with initialCategoryRef instead of initialCategory
    const hasActiveFilters =
      (selectedCategory && selectedCategory.id !== initialCategoryRef.current?.id) ||
      selectedNeighborhoods.length > 0 ||
      selectedFeatures.length > 0 ||
      rangeFilters.some((filter) => filter.low !== "" || filter.high !== "") ||
      sortBy !== "newest";

    if (!hasActiveFilters) return null;

    return (
      <Box
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "grey.300",
        }}
      >
        {filterError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {filterError}
          </Alert>
        )}

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {selectedCategory && selectedCategory.id !== initialCategoryRef.current?.id && (
            <Chip
              label={`دسته ‌بندی: ${selectedCategory.name}`}
              onClick={() => handleCategoryChange()}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}

          {selectedNeighborhoods.map((neighborhood) => (
            <Chip
              key={neighborhood.id}
              label={`محله: ${neighborhood.name}`}
              onDelete={() => handleNeighborhoodRemove(neighborhood.id)}
              color="secondary"
              variant="outlined"
              size="small"
            />
          ))}

          {selectedFeatures.map((feature) => (
            <Chip
              key={feature.value}
              label={`دارای ${feature.value}`}
              onDelete={() =>
                setSelectedFeatures((prev) =>
                  prev.filter((f) => f.value !== feature.value)
                )
              }
              color="success"
              variant="outlined"
              size="small"
            />
          ))}

          {rangeFilters
            .map((filter) => {
              if (filter.low !== "" || filter.high !== "") {
                let label = `${filter.name}: `;

                if (filter.low !== "" && filter.high !== "") {
                  label += `${formatNumberWithWords(
                    filter.low
                  )} تا ${formatNumberWithWords(filter.high)} ${filter.unit}`;
                } else if (filter.low !== "") {
                  label += `از ${formatNumberWithWords(filter.low)}`;
                } else if (filter.high !== "") {
                  label += `تا ${formatNumberWithWords(filter.high)}`;
                }

                return (
                  <Chip
                    key={filter.id}
                    label={label}
                    onDelete={() => {
                      setRangeFilters((prev) =>
                        prev.map((f) =>
                          f.id === filter.id ? { ...f, low: "", high: "" } : f
                        )
                      );
                    }}
                    color="warning"
                    variant="outlined"
                    size="small"
                  />
                );
              }
              return null;
            })
            .filter(Boolean)}

          {sortBy !== "newest" && (
            <Chip
              label={`مرتب‌سازی: ${getSortDisplayText()}`}
              onDelete={() => setSortBy("newest")}
              color="info"
              variant="outlined"
              size="small"
            />
          )}

          <Chip
            label="پاک کردن همه"
            onClick={handleResetAll}
            color="error"
            variant="outlined"
            size="small"
            icon={<Delete />}
          />
        </Stack>
      </Box>
    );
  };

  const renderFeatures = () => {
    if (dynamicFeatures.length === 0) {
      return null;
    }

    return (
      <Box
        sx={{
          mb: 2,
          borderTop: 2,
          borderColor: "#e0e0e0",
        }}
      >
        <Accordion
          expanded={featuresExpanded}
          onChange={() => setFeaturesExpanded(!featuresExpanded)}
          sx={{
            "&:before": {
              display: "none",
            },
            borderColor: "#e0e0e0",
            transition: "all 0.3s ease",
            boxShadow: 0,
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMore
                sx={{ color: featuresExpanded ? "#b92a31" : "#666" }}
              />
            }
            sx={{
              minHeight: "48px",
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "center",
              "& .MuiAccordionSummary-content": {
                margin: "12px 0",
                flex: 1,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              },
              "& .MuiAccordionSummary-expandIconWrapper": {
                marginRight: 0,
                marginLeft: 0,
              },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "#b92a31", fontWeight: 600, textAlign: "right" }}
            >
              امکانات
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 2 }}>
            <Grid container spacing={1}>
              {dynamicFeatures.map((feature) => {
                const isSelected = selectedFeatures.some(
                  (f) => f.value === feature.value
                );

                return (
                  <Grid item xs={12} sm={6} key={feature.id}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        border: "2px solid",
                        borderColor: isSelected ? "#b92a31" : "#e0e0e0",
                        borderRadius: 3,
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(185, 42, 49, 0.1) 0%, rgba(192, 192, 192, 0.1) 100%)"
                          : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 240, 240, 0.8) 100%)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "#b92a31",
                          boxShadow: "0 2px 8px rgba(185, 42, 49, 0.15)",
                        },
                      }}
                      onClick={() => handleFeatureToggle(feature)}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          border: "2px solid",
                          borderColor: isSelected ? "#b92a31" : "#999",
                          borderRadius: "6px",
                          background: isSelected
                            ? "linear-gradient(135deg, #b92a31 0%, #a01c22 100%)"
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s ease",
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && (
                          <CheckBox sx={{ color: "white", fontSize: 18 }} />
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        fontWeight={isSelected ? 600 : 500}
                        sx={{ color: isSelected ? "#b92a31" : "#333", ml: 1.5 }}
                      >
                        {feature.value}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  const renderRangeFilters = () => (
    <Box
      sx={{
        mb: 2,
        borderTop: 2,
        borderColor: "#e0e0e0",
      }}
    >
      <Accordion
        expanded={moreFiltersExpanded}
        onChange={() => setMoreFiltersExpanded(!moreFiltersExpanded)}
        sx={{
          "&:before": {
            display: "none",
          },
          borderColor: "#e0e0e0",
          transition: "all 0.3s ease",
          boxShadow: 0,
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMore
              sx={{ color: moreFiltersExpanded ? "#b92a31" : "#666" }}
            />
          }
          sx={{
            minHeight: "48px",
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            "& .MuiAccordionSummary-content": {
              margin: "12px 0",
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            },
            "& .MuiAccordionSummary-expandIconWrapper": {
              marginRight: 0,
              marginLeft: 0,
            },
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: "#b92a31", fontWeight: 600, textAlign: "right" }}
          >
            فیلترهای بیشتر
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            {dynamicRangeFilters.map((filter) => {
              const rangeFilter = rangeFilters.find(
                (rf) => rf.id === filter.id
              );
              if (!rangeFilter) return null;

              return (
                <Grid item xs={12} key={filter.id}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 500, textAlign: "right", width: "100%", direction: "rtl" }}
                  >
                    {/* {filter.name} ({filter.unit}) */}
                    {filter.name}
                  </Typography>

                  {(rangeFilter.low !== "" || rangeFilter.high !== "") && (
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        background:
                          "linear-gradient(135deg, rgba(185, 42, 49, 0.05) 0%, rgba(192, 192, 192, 0.05) 100%)",
                        borderRadius: 2,
                        border: "1px solid rgba(185, 42, 49, 0.1)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#666", fontWeight: 500, textAlign: "right", width: "100%", direction: "rtl" }}
                      >
                        {rangeFilter.low !== "" && (
                          <span>
                            از {formatNumber(rangeFilter.low)} {" "}
                          </span>
                        )}
                        {rangeFilter.low !== "" && rangeFilter.high !== "" && (
                          <span>تا </span>
                        )}
                        {rangeFilter.high !== "" && (
                          <span>
                            {formatNumber(rangeFilter.high)} 
                          </span>
                        )}
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <Box sx={{ flex: 1, position: "relative" }}>
                      <TextField
                        size="small"
                        placeholder="تا"
                        value={rangeFilter.high}
                        onChange={(e) =>
                          handleRangeFilterChange(
                            filter.id,
                            "high",
                            e.target.value
                          )
                        }
                        onFocus={() => setFocusedField(`${filter.id}-high`)}
                        onBlur={(e) => {
                          setTimeout(() => {
                            const relatedTarget = e.relatedTarget;
                            const isClickingSuggestion =
                              relatedTarget &&
                              relatedTarget.closest &&
                              relatedTarget.closest("[data-suggestion]");

                            if (!isClickingSuggestion) {
                              setFocusedField(null);
                            }
                          }, 150);
                        }}
                        fullWidth
                        type="number"
                        inputProps={{
                          min: filter.min,
                          max: filter.max,
                          style: { textAlign: "center" },
                          autoComplete: "off",
                          autoCorrect: "off",
                          autoCapitalize: "off",
                          spellCheck: "false",
                        }}
                        autoComplete="off"
                        name={`filter-${filter.id}-high`}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2.5,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            border: "1.5px solid #e0e0e0",
                            "&:hover": {
                              borderColor: "#b92a31",
                              backgroundColor: "rgba(255, 255, 255, 1)",
                            },
                            "&.Mui-focused": {
                              borderColor: "#b92a31",
                              boxShadow: "0 0 0 2px rgba(185, 42, 49, 0.1)",
                            },
                          },
                        }}
                      />
                      {focusedField === `${filter.id}-high` &&
                        getSuggestions(filter.id).length > 0 && (
                          <Paper
                            sx={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              zIndex: 10,
                              mt: 0.5,
                              maxHeight: 150,
                              overflow: "auto",
                              borderRadius: 2,
                              border: "1.5px solid #b92a31",
                              boxShadow: "0 4px 12px rgba(185, 42, 49, 0.15)",
                            }}
                            elevation={0}
                          >
                            {getSuggestions(filter.id).map(
                              (suggestion, index) => (
                                <Box
                                  key={index}
                                  data-suggestion="true"
                                  sx={{
                                    p: 1.2,
                                    cursor: "pointer",
                                    borderBottom: "1px solid #f0f0f0",
                                    background:
                                      "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(245,245,245,1) 100%)",
                                    "&:hover": {
                                      bgcolor: "rgba(185, 42, 49, 0.08)",
                                      borderBottomColor: "#b92a31",
                                    },
                                    "&:last-child": {
                                      borderBottom: "none",
                                    },
                                  }}
                                  onClick={() => {
                                    handleSuggestionClick(
                                      filter.id,
                                      "high",
                                      suggestion.value
                                    );
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ textAlign: "center" }}
                                  >
                                    {suggestion.label}
                                  </Typography>
                                </Box>
                              )
                            )}
                          </Paper>
                        )}
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ minWidth: "30px", textAlign: "center" }}
                    >
                      تا
                    </Typography>

                    <Box sx={{ flex: 1, position: "relative" }}>
                      <TextField
                        size="small"
                        placeholder="از"
                        value={rangeFilter.low}
                        onChange={(e) =>
                          handleRangeFilterChange(
                            filter.id,
                            "low",
                            e.target.value
                          )
                        }
                        onFocus={() => setFocusedField(`${filter.id}-low`)}
                        onBlur={(e) => {
                          setTimeout(() => {
                            const relatedTarget = e.relatedTarget;
                            const isClickingSuggestion =
                              relatedTarget &&
                              relatedTarget.closest &&
                              relatedTarget.closest("[data-suggestion]");

                            if (!isClickingSuggestion) {
                              setFocusedField(null);
                            }
                          }, 150);
                        }}
                        fullWidth
                        type="number"
                        inputProps={{
                          min: filter.min,
                          max: rangeFilter.high || filter.max,
                          style: { textAlign: "center" },
                          autoComplete: "off",
                          autoCorrect: "off",
                          autoCapitalize: "off",
                          spellCheck: "false",
                        }}
                        autoComplete="off"
                        name={`filter-${filter.id}-low`}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2.5,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            border: "1.5px solid #e0e0e0",
                            "&:hover": {
                              borderColor: "#b92a31",
                              backgroundColor: "rgba(255, 255, 255, 1)",
                            },
                            "&.Mui-focused": {
                              borderColor: "#b92a31",
                              boxShadow: "0 0 0 2px rgba(185, 42, 49, 0.1)",
                            },
                          },
                        }}
                      />
                      {focusedField === `${filter.id}-low` &&
                        getSuggestions(filter.id).length > 0 && (
                          <Paper
                            sx={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              zIndex: 10,
                              mt: 0.5,
                              maxHeight: 150,
                              overflow: "auto",
                              borderRadius: 2,
                              border: "1.5px solid #b92a31",
                              boxShadow: "0 4px 12px rgba(185, 42, 49, 0.15)",
                            }}
                            elevation={0}
                          >
                            {getSuggestions(filter.id).map(
                              (suggestion, index) => (
                                <Box
                                  key={index}
                                  data-suggestion="true"
                                  sx={{
                                    p: 1.2,
                                    cursor: "pointer",
                                    borderBottom: "1px solid #f0f0f0",
                                    background:
                                      "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(245,245,245,1) 100%)",
                                    "&:hover": {
                                      bgcolor: "rgba(185, 42, 49, 0.08)",
                                      borderBottomColor: "#b92a31",
                                    },
                                    "&:last-child": {
                                      borderBottom: "none",
                                    },
                                  }}
                                  onClick={() => {
                                    handleSuggestionClick(
                                      filter.id,
                                      "low",
                                      suggestion.value
                                    );
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      textAlign: "center",
                                      color: "#333",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {suggestion.label}
                                  </Typography>
                                </Box>
                              )
                            )}
                          </Paper>
                        )}
                    </Box>
                  </Box>

                  {/* {(rangeFilter.low !== "" || rangeFilter.high !== "") && (
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        background:
                          "linear-gradient(135deg, rgba(185, 42, 49, 0.05) 0%, rgba(192, 192, 192, 0.05) 100%)",
                        borderRadius: 2,
                        border: "1px solid rgba(185, 42, 49, 0.1)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#666", fontWeight: 500, textAlign: "right", width: "100%", direction: "rtl" }}
                      >
                        {rangeFilter.low !== "" && (
                          <span>
                            از {formatNumber(rangeFilter.low)} {" "}
                          </span>
                        )}
                        {rangeFilter.low !== "" && rangeFilter.high !== "" && (
                          <span>تا </span>
                        )}
                        {rangeFilter.high !== "" && (
                          <span>
                            {formatNumber(rangeFilter.high)} 
                          </span>
                        )}
                      </Typography>
                    </Box>
                  )} */}
                </Grid>
              );
            })}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: isMobile ? 82 : 80,
          left: isMobile ? 24 : 16, // Increased from 16 to 24 on mobile
          right: isMobile ? 24 : "auto", // Increased from 16 to 24 on mobile
          zIndex: 15,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          width: isMobile ? "calc(100% - 48px)" : "auto", // Updated from 32px to 48px (24+24)
        }}
      >
        <Button
          onClick={() => setIsFilterOpen(true)}
          variant="contained"
          sx={{
            width: isMobile ? "100%" : 100,
            minWidth: isMobile ? "auto" : 100,
            height: isMobile ? 40 : 48,
            borderRadius: "24px",
            background: "linear-gradient(135deg, #a92b31 0%, #d45b61 100%)",
            color: "white",
            boxShadow: "0 4px 15px rgba(169, 43, 49, 0.3)",
            px: isMobile ? 4 : 2, // Increased from 3 to 4 on mobile
            py: 1,
            fontFamily: "'Vazir', 'Segoe UI', sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            letterSpacing: "0.5px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #8c2328 0%, #c2494f 100%)",
              boxShadow: "0 6px 20px rgba(169, 43, 49, 0.4)",
              transform: "translateY(-2px)",
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: "0 2px 10px rgba(169, 43, 49, 0.3)",
            },
          }}
        >
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "flex-start",
            gap: 1,
            width: "100%"
          }}>
            <Tune sx={{ fontSize: 20 }} />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "14px",
                position: "relative" // Add this for badge positioning
              }}
            >
              فیلترها
    {countActiveFilters() > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: -30,
                    backgroundColor: "#b92a31", // Red color
                    color: "white",
                    borderRadius: "50%",
                    width: 21,
                    height: 21,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  <p>
                    {countActiveFilters()}
                  </p>
                </Box>
              )}
            </Typography>
          </Box>

        </Button>
      </Box>

      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={() => setSortAnchorEl(null)}
      >
        <MenuItem
          onClick={() => handleSortChange("newest")}
          selected={sortBy === "newest"}
        >
          جدیدترین
        </MenuItem>
        <MenuItem
          onClick={() => handleSortChange("oldest")}
          selected={sortBy === "oldest"}
        >
          قدیمی ترین
        </MenuItem>
        <MenuItem
          onClick={() => handleSortChange("most_viewed")}
          selected={sortBy === "most_viewed"}
        >
          پر بازدید ترین
        </MenuItem>
      </Menu>

      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: isFilterOpen ? 0 : isMobile ? "-100%" : -500,
          width: isMobile ? "100%" : 500,
          height: "100vh",
          bgcolor: "background.paper",
          boxShadow: 3,
          borderLeft: "1px solid",
          borderColor: "divider",
          transition: "right 0.3s ease-in-out",
          zIndex: 1200,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #b92a31 0%, #e74c3c 100%)",
            color: "white",
            p: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #a01c22",
          }}
        >
          <Button
            onClick={handleModalBackButton}
            color="inherit"
            sx={{
              "&:hover": {
                background: "linear-gradient(135deg, #a01c22 0%, #c0392b 100%)",
              },
            }}
          >
            {filterLevel === "base" ? <Close /> : <ArrowBack />}
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            فیلترها
          </Typography>
          <Button
            onClick={handleResetAll}
            color="inherit"
            size="small"
            sx={{
              "&:hover": {
                background: "linear-gradient(135deg, #a01c22 0%, #c0392b 100%)",
              },
            }}
          >
            حذف همه
          </Button>
        </Box>

        {renderSelectedFilters()}

        <Box sx={{
          flex: 1,
          overflow: "auto",
          mb: 3,
          pb: isMobile && filterLevel === "base" && isFilterOpen ? "100px" : "0"
        }}>
          {filterLevel === "category" ? (
            <Box sx={{ p: 2 }}>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                  }}
                >
                  <CircularProgress size={40} sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Loading categories...
                  </Typography>
                </Box>
              ) : categories.length === 0 ? (
                <Typography
                  sx={{ textAlign: "center", p: 3 }}
                  color="text.secondary"
                >
                  No categories available
                </Typography>
              ) : (
                    <Grid container spacing={2}>
                      {categories.map((category) => (
                        <Grid item xs={6} key={category.id}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 2,
                              cursor: "pointer",
                              border: "1px solid",
                              borderColor:
                                selectedCategory?.id === category.id
                                  ? "#b92a31"
                                  : "grey.300",
                              borderRadius: 1,
                              bgcolor:
                                selectedCategory?.id === category.id
                                  ? "rgba(185, 42, 49, 0.1)"
                                  : "white",
                              "&:hover": {
                                bgcolor:
                                  selectedCategory?.id === category.id
                                    ? "rgba(185, 42, 49, 0.15)"
                                    : "grey.50",
                                borderColor:
                                  selectedCategory?.id === category.id
                                    ? "#b92a31"
                                    : "grey.400",
                              },
                              transition: "all 0.2s ease-in-out",
                              height: "100%",
                              minHeight: "80px",
                            }}
                            onClick={() => handleCategorySelect(category)}
                          >
                            {selectedCategory?.id === category.id ? (
                              <RadioButtonChecked sx={{ ml: 1, color: "#b92a31" }} />
                            ) : (
                                <RadioButtonUnchecked
                                  sx={{ ml: 1, color: "grey.500" }}
                                />
                              )}
                            <Typography
                              sx={{
                                ml: 2,
                                fontWeight: 500,
                                textAlign: "right",
                                flex: 1,
                              }}
                            >
                              {category.name}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
            </Box>
          ) : filterLevel === "region" ? (
            <Box sx={{ p: 2 }}>
              {/* Search Box */}
              <TextField
                fullWidth
                variant="outlined"
                placeholder="جستجوی محله..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />

              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                  }}
                >
                  <CircularProgress size={40} sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Loading neighborhoods...
      </Typography>
                </Box>
              ) : neighborhoods && neighborhoods.length > 0 ? (
                <Grid container spacing={1}>
  {neighborhoods
    .filter((neighborhood) =>
      searchQuery.length >= 2
        ? neighborhood.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .map((neighborhood) => (
      <Grid item xs={12} md={6} key={neighborhood.id}>
        <Button
          variant={
            selectedNeighborhoods.some((n) => n.id === neighborhood.id)
              ? "contained"
              : "outlined"
          }
          fullWidth
          startIcon={
            selectedNeighborhoods.some((n) => n.id === neighborhood.id) ? (
              <CheckBox />
            ) : (
              <CheckBoxOutlineBlank />
            )
          }
          onClick={() => handleNeighborhoodToggle(neighborhood)}
          sx={{
            justifyContent: "flex-start",
            textAlign: "right", // Right alignment for Persian text
            direction: "rtl", // Right-to-left direction
            padding: "12px 16px", // More padding for better touch targets
            borderRadius: "8px", // Rounded corners
            marginBottom: "4px", // Small spacing between items
            transition: "all 0.2s ease-in-out", // Smooth transitions
            "&.Mui-contained": {
              backgroundColor: "#b92a31",
              "&:hover": {
                backgroundColor: "#a01c22",
                transform: "translateY(-2px)", // Lift effect on hover
                boxShadow: "0 4px 8px rgba(160, 28, 34, 0.3)", // Shadow on hover
              },
              boxShadow: "0 2px 4px rgba(185, 42, 49, 0.2)", // Subtle shadow
            },
            "&.Mui-outlined": {
              borderColor: "#b92a31",
              color: "#b92a31",
              "&:hover": {
                borderColor: "#a01c22",
                backgroundColor: "rgba(185, 42, 49, 0.08)", // Slightly stronger hover
                transform: "translateY(-2px)", // Lift effect on hover
                boxShadow: "0 4px 8px rgba(185, 42, 49, 0.1)", // Shadow on hover
              },
            },
            "& .MuiButton-startIcon": {
              marginRight: "0", // Remove default right margin
              marginLeft: "8px", // Add left margin for RTL
            },
          }}
        >
          <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "flex-end", // Align content to right
            width: "100%",
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 500,
                fontSize: "0.95rem",
              }}
            >
              {neighborhood.name}
            </Typography>
            
          </Box>
        </Button>
      </Grid>
    ))}
</Grid>

              ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 4,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        محله‌ای یافت نشد
      </Typography>
                    </Box>
                  )}
            </Box>

          ) : (
                <Box sx={{ p: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      my: 1,
                      p: 1,
                    }}
                  >
                    <Button
                      onClick={(e) => setSortAnchorEl(e.currentTarget)}
                      variant="outlined"
                      size="small"
                      startIcon={<Sort />}
                      sx={{
                        borderColor: '#b92a31',
                        color: '#b92a31',
                        '&:hover': {
                          borderColor: '#a01c22',
                          backgroundColor: 'rgba(185, 42, 49, 0.04)',
                        }
                      }}
                    >
                      {getSortDisplayText()}
                    </Button>
                    <span>مرتب‌سازی</span>
                  </Box>
                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      my: 1,
                      p: 1,
                    }}
                  >
                    <Button
                      onClick={() => setFilterLevel("category")}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#b92a31',
                        color: '#b92a31',
                        '&:hover': {
                          borderColor: '#a01c22',
                          backgroundColor: 'rgba(185, 42, 49, 0.04)',
                        }
                      }}
                    >
                      {selectedCategory && selectedCategory.id !== initialCategoryRef.current?.id ? "تغییر" : "انتخاب"}
                    </Button>
                    <span>
                      {selectedCategory
                        ? `دسته بندی: ${selectedCategory.name}`
                        : "انتخاب دسته بندی"}
                    </span>
                  </Box>
                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      my: 1,
                      p: 1,
                    }}
                  >
                    <Button
                      onClick={() => setFilterLevel("region")}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#b92a31',
                        color: '#b92a31',
                        '&:hover': {
                          borderColor: '#a01c22',
                          backgroundColor: 'rgba(185, 42, 49, 0.04)',
                        }
                      }}
                    >
                      {selectedNeighborhoods.length > 0 ? "تغییر" : "انتخاب"}
                    </Button>
                    <span>
                      {selectedNeighborhoods.length > 0
                        ? `محله ها: ${selectedNeighborhoods
                          .slice(0, 2)
                          .map((n) => n.name)
                          .join("، ")}${selectedNeighborhoods.length > 2 ? "..." : ""
                        }`
                        : "انتخاب محله"}
                    </span>
                  </Box>
                  <Divider />

                  {renderFeatures()}

                  {renderRangeFilters()}
                </Box>
              )}
        </Box>

        {filterLevel !== "category" && isFilterOpen && (
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #e0e0e0",
              bgcolor: "#f5f5f5",
              position: isMobile ? "fixed" : "static",
              bottom: isMobile ? 0 : "auto",
              left: 0,
              right: 0,
              zIndex: 10,
              boxShadow: isMobile ? "0 -4px 20px rgba(0, 0, 0, 0.1)" : "none",
            }}
          >
            {filterError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {filterError}
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={applyServerSideFilters}
              disabled={filterLoading}
              sx={{
                background: "linear-gradient(135deg, #b92a31 0%, #e74c3c 100%)",
                color: "white",
                fontWeight: 600,
                py: 1,
                borderRadius: isMobile ? "12px" : "8px",
                fontSize: isMobile ? "16px" : "14px",
                mb: isMobile ? "max(16px, env(safe-area-inset-bottom))" : 0,
                "&:hover": {
                  background: "linear-gradient(135deg, #a01c22 0%, #c0392b 100%)",
                },
                "&:disabled": {
                  background: "linear-gradient(135deg, #cccccc 0%, #aaaaaa 100%)",
                }
              }}
            >
              {filterLoading ? (
                <>
                  <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
          در حال اعمال فیلترها...
        </>
              ) : (
                  "اعمال فیلترها"
                )}
            </Button>
          </Box>
        )}
      </Box>

      {isFilterOpen && isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // bgcolor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1199,
          }}
          onClick={handleModalClose}
        />
      )}



      {/* {(isMobile || 1) && (
  <Box
    sx={{
      position: "fixed",
      top: 120,
      left: isMobile ? 24 : 0,
      right: isMobile ? 24 : 0,
      p: 1,
      borderBottom: "1px solid",
      borderColor: "divider",
      maxHeight: "100px",
      overflow: "auto",
      zIndex: 10,
      display:
        (selectedCategory && selectedCategory.id !== initialCategoryRef.current?.id) ||
        selectedNeighborhoods.length > 0 ||
        selectedFeatures.length > 0 ||
        rangeFilters.some((f) => f.low !== "" || f.high !== "")
          ? "block"
          : "none",
    }}
  >
    {renderSelectedFilters()}
  </Box>
)} */}

    </>
  );
};

export default WorkerFilter;