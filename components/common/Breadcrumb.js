import React from "react";
import Link from "next/link";
import styles from "./Breadcrumb.module.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const Breadcrumb = ({ 
  persianCategory, 
  englishCategory, 
  englishCity, 
  currentPage 
}) => {
  console.log('Breadcrumb props RECEIVED:', {
    persianCategory,
    englishCategory,
    englishCity,
    currentPage,
    hasPersianCategory: !!persianCategory,
    hasEnglishCategory: !!englishCategory,
    hasEnglishCity: !!englishCity
  });

  // Check why we're getting #
  if (!englishCity || !englishCategory) {
    console.error('Missing data for URL:', {
      missingCity: !englishCity,
      missingCategory: !englishCategory,
      englishCity,
      englishCategory
    });
  }

  // Build the category URL - MUST have both
  const categoryUrl = englishCity && englishCategory 
    ? `/${englishCity}/${englishCategory}`  // e.g., /robat-karim/buy-villa
    : null; // Return null if missing, we'll handle it

  console.log('Generated categoryUrl:', categoryUrl);

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb" dir="rtl">
      <ol className={styles.breadcrumbList}>
        {/* Home Link */}
        <li className={styles.breadcrumbItem}>
          <Link href="/" className={styles.breadcrumbLink}>
            خانه
          </Link>
        </li>

        {/* Separator - Always show after home */}
        <li className={styles.breadcrumbSeparator}>
          <ChevronLeftIcon className={styles.breadcrumbIcon} />
        </li>

        {/* Category Link */}
        {persianCategory && (
          <>
            <li className={styles.breadcrumbItem}>
              {categoryUrl ? (
                <Link 
                  href={categoryUrl} 
                  className={styles.breadcrumbLink}
                  onClick={() => console.log('Navigating to:', categoryUrl)}
                >
                  {persianCategory} 
                </Link>
              ) : (
                // Show as text if no valid URL
                <span className={styles.breadcrumbLink} style={{ cursor: 'default', color: '#666' }}>
                  {persianCategory} 
                </span>
              )}
            </li>
            
            {/* Separator after category if we have current page */}
            {currentPage && (
              <li className={styles.breadcrumbSeparator}>
                <ChevronLeftIcon className={styles.breadcrumbIcon} />
              </li>
            )}
          </>
        )}

        {/* Current Page */}
        {currentPage && (
          <li className={`${styles.breadcrumbItem} ${styles.active}`}>
            <span className={styles.breadcrumbText}>{currentPage}</span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;