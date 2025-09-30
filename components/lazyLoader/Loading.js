// components/LazyLoader.jsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Grid from "@mui/material/Grid";

const LazyLoader = ({
  items,
  renderItem,
  itemsPerPage = 10,
  delay = 0,
  loadingComponent = <p>در حال بارگذاری...</p>,
  endComponent = <p>تمام آیتم‌ها بارگذاری شدند!</p>,
  grid = true,
  gridProps = { spacing: 2 },
  // make default item width 3 (12/4) on medium+ so we get 4 columns
  itemProps = { xl: 3, lg: 3, md: 3, sm: 6, xs: 12 },
  emptyComponent = <p>متاسفانه موردی یافت نشد ❌</p>,
  className = ""
}) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  // Reset when items change
  useEffect(() => {
    setVisibleItems(items.slice(0, itemsPerPage));
    setPage(1);
  }, [items, itemsPerPage]);

  const loadMoreItems = useCallback(() => {
    if (isLoading || visibleItems.length >= items.length) return;
    
    setIsLoading(true);
    const nextPage = page + 1;

    setTimeout(() => {
      const nextItems = items.slice(0, nextPage * itemsPerPage);
      setVisibleItems(nextItems);
      setPage(nextPage);
      setIsLoading(false);
    }, delay);
  }, [page, items, visibleItems, itemsPerPage, isLoading, delay]);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMoreItems]);

  // Handle empty state
  if (!items || items.length === 0) {
    if (grid) {
      const gap = gridProps && gridProps.spacing ? (gridProps.spacing * 8) + "px" : "16px";
      return (
        <div className={`lazy-grid ${className}`} style={{ display: "grid", gap }}>
          <div style={{ gridColumn: "1 / -1" }}>{emptyComponent}</div>
        </div>
      );
    }

    return <div className={className}>{emptyComponent}</div>;
  }

  const content = visibleItems.map((item, index) => (
    <div key={index} className="lazy-item">
      {renderItem(item)}
    </div>
  ));

  if (grid) {
    const gap = gridProps && gridProps.spacing ? (gridProps.spacing * 8) + "px" : "16px";
    return (
      <div className={`lazy-grid ${className}`} style={{ display: "grid", gap }}>
        {content}

        <div
          ref={loaderRef}
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
            minHeight: "100px",
            textAlign: "center",
          }}
        >
          {visibleItems.length < items.length ? (isLoading ? loadingComponent : null) : endComponent}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {content}
      <div
        ref={loaderRef}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100px",
          textAlign: "center",
        }}
      >
        {visibleItems.length < items.length ? (isLoading ? loadingComponent : null) : endComponent}
      </div>
    </div>
  );
};

export default LazyLoader;