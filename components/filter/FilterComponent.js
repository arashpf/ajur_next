// components/filter/FilterComponent.js (FIXED - No automatic API calls on load)
import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import FilterSlider from './components/FilterSlider';
import { useServerFilterLogic } from './hooks/useServerFilterLogic';
import { filterApi } from './services/filterApi';
import { useRouter } from 'next/router';

// Dynamically import modal
const FilterModal = dynamic(() => import('./components/FilterModal'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <CircularProgress size={24} />
    </Box>
  )
});

const FilterComponent = forwardRef(({ 
  onFilteredDataChange,
  onLoadingChange,
  availableCategories = [],
  initialCategory = null,
  userLocation = null,
  selectedCity = null,
  categoryFields = {},
  loadingFields = false,
  onCategoryChange = null,
  initialServerData = [],
  forceCategory = null,
  onBackToCategories = null,
}, ref) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [serverData, setServerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_count: initialServerData?.length || 0,
    has_next: false
  });

  // State for field values
  const [fieldValues, setFieldValues] = useState({});
  const [activeFieldFilters, setActiveFieldFilters] = useState([]);
  const [hasInitialDataLoaded, setHasInitialDataLoaded] = useState(false);

  // Refs for tracking
  const selectedCategoryRef = useRef(initialCategory);
  const fieldValuesRef = useRef({});
  const userLocationRef = useRef(userLocation);
  const selectedCityRef = useRef(selectedCity);
  const isInitializedRef = useRef(false);
  const apiCallTimeoutRef = useRef(null);

  // Update refs
  useEffect(() => {
    selectedCategoryRef.current = initialCategory;
  }, [initialCategory]);

  useEffect(() => {
    fieldValuesRef.current = fieldValues;
  }, [fieldValues]);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  useEffect(() => {
    selectedCityRef.current = selectedCity;
  }, [selectedCity]);

  useEffect(() => {
    setIsClient(true);
    
    // Set initial data from props (already loaded from server)
    if (initialServerData && initialServerData.length > 0 && !hasInitialDataLoaded) {
      console.log('📦 Setting initial server data:', initialServerData.length, 'workers');
      setServerData(initialServerData);
      setHasInitialDataLoaded(true);
      setPagination({
        current_page: 1,
        total_pages: Math.ceil(initialServerData.length / 10),
        total_count: initialServerData.length,
        has_next: initialServerData.length > 10,
        per_page: 10
      });
      
      // Notify parent about initial data
      if (onFilteredDataChange) {
        onFilteredDataChange(initialServerData, {
          current_page: 1,
          total_pages: Math.ceil(initialServerData.length / 10),
          total_count: initialServerData.length,
          has_next: initialServerData.length > 10,
          per_page: 10
        });
      }
    }
  }, [initialServerData, hasInitialDataLoaded, onFilteredDataChange]);

  // Main API call function - ONLY called on user interactions
 // Main API call function - ONLY called on user interactions
const handleServerFilterChange = useCallback(async (filters, page = 1, options = {}) => {
  // Clear any pending timeout
  if (apiCallTimeoutRef.current) {
    clearTimeout(apiCallTimeoutRef.current);
  }

  // Set loading state only if NOT initializing
  if (!options.isInitializing) {
    setIsLoading(true);
    onLoadingChange?.(true);
  }

  const makeApiCall = async () => {
    let workersData = [];
    let apiResponse = null;
    
    try {
      const allFilters = {
        lat: userLocationRef.current?.lat,
        long: userLocationRef.current?.long,
        page: page,
        per_page: 10,
        ...filters,
      };

      // CRITICAL FIX: Always include catname if we have category name
      // This matches what SSR uses and what the backend expects
      if (selectedCategoryRef.current?.name) {
        const categoryName = selectedCategoryRef.current.name.toLowerCase();
        // Convert spaces to hyphens for URL
        const catnameParam = categoryName.replace(/\s+/g, '-');
        allFilters.catname = catnameParam;
        console.log('📝 Adding catname parameter:', catnameParam);
      }
      
      // Also include category_id as fallback
      if (selectedCategoryRef.current?.id) {
        allFilters.category_id = selectedCategoryRef.current.id;
      }

      // Add city if available - ensure it's the slug format
      if (selectedCityRef.current?.name) {
        const cityName = selectedCityRef.current.name.toLowerCase();
        const cityParam = cityName.replace(/\s+/g, '-');
        allFilters.city = cityParam;
        console.log('📍 Adding city parameter:', cityParam);
      }

      // Add field values
      Object.entries(fieldValuesRef.current).forEach(([fieldSlug, value]) => {
        if (typeof value === 'object') {
          if (value.min && value.min !== '' && value.min !== '0') {
            allFilters[`${fieldSlug}_min`] = value.min;
          }
          if (value.max && value.max !== '' && value.max !== '0') {
            allFilters[`${fieldSlug}_max`] = value.max;
          }
        } else if (value !== '' && value !== null && value !== undefined && value !== '0') {
          allFilters[fieldSlug] = value;
        }
      });

      console.log('📤 Making API call with filters:', allFilters);
      console.log('🌐 Full API URL will be: catname=', allFilters.catname, '&city=', allFilters.city);

      // ⚠️ CRITICAL FIX: Only update URL if NOT initializing and it's a user interaction
      if (!options.isInitializing && !options.skipUrlUpdate) {
        const queryParams = new URLSearchParams();
        Object.entries(allFilters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '' && key !== 'page' && key !== 'per_page') {
            queryParams.append(key, value);
          }
        });

        // Preserve catname in URL if we have it
        if (allFilters.catname) {
          queryParams.set('catname', allFilters.catname);
        }

        router.replace(
          {
            pathname: router.pathname,
            query: Object.fromEntries(queryParams)
          },
          undefined,
          { shallow: true, scroll: false }
        );
      }

      // Call API with error handling
      try {
        apiResponse = await filterApi.getFilteredWorkers(allFilters);
        workersData = apiResponse?.workers || [];
        
        console.log('📥 API Response received:', {
          status: 'success',
          workersCount: workersData.length,
          hasPagination: !!apiResponse?.pagination,
          pagination: apiResponse?.pagination,
          responseKeys: Object.keys(apiResponse || {})
        });
        
      } catch (apiError) {
        console.error('🚨 API call failed:', apiError);
        // Fallback to empty data
        workersData = [];
      }

      // SAFE PAGINATION HANDLING
      const newPagination = {
        current_page: page,
        // total_count: apiResponse?.pagination?.total_count || workersData.length || 0,
        total_count: apiResponse?.pagination?.total_count ?? workersData?.length ?? 0,
        has_next: apiResponse?.pagination?.has_next || false,
        total_pages: apiResponse?.pagination?.total_pages || 0,
        per_page: apiResponse?.pagination?.per_page || 10
      };

      console.log('📊 Setting pagination:', newPagination);

      if (page === 1) {
        setServerData(workersData);
      } else {
        setServerData(prev => [...prev, ...workersData]);
      }
      
      setPagination(newPagination);
      
      // Notify parent with safe data
      if (onFilteredDataChange) {
        onFilteredDataChange(workersData, newPagination);
      }
      
    } catch (error) {
      console.error('❌ Filter API error in makeApiCall:', error);
      
      // Create safe fallback pagination
      const errorPagination = {
        current_page: 1,
        total_count: 0,
        has_next: false,
        total_pages: 0,
        per_page: 10
      };
      
      setServerData([]);
      setPagination(errorPagination);
      
      if (onFilteredDataChange) {
        onFilteredDataChange([], errorPagination);
      }
      
    } finally {
      if (!options.isInitializing) {
        setIsLoading(false);
        onLoadingChange?.(false);
      }
    }
  };

  // If we need debouncing (for rapid filter changes), use timeout
  if (options.debounce) {
    apiCallTimeoutRef.current = setTimeout(makeApiCall, 300);
  } else {
    // Otherwise make the call immediately
    makeApiCall();
  }
}, [onFilteredDataChange, onLoadingChange, router]);

  // Initialize field values from URL - NO API CALL HERE
  useEffect(() => {
    if (!isClient || isInitializedRef.current) return;

    const initializeFromURL = () => {
      console.log('🔄 Initializing field values from URL (no API call)');
      
      // Parse field values from URL
      const newFieldValues = {};
      const { query } = router;
      
      Object.entries(query).forEach(([key, value]) => {
        // Skip standard parameters
        if (['category_id', 'city_id', 'sort_by', 'sort_order', 'page', 'per_page', 'lat', 'lng', 'long'].includes(key)) {
          return;
        }
        
        // Handle range filters
        if (key.endsWith('_min') || key.endsWith('_max')) {
          const baseKey = key.replace(/(_min|_max)$/, '');
          if (!newFieldValues[baseKey]) {
            newFieldValues[baseKey] = { min: '', max: '' };
          }
          
          if (key.endsWith('_min')) {
            newFieldValues[baseKey].min = value;
          } else {
            newFieldValues[baseKey].max = value;
          }
        } else {
          // Regular field
          newFieldValues[key] = value;
        }
      });
      
      if (Object.keys(newFieldValues).length > 0) {
        console.log('📋 Setting field values from URL:', newFieldValues);
        setFieldValues(newFieldValues);
        fieldValuesRef.current = newFieldValues;
        
        // Update active filters display (but don't call API yet)
        Object.entries(newFieldValues).forEach(([fieldSlug, value]) => {
          if (typeof value === 'object') {
            const hasValue = (value.min && value.min !== '' && value.min !== '0') || 
                            (value.max && value.max !== '' && value.max !== '0');
            
            if (hasValue) {
              let displayText = '';
              if (value.min && value.min !== '' && value.min !== '0') {
                displayText += `از ${value.min}`;
              }
              if (value.max && value.max !== '' && value.max !== '0') {
                if (displayText) displayText += ' ';
                displayText += `تا ${value.max}`;
              }
              
              setActiveFieldFilters(prev => {
                const existingIndex = prev.findIndex(f => f.slug === fieldSlug);
                
                const fieldObj = {
                  slug: fieldSlug,
                  name: fieldSlug, // We'll update this later when categoryFields are loaded
                  value: value,
                  displayValue: displayText,
                  type: 'normal_range',
                  unit: '',
                  isRange: true
                };
                
                if (existingIndex >= 0) {
                  const updated = [...prev];
                  updated[existingIndex] = fieldObj;
                  return updated;
                } else {
                  return [...prev, fieldObj];
                }
              });
            }
          } else if (value !== '' && value !== null && value !== undefined && value !== '0') {
            setActiveFieldFilters(prev => {
              const existingIndex = prev.findIndex(f => f.slug === fieldSlug);
              
              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = { 
                  slug: fieldSlug, 
                  name: fieldSlug, // We'll update this later
                  value, 
                  type: 'predefine',
                  unit: '',
                  isRange: false
                };
                return updated;
              } else {
                return [...prev, { 
                  slug: fieldSlug, 
                  name: fieldSlug,
                  value, 
                  type: 'predefine',
                  unit: '',
                  isRange: false
                }];
              }
            });
          }
        });
      }
      
      // Mark as initialized
      isInitializedRef.current = true;
      console.log('✅ Filter component initialized from URL (no API call made)');
    };

    if (router.isReady) {
      initializeFromURL();
    }
  }, [isClient, router.isReady, router.query]);

  // Use server filter logic hook - BUT don't auto-call API
  const {
    selectedCategory,
    selectedNeighborhoods,
    selectedFeatures,
    rangeFilters,
    sortBy,
    filterModalVisible,
    activeFilterSection,
    setFilterModalVisible,
    setActiveFilterSection,
    handleCategorySelect,
    handleNeighborhoodToggle,
    handleFeatureToggle,
    handleRangeFilterChange,
    handleResetAll,
    handleSortChange,
    hasActiveFilters,
    getSortDisplayText,
    availableFeatures,
  } = useServerFilterLogic(handleServerFilterChange, {
    dynamicTickFields: categoryFields.tick || [],
    initialCategory: initialCategory,
  });

  // Update ref when selectedCategory changes
  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);

  // Handle category changes - ONLY when user interacts
  const handleCategorySelectWithApiCall = useCallback((category) => {
    console.log('🎯 User selected category:', category?.name);
    handleCategorySelect(category);
    if (onCategoryChange) onCategoryChange(category);
    
    // Only call API if it's a different category
    if (category?.id !== selectedCategoryRef.current?.id) {
      const filters = {};
      filters.category_id = category?.id;
      handleServerFilterChange(filters, 1, { debounce: false });
    }
  }, [handleCategorySelect, onCategoryChange, handleServerFilterChange]);

  // Handle sort changes - ONLY when user interacts
  const handleSortChangeWithApiCall = useCallback((newSort) => {
    console.log('🎯 User changed sort to:', newSort);
    handleSortChange(newSort);
    
    const filters = { sort_by: newSort };
    handleServerFilterChange(filters, 1, { debounce: false });
  }, [handleSortChange, handleServerFilterChange]);

  // Find field name by slug
  const findFieldNameBySlug = useCallback((slug, type) => {
    const fields = {
      normal: categoryFields.normal || [],
      tick: categoryFields.tick || [],
      predefine: categoryFields.predefine || []
    }[type] || [];
    
    const field = fields.find(f => f.slug === slug);
    return field?.name || field?.value || slug;
  }, [categoryFields]);

  // Find field unit by slug
  const findFieldUnitBySlug = useCallback((slug, type) => {
    const fields = {
      normal: categoryFields.normal || [],
      tick: categoryFields.tick || [],
      predefine: categoryFields.predefine || []
    }[type] || [];
    
    const field = fields.find(f => f.slug === slug);
    return field?.unit || '';
  }, [categoryFields]);

  // Handle field value changes - ONLY when user interacts
  const handleFieldValueChange = useCallback((fieldSlug, value, fieldType, fieldName = '') => {
    console.log('🎯 User changed field value:', {
      name: fieldName || fieldSlug,
      value: value,
      type: fieldType
    });
    
    setFieldValues(prev => ({ 
      ...prev, 
      [fieldSlug]: value 
    }));

    // Update active filters display
    const isRangeValue = fieldType === 'normal_range' || (typeof value === 'object' && (value.min !== undefined || value.max !== undefined));
    
    if (isRangeValue) {
      const hasValue = (value.min && value.min !== '' && value.min !== '0') || 
                       (value.max && value.max !== '' && value.max !== '0');
      
      if (hasValue) {
        setActiveFieldFilters(prev => {
          const existingIndex = prev.findIndex(f => f.slug === fieldSlug);
          
          let displayText = '';
          if (value.min && value.min !== '' && value.min !== '0') {
            displayText += `از ${value.min}`;
          }
          if (value.max && value.max !== '' && value.max !== '0') {
            if (displayText) displayText += ' ';
            displayText += `تا ${value.max}`;
          }
          
          const fieldObj = {
            slug: fieldSlug,
            name: fieldName || findFieldNameBySlug(fieldSlug, fieldType),
            value: value,
            displayValue: displayText,
            type: fieldType,
            unit: findFieldUnitBySlug(fieldSlug, fieldType),
            isRange: true
          };
          
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = fieldObj;
            return updated;
          } else {
            return [...prev, fieldObj];
          }
        });
      } else {
        setActiveFieldFilters(prev => 
          prev.filter(f => f.slug !== fieldSlug)
        );
      }
    } 
    else if (value !== '' && value !== null && value !== undefined && value !== '0') {
      setActiveFieldFilters(prev => {
        const existingIndex = prev.findIndex(f => f.slug === fieldSlug);
        
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { 
            slug: fieldSlug, 
            name: fieldName || findFieldNameBySlug(fieldSlug, fieldType),
            value, 
            type: fieldType,
            unit: findFieldUnitBySlug(fieldSlug, fieldType),
            isRange: false
          };
          return updated;
        } else {
          return [...prev, { 
            slug: fieldSlug, 
            name: fieldName || findFieldNameBySlug(fieldSlug, fieldType),
            value, 
            type: fieldType,
            unit: findFieldUnitBySlug(fieldSlug, fieldType),
            isRange: false
          }];
        }
      });
    } else {
      setActiveFieldFilters(prev => 
        prev.filter(f => f.slug !== fieldSlug)
      );
    }
    
    // Update ref immediately
    fieldValuesRef.current = { ...fieldValuesRef.current, [fieldSlug]: value };
    
    // Trigger API call with debouncing for rapid changes
    const filters = {};
    if (selectedCategoryRef.current?.id) {
      filters.category_id = selectedCategoryRef.current.id;
    }
    handleServerFilterChange(filters, 1, { debounce: true });
  }, [findFieldNameBySlug, findFieldUnitBySlug, handleServerFilterChange]);

  // Remove field filter - ONLY when user interacts
  const handleFieldFilterRemove = useCallback((fieldSlug) => {
    console.log('🎯 User removed field filter:', fieldSlug);
    
    setFieldValues(prev => {
      const updated = { ...prev };
      delete updated[fieldSlug];
      return updated;
    });
    
    // Update ref
    delete fieldValuesRef.current[fieldSlug];
    
    setActiveFieldFilters(prev => 
      prev.filter(f => f.slug !== fieldSlug)
    );
    
    // Apply filter after removal
    const filters = {};
    if (selectedCategoryRef.current?.id) {
      filters.category_id = selectedCategoryRef.current.id;
    }
    handleServerFilterChange(filters, 1, { debounce: false });
  }, [handleServerFilterChange]);

  // Compile all filters
  const compileAllFilters = useCallback(() => {
    const allFilters = {
      category_id: selectedCategory?.id || null,
      page: pagination.current_page,
      per_page: 10
    };
    
    if (sortBy && sortBy !== 'newest') {
      allFilters.sort_by = sortBy;
    }
    
    if (userLocation?.lat && userLocation?.long) {
      allFilters.lat = userLocation.lat;
      allFilters.long = userLocation.long;
    }
    
    Object.entries(fieldValuesRef.current).forEach(([fieldSlug, value]) => {
      if (typeof value === 'object') {
        if (value.min && value.min !== '' && value.min !== '0') {
          allFilters[`${fieldSlug}_min`] = value.min;
        }
        if (value.max && value.max !== '' && value.max !== '0') {
          allFilters[`${fieldSlug}_max`] = value.max;
        }
      } else if (value !== '' && value !== null && value !== undefined && value !== '0') {
        allFilters[fieldSlug] = value;
      }
    });
    
    // Clean empty values
    Object.keys(allFilters).forEach(key => {
      if (allFilters[key] === null || 
          allFilters[key] === undefined || 
          allFilters[key] === '' ||
          (Array.isArray(allFilters[key]) && allFilters[key].length === 0)) {
        delete allFilters[key];
      }
    });
    
    return allFilters;
  }, [selectedCategory, userLocation, sortBy, pagination.current_page]);

  // Calculate active filters count
  const calculateActiveFiltersCount = useCallback(() => {
    let count = 0;
    
    if (selectedCategory) count += 1;
    if (selectedNeighborhoods?.length) count += selectedNeighborhoods.length;
    if (selectedFeatures?.length) count += selectedFeatures.length;
    
    Object.entries(fieldValuesRef.current).forEach(([slug, value]) => { 
      if (typeof value === 'object') {
        if ((value.min && value.min !== '' && value.min !== '0') || 
            (value.max && value.max !== '' && value.max !== '0')) {
          count += 1;
        }
      } else if (value !== '' && value !== null && value !== undefined && value !== '0') {
        count += 1;
      }
    });
    
    if (sortBy && sortBy !== 'newest') count += 1;
    
    return count;
  }, [selectedCategory, selectedNeighborhoods, selectedFeatures, sortBy]);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    refreshData: (page = 1) => {
      console.log('🔄 Manual refresh requested');
      const currentFilters = compileAllFilters();
      return handleServerFilterChange(currentFilters, page, { debounce: false });
    },
    
    getCurrentFilters: () => {
      return compileAllFilters();
    },
    
    getPagination: () => {
      return pagination;
    },
    
    loadMoreData: () => {
      if (pagination.has_next && !isLoading) {
        const currentFilters = compileAllFilters();
        return handleServerFilterChange(currentFilters, pagination.current_page + 1, { debounce: false });
      }
      return Promise.resolve();
    },
    
    hasActiveFilters: hasActiveFilters,
  }));

  // Open category section
  const openCategorySection = () => {
    setActiveFilterSection('categories');
    setFilterModalVisible(true);
  };

  // Reset all filters - ONLY when user clicks reset
  const handleReset = useCallback(() => {
    console.log('🎯 User clicked reset all filters');
    
    // Clear timeout
    if (apiCallTimeoutRef.current) {
      clearTimeout(apiCallTimeoutRef.current);
      apiCallTimeoutRef.current = null;
    }
    
    // Reset states
    setServerData([]);
    setPagination({ current_page: 1, total_count: 0, has_next: false, total_pages: 0 });
    setFieldValues({});
    fieldValuesRef.current = {};
    setActiveFieldFilters([]);
    handleResetAll();
    
    // Clear URL parameters
    router.replace(
      {
        pathname: router.pathname,
        query: {}
      },
      undefined,
      { shallow: true, scroll: false }
    );
    
    // Make API call with reset filters
    if (selectedCategoryRef.current?.id) {
      const filters = { category_id: selectedCategoryRef.current.id };
      handleServerFilterChange(filters, 1, { debounce: false });
    }
  }, [handleResetAll, router, handleServerFilterChange]);

  // Remove category - ONLY when user clicks remove
  const handleCategoryRemove = useCallback(() => {
    if (!forceCategory) {
      console.log('🎯 User removed category');
      handleCategorySelect(null);
      onCategoryChange?.(null);
      setFieldValues({});
      fieldValuesRef.current = {};
      setActiveFieldFilters([]);
      setServerData([]);
      setPagination({ current_page: 1, total_count: 0, has_next: false, total_pages: 0 });
    }
  }, [forceCategory, handleCategorySelect, onCategoryChange]);

  // Apply filters after closing modal
  const handleApplyFilters = useCallback(() => {
    console.log('🎯 User applied filters from modal');
    
    setFilterModalVisible(false);
    const filters = {};
    if (selectedCategory?.id) {
      filters.category_id = selectedCategory.id;
    }
    handleServerFilterChange(filters, 1, { debounce: false });
  }, [selectedCategory, handleServerFilterChange, setFilterModalVisible]);

  const handleModalClose = useCallback(() => {
    console.log('🎯 User closed modal');
    handleApplyFilters();
  }, [handleApplyFilters]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (apiCallTimeoutRef.current) {
        clearTimeout(apiCallTimeoutRef.current);
      }
    };
  }, []);

  if (!isClient) {
    return (
      <Box sx={{ height: 60, bgcolor: '#f8f9fa' }} />
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {onBackToCategories && (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: '#f8f9fa',
            p: 1.5,
            borderBottom: 1,
            borderColor: '#e0e0e0',
            mb: 1
          }}
        >
          {/* Back button would go here */}
        </Box>
      )}

      <FilterSlider
        selectedCategory={selectedCategory}
        selectedNeighborhoods={selectedNeighborhoods}
        selectedFeatures={selectedFeatures}
        rangeFilters={rangeFilters}
        sortBy={sortBy}
        hasActiveFilters={hasActiveFilters}
        onFilterModalOpen={() => setFilterModalVisible(true)}
        onFilterModalOpenForCategory={openCategorySection}
        onCategoryRemove={handleCategoryRemove}
        onNeighborhoodRemove={handleNeighborhoodToggle}
        onFeatureRemove={handleFeatureToggle}
        onRangeFilterRemove={handleRangeFilterChange}
        onSortRemove={() => handleSortChangeWithApiCall('newest')}
        onResetAll={handleReset}
        getSortDisplayText={getSortDisplayText}
        isCategoryLocked={!!forceCategory}
        activeFiltersCount={calculateActiveFiltersCount()}
        
        // Field-related props
        fieldValues={fieldValues}
        activeFieldFilters={activeFieldFilters}
        onFieldFilterRemove={handleFieldFilterRemove}
        categoryFields={categoryFields}
        isLoading={isLoading}
      />

      {filterModalVisible && (
        <FilterModal
          visible={filterModalVisible}
          activeSection={activeFilterSection}
          selectedCategory={selectedCategory}
          selectedNeighborhoods={selectedNeighborhoods}
          selectedFeatures={selectedFeatures}
          rangeFilters={rangeFilters}
          sortBy={sortBy}
          availableCategories={availableCategories}
          onClose={handleModalClose}
          onSectionChange={setActiveFilterSection}
          onCategorySelect={handleCategorySelectWithApiCall}
          onNeighborhoodToggle={handleNeighborhoodToggle}
          onFeatureToggle={handleFeatureToggle}
          onRangeFilterChange={handleRangeFilterChange}
          onSortChange={handleSortChangeWithApiCall}
          onResetAll={handleReset}
          getSortDisplayText={getSortDisplayText}
          filteredCount={pagination.total_count}
          isLoading={isLoading}
          isCategoryLocked={!!forceCategory}
          categoryFields={categoryFields}
          loadingFields={loadingFields}
          onFieldValueChange={handleFieldValueChange}
          fieldValues={fieldValues}
          features={availableFeatures || []}
        />
      )}
    </Box>
  );
});

FilterComponent.displayName = 'FilterComponent';
export default FilterComponent;