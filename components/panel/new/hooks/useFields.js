// components/panel/new/hooks/useFields.js
// Ported from newworkerparts/hooks.js useFields — 1:1

import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://api.ajur.app/api";

export const useFields = (catId) => {
  const [normalFields, setNormalFields] = useState([]);
  const [predefineFields, setPredefineFields] = useState([]);
  const [tickFields, setTickFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(true);

  useEffect(() => {
    if (catId) {
      setLoadingFields(true);
      axios({
        method: "get",
        url: `${API_BASE}/category-fields`,
        params: { cat: catId },
      })
        .then((response) => {
          setNormalFields(
            response.data.normal_fields.sort((a, b) =>
              a.sort > b.sort ? 1 : -1
            )
          );
          setTickFields(response.data.tick_fields);
          setPredefineFields(response.data.predefine_fields);
          setLoadingFields(false);
        })
        .catch((error) => {
          console.error("useFields error:", error);
          setLoadingFields(false);
        });
    }
  }, [catId]);

  return {
    normalFields,
    predefineFields,
    tickFields,
    loadingFields,
  };
};