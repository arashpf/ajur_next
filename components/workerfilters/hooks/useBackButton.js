// hooks/useBackButton.js
import { useEffect, useRef } from "react";

export const useBackButton = (isFilterOpen, filterLevel, setFilterLevel, setIsFilterOpen) => {
  const cleanupTimeoutRef = useRef(null);
  const historyAdded = useRef(false);

  useEffect(() => {
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }

    if (!isFilterOpen) {
      if (historyAdded.current) {
        cleanupTimeoutRef.current = setTimeout(() => {
          if (window.history.state?.filterModalOpen) {
            window.history.back();
          }
          historyAdded.current = false;
        }, 100);
      }
      return;
    }

    if (!historyAdded.current) {
      window.history.pushState({ filterModalOpen: true, filterLevel }, '');
      historyAdded.current = true;
    }

    const handlePopState = (event) => {
      if (!isFilterOpen) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();

      if (filterLevel !== "base") {
        setFilterLevel("base");
        window.history.replaceState({
          filterModalOpen: true,
          filterLevel: "base"
        }, '');
      } else {
        setIsFilterOpen(false);
        cleanupTimeoutRef.current = setTimeout(() => {
          if (historyAdded.current && window.history.state?.filterModalOpen) {
            window.history.back();
            historyAdded.current = false;
          }
        }, 50);
      }
    };

    window.addEventListener('popstate', handlePopState, true);

    return () => {
      window.removeEventListener('popstate', handlePopState, true);

      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }
    };
  }, [isFilterOpen, filterLevel, setFilterLevel, setIsFilterOpen]);

  useEffect(() => {
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, []);
};
