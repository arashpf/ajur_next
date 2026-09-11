// components/filter/FilterModal.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  Slider,
  CircularProgress,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close,
  ArrowBack,
  Check,
  Tune,
  FilterList,
  RadioButtonChecked,
  RadioButtonUnchecked,
  ChevronLeft,
  Menu,
  CheckCircle,
  Sort,
  Place,
} from '@mui/icons-material';
import { formatNumberWithWords, formatNumber } from '../utils/formatters';

const FilterModal = ({
  visible,
  activeSection,
  selectedCategory,
  selectedNeighborhoods,
  selectedFeatures,
  rangeFilters,
  sortBy,
  availableCategories,
  onClose,
  onSectionChange,
  onCategorySelect,
  onNeighborhoodToggle,
  onFeatureToggle,
  onRangeFilterChange,
  onSortChange,
  onResetAll,
  getSortDisplayText,
  filteredCount,
  isLoading,
  isCategoryLocked,
  categoryFields = {},
  loadingFields = false,
  onFieldValueChange,
  fieldValues = {},
  features = [],
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [localFieldValues, setLocalFieldValues] = useState({});
  const [focusedInput, setFocusedInput] = useState({ slug: null, type: null });

  useEffect(() => {
    if (visible) {
      setLocalFieldValues(fieldValues);
    }
  }, [visible, fieldValues]);

  const formatNumberInput = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const unformatNumber = (text) => {
    const persianToEnglish = text.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
    return persianToEnglish.replace(/,/g, '');
  };

  const handleFieldRangeChange = (fieldSlug, type, text, fieldName) => {
    const numericValue = unformatNumber(text);
    
    setLocalFieldValues(prev => {
      const current = prev[fieldSlug] || { min: '', max: '' };
      return {
        ...prev,
        [fieldSlug]: {
          ...current,
          [type]: numericValue
        }
      };
    });
  };

  const handleApplyAndClose = () => {
    Object.entries(localFieldValues).forEach(([slug, value]) => {
      if (JSON.stringify(value) !== JSON.stringify(fieldValues[slug])) {
        const fieldConfig = [...(categoryFields.normal || []), ...(categoryFields.predefine || [])]
          .find(f => f.slug === slug);
        
        if (fieldConfig) {
          const fieldName = fieldConfig.name || fieldConfig.value || fieldConfig.label || slug;
          
          if (fieldConfig.type === 'normal' && typeof value === 'object') {
            onFieldValueChange(slug, value, 'normal_range', fieldName);
          } else {
            onFieldValueChange(slug, value, fieldConfig.type || 'normal', fieldName);
          }
        }
      }
    });
    onClose();
  };

  const handleChipPress = (fieldSlug, type, chipValue) => {
    setLocalFieldValues(prev => {
      const current = prev[fieldSlug] || { min: '', max: '' };
      return {
        ...prev,
        [fieldSlug]: {
          ...current,
          [type]: chipValue.toString()
        }
      };
    });
    
    setFocusedInput({ slug: null, type: null });
  };

  const renderPriceChipSuggestions = (field, currentValue, isMinField) => {
    if (field.unit !== 'تومان') return null;
    
    const valueStr = isMinField ? currentValue.min : currentValue.max;
    if (!valueStr) return null;
    
    const persianToEnglish = (str) => {
      const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      return str.replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d));
    };
    
    const englishValueStr = persianToEnglish(valueStr);
    const value = parseFloat(englishValueStr);
    
    if (!value || isNaN(value) || value === 0) return null;
    
    const chips = [];
    
    if (value < 1000) {
      chips.push(
        { label: `${formatNumberWithWords(value)} هزار`, value: value * 1000 },
        { label: `${formatNumberWithWords(value)} میلیون`, value: value * 1000000 },
        { label: `${formatNumberWithWords(value)} میلیارد`, value: value * 1000000000 }
      );
    } else if (value >= 1000 && value <= 999999) {
      const millions = value / 1000;
      chips.push(
        { label: `${formatNumberWithWords(millions)} میلیون`, value: value * 1000 },
        { label: `${formatNumberWithWords(value / 1000000)} میلیارد`, value: value * 1000000 }
      );
    } else if (value >= 1000000 && value <= 999999999) {
      const billions = value / 1000000;
      chips.push(
        { label: `${formatNumberWithWords(billions)} میلیارد`, value: value * 1000000 }
      );
    }
    
    const uniqueChips = chips.filter((chip, index, self) =>
      chip.value > 0 && 
      self.findIndex(c => c.value === chip.value) === index
    );
    
    if (uniqueChips.length === 0) return null;

    const fieldType = isMinField ? 'min' : 'max';

    return (
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1, 
        mb: 1,
        bgcolor: '#f9f9f9',
        p: 1,
        borderRadius: 1,
        border: '1px solid #eee'
      }}>
        <Typography variant="caption" sx={{ color: '#666', ml: 1 }}>
          پیشنهاد:
        </Typography>
        {uniqueChips.map((chip, index) => (
          <Chip
            key={index}
            label={chip.label}
            onClick={() => handleChipPress(field.slug, fieldType, chip.value)}
            size="small"
            sx={{ 
              bgcolor: '#a92b31',
              color: 'white',
              '&:hover': { bgcolor: '#8c2328' }
            }}
          />
        ))}
      </Box>
    );
  };

  const renderNormalFields = () => {
    if (loadingFields) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
            در حال بارگذاری فیلترها...
          </Typography>
        </Box>
      );
    }

    const normalFields = categoryFields.normal || [];
    if (normalFields.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          محدوده قیمت و مشخصات
        </Typography>
        {normalFields.map((field) => {
          const currentValue = localFieldValues[field.slug] || { min: '', max: '' };
          const minValue = currentValue.min || '';
          const maxValue = currentValue.max || '';
          
          const isMinFocused = focusedInput.slug === field.slug && focusedInput.type === 'min';
          const isMaxFocused = focusedInput.slug === field.slug && focusedInput.type === 'max';
          const isPriceField = field.unit === 'تومان';

          const displayedMin = isPriceField ? formatNumberInput(minValue) : minValue;
          const displayedMax = isPriceField ? formatNumberInput(maxValue) : maxValue;

          return (
            <Box key={field.slug} sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {field.name || field.value}
                {field.unit ? ` (${field.unit})` : ''}
              </Typography>
              
              {field.unit === 'تومان' && isMinFocused && 
                renderPriceChipSuggestions(field, currentValue, true)}
              {field.unit === 'تومان' && isMaxFocused && 
                renderPriceChipSuggestions(field, currentValue, false)}
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={"تا " + (field.name || field.value)}
                  value={displayedMax}
                  onChange={(e) => handleFieldRangeChange(field.slug, 'max', e.target.value, field.name || field.value)}
                  onFocus={() => setFocusedInput({ slug: field.slug, type: 'max' })}
                  onBlur={() => setFocusedInput({ slug: null, type: null })}
                  type={isPriceField ? 'text' : 'number'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                
                <Typography variant="body2" sx={{ minWidth: '30px', textAlign: 'center' }}>
                  تا
                </Typography>
                
                <TextField
                  fullWidth
                  size="small"
                  placeholder={"از " + (field.name || field.value)}
                  value={displayedMin}
                  onChange={(e) => handleFieldRangeChange(field.slug, 'min', e.target.value, field.name || field.value)}
                  onFocus={() => setFocusedInput({ slug: field.slug, type: 'min' })}
                  onBlur={() => setFocusedInput({ slug: null, type: null })}
                  type={isPriceField ? 'text' : 'number'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  const renderPredefineFields = () => {
    if (loadingFields) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
            در حال بارگذاری فیلترها...
          </Typography>
        </Box>
      );
    }

    const predefineFields = categoryFields.predefine || [];
    if (predefineFields.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          فیلترهای انتخابی
        </Typography>
        {predefineFields.map((field) => (
          <Box key={field.slug} sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {field.name || field.value}
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={localFieldValues[field.slug] || ''}
                onChange={(e) => {
                  setLocalFieldValues(prev => ({
                    ...prev,
                    [field.slug]: e.target.value
                  }));
                }}
                displayEmpty
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    انتخاب کنید
                  </Typography>
                </MenuItem>
                {field.options?.map((option, index) => (
                  <MenuItem 
                    key={option.value || option.id || index}
                    value={option.value || option.id || option.name}
                  >
                    {option.label || option.value || option.name || `گزینه ${index + 1}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}
      </Box>
    );
  };

  const renderContent = () => {
    if (activeSection === 'categories') {
      return (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            انتخاب دسته‌بندی
          </Typography>
          {availableCategories.map((category) => (
            <Button
              key={category.id}
              fullWidth
              sx={{
                justifyContent: 'space-between',
                mb: 1,
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: selectedCategory?.id === category.id ? '#b92a31' : '#e0e0e0',
                bgcolor: selectedCategory?.id === category.id ? 'rgba(185, 42, 49, 0.1)' : 'white',
                '&:hover': {
                  bgcolor: selectedCategory?.id === category.id ? 'rgba(185, 42, 49, 0.15)' : '#f5f5f5',
                }
              }}
              onClick={() => onCategorySelect(category)}
              disabled={isCategoryLocked}
            >
              <Typography>
                {category.name || category.title}
              </Typography>
              {selectedCategory?.id === category.id && (
                <Check sx={{ color: '#b92a31' }} />
              )}
            </Button>
          ))}
        </Box>
      );
    }

    if (activeSection === 'features') {
      return (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            انتخاب امکانات
          </Typography>
          {features.map((feature) => {
            const isSelected = selectedFeatures?.some(f => f.value === feature.value);
            return (
              <Box
                key={feature.value}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: isSelected ? '#b92a31' : '#e0e0e0',
                  bgcolor: isSelected ? 'rgba(185, 42, 49, 0.1)' : 'white',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: isSelected ? 'rgba(185, 42, 49, 0.15)' : '#f5f5f5',
                  }
                }}
                onClick={() => onFeatureToggle(feature)}
              >
                <Typography>
                  {feature.value}
                </Typography>
                <Switch
                  checked={isSelected}
                  onChange={() => onFeatureToggle(feature)}
                  color="primary"
                />
              </Box>
            );
          })}
        </Box>
      );
    }

    if (activeSection === 'sort') {
      const sortOptions = [
        { value: 'newest', label: 'جدیدترین' },
        { value: 'cheapest', label: 'ارزان‌ترین' },
        { value: 'most_expensive', label: 'گران‌ترین' },
        { value: 'nearest', label: 'نزدیک‌ترین' },
      ];

      return (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            مرتب‌سازی
          </Typography>
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              fullWidth
              sx={{
                justifyContent: 'space-between',
                mb: 1,
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: sortBy === option.value ? '#b92a31' : '#e0e0e0',
                bgcolor: sortBy === option.value ? 'rgba(185, 42, 49, 0.1)' : 'white',
                '&:hover': {
                  bgcolor: sortBy === option.value ? 'rgba(185, 42, 49, 0.15)' : '#f5f5f5',
                }
              }}
              onClick={() => {
                onSortChange(option.value);
                onSectionChange('main');
              }}
            >
              <Typography>
                {option.label}
              </Typography>
              {sortBy === option.value && (
                <Check sx={{ color: '#b92a31' }} />
              )}
            </Button>
          ))}
        </Box>
      );
    }

    if (activeSection === 'range') {
      return (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            محدوده‌ها
          </Typography>
          {rangeFilters?.map((filter) => (
            <Box key={filter.id} sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {filter.name} {filter.unit ? `(${filter.unit})` : ''}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="حداقل"
                  value={filter.low || ''}
                  onChange={(e) => onRangeFilterChange(filter.id, 'low', e.target.value)}
                  type="number"
                  sx={{ borderRadius: 2 }}
                />
                <Typography variant="body2" sx={{ minWidth: '30px', textAlign: 'center' }}>
                  تا
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="حداکثر"
                  value={filter.high || ''}
                  onChange={(e) => onRangeFilterChange(filter.id, 'high', e.target.value)}
                  type="number"
                  sx={{ borderRadius: 2 }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      );
    }

    // Main section
    return (
      <Box>
        {/* Category */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            mb: 1,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            bgcolor: 'white',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
          onClick={() => onSectionChange('categories')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Menu sx={{ color: '#666' }} />
            <Typography>دسته‌بندی</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {selectedCategory?.name || selectedCategory?.title || 'انتخاب نشده'}
            </Typography>
            <ChevronLeft sx={{ color: '#666' }} />
          </Box>
        </Box>

        {/* Features */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            mb: 1,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            bgcolor: 'white',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
          onClick={() => onSectionChange('features')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle sx={{ color: '#666' }} />
            <Typography>امکانات</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {selectedFeatures?.length > 0 ? `${selectedFeatures.length} مورد` : 'انتخاب نشده'}
            </Typography>
            <ChevronLeft sx={{ color: '#666' }} />
          </Box>
        </Box>

        {/* Sort */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            mb: 1,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            bgcolor: 'white',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
          onClick={() => onSectionChange('sort')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Sort sx={{ color: '#666' }} />
            <Typography>مرتب‌سازی</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {getSortDisplayText ? getSortDisplayText(sortBy) : 'جدیدترین'}
            </Typography>
            <ChevronLeft sx={{ color: '#666' }} />
          </Box>
        </Box>

        {/* Range Filters */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            bgcolor: 'white',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
          onClick={() => onSectionChange('range')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Place sx={{ color: '#666' }} />
            <Typography>محلات</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {rangeFilters?.some(f => f.low || f.high) ? 'تنظیم شده' : 'انتخاب نشده'}
            </Typography>
            <ChevronLeft sx={{ color: '#666' }} />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Category-specific fields */}
        {selectedCategory && (
          <Box>
            {renderNormalFields()}
            {renderPredefineFields()}
          </Box>
        )}
      </Box>
    );
  };

  const getModalTitle = () => {
    switch (activeSection) {
      case 'main': return 'فیلترها';
      case 'categories': return 'دسته‌بندی';
      case 'features': return 'امکانات';
      case 'sort': return 'مرتب‌سازی';
      case 'range': return 'محدوده‌ها';
      default: return 'فیلترها';
    }
  };

  return (
    <Dialog
      open={visible}
      onClose={handleApplyAndClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          height: isMobile ? '100%' : 'auto',
          maxHeight: isMobile ? '100%' : '90vh',
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#b92a31',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <IconButton
          onClick={() => {
            if (activeSection === 'main') {
              handleApplyAndClose();
            } else {
              onSectionChange('main');
            }
          }}
          sx={{ color: 'white' }}
        >
          {activeSection === 'main' ? <Close /> : <ArrowBack />}
        </IconButton>
        
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {getModalTitle()}
        </Typography>
        
        <Button
          onClick={onResetAll}
          sx={{
            color: 'white',
            border: '1.5px solid rgba(255, 255, 255, 0.8)',
            borderRadius: 20,
            px: 2,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          حذف همه
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        {renderContent()}
      </DialogContent>

      {activeSection === 'main' && (
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleApplyAndClose}
            disabled={isLoading}
            sx={{
              bgcolor: '#b92a31',
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                bgcolor: '#a01c22'
              },
              '&.Mui-disabled': {
                bgcolor: '#cccccc'
              }
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <Typography>در حال جستجو...</Typography>
              </Box>
            ) : (
              `نمایش ${filteredCount || 0} آگهی`
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default FilterModal;