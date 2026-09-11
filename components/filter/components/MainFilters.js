// components/filter/components/MainFilters.js
import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Checkbox,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Check,
} from '@mui/icons-material';
import RangeFilters from './RangeFilters';

const MainFilters = ({
  selectedCategory,
  selectedNeighborhoods,
  selectedFeatures,
  rangeFilters,
  sortBy,
  onSectionChange,
  onFeatureToggle,
  onRangeFilterChange,
  onSortChange,
  getSortDisplayText,
  features,
  categoryFields = {},
  loadingFields = false,
  onFieldValueChange = () => {},
  fieldValues = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { normal = [], tick = [], predefine = [] } = categoryFields;

  const renderNormalFields = () => {
    if (normal.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          مشخصات:
        </Typography>
        {normal.map((field) => {
          if (field.special != 1) return null;
          
          const fieldType = determineFieldType(field);
          
          if (fieldType === 'number' || fieldType === 'price') {
            return renderMinMaxField(field);
          }
          
          const value = fieldValues[field.name] || '';
          const label = field.label || field.name || 'بدون عنوان';
          
          switch (fieldType) {
            case 'text':
              return renderTextField(field, value, label);
            case 'boolean':
              return renderBooleanField(field, value, label);
            default:
              return renderTextField(field, value, label);
          }
        })}
      </Box>
    );
  };

  const renderMinMaxField = (field) => {
    const label = field.label || field.name || 'بدون عنوان';
    const unit = getFieldUnit(field);
    
    const minValue = fieldValues[`${field.name}_min`] || '';
    const maxValue = fieldValues[`${field.name}_max`] || '';
    
    return (
      <Box key={field.id || field.name} sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          {label}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Max Input */}
          <TextField
            fullWidth
            size="small"
            placeholder={" تا " + label}
            value={maxValue}
            onChange={(e) => onFieldValueChange(`${field.name}_max`, e.target.value)}
            type="number"
            sx={{ borderRadius: 2 }}
          />
          
          <Typography variant="body2" sx={{ minWidth: '30px', textAlign: 'center' }}>
            تا
          </Typography>
          
          {/* Min Input */}
          <TextField
            fullWidth
            size="small"
            placeholder={" از " + label}
            value={minValue}
            onChange={(e) => onFieldValueChange(`${field.name}_min`, e.target.value)}
            type="number"
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Box>
    );
  };

  const renderTextField = (field, value, label) => (
    <Box key={field.id || field.name} sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder={`${label} را وارد کنید`}
        value={value}
        onChange={(e) => onFieldValueChange(field.name, e.target.value)}
        sx={{ borderRadius: 2 }}
      />
    </Box>
  );

  const renderBooleanField = (field, value, label) => {
    const boolValue = value === true || value === 'true' || value === '1';

    return (
      <Box key={field.id || field.name} sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={boolValue}
              onChange={(e) => onFieldValueChange(field.name, e.target.checked)}
              color="primary"
            />
          }
          label={label}
        />
      </Box>
    );
  };

  const determineFieldType = (field) => {
    if (field.type) {
      return field.type === '1' ? 'number' : 'text';
    }
    
    const value = field.value?.toLowerCase() || '';
    
    if (value.includes('قیمت') || value.includes('price')) {
      return 'price';
    }
    
    if (value.includes('متراژ') || value.includes('area') || value.includes('متر')) {
      return 'number';
    }
    
    if (value.includes('سال') || value.includes('year') || value.includes('age')) {
      return 'number';
    }
    
    if (value.includes('تعداد') || value.includes('count') || value.includes('room')) {
      return 'number';
    }
    
    if (value.includes('آسانسور') || value.includes('پارکینگ') || 
        value.includes('انباری') || value.includes('آب') || 
        value.includes('برق') || value.includes('گاز')) {
      return 'boolean';
    }
    
    return 'text';
  };

  const getFieldUnit = (field) => {
    if (field.unit) return field.unit;
    
    const name = field.name?.toLowerCase() || '';
    if (name.includes('price') || name.includes('قیمت') || 
        name.includes('rent') || name.includes('اجاره') ||
        name.includes('deposit') || name.includes('پول پیش')) {
      return 'تومان';
    }
    if (name.includes('area') || name.includes('متراژ')) return 'متر';
    if (name.includes('age') || name.includes('سن')) return 'سال';
    return null;
  };

  const renderLoadingState = () => {
    if (!loadingFields || (normal.length + tick.length + predefine.length > 0)) {
      return null;
    }

    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          در حال بارگذاری فیلترها...
        </Typography>
      </Box>
    );
  };

  const renderFeatures = () => {
    if (categoryFields.tick && categoryFields.tick.length > 0) {
      return (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            امکانات:
          </Typography>
          {categoryFields.tick.map((feature) => {
            if (feature.special != 1) return null;
            
            const isSelected = selectedFeatures.some(
              (f) => f.value === feature.value || f.id === feature.id
            );

            return (
              <Box
                key={feature.id || feature.value}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: isSelected ? '#b92a31' : '#ddd',
                  bgcolor: isSelected ? 'rgba(185, 42, 49, 0.1)' : 'white',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: isSelected ? 'rgba(185, 42, 49, 0.15)' : '#f5f5f5',
                  }
                }}
                onClick={() => onFeatureToggle(feature)}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    border: '2px solid',
                    borderColor: isSelected ? '#b92a31' : '#666',
                    borderRadius: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5,
                    bgcolor: isSelected ? '#b92a31' : 'transparent',
                  }}
                >
                  {isSelected && <Check sx={{ fontSize: 16, color: 'white' }} />}
                </Box>
                <Typography
                  sx={{
                    flex: 1,
                    color: isSelected ? '#b92a31' : '#666',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {feature.value}
                </Typography>
              </Box>
            );
          })}
        </Box>
      );
    }
    
    if (features && features.length > 0) {
      return (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            امکانات:
          </Typography>
          {features.map((feature) => {
            const isSelected = selectedFeatures.some(
              (f) => f.value === feature.value
            );

            return (
              <Box
                key={feature.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: isSelected ? '#b92a31' : '#ddd',
                  bgcolor: isSelected ? 'rgba(185, 42, 49, 0.1)' : 'white',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: isSelected ? 'rgba(185, 42, 49, 0.15)' : '#f5f5f5',
                  }
                }}
                onClick={() => onFeatureToggle(feature)}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    border: '2px solid',
                    borderColor: isSelected ? '#b92a31' : '#666',
                    borderRadius: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5,
                    bgcolor: isSelected ? '#b92a31' : 'transparent',
                  }}
                >
                  {isSelected && <Check sx={{ fontSize: 16, color: 'white' }} />}
                </Box>
                <Typography
                  sx={{
                    flex: 1,
                    color: isSelected ? '#b92a31' : '#666',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  دارای {feature.value}
                </Typography>
              </Box>
            );
          })}
        </Box>
      );
    }
    
    return null;
  };

  return (
    <Box>
      {renderLoadingState()}

      {/* Category Selection */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onSectionChange('categories')}
            sx={{
              borderColor: '#b92a31',
              color: '#b92a31',
              borderRadius: 1,
              '&:hover': {
                borderColor: '#a01c22',
                bgcolor: 'rgba(185, 42, 49, 0.04)',
              }
            }}
          >
            {selectedCategory ? 'تغییر' : 'انتخاب'}
          </Button>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {selectedCategory ? `دسته بندی: ${selectedCategory.name}` : 'انتخاب دسته بندی'}
          </Typography>
        </Box>
      </Box>

      {/* Features */}
      {renderFeatures()}

      {/* Dynamic Normal Fields */}
      {renderNormalFields()}

      {/* Neighborhood Selection */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onSectionChange('neighborhoods')}
            sx={{
              borderColor: '#b92a31',
              color: '#b92a31',
              borderRadius: 1,
              '&:hover': {
                borderColor: '#a01c22',
                bgcolor: 'rgba(185, 42, 49, 0.04)',
              }
            }}
          >
            {selectedNeighborhoods.length > 0 ? 'تغییر' : 'انتخاب'}
          </Button>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {selectedNeighborhoods.length > 0 
              ? `محلات: ${selectedNeighborhoods.slice(0, 2).map(n => n.name).join('، ')}${selectedNeighborhoods.length > 2 ? '...' : ''}`
              : 'انتخاب محلات'
            }
          </Typography>
        </Box>
      </Box>

      {/* Range Filters */}
      <RangeFilters
        rangeFilters={rangeFilters}
        onRangeFilterChange={onRangeFilterChange}
        categoryFields={categoryFields}
        loadingFields={loadingFields}
        onFieldValueChange={onFieldValueChange}
        fieldValues={fieldValues}
      />
    </Box>
  );
};

export default MainFilters;