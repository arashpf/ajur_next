// components/LazyLoader.jsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";

const LazyLoader = ({
  items,
  renderItem,
  delay = 0,
  loadingComponent = <p>در حال بارگذاری...</p>,
  endComponent = <p>تمام آیتم‌ها بارگذاری شدند!</p>,
  grid = true,
  gridProps = { spacing: 2 },
  // optional: provide a horizontal padding value (e.g. '12px' or '24px')
  // to apply to the left/right of the rendered grid. If null, global CSS applies.
  gridPadding = null,
  // make default item width 3 (12/4) on medium+ so we get 4 columns
  itemProps = { xl: 3, lg: 3, md: 3, sm: 6, xs: 12 },
  emptyComponent = <p>متاسفانه موردی یافت نشد ❌</p>,
  className = "",
}) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  const getItemsPerPage = () => {
    if (isXs) return 4; // Mobile
    if (isSm) return 4; // Small tablets
    if (isMd) return 6; // Medium screens
    if (isLg) return 6; // Large screens
    return 6; // Default
  };

  const itemsPerPage = getItemsPerPage();
  const [visibleItems, setVisibleItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  // Reset when items change
  useEffect(() => {
    setVisibleItems((items || []).slice(0, itemsPerPage));
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
      const paddingStyle = gridPadding
        ? { paddingLeft: gridPadding, paddingRight: gridPadding }
        : {};
      return (
        <div className={className} style={{ width: "100%", ...paddingStyle }}>
          <Grid container className={`lazy-grid-inner`} {...gridProps}>
            <Grid item xs={12}>
              {emptyComponent}
            </Grid>
          </Grid>
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
    const paddingStyle = gridPadding
      ? { paddingLeft: gridPadding, paddingRight: gridPadding }
      : {};

    return (
      <div className={className} style={{ width: "100%", ...paddingStyle }}>
        <Grid container className={`lazy-grid-inner`} {...gridProps}>
          {visibleItems.map((item, index) => (
            // renderItem is expected to return a `<Grid item ...>` element when used with `grid=true`.
            // We render it directly so MUI Grid sizing works as intended.
            <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
          ))}

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
            {visibleItems.length < (items || []).length
              ? isLoading
                ? loadingComponent
                : null
              : endComponent}
          </Grid>
        </Grid>
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
