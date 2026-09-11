// components/filters/RangeFilter.js
const RangeFilter = ({ rangeFilters, dynamicRangeFilters, onRangeFilterChange }) => {
    return (
      <div className="range-filter">
        <h3>Range Filters</h3>
        {Object.entries(rangeFilters).map(([filterName, filterConfig]) => (
          <div key={filterName} className="range-input">
            <label>{filterConfig.label}</label>
            <input
              type="range"
              min={filterConfig.min}
              max={filterConfig.max}
              value={dynamicRangeFilters[filterName] || filterConfig.default}
              onChange={(e) => onRangeFilterChange(filterName, e.target.value)}
            />
            <span>{dynamicRangeFilters[filterName] || filterConfig.default}</span>
          </div>
        ))}
      </div>
    );
  };
  