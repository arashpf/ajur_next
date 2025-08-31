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
  const [showMessage, setShowMessage] = useState(false);
  const loaderRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setVisibleItems(items.slice(0, itemsPerPage));
    setPage(1);
  }, [items, itemsPerPage]);

  const loadMoreItems = useCallback(() => {
    if (isLoading || visibleItems.length >= items.length) return;

    setIsLoading(true);
    setShowMessage(true);

    const nextPage = page + 1;

    setTimeout(() => {
      const nextItems = items.slice(0, nextPage * itemsPerPage);
      setVisibleItems(nextItems);
      setPage(nextPage);
      setIsLoading(false);

      if (nextItems.length >= items.length) {
        setShowMessage(true);
      } else {
        setShowMessage(false);
      }
    }, delay);
  }, [page, items, visibleItems, itemsPerPage, isLoading, delay]);

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

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", minHeight: "300px" }}
    >
      {grid ? (
        <Grid container {...gridProps}>
          {content}
          <div ref={loaderRef}></div>
        </Grid>
      ) : (
        <div>
          {content}
          <div ref={loaderRef}></div>
        </div>
      )}

    
      <div
        style={{
          position: "absolute",
          bottom: "20px",          
          left: 0,
          width: "100%",           
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "8px 16px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          maxWidth: "90%",
          wordBreak: "break-word",
          margin: "0 auto",
          opacity: showMessage ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: showMessage ? "auto" : "none",
        }}
      >
        {visibleItems.length < items.length ? loadingComponent : endComponent}
      </div>
    </div>
  );
};

export default LazyLoader;
