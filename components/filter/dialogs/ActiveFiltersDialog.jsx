// components/filter/dialogs/ActiveFiltersDialog.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getFieldDisplayName,
  getFieldUnit,
  formatNumberWithWords,
} from "../utils/fieldUtils";

const FONT = "'Vazir','IRANSans','Segoe UI',sans-serif";

const SORT_LABELS = {
  newest: "جدیدترین",
  oldest: "قدیمی‌ترین",
  most_viewed: "پر بازدید ترین",
};

export default function ActiveFiltersDialog({
  open,
  onClose,
  fieldValues,
  allFields,
  neighborhoodIds,
  availableNeighborhoods,
  features,
  sortBy,
  onOpenField,
  onOpenNeighborhoods,
  onOpenFeatures,
  onRemoveField,
  onRemoveNeighborhood,
  onRemoveFeature,
  onClearSort,
  onResetAll,
}) {
  // Build active items
  const activeFields = Object.entries(fieldValues || {}).filter(([slug, v]) => {
    if (!v) return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") {
      return (
        (v.min !== "" && v.min !== undefined && v.min !== null) ||
        (v.max !== "" && v.max !== undefined && v.max !== null)
      );
    }
    return v !== "" && v !== "0";
  });

  const neighborhoodItems = (neighborhoodIds || []).map((id) => {
    const n = (availableNeighborhoods || []).find(
      (x) => String(x.id) === String(id)
    );
    return { id, name: n?.name || n?.title || `محله ${id}` };
  });

  const totalActive =
    activeFields.length +
    neighborhoodItems.length +
    (features?.length || 0) +
    (sortBy && sortBy !== "newest" ? 1 : 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          direction: "rtl",
          fontFamily: FONT,
          borderRadius: "16px",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          pt: 1.25,
          pb: 0.25,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 4,
            backgroundColor: "#cccccc",
            borderRadius: 3,
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.25,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
        <Typography
          sx={{
            fontFamily: FONT,
            fontSize: 16,
            fontWeight: 700,
            color: "#333",
            flex: 1,
            textAlign: "center",
          }}
        >
          فیلترهای فعال {totalActive > 0 ? `(${totalActive})` : ""}
        </Typography>
        {totalActive > 0 ? (
          <Typography
            component="span"
            onClick={onResetAll}
            sx={{
              fontFamily: FONT,
              fontSize: 13,
              color: "#b92a31",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            حذف همه
          </Typography>
        ) : (
          <Box sx={{ width: 40 }} />
        )}
      </Box>

      <DialogContent sx={{ p: 2, maxHeight: "60vh", overflowY: "auto" }}>
        {totalActive === 0 ? (
          <Typography
            sx={{
              fontFamily: FONT,
              fontSize: 14,
              color: "#999",
              textAlign: "center",
              py: 4,
            }}
          >
            هیچ فیلتری فعال نیست
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {/* Sort */}
            {sortBy !== "newest" && (
              <Row
                label={`مرتب‌سازی: ${SORT_LABELS[sortBy] || sortBy}`}
                onRemove={onClearSort}
              />
            )}

            {/* Neighborhoods */}
            {neighborhoodItems.length > 0 && (
              <Row
                label={`محله (${neighborhoodItems.length})`}
                sublabel={neighborhoodItems.map((n) => n.name).join("، ")}
                onPress={onOpenNeighborhoods}
                onRemove={() =>
                  neighborhoodItems.forEach((n) => onRemoveNeighborhood(n.id))
                }
              />
            )}

            {/* Fields */}
            {activeFields.map(([slug, val]) => {
              const field = (allFields || []).find((f) => f.slug === slug);
              const name = getFieldDisplayName(field) || slug;
              const unit = getFieldUnit(field);

              let valueLabel = "";
              if (Array.isArray(val)) {
                valueLabel = val.join("، ");
              } else if (typeof val === "object") {
                if (val.min && val.max)
                  valueLabel = `${formatNumberWithWords(val.min)} تا ${formatNumberWithWords(
                    val.max
                  )} ${unit}`;
                else if (val.min) valueLabel = `از ${formatNumberWithWords(val.min)} ${unit}`;
                else if (val.max) valueLabel = `تا ${formatNumberWithWords(val.max)} ${unit}`;
              } else {
                valueLabel = String(val);
              }

              return (
                <Row
                  key={`af-${slug}`}
                  label={name}
                  sublabel={valueLabel}
                  onPress={() => onOpenField?.(field || { slug, name })}
                  onRemove={() => onRemoveField(slug)}
                />
              );
            })}

            {/* Features */}
            {features?.length > 0 && (
              <Row
                label={`امکانات (${features.length})`}
                sublabel={features.join("، ")}
                onPress={onOpenFeatures}
                onRemove={() => features.forEach((f) => onRemoveFeature(f))}
              />
            )}
          </Box>
        )}
      </DialogContent>

      {totalActive > 0 && (
        <>
          <Divider />
          <Box sx={{ p: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={onResetAll}
              sx={{
                fontFamily: FONT,
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "10px",
                color: "#b92a31",
                borderColor: "#b92a31",
                "&:hover": {
                  borderColor: "#a01c22",
                  backgroundColor: "rgba(185,42,49,0.06)",
                },
              }}
            >
              حذف همه فیلترها
            </Button>
          </Box>
        </>
      )}
    </Dialog>
  );
}

function Row({ label, sublabel, onPress, onRemove }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        px: 1.5,
        py: 1.25,
        borderRadius: "10px",
        border: "1px solid #eee",
        backgroundColor: "#fafafa",
      }}
    >
      <Chip
        onDelete={onRemove}
        onClick={onPress}
        label={
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Typography sx={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#b92a31" }}>
              {label}
            </Typography>
            {sublabel && (
              <Typography sx={{ fontFamily: FONT, fontSize: 11, color: "#666", mt: 0.25 }}>
                {sublabel}
              </Typography>
            )}
          </Box>
        }
        sx={{
          flex: 1,
          height: "auto",
          py: 1,
          backgroundColor: "#fff",
          border: "1.5px solid #b92a31",
          borderRadius: "8px",
          justifyContent: "flex-start",
          "& .MuiChip-label": { width: "100%", px: 1 },
          "& .MuiChip-deleteIcon": { color: "#b92a31", "&:hover": { color: "#a01c22" } },
        }}
      />
    </Box>
  );
}