// components/filters/NeighborhoodFilter.js
const NeighborhoodFilter = ({ neighborhoods, selectedNeighborhoods, onNeighborhoodToggle, onNeighborhoodRemove }) => {
    return (
      <div className="neighborhood-filter">
        <h3>Neighborhoods</h3>
        <div className="neighborhood-list">
          {neighborhoods.map(neighborhood => (
            <label key={neighborhood.id}>
              <input
                type="checkbox"
                checked={selectedNeighborhoods.includes(neighborhood.id)}
                onChange={() => onNeighborhoodToggle(neighborhood.id)}
              />
              {neighborhood.name}
            </label>
          ))}
        </div>
      </div>
    );
  };
  