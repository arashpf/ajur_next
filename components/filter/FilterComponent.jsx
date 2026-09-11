// components/filter/FilterComponent.jsx
import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import SortIcon from "@mui/icons-material/Sort";
import PlaceIcon from "@mui/icons-material/Place";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";

import FilterSlider from "./FilterSlider";
import useFilterState from "./hooks/useFilterState";
import useCategoryFields from "./hooks/useCategoryFields";
import {
  getAllFields,
  getFieldDisplayName,
  getFieldUnit,
} from "./utils/fieldUtils";

import ActiveFiltersDialog from "./dialogs/ActiveFiltersDialog";
import SortMenu from "./dialogs/SortMenu";
import NeighborhoodDialog from "./dialogs/NeighborhoodDialog";
import FeaturesDialog from "./dialogs/FeaturesDialog";
import FieldDialog from "./dialogs/FieldDialog";

const SORT_LABELS = {
  newest: "جدیدترین",
  oldest: "قدیمی‌ترین",
  most_viewed: "پر بازدید ترین",
};

/**
 * Props:
 *   initialCategoryId   number|string   → used to fetch /api/category-fields
 *   availableNeighborhoods array        → passed from SingleCategory's base data
 *   availableFeatures   array           → features from base API
 *   top                 number          → chip bar top offset (default 80)
 */
export default function FilterComponent({
  initialCategoryId = null,
  availableNeighborhoods = [],
  availableFeatures = [],
  top = 80,
}) {
  const router = useRouter();

  // 1. Fetch category fields for the active category
  const { normal, tick, predefine, loading: loadingFields } =
    useCategoryFields(initialCategoryId);

  const categoryFields = useMemo(
    () => ({ normal, tick, predefine }),
    [normal, tick, predefine]
  );

  const allFields = useMemo(() => getAllFields(categoryFields), [categoryFields]);

  const fieldSlugs = useMemo(
    () => allFields.map((f) => f.slug).filter(Boolean),
    [allFields]
  );

  // Map { [slug]: "1" | "2" | "3" } — passed to useFilterState so the parser
  // knows whether a scalar URL param should be treated as an array (tick) or
  // a plain string (predefine/text).
  const fieldTypes = useMemo(() => {
    const m = {};
    allFields.forEach((f) => {
      if (f?.slug) m[f.slug] = String(f.type ?? "");
    });
    return m;
  }, [allFields]);

  // 2. Filter state from URL
  const {
    fieldValues,
    neighborhoodIds,
    features,
    sortBy,
    activeCount,
    update,
    resetAll,
  } = useFilterState({ fieldSlugs, fieldTypes });

  // 3. Which dialog is open
  const [dialog, setDialog] = useState(null);
  // dialog = null | "active" | "sort" | "neighborhoods" | "features" | { type: "field", field }

  // 4. Anchor for sort menu
  const [sortAnchorEl, setSortAnchorEl] = useState(null);

  // 5. Build neighborhood objects from ids (for chip + dialog display)
  const selectedNeighborhoods = useMemo(() => {
    return neighborhoodIds
      .map((id) =>
        availableNeighborhoods.find((n) => String(n.id) === String(id))
      )
      .filter(Boolean);
  }, [neighborhoodIds, availableNeighborhoods]);

  // 6. Compose chips
  const chips = useMemo(() => {
    const out = [];

    

    // ---- Chip: محله ----
    out.push({
      key: "neighborhoods",
      label:
        selectedNeighborhoods.length > 0
          ? `محله (${selectedNeighborhoods.length})`
          : "محله",
      active: selectedNeighborhoods.length > 0,
      startIcon: <PlaceIcon sx={{ fontSize: 18 }} />,
      onPress: () => setDialog("neighborhoods"),
      onRemove:
        selectedNeighborhoods.length > 0
          ? () => update({ neighborhoodIds: [] })
          : undefined,
    });

    // ---- Chips: one per category field (all fields, always visible) ----
    // Label is always just the field name — no values. FilterSlider will
    // reorder these by active-first, then field.sort ascending.
    allFields.forEach((field) => {
        const value = fieldValues[field.slug];
        const isActive = isFieldActive(field, value);
        const type = String(field.type || "");
      
        // ---- Tick fields (type 2): tap toggles directly, no dialog ----
        if (type === "2") {
          out.push({
            key: `field-${field.slug}`,
            label: getFieldDisplayName(field),
            active: isActive,
            // Tap = toggle on/off
            onPress: () => {
              const next = { ...fieldValues };
              if (isActive) {
                delete next[field.slug];
              } else {
                // Tick value is an array; use [1] as the "on" flag — this is what
                // the API expects for a boolean-style tick field.
                next[field.slug] = [1];
              }
              update({ fieldValues: next });
            },
            // Same toggle when the user taps the X
            onRemove: isActive
              ? () => {
                  const next = { ...fieldValues };
                  delete next[field.slug];
                  update({ fieldValues: next });
                }
              : undefined,
            isFieldChip: true,
            sortPriority: Number(field.sort) || 9999,
          });
          return;
        }
      
        // ---- Range (1) and predefine (3): open the dialog ----
        out.push({
          key: `field-${field.slug}`,
          label: getFieldDisplayName(field),
          active: isActive,
          onPress: () => setDialog({ type: "field", field }),
          onRemove: isActive
            ? () => {
                const next = { ...fieldValues };
                delete next[field.slug];
                update({ fieldValues: next });
              }
            : undefined,
          isFieldChip: true,
          sortPriority: Number(field.sort) || 9999,
        });
      });

    // ---- Chip: امکانات ----
    // out.push({
    //   key: "features",
    //   label:
    //     features.length > 0 ? `امکانات (${features.length})` : "امکانات",
    //   active: features.length > 0,
    //   startIcon: <CheckCircleIcon sx={{ fontSize: 18 }} />,
    //   onPress: () => setDialog("features"),
    //   onRemove:
    //     features.length > 0
    //       ? () => update({ features: [] })
    //       : undefined,
    // });

    // ---- Chip: حذف همه ----
    if (activeCount > 1) {
      out.push({
        key: "reset-all",
        label: "حذف همه",
        active: false,
        startIcon: <DeleteIcon sx={{ fontSize: 18 }} />,
        onPress: () => resetAll(),
      });
    }


    
  
      // ---- Chip 2: مرتب‌سازی ----
      out.push({
        key: "sort",
        label: `مرتب‌سازی: ${SORT_LABELS[sortBy] || SORT_LABELS.newest}`,
        active: sortBy !== "newest",
        startIcon: <SortIcon sx={{ fontSize: 18 }} />,
        onPress: (e) => {
          setSortAnchorEl(e?.currentTarget || null);
          setDialog("sort");
        },
        onRemove:
          sortBy !== "newest"
            ? () => update({ sortBy: "newest" })
            : undefined,
      });

      // ---- Chip 1: فیلترها (N) ----
    out.push({
        key: "open-filters",
        label: "فیلترها",
        active: true,
        badge: activeCount > 0 ? activeCount : null,
        startIcon: <TuneIcon sx={{ fontSize: 20 }} />,
        onPress: () => setDialog("active"),
      });

    return out;
  }, [
    activeCount,
    sortBy,
    fieldValues,
    selectedNeighborhoods,
    allFields,
    features,
    update,
    resetAll,
  ]);

  // 7. Scroll deps — reruns when any meaningful value changes
  const scrollDeps = [
    activeCount,
    sortBy,
    JSON.stringify(fieldValues),
    JSON.stringify(neighborhoodIds),
    JSON.stringify(features),
    allFields.length,
  ];

  return (
    <>
      <FilterSlider chips={chips} top={top} height={60} deps={scrollDeps} />

      {/* Space reserving so content doesn’t sit under the fixed bar */}
      <Box sx={{ height: 70 }} />

      {/* ---------------- DIALOGS ---------------- */}

      <ActiveFiltersDialog
        open={dialog === "active"}
        onClose={() => setDialog(null)}
        fieldValues={fieldValues}
        allFields={allFields}
        neighborhoodIds={neighborhoodIds}
        availableNeighborhoods={availableNeighborhoods}
        features={features}
        sortBy={sortBy}
        onOpenField={(field) => setDialog({ type: "field", field })}
        onOpenNeighborhoods={() => setDialog("neighborhoods")}
        onOpenFeatures={() => setDialog("features")}
        onRemoveField={(slug) => {
          const next = { ...fieldValues };
          delete next[slug];
          update({ fieldValues: next });
        }}
        onRemoveNeighborhood={(id) => {
          update({
            neighborhoodIds: neighborhoodIds.filter(
              (n) => String(n) !== String(id)
            ),
          });
        }}
        onRemoveFeature={(name) => {
          update({ features: features.filter((f) => f !== name) });
        }}
        onClearSort={() => update({ sortBy: "newest" })}
        onResetAll={() => {
          resetAll();
          setDialog(null);
        }}
      />

      <SortMenu
        open={dialog === "sort"}
        anchorEl={sortAnchorEl}
        current={sortBy}
        onChange={(val) => {
          update({ sortBy: val });
          setDialog(null);
          setSortAnchorEl(null);
        }}
        onClose={() => {
          setDialog(null);
          setSortAnchorEl(null);
        }}
      />

      <NeighborhoodDialog
        open={dialog === "neighborhoods"}
        onClose={() => setDialog(null)}
        neighborhoods={availableNeighborhoods}
        selectedIds={neighborhoodIds}
        onApply={(ids) => {
          update({ neighborhoodIds: ids });
          setDialog(null);
        }}
      />

      <FeaturesDialog
        open={dialog === "features"}
        onClose={() => setDialog(null)}
        features={availableFeatures}
        selectedNames={features}
        onApply={(names) => {
          update({ features: names });
          setDialog(null);
        }}
      />

      {dialog && typeof dialog === "object" && dialog.type === "field" && (
        <FieldDialog
          open
          field={dialog.field}
          fieldValue={fieldValues[dialog.field.slug]}
          unit={getFieldUnit(dialog.field)}
          onApply={(value) => {
            const next = { ...fieldValues };
            if (isEmptyValue(value)) {
              delete next[dialog.field.slug];
            } else {
              next[dialog.field.slug] = value;
            }
            update({ fieldValues: next });
            setDialog(null);
          }}
          onRemove={() => {
            const next = { ...fieldValues };
            delete next[dialog.field.slug];
            update({ fieldValues: next });
            setDialog(null);
          }}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------- */

function isFieldActive(field, value) {
  if (!field || value === undefined || value === null || value === "")
    return false;

  const type = String(field.type || "");

  // tick (type 2): value is array
  if (type === "2") return Array.isArray(value) && value.length > 0;

  // normal range (type 1) or object
  if (typeof value === "object" && !Array.isArray(value)) {
    return (
      (value.min !== "" && value.min !== undefined && value.min !== null) ||
      (value.max !== "" && value.max !== undefined && value.max !== null)
    );
  }

  // predefine (type 3) or free text
  return value !== "" && value !== "0";
}

function isEmptyValue(value) {
  if (value === undefined || value === null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") {
    return (
      (value.min === "" || value.min === undefined) &&
      (value.max === "" || value.max === undefined)
    );
  }
  return value === "0";
}