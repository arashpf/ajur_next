import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { formatNumber } from '../utils/formatters';

const RangeFilters = ({ 
  rangeFilters, 
  onRangeFilterChange, 
  onValidationError,
  // NEW: Add props for dynamic range filters from category
  categoryFields = {},
  loadingFields = false,
  onFieldValueChange = () => {},
  fieldValues = {},
}) => {
  const [validationErrors, setValidationErrors] = useState({});

  // Combine static rangeFilters with dynamic range fields from category
  const getAllRangeFilters = () => {
    const dynamicRangeFilters = [];
    
    // Convert normal fields from category to range filters
    if (categoryFields.normal && categoryFields.normal.length > 0) {
      categoryFields.normal.forEach(field => {
        if (isRangeField(field)) {
          dynamicRangeFilters.push({
            id: field.id || field.name,
            name: field.label || field.name,
            unit: getFieldUnit(field),
            type: determineFieldType(field),
            // Get values from fieldValues if they exist
            low: fieldValues[`${field.name}_min`] || fieldValues[`${field.name}_from`] || '',
            high: fieldValues[`${field.name}_max`] || fieldValues[`${field.name}_to`] || '',
          });
        }
      });
    }
    
    return [...rangeFilters, ...dynamicRangeFilters];
  };

  // Check if a field should be displayed as range filter
  const isRangeField = (field) => {
    const fieldType = determineFieldType(field);
    return fieldType === 'price' || fieldType === 'number';
  };

  // Determine field type
  const determineFieldType = (field) => {
    if (field.type) return field.type;
    
    const name = field.name?.toLowerCase() || '';
    if (name.includes('price') || name.includes('قیمت') || 
        name.includes('rent') || name.includes('اجاره') ||
        name.includes('deposit') || name.includes('پول پیش')) {
      return 'price';
    }
    if (name.includes('area') || name.includes('متراژ')) return 'number';
    if (name.includes('age') || name.includes('سن')) return 'number';
    if (name.includes('room') || name.includes('اتاق')) return 'number';
    if (name.includes('floor') || name.includes('طبقه')) return 'number';
    
    return 'text';
  };

  // Get field unit
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
    return '';
  };

  // Format input value for display (add commas)
  const formatInputValue = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return formatNumber(number);
  };

  // Remove commas and non-numeric characters for processing
  const cleanInputValue = (text) => {
    return text.replace(/,/g, '');
  };

  const handleInputChange = (filterId, type, text) => {
    const cleanedText = cleanInputValue(text);
    
    // Check if this is a dynamic field (from category)
    const isDynamicField = getAllRangeFilters().some(f => 
      f.id === filterId && rangeFilters.every(rf => rf.id !== filterId)
    );
    
    if (isDynamicField) {
      // Handle dynamic field value change
      const fieldName = filterId; // filterId is the field name for dynamic fields
      const valueKey = type === 'low' ? `${fieldName}_min` : `${fieldName}_max`;
      onFieldValueChange(valueKey, cleanedText);
    } else {
      // Handle static range filter change
      onRangeFilterChange(filterId, type, cleanedText);
    }
  };

  // Validate range filters
  useEffect(() => {
    const errors = {};
    const allFilters = getAllRangeFilters();
    
    allFilters.forEach(filter => {
      if (filter.low !== '' && filter.high !== '') {
        const low = parseFloat(filter.low);
        const high = parseFloat(filter.high);
        
        if (!isNaN(low) && !isNaN(high) && low > high) {
          errors[filter.id] = `مقدار "تا" باید بزرگتر یا مساوی "از" باشد`;
        }
      }
    });

    setValidationErrors(errors);
    
    // Notify parent component about validation status
    if (onValidationError) {
      onValidationError(Object.keys(errors).length > 0);
    }
  }, [rangeFilters, fieldValues, categoryFields, onValidationError]);

  const showValidationAlert = (filterName) => {
    Alert.alert(
      'خطا در محدوده',
      `در فیلد "${filterName}" مقدار "تا" باید بزرگتر یا مساوی "از" باشد`,
      [{ text: 'متوجه شدم', style: 'cancel' }]
    );
  };

  const allRangeFilters = getAllRangeFilters();

  // Don't show section if no range filters available
  if (allRangeFilters.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>فیلترهای بیشتر</Text>
      {allRangeFilters.map((filter) => {
        const hasError = validationErrors[filter.id];
        
        return (
          <View key={filter.id} style={styles.rangeFilter}>
            <Text style={styles.rangeFilterTitle}>
              {filter.name} {filter.unit && `(${filter.unit})`}
            </Text>
            
            <View style={styles.rangeInputs}>
              {/* تا (To) - upper limit - NOW ON LEFT */}
              <View style={styles.rangeInputContainer}>
                <TextInput
                  style={[
                    styles.rangeInput,
                    hasError && styles.rangeInputError
                  ]}
                  placeholder="تا"
                  value={formatInputValue(filter.high)}
                  onChangeText={(text) => handleInputChange(filter.id, 'high', text)}
                  onBlur={() => {
                    if (validationErrors[filter.id]) {
                      showValidationAlert(filter.name);
                    }
                  }}
                  keyboardType="numeric"
                />
              </View>
              
              {/* از (From) - lower limit - NOW ON RIGHT */}
              <View style={styles.rangeInputContainer}>
                <TextInput
                  style={[
                    styles.rangeInput,
                    hasError && styles.rangeInputError
                  ]}
                  placeholder="از"
                  value={formatInputValue(filter.low)}
                  onChangeText={(text) => handleInputChange(filter.id, 'low', text)}
                  onBlur={() => {
                    if (validationErrors[filter.id]) {
                      showValidationAlert(filter.name);
                    }
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Error Message */}
            {hasError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {validationErrors[filter.id]}
                </Text>
              </View>
            )}

            {(filter.low !== '' || filter.high !== '') && !hasError && (
              <View style={styles.rangeDisplay}>
                <Text style={styles.rangeDisplayText}>
                  {filter.low !== '' && `از ${formatNumber(filter.low)} ${filter.unit || ''} `}
                  {filter.low !== '' && filter.high !== '' && `تا `}
                  {filter.high !== '' && `${formatNumber(filter.high)} ${filter.unit || ''}`}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'iransans',
  },
  rangeFilter: {
    marginBottom: 16,
  },
  rangeFilterTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'iransans',
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  rangeInputContainer: {
    flex: 1,
  },
  rangeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'iransans',
    fontWeight: '500',
  },
  rangeInputError: {
    borderColor: '#d32f2f',
    backgroundColor: '#ffebee',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    textAlign: 'center',
    fontFamily: 'iransans',
  },
  rangeDisplay: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  rangeDisplayText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'iransans',
  },
});

export default RangeFilters;