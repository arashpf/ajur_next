// components/panel/new/hooks/useCategories.js
// Ported from newworkerparts/hooks.js useCategories
// Diff: native-base toast → MUI Snackbar (emitted via callback)

import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://api.ajur.app/api";

export const useCategories = ({ onError } = {}) => {
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [catId, setCatId] = useState(null);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get(`${API_BASE}/sub-category`);
      setAllCategories(response.data);
    } catch (error) {
      console.error("fetchCategories error:", error);
      if (onError) onError("خطا در بارگذاری دسته بندی‌ها");
    } finally {
      setLoadingCategories(false);
    }
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setCatId(category.id);
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    allCategories,
    selectedCategory,
    loadingCategories,
    catId,
    selectCategory,
  };
};