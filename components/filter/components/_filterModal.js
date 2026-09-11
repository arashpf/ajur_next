import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  BackHandler,
  PanResponder,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { formatNumberWithWords } from '../utils/formatters';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const [localFieldValues, setLocalFieldValues] = useState({});
  const [focusedInput, setFocusedInput] = useState({ slug: null, type: null });
  const [modalOffset, setModalOffset] = useState(0);

  // Sync field values when modal opens
  useEffect(() => {
    if (visible) {
      setLocalFieldValues(fieldValues);
      setModalOffset(0);
    }
  }, [visible, fieldValues]);

  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (visible && activeSection !== 'main') {
          onSectionChange('main');
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [visible, activeSection, onSectionChange]);

  // PanResponder for pull-down to close - only on grabber
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          setModalOffset(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          handleApplyAndClose();
        } else {
          setModalOffset(0);
        }
      },
    })
  ).current;

  // Format number with commas
  const formatNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Unformat number (remove commas and convert Persian to English digits)
  const unformatNumber = (text) => {
    const persianToEnglish = text.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
    return persianToEnglish.replace(/,/g, '');
  };

  // Handle field value change for range fields
  const handleFieldRangeChange = (fieldSlug, type, text, fieldName) => {
    console.log('Field range changed:', { fieldSlug, type, text });
    
    const numericValue = unformatNumber(text);
    
    setLocalFieldValues(prev => {
      const current = prev[fieldSlug] || { min: '', max: '' };
      const updated = {
        ...prev,
        [fieldSlug]: {
          ...current,
          [type]: numericValue
        }
      };
      
      // If this is a price field with chips, we need to ensure proper formatting
      const fieldConfig = (categoryFields.normal || []).find(f => f.slug === fieldSlug);
      if (fieldConfig && fieldConfig.unit === 'تومان') {
        // Ensure we're storing the actual value, not a formatted string
        // (formatting is only for display)
        console.log('Updated price field value:', updated[fieldSlug]);
      }
      
      return updated;
    });
  };

  // Apply field changes when closing modal
  const handleApplyAndClose = () => {
  console.log('Applying field changes:', localFieldValues);
  
  Object.entries(localFieldValues).forEach(([slug, value]) => {
    if (JSON.stringify(value) !== JSON.stringify(fieldValues[slug])) {
      const fieldConfig = [...(categoryFields.normal || []), ...(categoryFields.predefine || [])]
        .find(f => f.slug === slug);
      
      if (fieldConfig) {
        // Use the actual field name from fieldConfig
        const fieldName = fieldConfig.name || fieldConfig.value || fieldConfig.label || slug;
        
        // For range fields
        if (fieldConfig.type === 'normal' && typeof value === 'object') {
          onFieldValueChange(slug, value, 'normal_range', fieldName);
        } 
        // For predefine fields
        else {
          onFieldValueChange(slug, value, fieldConfig.type || 'normal', fieldName);
        }
      }
    }
  });
  onClose();
};

  // Dismiss keyboard function
  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setFocusedInput({ slug: null, type: null });
  };

  // Handle chip press - clear input and set chip value
  const handleChipPress = (fieldSlug, type, chipValue) => {
    // Dismiss keyboard first
    Keyboard.dismiss();
    
    console.log('Setting chip value:', { fieldSlug, type, chipValue });
    
    // Update the local state
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
    
    // Reset focused input
    setFocusedInput({ slug: null, type: null });
  };

  const renderPriceChipSuggestions = (field, currentValue, isMinField) => {
    if (field.unit !== 'تومان') return null;
    
    // Get the string value first
    const valueStr = isMinField ? currentValue.min : currentValue.max;
    if (!valueStr) return null;
    
    // Convert Persian digits to English for parsing
    const persianToEnglish = (str) => {
      const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      return str.replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d));
    };
    
    const englishValueStr = persianToEnglish(valueStr);
    const value = parseFloat(englishValueStr);
    
    console.log('Current value for chips:', { 
      original: valueStr, 
      english: englishValueStr, 
      parsed: value 
    });
    
    if (!value || isNaN(value) || value === 0) return null;
    
    // Generate chip values based on the entered number
    const chips = [];
    
    // If value is less than 1000, show all options
    if (value < 1000) {
      chips.push(
        { label: `${formatNumberWithWords(value)} هزار`, value: value * 1000 },
        { label: `${formatNumberWithWords(value)} میلیون`, value: value * 1000000 },
        { label: `${formatNumberWithWords(value)} میلیارد`, value: value * 1000000000 }
      );
    } 
    // If value is between 1000 and 999999, assume it's in thousands
    else if (value >= 1000 && value <= 999999) {
      const millions = value / 1000;
      chips.push(
        { label: `${formatNumberWithWords(millions)} میلیون`, value: value * 1000 },
        { label: `${formatNumberWithWords(value / 1000000)} میلیارد`, value: value * 1000000 }
      );
    }
    // If value is in millions (1,000,000 to 999,999,999)
    else if (value >= 1000000 && value <= 999999999) {
      const billions = value / 1000000;
      chips.push(
        { label: `${formatNumberWithWords(billions)} میلیارد`, value: value * 1000000 }
      );
    }
    
    // Filter out duplicate or unrealistic values
    const uniqueChips = chips.filter((chip, index, self) =>
      chip.value > 0 && 
      self.findIndex(c => c.value === chip.value) === index
    );
    
    console.log('Generated chips:', uniqueChips);
    
    if (uniqueChips.length === 0) return null;

    // Determine which field type (min or max) we're showing chips for
    const fieldType = isMinField ? 'min' : 'max';

    return (
      <View style={styles.chipContainerAbove}>
        <Text style={styles.chipTitle}>پیشنهاد:</Text>
        {uniqueChips.map((chip, index) => (
          <TouchableOpacity
            key={index}
            style={styles.chip}
            onPress={() => handleChipPress(field.slug, fieldType, chip.value)}
            delayPressIn={0}
            activeOpacity={0.7}
          >
            <Text style={styles.chipText}>{chip.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render Normal Fields as Range Inputs (از تا)
  const renderNormalFields = () => {
    if (loadingFields) {
      return <Text style={styles.loadingText}>در حال بارگذاری فیلترها...</Text>;
    }

    const normalFields = categoryFields.normal || [];
    if (normalFields.length === 0) return null;

    return (
      <View style={styles.fieldsSection}>
        <Text style={styles.sectionTitle}>محدوده قیمت و مشخصات</Text>
        {normalFields.map((field) => {
          // Make sure we get the latest value from localFieldValues
          const currentValue = localFieldValues[field.slug] || { min: '', max: '' };
          const minValue = currentValue.min || '';
          const maxValue = currentValue.max || '';
          
          const isMinFocused = focusedInput.slug === field.slug && focusedInput.type === 'min';
          const isMaxFocused = focusedInput.slug === field.slug && focusedInput.type === 'max';

          const isPriceField = field.unit === 'تومان';

          const displayedMin = isPriceField ? formatNumber(minValue) : minValue;
          const displayedMax = isPriceField ? formatNumber(maxValue) : maxValue;

          console.log(`Field ${field.slug} values:`, {
            min: minValue,
            max: maxValue,
            isMinFocused,
            isMaxFocused
          });

          return (
            <View key={field.slug} style={styles.rangeFieldContainer}>
              <Text style={styles.rangeFieldLabel}>
                {field.name || field.value}
                {field.unit ? ` (${field.unit})` : ''}
              </Text>
              
              {/* Show chip suggestions for focused input ABOVE the field */}
              {field.unit === 'تومان' && isMinFocused && 
                renderPriceChipSuggestions(field, currentValue, true)}
              {field.unit === 'تومان' && isMaxFocused && 
                renderPriceChipSuggestions(field, currentValue, false)}
              
              <View style={styles.rangeInputsContainer}>
                <View style={styles.rangeInputGroup}>
                  <TextInput
                    style={[styles.rangeInput, isMaxFocused && styles.focusedInput]}
                    placeholder={"تا "+field.name}
                    value={displayedMax}
                    onChangeText={(text) => {
                      console.log(`Max field ${field.slug} changed to:`, text);
                      handleFieldRangeChange(field.slug, 'max', text, field.name || field.value);
                    }}
                    onFocus={() => {
                      console.log(`Max field ${field.slug} focused`);
                      setFocusedInput({ slug: field.slug, type: 'max' });
                    }}
                    onBlur={() => {
                      console.log(`Max field ${field.slug} blurred`);
                      setFocusedInput({ slug: null, type: null });
                    }}
                    keyboardType="numeric"
                    autoComplete="off"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.rangeInputGroup}>
                  <TextInput
                    style={[styles.rangeInput, isMinFocused && styles.focusedInput]}
                    placeholder={"از "+field.name}
                    value={displayedMin}
                    onChangeText={(text) => {
                      console.log(`Min field ${field.slug} changed to:`, text);
                      handleFieldRangeChange(field.slug, 'min', text, field.name || field.value);
                    }}
                    onFocus={() => {
                      console.log(`Min field ${field.slug} focused`);
                      setFocusedInput({ slug: field.slug, type: 'min' });
                    }}
                    onBlur={() => {
                      console.log(`Min field ${field.slug} blurred`);
                      setFocusedInput({ slug: null, type: null });
                    }}
                    keyboardType="numeric"
                    autoComplete="off"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  // Render Predefine Fields (Dropdown)
  const renderPredefineFields = () => {
    if (loadingFields) {
      return <Text style={styles.loadingText}>در حال بارگذاری فیلترها...</Text>;
    }

    const predefineFields = categoryFields.predefine || [];
    if (predefineFields.length === 0) return null;

    return (
      <View style={styles.fieldsSection}>
        <Text style={styles.sectionTitle}>فیلترهای انتخابی</Text>
        {predefineFields.map((field) => (
          <View key={field.slug} style={styles.predefineFieldContainer}>
            <Text style={styles.predefineFieldLabel}>
              {field.name || field.value}
            </Text>
            <View style={styles.predefineFieldSelect}>
              <Picker
                selectedValue={localFieldValues[field.slug] || ''}
                onValueChange={(itemValue) => {
                  setLocalFieldValues(prev => ({
                    ...prev,
                    [field.slug]: itemValue
                  }));
                }}
                style={styles.picker}
              >
                <Picker.Item label="انتخاب کنید" value="" />
                {field.options?.map((option, index) => (
                  <Picker.Item 
                    key={option.value || option.id || index}
                    label={option.label || option.value || option.name || `گزینه ${index + 1}`}
                    value={option.value || option.id || option.name}
                  />
                ))}
              </Picker>
            </View>
          </View>
        ))}
      </View>
    );
  };

  // Render Range Filters
  const renderRangeFilters = () => {
    if (!rangeFilters || !Array.isArray(rangeFilters)) return null;

    return rangeFilters.map((filter) => (
      <View key={filter.id} style={styles.rangeFilterContainer}>
        <Text style={styles.rangeFilterLabel}>
          {filter.name} {filter.unit ? `(${filter.unit})` : ''}
        </Text>
        
        <View style={styles.rangeValuesContainer}>
          <TextInput
            style={styles.rangeInput}
            placeholder="حداقل"
            value={filter.low || ''}
            onChangeText={(text) => onRangeFilterChange(filter.id, 'low', text)}
            keyboardType="numeric"
            autoComplete="off"
          />
          <Text style={styles.rangeSeparator}>تا</Text>
          <TextInput
            style={styles.rangeInput}
            placeholder="حداکثر"
            value={filter.high || ''}
            onChangeText={(text) => onRangeFilterChange(filter.id, 'high', text)}
            keyboardType="numeric"
            autoComplete="off"
          />
        </View>

        {filter.min !== undefined && filter.max !== undefined && (
          <Slider
            style={styles.slider}
            minimumValue={filter.min}
            maximumValue={filter.max}
            value={filter.low || filter.min}
            onValueChange={(value) => onRangeFilterChange(filter.id, 'low', Math.round(value))}
            minimumTrackTintColor="#b92a31"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#b92a31"
          />
        )}
      </View>
    ));
  };

  // Render main content based on active section
  const renderContent = () => {
    const scrollViewProps = {
      style: styles.scrollContainer,
      keyboardShouldPersistTaps: "handled",
      keyboardDismissMode: "on-drag",
      showsVerticalScrollIndicator: false
    };

    if (activeSection === 'categories') {
      return (
        <ScrollView {...scrollViewProps}>
          <Text style={styles.sectionHeader}>انتخاب دسته‌بندی</Text>
          {availableCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory?.id === category.id && styles.selectedCategoryItem
              ]}
              onPress={() => onCategorySelect(category)}
              disabled={isCategoryLocked}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory?.id === category.id && styles.selectedCategoryText
              ]}>
                {category.name || category.title}
              </Text>
              {selectedCategory?.id === category.id && (
                <Icon name="check" size={20} color="#b92a31" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }

    if (activeSection === 'features') {
      return (
        <ScrollView {...scrollViewProps}>
          <Text style={styles.sectionHeader}>انتخاب امکانات</Text>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.value}
              style={[
                styles.featureItem,
                selectedFeatures?.some(f => f.value === feature.value) && styles.selectedFeatureItem
              ]}
              onPress={() => onFeatureToggle(feature)}
            >
              <Text style={styles.featureText}>{feature.value}</Text>
              <Switch
                value={selectedFeatures?.some(f => f.value === feature.value)}
                onValueChange={() => onFeatureToggle(feature)}
                trackColor={{ false: '#767577', true: '#b92a31' }}
                thumbColor="#f4f3f4"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }

    if (activeSection === 'sort') {
      return (
        <ScrollView {...scrollViewProps}>
          <Text style={styles.sectionHeader}>مرتب‌سازی</Text>
          {['newest', 'cheapest', 'most_expensive', 'nearest'].map((sortOption) => (
            <TouchableOpacity
              key={sortOption}
              style={[
                styles.sortItem,
                sortBy === sortOption && styles.selectedSortItem
              ]}
              onPress={() => {
                onSortChange(sortOption);
                onSectionChange('main');
              }}
            >
              <Text style={[
                styles.sortText,
                sortBy === sortOption && styles.selectedSortText
              ]}>
                {getSortDisplayText ? getSortDisplayText(sortOption) : sortOption}
              </Text>
              {sortBy === sortOption && (
                <Icon name="check" size={20} color="#b92a31" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }

    if (activeSection === 'range') {
      return (
        <ScrollView {...scrollViewProps}>
          <Text style={styles.sectionHeader}>محدوده‌ها</Text>
          {renderRangeFilters()}
        </ScrollView>
      );
    }

    // Default: Main filters (including category fields)
    return (
      <ScrollView {...scrollViewProps}>
        <TouchableOpacity
          style={styles.mainFilterItem}
          onPress={() => onSectionChange('categories')}
        >
          <View style={styles.filterItemRight}>
            <Icon name="chevron-left" size={24} color="#666" />
            <Text style={styles.filterItemValue}>
              {selectedCategory?.name || selectedCategory?.title || 'انتخاب نشده'}
            </Text>
          </View>
          <View style={styles.filterItemContent}>
            <Text style={styles.filterItemText}>دسته‌بندی</Text>
            <Icon name="menu" size={24} color="#666" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainFilterItem}
          onPress={() => onSectionChange('features')}
        >
          <View style={styles.filterItemRight}>
            <Icon name="chevron-left" size={24} color="#666" />
            <Text style={styles.filterItemValue}>
              {selectedFeatures?.length > 0 ? `${selectedFeatures.length} مورد` : 'انتخاب نشده'}
            </Text>
          </View>
          <View style={styles.filterItemContent}>
            <Text style={styles.filterItemText}>امکانات</Text>
            <Icon name="check-circle" size={24} color="#666" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainFilterItem}
          onPress={() => onSectionChange('sort')}
        >
          <View style={styles.filterItemRight}>
            <Icon name="chevron-left" size={24} color="#666" />
            <Text style={styles.filterItemValue}>
              {getSortDisplayText ? getSortDisplayText(sortBy) : 'جدیدترین'}
            </Text>
          </View>
          <View style={styles.filterItemContent}>
            <Text style={styles.filterItemText}>مرتب‌سازی</Text>
            <Icon name="sort" size={24} color="#666" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainFilterItem}
          onPress={() => onSectionChange('range')}
        >
          <View style={styles.filterItemRight}>
            <Icon name="chevron-left" size={24} color="#666" />
            <Text style={styles.filterItemValue}>
              {rangeFilters?.some(f => f.low || f.high) ? 'تنظیم شده' : 'انتخاب نشده'}
            </Text>
          </View>
          <View style={styles.filterItemContent}>
            <Text style={styles.filterItemText}>محلات</Text>
            <Icon name="place" size={24} color="#666" />
          </View>
        </TouchableOpacity>

        {/* Category-specific fields */}
        {selectedCategory && (
          <View style={styles.categoryFieldsContainer}>
            {renderNormalFields()}
            {renderPredefineFields()}
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        if (activeSection === 'main') {
          handleApplyAndClose();
        } else {
          onSectionChange('main');
        }
      }}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.modalContainer}>
          <View 
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalOffset }] }
            ]}
          >
            {/* Grabber for pull-down */}
            {activeSection === 'main' && (
              <View style={styles.grabberContainer} {...panResponder.panHandlers}>
                <View style={styles.grabber} />
              </View>
            )}

            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => {
                  if (activeSection === 'main') {
                    handleApplyAndClose();
                  } else {
                    onSectionChange('main');
                  }
                }}
              >
                <Icon 
                  name={activeSection === 'main' ? 'close' : 'arrow-back'} 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
              
              <Text style={styles.modalTitle}>
                {activeSection === 'main' && 'فیلترها'}
                {activeSection === 'categories' && 'دسته‌بندی'}
                {activeSection === 'features' && 'امکانات'}
                {activeSection === 'sort' && 'مرتب‌سازی'}
                {activeSection === 'range' && 'محدوده‌ها'}
              </Text>
              
              <TouchableOpacity onPress={onResetAll}>
                <Text style={styles.resetText}>حذف همه</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            {renderContent()}

            {/* Footer - Only show on main screen */}
            {activeSection === 'main' && (
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={[
                    styles.applyButton,
                    isLoading && styles.applyButtonDisabled
                  ]}
                  onPress={handleApplyAndClose}
                  disabled={isLoading}
                >
                  <Text style={styles.applyButtonText}>
                    {isLoading ? 'در حال جستجو...' : `نمایش فایل ها`}
                    {/* {isLoading ? 'در حال جستجو...' : `نمایش ${filteredCount} آگهی`} */}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  grabberContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 0,
    backgroundColor: '#b92a31',
    padding: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  grabber: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#b92a31',
    padding: 16,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'iransans',
  },
  resetText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'iransans',
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: 'iransans',
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
  },
  mainFilterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterItemText: {
    fontSize: 16,
    fontFamily: 'iransans',
    color: '#333',
    marginRight: 12,
  },
  filterItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterItemValue: {
    fontSize: 14,
    fontFamily: 'iransans',
    color: '#666',
    marginLeft: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedCategoryItem: {
    backgroundColor: '#f9f0f0',
  },
  categoryText: {
    fontSize: 16,
    fontFamily: 'iransans',
    color: '#333',
  },
  selectedCategoryText: {
    color: '#b92a31',
    fontWeight: 'bold',
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedFeatureItem: {
    backgroundColor: '#f9f0f0',
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'iransans',
    color: '#333',
  },
  sortItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedSortItem: {
    backgroundColor: '#f9f0f0',
  },
  sortText: {
    fontSize: 16,
    fontFamily: 'iransans',
    color: '#333',
  },
  selectedSortText: {
    color: '#b92a31',
    fontWeight: 'bold',
  },
  categoryFieldsContainer: {
    padding: 16,
  },
  categoryFieldsTitle: {
    fontSize: 16,
    fontFamily: 'iransans',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  fieldsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'iransans',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'iransans',
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  rangeFieldContainer: {
    marginBottom: 20,
    padding: 3,
    borderRadius: 8,
  },
  rangeFieldLabel: {
    fontSize: 14,
    fontFamily: 'iransans',
    fontWeight: '600',
    color: '#333',
    marginRight: 7,
    marginBottom: 7
  },
  rangeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeInputGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 0,
    padding: 5
  },
  rangeInputLabel: {
    fontSize: 14,
    fontFamily: 'iransans',
    marginLeft: 4,
  },
  rangeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    fontFamily: 'iransans',
    backgroundColor: 'white',
    textAlign: 'center',
  },
  focusedInput: {
    borderColor: '#b92a31',
    borderWidth: 2,
  },
  chipContainerAbove: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
    zIndex: 999,
    elevation: 999,
  },
  chipTitle: {
    fontSize: 12,
    fontFamily: 'iransans',
    color: '#666',
    marginLeft: 8,
  },
  chip: {
    backgroundColor: '#a92b31',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#d0e0ff',
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'iransans',
    color: '#f9f9f9',
  },
  predefineFieldContainer: {
    marginBottom: 16,
  },
  predefineFieldLabel: {
    fontSize: 14,
    fontFamily: 'iransans',
    color: '#333',
    marginBottom: 8,
  },
  predefineFieldSelect: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  rangeFilterContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rangeFilterLabel: {
    fontSize: 14,
    fontFamily: 'iransans',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  rangeValuesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rangeSeparator: {
    fontSize: 14,
    fontFamily: 'iransans',
    color: '#666',
    marginHorizontal: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  applyButton: {
    backgroundColor: '#b92a31',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'iransans',
  },
});

export default FilterModal;