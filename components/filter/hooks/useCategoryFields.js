// components/filter/hooks/useCategoryFields.js

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { normalizeField } from "../utils/fieldUtils";

const API_BASE = "https://api.ajur.app";

// Module-level cache so we don't refetch per dialog open
const cache = new Map();

function processFields(rawFields) {
  if (!Array.isArray(rawFields)) return [];
  return rawFields.map(normalizeField).filter(Boolean);
}

/**
 * Fetches category fields for a given categoryId.
 * Returns: { normal, tick, predefine, loading, error }
 */
export default function useCategoryFields(categoryId) {
  const [state, setState] = useState(() => {
    if (!categoryId) return { normal: [], tick: [], predefine: [], loading: false, error: null };
    const cached = cache.get(categoryId);
    if (cached) return { ...cached, loading: false, error: null };
    return { normal: [], tick: [], predefine: [], loading: true, error: null };
  });

  const reqIdRef = useRef(0);

  useEffect(() => {
    if (!categoryId) {
      setState({ normal: [], tick: [], predefine: [], loading: false, error: null });
      return;
    }

    const cached = cache.get(categoryId);
    if (cached) {
      setState({ ...cached, loading: false, error: null });
      return;
    }

    const myReq = ++reqIdRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    axios
      .get(`${API_BASE}/api/category-fields`, {
        params: { cat: categoryId },
        timeout: 10000,
        headers: { Accept: "application/json" },
      })
      .then((res) => {
        if (myReq !== reqIdRef.current) return; // stale
        const data = {
          normal: processFields(res.data?.normal_fields || []),
          tick: processFields(res.data?.tick_fields || []),
          predefine: processFields(res.data?.predefine_fields || []),
        };
        cache.set(categoryId, data);
        setState({ ...data, loading: false, error: null });
      })
      .catch((err) => {
        if (myReq !== reqIdRef.current) return;
        console.error("useCategoryFields error:", err);
        setState({ normal: [], tick: [], predefine: [], loading: false, error: err });
      });
  }, [categoryId]);

  return state;
}