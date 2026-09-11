// components/filters/CategoryFilter.js
const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }) => {
    return (
      <div className="category-filter">
        <h3>Category</h3>
        <div className="category-list">
          {categories.map(category => (
            <button
              key={category.id}
              className={selectedCategory === category.id ? 'active' : ''}
              onClick={() => onCategorySelect(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  
  
  
  