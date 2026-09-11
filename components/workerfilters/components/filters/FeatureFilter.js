// components/filters/FeatureFilter.js
const FeatureFilter = ({ features, selectedFeatures, onFeatureToggle }) => {
    return (
      <div className="feature-filter">
        <h3>Features</h3>
        <div className="feature-list">
          {features.map(feature => (
            <label key={feature.id}>
              <input
                type="checkbox"
                checked={selectedFeatures.includes(feature.id)}
                onChange={() => onFeatureToggle(feature.id)}
              />
              {feature.name}
            </label>
          ))}
        </div>
      </div>
    );
  };