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
  itemProps = { xl: 3, md: 4, xs: 12 },
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
    return grid ? (
      <Grid container {...gridProps} className={className}>
        <Grid item xs={12}>
          {emptyComponent}
        </Grid>
      </Grid>
    ) : (
      <div className={className}>{emptyComponent}</div>
    );
  }

  const content = visibleItems.map((item, index) =>
    grid ? (
      <Grid item {...itemProps} key={index}>
        {renderItem(item)}
      </Grid>
    ) : (
      <div key={index}>{renderItem(item)}</div>
    )
  );

  return grid ? (
    <Grid container {...gridProps} className={className}>
      {content}
      <Grid
        item
        xs={12}
        ref={loaderRef}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          minHeight: "100px",
          textAlign: "center",
        }}
      >
        {visibleItems.length < items.length
          ? isLoading
            ? loadingComponent
            : null
          : endComponent}
      </Grid>
    </Grid>
  ) : (
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
        {visibleItems.length < items.length
          ? isLoading
            ? loadingComponent
            : null
          : endComponent}
      </div>
    </div>
  );
};

export default LazyLoader;