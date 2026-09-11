// components/filters/AppliedFiltersDisplay.js
const AppliedFiltersDisplay = ({
    selectedCategory,
    selectedNeighborhoods,
    selectedFeatures,
    rangeFilters,
    onClearFilters
  }) => {
    return (
      <div className="applied-filters">
        <h3>Applied Filters</h3>
        <div className="filter-chips">
          {selectedCategory && (
            <span className="filter-chip">
              Category: {selectedCategory}
              <button onClick={() => {/* Clear category */}}>×</button>
            </span>
          )}
          
          {selectedNeighborhoods.map(neighborhood => (
            <span key={neighborhood} className="filter-chip">
              {neighborhood}
              <button onClick={() => {/* Remove neighborhood */}}>×</button>
            </span>
          ))}
          
          {selectedFeatures.map(feature => (
            <span key={feature} className="filter-chip">
              {feature}
              <button onClick={() => {/* Remove feature */}}>×</button>
            </span>
          ))}
          
          {Object.entries(rangeFilters).map(([name, value]) => (
            <span key={name} className="filter-chip">
              {name}: {value}
              <button onClick={() => {/* Clear range filter */}}>×</button>
            </span>
          ))}
        </div>
        
        <button onClick={onClearFilters} className="clear-filters-btn">
          Clear All Filters
        </button>
      </div>
    );
  };
  