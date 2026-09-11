// components/filter/hooks/useServerFilterLogic.js
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useServerFilterLogic = (onFiltersChange, options = {}) => {
  const router = useRouter();
  const { 
    dynamicTickFields = [],
    initialCategory = null
  } = options;

  // Initialize state from URL query params
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (initialCategory) return initialCategory;
    
    // Try to get from URL
    const categoryId = router.query.category_id;
    if (categoryId) {
      return { id: parseInt(categoryId) };
    }
    return null;
  });

  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState(() => {
    // Try to get from URL
    const neighborhoodIds = router.query.neighborhood_ids;
    if (neighborhoodIds) {
      return Array.isArray(neighborhoodIds) 
        ? neighborhoodIds.map(id => ({ id: parseInt(id) }))
        : [{ id: parseInt(neighborhoodIds) }];
    }
    return [];
  });

  const [selectedFeatures, setSelectedFeatures] = useState(() => {
    // Try to get from URL
    const features = router.query.features;
    if (features) {
      const featureArray = Array.isArray(features) ? features : features.split(',');
      return featureArray.map(value => ({ value }));
    }
    return [];
  });

  const [rangeFilters, setRangeFilters] = useState(() => {
    // Initialize from URL if available
    const query = router.query;
    const filters = [];
    
    // You would parse range filters from URL here
    // For now, return empty array
    return filters;
  });

  const [sortBy, setSortBy] = useState(() => {
    return router.query.sort_by === 'oldest' ? 'oldest' : 
           router.query.sort_by === 'most_viewed' ? 'most_viewed' : 'newest';
  });

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState('main');

  // Update URL when filters change
  useEffect(() => {
    const query = {};
    
    // Category
    if (selectedCategory?.id) {
      query.category_id = selectedCategory.id;
    }
    
    // Neighborhoods
    if (selectedNeighborhoods.length > 0) {
      query.neighborhood_ids = selectedNeighborhoods.map(n => n.id);
    }
    
    // Features
    if (selectedFeatures.length > 0) {
      query.features = selectedFeatures.map(f => f.value).join(',');
    }
    
    // Sort
    if (sortBy !== 'newest') {
      const sortMap = {
        'newest': 'created_at',
        'oldest': 'created_at_asc', 
        'most_viewed': 'views'
      };
      query.sort_by = sortMap[sortBy] || 'created_at';
    }
    
    // Range filters (simplified for URL)
    rangeFilters.forEach(filter => {
      if (filter.low !== '') {
        query[`min_${filter.value}`] = filter.low;
      }
      if (filter.high !== '') {
        query[`max_${filter.value}`] = filter.high;
      }
    });
    
    // Update URL without page refresh (shallow routing)
    router.push(
      {
        pathname: router.pathname,
        query: query
      },
      undefined,
      { shallow: true, scroll: false }
    );
  }, [selectedCategory, selectedNeighborhoods, selectedFeatures, rangeFilters, sortBy, router]);

  // Handle initial category from props (same as RN)
  useEffect(() => {
    if (initialCategory && initialCategory.id) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Get features to use - dynamic or static (SAME as RN)
  const getFeaturesToUse = () => {
    if (dynamicTickFields && dynamicTickFields.length > 0) {
      console.log('🎯 Using dynamic tick fields:', dynamicTickFields.length);
      return dynamicTickFields.map(field => ({
        id: field.id,
        name: field.name,
        value: field.name,
        label: field.label || field.name
      }));
    }
    return [];
  };

  // Convert to Laravel-compatible parameters (SAME as RN)
  const getApiFilters = useCallback(() => {
    const filters = {};

    // Category
    if (selectedCategory) {
      filters.category_id = selectedCategory.id;
    }

    // Neighborhoods
    if (selectedNeighborhoods.length > 0) {
      filters.neighborhood_ids = selectedNeighborhoods.map(n => n.id);
    }

    // Features - use dynamic field names from API
    if (selectedFeatures.length > 0) {
      filters.features = selectedFeatures.map(f => f.name || f.value);
    }

    // Sort - convert to Laravel column names
    const sortMap = {
      'newest': 'created_at',
      'oldest': 'created_at_asc', 
      'most_viewed': 'views'
    };
    filters.sort_by = sortMap[sortBy] || 'created_at';

    // Range filters - convert to Laravel conventional names
    rangeFilters.forEach(filter => {
      const fieldMap = {
        'price': 'price',
        'area': 'area', 
        'room_count': 'rooms'
        // Add more mappings as needed
      };
      
      const fieldName = fieldMap[filter.value] || filter.value;
      
      if (filter.low !== '') {
        filters[`min_${fieldName}`] = filter.low;
      }
      if (filter.high !== '') {
        filters[`max_${fieldName}`] = filter.high;
      }
    });

    console.log('🔧 API Filters prepared:', filters);
    return filters;
  }, [selectedCategory, selectedNeighborhoods, selectedFeatures, rangeFilters, sortBy]);

  // Apply filters (triggers server call via parent) - SAME as RN
  const applyFilters = useCallback(() => {
    const filters = getApiFilters();
    onFiltersChange(filters, 1);
  }, [getApiFilters, onFiltersChange]);

  // Event handlers (SAME as RN)
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setActiveFilterSection('main');
    setSelectedFeatures([]); // Reset features when category changes
  };

  const handleNeighborhoodToggle = (neighborhood) => {
    setSelectedNeighborhoods(prev =>
      prev.some(n => n.id === neighborhood.id)
        ? prev.filter(n => n.id !== neighborhood.id)
        : [...prev, neighborhood]
    );
  };

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev =>
      prev.some(f => f.value === feature.value || f.id === feature.id)
        ? prev.filter(f => f.value !== feature.value && f.id !== feature.id)
        : [...prev, feature]
    );
  };

  const handleRangeFilterChange = (fieldId, type, value) => {
    setRangeFilters(prev =>
      prev.map(f =>
        f.id === fieldId
          ? {
              ...f,
              [type]: value === '' ? '' : parseFloat(value) || '',
            }
          : f
      )
    );
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleResetAll = () => {
    setSelectedNeighborhoods([]);
    setSelectedFeatures([]);
    setRangeFilters(
      rangeFilters.map(field => ({
        ...field,
        low: '',
        high: '',
      }))
    );
    setSortBy('newest');
  };

  const hasActiveFilters = () => {
    return selectedNeighborhoods.length > 0 ||
      selectedFeatures.length > 0 ||
      rangeFilters.some(filter => filter.low !== '' || filter.high !== '') ||
      sortBy !== 'newest';
  };

  const getSortDisplayText = (sortValue = null) => {
    const sortValueToCheck = sortValue || sortBy;
    const sortTexts = {
      newest: 'جدیدترین',
      oldest: 'قدیمی ترین',
      most_viewed: 'پر بازدید ترین',
    };
    return sortTexts[sortValueToCheck] || 'مرتب‌سازی';
  };

  // Get available features for UI components
  const availableFeatures = getFeaturesToUse();

  return {
    selectedCategory,
    selectedNeighborhoods,
    selectedFeatures,
    rangeFilters,
    sortBy,
    filterModalVisible,
    activeFilterSection,
    setFilterModalVisible,
    setActiveFilterSection,
    getApiFilters,
    applyFilters,
    handleCategorySelect,
    handleNeighborhoodToggle,
    handleFeatureToggle,
    handleRangeFilterChange,
    handleSortChange,
    handleResetAll,
    hasActiveFilters,
    getSortDisplayText,
    availableFeatures,
  };
};