import React from 'react';
import styles from './styles.module.css';

const CategoryTabs = ({ categories = [], activeCategory, onCategoryChange = () => {} }) => {
  return (
    <div className={styles.categoryContainer}>
      <div className={styles.categoryContent}>
      {(categories || []).map((category) => (
        <button
          key={category?.id}
          className={styles.categoryButton}
          style={{ backgroundColor: activeCategory === category?.id ? category?.color : '#8e8b8b' }}
          onClick={() => onCategoryChange(category?.id)}
        >
          <span className={styles.categoryText} style={{ color: 'white' }}>{category?.name}</span>
        </button>
      ))}
      </div>
    </div>
  );
};

export default CategoryTabs;