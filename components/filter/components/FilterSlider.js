// components/filter/FilterSlider.js
import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  FilterList,
  Close,
  List,
} from '@mui/icons-material';
import { formatNumberWithWords } from '../utils/formatters';

const FilterSlider = ({
  selectedCategory,
  selectedNeighborhoods,
  selectedFeatures,
  rangeFilters,
  sortBy,
  hasActiveFilters,
  onFilterModalOpen,
  onFilterModalOpenForCategory,
  onCategoryRemove,
  onNeighborhoodRemove,
  onFeatureRemove,
  onRangeFilterRemove,
  onSortRemove,
  onResetAll,
  getSortDisplayText,
  activeFiltersCount,
  fieldValues = {},
  activeFieldFilters = [],
  onFieldFilterRemove,
  categoryFields = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Helper to format field display text
  const formatFieldDisplayText = (field) => {
    let displayText = '';
    
    if (field.isRange) {
      const { min, max } = field.value || {};
      
      if (min && min !== '' && min !== '0' && max && max !== '' && max !== '0') {
        displayText = `${field.name}: از ${formatNumberWithWords(min)} تا ${formatNumberWithWords(max)}`;
      } else if (min && min !== '' && min !== '0') {
        displayText = `${field.name}: از ${formatNumberWithWords(min)}`;
      } else if (max && max !== '' && max !== '0') {
        displayText = `${field.name}: تا ${formatNumberWithWords(max)}`;
      }
    } else {
      const fieldConfig = (categoryFields.predefine || []).find(f => f.slug === field.slug);
      if (fieldConfig) {
        const selectedOption = fieldConfig.options?.find(opt => 
          opt.value === field.value || opt.id === field.value
        );
        if (selectedOption) {
          displayText = `${field.name}: ${selectedOption.label || selectedOption.value || selectedOption.name}`;
        } else if (field.value) {
          displayText = `${field.name}: ${field.value}`;
        }
      } else {
        displayText = field.name;
      }
    }
    
    if (field.unit && displayText) {
      displayText += ` ${field.unit}`;
    }
    
    return displayText;
  };

  const FilterChip = ({ text, onRemove, type = 'default' }) => {
    const chipStyles = {
      default: {
        bgcolor: 'white',
        borderColor: '#dee2e6',
        color: '#495057',
      },
      field: {
        bgcolor: '#f8f9fa',
        borderColor: '#b92a31',
        borderWidth: 1.5,
        color: '#b92a31',
      },
      neighborhood: {
        bgcolor: '#e8f4fd',
        borderColor: '#4dabf7',
        color: '#495057',
      },
      feature: {
        bgcolor: '#e7f5e9',
        borderColor: '#69db7c',
        color: '#495057',
      },
      range: {
        bgcolor: '#fff3cd',
        borderColor: '#ffc107',
        color: '#495057',
      },
      sort: {
        bgcolor: '#f8f9fa',
        borderColor: '#adb5bd',
        color: '#495057',
      },
    };

    return (
      <Chip
        label={text}
        onDelete={onRemove}
        deleteIcon={<Close fontSize="small" />}
        sx={{
          m: 0.5,
          ...chipStyles[type],
          '& .MuiChip-deleteIcon': {
            color: type === 'field' ? '#b92a31' : '#666',
            fontSize: 16,
          },
          '&:hover': {
            bgcolor: `${chipStyles[type].bgcolor}CC`,
          },
        }}
      />
    );
  };

  if (!hasActiveFilters && !isMobile) {
    return (
      <Button
        variant="outlined"
        onClick={onFilterModalOpen}
        sx={{
          borderColor: '#b92a31',
          color: '#b92a31',
          borderRadius: 8,
          px: 3,
          '&:hover': {
            borderColor: '#a01c22',
            bgcolor: 'rgba(185, 42, 49, 0.04)',
          }
        }}
      >
        <FilterList sx={{ ml: 1 }} />
        <Typography>فیلترها</Typography>
      </Button>
    );
  }

  if (!hasActiveFilters && isMobile) {
    return (
      <Box sx={{ position: 'fixed', top: 16, left: 16, zIndex: 10 }}>
        <IconButton
          onClick={onFilterModalOpen}
          sx={{
            bgcolor: 'white',
            boxShadow: 2,
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
        >
          <FilterList sx={{ color: '#b92a31' }} />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#f8f9fa',
        p: 1,
        borderBottom: '1px solid #e9ecef',
        minHeight: 56,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        '&::-webkit-scrollbar': {
          height: 4,
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: '#888',
          borderRadius: 2,
        },
      }}
    >
      {/* Filters Container */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {/* Clear All Button */}
        {activeFiltersCount > 1 && (
          <Chip
            label="حذف همه"
            onClick={onResetAll}
            deleteIcon={<Close fontSize="small" />}
            onDelete={onResetAll}
            sx={{
              m: 0.5,
              bgcolor: 'white',
              border: '1.5px solid #b92a31',
              color: '#b92a31',
              '& .MuiChip-deleteIcon': {
                color: '#b92a31',
              },
            }}
          />
        )}

        {/* Selected Category */}
        {selectedCategory && (
          <Chip
            label={selectedCategory.name}
            onClick={onFilterModalOpenForCategory}
            icon={<List />}
            sx={{
              m: 0.5,
              bgcolor: '#e9ecef',
              border: '1px solid #dee2e6',
              color: '#495057',
              '&:hover': {
                bgcolor: '#dee2e6',
              },
            }}
          />
        )}

        {/* Selected Neighborhoods */}
        {selectedNeighborhoods.map((neighborhood) => (
          <FilterChip
            key={`neighborhood-${neighborhood.id}`}
            text={`محله: ${neighborhood.name}`}
            onRemove={() => onNeighborhoodRemove(neighborhood)}
            type="neighborhood"
          />
        ))}

        {/* Selected Features */}
        {selectedFeatures.map((feature) => (
          <FilterChip
            key={`feature-${feature.value}`}
            text={`دارای ${feature.value}`}
            onRemove={() => onFeatureRemove(feature)}
            type="feature"
          />
        ))}

        {/* Range Filters */}
        {rangeFilters.map((filter) => {
          if (filter.low !== '' || filter.high !== '') {
            let label = `${filter.name}: `;
            
            if (filter.low !== '' && filter.high !== '') {
              label += `${formatNumberWithWords(filter.low)} تا ${formatNumberWithWords(filter.high)} ${filter.unit}`;
            } else if (filter.low !== '') {
              label += `از ${formatNumberWithWords(filter.low)} ${filter.unit}`;
            } else if (filter.high !== '') {
              label += `تا ${formatNumberWithWords(filter.high)} ${filter.unit}`;
            }
            
            return (
              <FilterChip
                key={`range-${filter.id}`}
                text={label}
                onRemove={() => onRangeFilterRemove(filter.id, 'low', '')}
                type="range"
              />
            );
          }
          return null;
        }).filter(Boolean)}

        {/* Sort Filter */}
        {sortBy !== 'newest' && (
          <FilterChip
            text={`مرتب‌سازی: ${getSortDisplayText()}`}
            onRemove={onSortRemove}
            type="sort"
          />
        )}

        {/* Field Filters */}
        {activeFieldFilters.map((field) => {
          const displayText = formatFieldDisplayText(field);
          if (displayText) {
            return (
              <FilterChip
                key={`field-${field.slug}`}
                text={displayText}
                onRemove={() => onFieldFilterRemove(field.slug)}
                type="field"
              />
            );
          }
          return null;
        }).filter(Boolean)}
      </Box>

      {/* Filter Button with Count */}
      <Box sx={{ ml: 1, position: 'relative' }}>
        <Button
          variant="outlined"
          onClick={onFilterModalOpen}
          sx={{
            borderColor: '#b92a31',
            color: '#b92a31',
            borderRadius: 2,
            px: 2,
            minWidth: 'auto',
            '&:hover': {
              borderColor: '#a01c22',
              bgcolor: 'rgba(185, 42, 49, 0.04)',
            }
          }}
        >
          <FilterList sx={{ fontSize: 20 }} />
          <Typography sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
            فیلترها
          </Typography>
        </Button>
        
        {activeFiltersCount > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              bgcolor: '#b92a31',
              color: 'white',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              border: '2px solid white',
            }}
          >
            {activeFiltersCount}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FilterSlider;