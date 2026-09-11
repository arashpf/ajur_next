// components/filter/hooks/useServerFilterLogic.js
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDebouncedCallback } from 'use-debounce';

export const useServerFilterLogic = (onFiltersChange, options = {}) => {
  const router = useRouter();
  const { 
    dynamicTickFields = [],
    initialCategory = null,
    city = null
  } = options;

  // Use router.query for initial state (Next.js feature)
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (initialCategory) return initialCategory;
    
    // Try to get from URL
    const categoryId = router.query.category_id;
    if (categoryId) {
      return { 
        id: parseInt(categoryId), 
        name: router.query.category_name || '',
        title: router.query.category_name || ''
      };
    }
    return null;
  });

  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [rangeFilters, setRangeFilters] = useState([]);
  const [sortBy, setSortBy] = useState(router.query.sort_by || 'newest');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState('main');

  // Add city to filters automatically
  useEffect(() => {
    if (city?.id) {
      console.log('🏙️ City context set:', city);
    }
  }, [city]);

  // Get features from dynamic fields or static
  const getFeaturesToUse = useCallback(() => {
    if (dynamicTickFields?.length > 0) {
      return dynamicTickFields.map(field => ({
        id: field.id,
        name: field.name || field.value,
        value: field.value,
        label: field.label || field.name || field.value
      }));
    }
    return [];
  }, [dynamicTickFields]);

  // Build API filters (IMPORTANT: matches your React Native)
  const getApiFilters = useCallback(() => {
    const filters = {
      page: 1,
      per_page: 10
    };

    // Category
    if (selectedCategory?.id) {
      filters.category_id = selectedCategory.id;
    }

    // City from context
    if (city?.id) {
      filters.city_id = city.id;
    }

    // Neighborhoods
    if (selectedNeighborhoods.length > 0) {
      filters.neighborhood_ids = selectedNeighborhoods.map(n => n.id);
    }

    // Features
    if (selectedFeatures.length > 0) {
      filters.features = selectedFeatures.map(f => f.value);
    }

    // Sort
    const sortMap = {
      'newest': 'created_at',
      'oldest': 'created_at_asc', 
      'most_viewed': 'views'
    };
    filters.sort_by = sortMap[sortBy] || 'created_at';

    // Range filters
    rangeFilters.forEach(filter => {
      const fieldMap = {
        'price': 'price',
        'area': 'area', 
        'room_count': 'rooms'
      };
      
      const fieldName = fieldMap[filter.value] || filter.value;
      
      if (filter.low !== '') {
        filters[`min_${fieldName}`] = filter.low;
      }
      if (filter.high !== '') {
        filters[`max_${fieldName}`] = filter.high;
      }
    });

    // Clean empty values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined || filters[key] === null || filters[key] === '') {
        delete filters[key];
      }
    });

    return filters;
  }, [selectedCategory, city, selectedNeighborhoods, selectedFeatures, rangeFilters, sortBy]);

  // Apply filters with URL sync - COMMENTED OUT FOR NOW
  const applyFilters = useCallback((filters, page = 1) => {
    const finalFilters = { ...filters, page };
    
    // Update URL for sharing/bookmarking - COMMENTED OUT
    /*
    router.push(
      {
        pathname: router.pathname,
        query: finalFilters
      },
      undefined,
      { shallow: true }
    );
    */
    
    console.log('🔗 URL update disabled - Would update to:', finalFilters);
    console.log('📁 Current pathname:', router.pathname);

    // Call parent handler
    onFiltersChange(finalFilters, page);
  }, [router, onFiltersChange]);

  // Event handlers
  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    setSelectedFeatures([]);
    applyFilters(getApiFilters());
  }, [applyFilters, getApiFilters]);

  const handleFeatureToggle = useCallback((feature) => {
    setSelectedFeatures(prev => 
      prev.some(f => f.value === feature.value)
        ? prev.filter(f => f.value !== feature.value)
        : [...prev, feature]
    );
  }, []);

  // Debounced filter application
  const debouncedApply = useDebouncedCallback(
    () => {
      applyFilters(getApiFilters());
    },
    300,
    { 
      maxWait: 1000,
      leading: false,
      trailing: true
    }
  );

  // Apply when filters change
  useEffect(() => {
    debouncedApply();
  }, [selectedNeighborhoods, selectedFeatures, rangeFilters, sortBy, debouncedApply]);

  // Add individual filter removal handlers
  const handleCategoryRemove = useCallback(() => {
    setSelectedCategory(null);
    applyFilters(getApiFilters());
  }, [applyFilters, getApiFilters]);

  const handleNeighborhoodRemove = useCallback((neighborhood) => {
    setSelectedNeighborhoods(prev => 
      prev.filter(n => n.id !== neighborhood.id)
    );
  }, []);

  const handleFeatureRemove = useCallback((feature) => {
    setSelectedFeatures(prev => 
      prev.filter(f => f.value !== feature.value)
    );
  }, []);

  const handleRangeFilterRemove = useCallback((filterId, field, value) => {
    setRangeFilters(prev => 
      prev.map(filter => 
        filter.id === filterId 
          ? { ...filter, [field]: value }
          : filter
      ).filter(filter => filter.low !== '' || filter.high !== '')
    );
  }, []);

  const handleSortRemove = useCallback(() => {
    setSortBy('newest');
  }, []);

  const handleResetAll = useCallback(() => {
    setSelectedCategory(null);
    setSelectedNeighborhoods([]);
    setSelectedFeatures([]);
    setRangeFilters([]);
    setSortBy('newest');
    applyFilters({});
  }, [applyFilters]);

  // Get display text for sort
  const getSortDisplayText = useCallback(() => {
    const sortTexts = {
      'newest': 'جدیدترین',
      'oldest': 'قدیمی‌ترین',
      'most_viewed': 'پربازدیدترین'
    };
    return sortTexts[sortBy] || 'جدیدترین';
  }, [sortBy]);

  // Calculate active filters count
  const activeFiltersCount = useCallback(() => {
    let count = 0;
    if (selectedCategory) count++;
    count += selectedNeighborhoods.length;
    count += selectedFeatures.length;
    count += rangeFilters.filter(f => f.low !== '' || f.high !== '').length;
    if (sortBy !== 'newest') count++;
    return count;
  }, [selectedCategory, selectedNeighborhoods, selectedFeatures, rangeFilters, sortBy]);

  return {
    // State
    selectedCategory,
    selectedNeighborhoods,
    selectedFeatures,
    rangeFilters,
    sortBy,
    filterModalVisible,
    activeFilterSection,
    
    // Setters
    setFilterModalVisible,
    setActiveFilterSection,
    setSelectedNeighborhoods,
    setSelectedFeatures,
    setRangeFilters,
    setSortBy,
    
    // Methods
    getApiFilters,
    applyFilters,
    handleCategorySelect,
    handleFeatureToggle,
    handleCategoryRemove,
    handleNeighborhoodRemove,
    handleFeatureRemove,
    handleRangeFilterRemove,
    handleSortRemove,
    handleResetAll,
    getSortDisplayText,
    
    // Data
    availableFeatures: getFeaturesToUse(),
    activeFiltersCount: activeFiltersCount(),
    hasActiveFilters: activeFiltersCount() > 0
  };
};