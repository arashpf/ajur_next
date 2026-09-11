// components/panel/new/hooks/usePropertyForm.js
// Ported from newworkerparts/hooks.js usePropertyForm
// + calculateAutomatic logic from web MainForm.js (kept as requested)

import { useState, useCallback } from "react";

export const usePropertyForm = () => {
  const [properties, setProperties] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");

  // ---------- basic ops ----------
  const addProperty = useCallback((property) => {
    setProperties((prev) => [...prev, property]);
  }, []);

  const removeProperty = useCallback((propertyName) => {
    setProperties((prev) => prev.filter((item) => item.name !== propertyName));
  }, []);

  const updateProperty = useCallback((propertyName, value) => {
    setProperties((prev) => {
      const exists = prev.some((p) => p.name === propertyName);
      if (exists) {
        return prev.map((p) =>
          p.name === propertyName ? { ...p, value } : p
        );
      }
      return [...prev, { name: propertyName, value }];
    });
  }, []);

  // upsert: replaces value if exists, else appends
  const upsertProperty = useCallback((property) => {
    setProperties((prev) => {
      const idx = prev.findIndex((p) => p.name === property.name);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          ...property,
          value: property.value,
        };
        return updated;
      }
      return [...prev, property];
    });
  }, []);

  const clearProperties = useCallback(() => {
    setProperties([]);
  }, []);

  // ---------- auto calculation ----------
  // From web MainForm.js — maintains a link between:
  //   قیمت, متراژ کل, قیمت هر متر
  // Whenever one changes, the third is recomputed.
  const calculateAutomatic = useCallback(
    (changedName, changedValue) => {
      const num = (v) => Number(String(v).replace(/[^0-9.-]/g, "")) || 0;

      const price = properties.find((p) => p.name === "قیمت");
      const totalArea = properties.find((p) => p.name === "متراژ کل");
      const pricePerMeter = properties.find((p) => p.name === "قیمت هر متر");

      const v = num(changedValue);

      if (changedName === "قیمت") {
        if (totalArea && num(totalArea.value) > 0) {
          const perMeter = Math.round(v / num(totalArea.value));
          upsertProperty({
            name: "قیمت هر متر",
            value: String(perMeter),
            kind: 1,
            special: "1",
            order: "3",
          });
        }
      } else if (changedName === "متراژ کل") {
        if (price && num(price.value) > 0 && v > 0) {
          const perMeter = Math.round(num(price.value) / v);
          upsertProperty({
            name: "قیمت هر متر",
            value: String(perMeter),
            kind: 1,
            special: "1",
            order: "3",
          });
        }
      } else if (changedName === "قیمت هر متر") {
        if (totalArea && num(totalArea.value) > 0) {
          const total = Math.round(v * num(totalArea.value));
          upsertProperty({
            name: "قیمت",
            value: String(total),
            kind: 1,
            special: "1",
            order: "3",
          });
        }
      }
    },
    [properties, upsertProperty]
  );

  return {
    properties,
    title,
    setTitle,
    description,
    setDescription,
    note,
    setNote,
    addProperty,
    removeProperty,
    updateProperty,
    upsertProperty,
    clearProperties,
    calculateAutomatic,
  };
};