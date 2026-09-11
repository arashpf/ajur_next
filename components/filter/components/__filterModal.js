import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MainFilters from './MainFilters';
import CategoryFilters from './CategoryFilters';
import NeighborhoodFilters from './NeighborhoodFilters';
// REMOVE THIS: import { features, neighborhoods } from '../data/filterData';

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
  isLoading = false,
  // NEW: Add props for category fields
  categoryFields = {},
  loadingFields = false,
  onFieldValueChange = () => {},
  fieldValues = {},
  // NEW: Add features prop (this should come from FilterComponent)
  features = [], // Add this prop
}) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'categories':
        return (
          <CategoryFilters
            categories={availableCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={onCategorySelect}
          />
        );
      case 'neighborhoods':
        return (
          <NeighborhoodFilters
            neighborhoods={neighborhoods} // This might need to be passed as prop too
            selectedNeighborhoods={selectedNeighborhoods}
            onNeighborhoodToggle={onNeighborhoodToggle}
          />
        );
      default:
        return (
          <MainFilters
            selectedCategory={selectedCategory}
            selectedNeighborhoods={selectedNeighborhoods}
            selectedFeatures={selectedFeatures}
            rangeFilters={rangeFilters}
            sortBy={sortBy}
            onSectionChange={onSectionChange}
            onFeatureToggle={onFeatureToggle}
            onRangeFilterChange={onRangeFilterChange}
            onSortChange={onSortChange}
            getSortDisplayText={getSortDisplayText}
            features={features} // Use the features prop passed from FilterComponent
            categoryFields={categoryFields}
            loadingFields={loadingFields}
            onFieldValueChange={onFieldValueChange}
            fieldValues={fieldValues}
          />
        );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => {
                if (activeSection === 'main') {
                  onClose();
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
            
            <Text style={styles.modalTitle}>فیلترها</Text>
            
            <TouchableOpacity onPress={onResetAll}>
              <Text style={styles.resetText}>حذف همه</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {renderContent()}

          {/* Footer */}
          {activeSection === 'main' && (
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[
                  styles.applyButton,
                  isLoading && styles.applyButtonDisabled
                ]}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.applyButtonText}>
                  {isLoading ? 'در حال جستجو...' : `نمایش ${filteredCount} آگهی`}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#b92a31',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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