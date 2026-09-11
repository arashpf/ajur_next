// components/filter/FilterSlider.jsx
import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import FilterChip from "./FilterChip";

export default function FilterSlider({ chips = [], top = 60, height = 60, deps = [] }) {
  const scrollRef = useRef(null);
  const dragState = useRef({
    dragging: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  // ---- Reorder: field chips sorted by active-first then sortPriority asc.
  //      Non-field chips stay in their original relative order, split into
  //      before/after the first field chip.
  const orderedChips = useMemo(() => {
    const fixedPre = [];
    const fixedPost = [];
    const fieldChips = [];
    let seenFirstField = false;

    chips.forEach((c) => {
      if (c.isFieldChip) {
        fieldChips.push(c);
        seenFirstField = true;
      } else if (!seenFirstField) {
        fixedPre.push(c);
      } else {
        fixedPost.push(c);
      }
    });

    fieldChips.sort((a, b) => {
      if (a.active !== b.active) return a.active ? -1 : 1;
      const aP = Number.isFinite(a.sortPriority) ? a.sortPriority : 9999;
      const bP = Number.isFinite(b.sortPriority) ? b.sortPriority : 9999;
      if (aP !== bP) return aP - bP;
      return String(a.key).localeCompare(String(b.key));
    });

    return [...fixedPre, ...fieldChips, ...fixedPost];
  }, [chips]);

  // ---- On chip change, jump back to the start (right edge in RTL).
  //      In RTL, scrollLeft = 0 is the rightmost / start position.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const id = setTimeout(() => {
      el.scrollLeft = 0;
    }, 150);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // ---- Mouse wheel → horizontal scroll.
  //      RTL: decreasing scrollLeft moves toward the "end" (left).
  const handleWheel = useCallback((e) => {
    const el = scrollRef.current;
    if (!el) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (e.deltaY !== 0) {
      el.scrollLeft -= e.deltaY;
      e.preventDefault();
    }
  }, []);

  // ---- Click + drag to scroll ----
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;

    dragState.current.dragging = true;
    dragState.current.moved = false;
    dragState.current.startX = e.pageX;
    dragState.current.startScrollLeft = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  }, []);

  const handleMouseMove = useCallback((e) => {
    const el = scrollRef.current;
    if (!el || !dragState.current.dragging) return;

    const dx = e.pageX - dragState.current.startX;
    if (Math.abs(dx) > 3) dragState.current.moved = true;

    // RTL: cursor right (positive dx) shifts content right → scrollLeft increases.
    el.scrollLeft = dragState.current.startScrollLeft + dx;
    e.preventDefault();
  }, []);

  const handleMouseUp = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current.dragging = false;
    el.style.cursor = "grab";
    el.style.userSelect = "";
  }, []);

  const handleClickCapture = useCallback((e) => {
    if (dragState.current.moved) {
      e.stopPropagation();
      e.preventDefault();
      dragState.current.moved = false;
    }
  }, []);

  useEffect(() => {
    const onUp = () => {
      if (dragState.current.dragging) handleMouseUp();
    };
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, [handleMouseUp]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: 70, md: top },
        left: { xs: 2, md: 16 },
        right: { xs: 2, md: 16 },
        height,
        zIndex: 15,
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        border: "1px solid #e9ecef",
        display: "flex",
        alignItems: "center",
        px: 1,
        direction: "rtl",
        overflow: "hidden",
      }}
    >
      <Box
        ref={scrollRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClickCapture={handleClickCapture}
        sx={{
          flex: 1,
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          overflowX: "auto",
          overflowY: "hidden",
          px: 1,
          py: 1,
          cursor: "grab",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {orderedChips.map((chip) => (
          <FilterChip key={chip.key} {...chip} />
        ))}
      </Box>
    </Box>
  );
}