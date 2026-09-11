// components/FilterSlider.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatNumberWithWords } from '../utils/formatters';

const FilterSlider = ({
  selectedCategory,
  selectedNeighborhoods,
  selectedFeatures,
  rangeFilters,
  sortBy,
  hasActiveFilters,
  onFilterModalOpen,
  onFilterModalOpenForCategory, // This will trigger category section
  onCategoryRemove,
  onNeighborhoodRemove,
  onFeatureRemove,
  onRangeFilterRemove,
  onSortRemove,
  onResetAll,
  getSortDisplayText,
  activeFiltersCount
}) => {
  if (!hasActiveFilters) {
    return (
      <TouchableOpacity
        style={styles.filterSlider}
        onPress={onFilterModalOpen}
      >
        <Text style={styles.filterSliderText}>فیلترها</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.filterSlider}>
      {/* Scrollable area for filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.selectedFiltersScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Selected Category - Opens directly to category section */}
        {selectedCategory && (
          <TouchableOpacity 
            style={styles.categoryChip}  
            onPress={onFilterModalOpenForCategory} // This opens modal to category section
          >
            <Text style={styles.categoryChipText}>
              {selectedCategory.name}
            </Text>
            <Icon name="list" size={20} color="#444" />
          </TouchableOpacity>
        )}

        {/* Selected Neighborhoods - with close buttons */}
        {selectedNeighborhoods.map((neighborhood) => (
          <FilterChip
            key={neighborhood.id}
            text={`محله: ${neighborhood.name}`}
            onRemove={() => onNeighborhoodRemove(neighborhood)}
          />
        ))}

        {/* Selected Features - with close buttons */}
        {selectedFeatures.map((feature) => (
          <FilterChip
            key={feature.value}
            text={`دارای ${feature.value}`}
            onRemove={() => onFeatureRemove(feature)}
          />
        ))}

        {/* Range Filters - with close buttons */}
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
                key={filter.id}
                text={label}
                onRemove={() => onRangeFilterRemove(filter.id, 'low', '')}
              />
            );
          }
          return null;
        }).filter(Boolean)}

        {/* Sort Filter - with close button */}
        {sortBy !== 'newest' && (
          <FilterChip
            text={`مرتب‌سازی: ${getSortDisplayText()}`}
            onRemove={onSortRemove}
          />
        )}
      </ScrollView>

      {/* Filter Button with Count */}
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={onFilterModalOpen}
      >
        <Text style={styles.filterButtonText}>
          فیلترها
        </Text>
        {activeFiltersCount > 0 && (
          <View style={styles.filterCountBadge}>
            <Text style={styles.filterCountText}>
              {activeFiltersCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const FilterChip = ({ text, onRemove }) => (
  <View style={styles.activeFilterChip}>
    <Text style={styles.activeFilterChipText}>{text}</Text>
    <TouchableOpacity onPress={onRemove}>
      <Icon name="close" size={16} color="#666" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1.5,
    marginLeft: 10,
    position: 'relative',
  },
  filterButtonText: {
    color: '#333',
    fontSize: 20,
    fontFamily: 'iransans',
    marginRight: 8,
  },
  filterCountBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    backgroundColor: '#b92a31',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  filterCountText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'iransans',
    fontWeight: 'bold',
  },
  filterSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    minHeight: 60,
  },
  selectedFiltersScroll: {
    flex: 1,
    marginRight: 10,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterSliderText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontFamily: 'iransans',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 8,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: 'iransans',
    marginRight: 4
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  activeFilterChipText: {
    fontSize: 12,
    color: '#444',
    marginLeft: 5,
    fontFamily: 'iransans',
  },
});

export default FilterSlider;