import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { formatNumber } from '../utils/formatters';

const RangeFilters = ({ rangeFilters, onRangeFilterChange, onValidationError }) => {
  const [validationErrors, setValidationErrors] = useState({});

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
    onRangeFilterChange(filterId, type, cleanedText);
  };

  // Validate range filters
  useEffect(() => {
    const errors = {};
    
    rangeFilters.forEach(filter => {
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
  }, [rangeFilters, onValidationError]);

  const showValidationAlert = (filterName) => {
    Alert.alert(
      'خطا در محدوده',
      `در فیلد "${filterName}" مقدار "تا" باید بزرگتر یا مساوی "از" باشد`,
      [{ text: 'متوجه شدم', style: 'cancel' }]
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>فیلترهای بیشتر</Text>
      {rangeFilters.map((filter) => {
        const hasError = validationErrors[filter.id];
        
        return (
          <View key={filter.id} style={styles.rangeFilter}>
            <Text style={styles.rangeFilterTitle}>
              {filter.name} ({filter.unit})
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
                  {filter.low !== '' && `از ${formatNumber(filter.low)} ${filter.unit} `}
                  {filter.low !== '' && filter.high !== '' && `تا `}
                  {filter.high !== '' && `${formatNumber(filter.high)} ${filter.unit}`}
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