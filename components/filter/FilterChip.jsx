// components/filter/FilterChip.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * A single chip in the filter slider.
 *
 * Props:
 *   label       string
 *   active      bool → red border + X button
 *   onPress     fn   → opens dialog
 *   onRemove    fn   → optional; called when X clicked (stopPropagation)
 *   badge       number | null → small red count badge on chip
 *   startIcon   ReactNode
 */
export default function FilterChip({
  label,
  active = false,
  onPress,
  onRemove,
  badge = null,
  startIcon = null,
}) {
  const handleRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onRemove?.();
  };

  return (
    <Box
      onClick={onPress}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPress?.();
        }
      }}
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        height: 40,
        px: 1.25,
        ml: 1, // left margin (visually "before" the next chip in RTL)
        backgroundColor: "#fff",
        borderRadius: "8px",
        border: active ? "2px solid #b92a31" : "1.5px solid #cccccc",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
        flexShrink: 0,
        transition: "border-color 0.15s, box-shadow 0.15s",
        "&:hover": {
          borderColor: "#b92a31",
          boxShadow: "0 2px 6px rgba(185,42,49,0.12)",
        },
        "&:focus-visible": {
          outline: "none",
          boxShadow: "0 0 0 2px rgba(185,42,49,0.25)",
        },
      }}
    >
      {startIcon && (
        <Box sx={{ display: "inline-flex", alignItems: "center", color: active ? "#b92a31" : "#666" }}>
          {startIcon}
        </Box>
      )}

      <Typography
        component="span"
        sx={{
          fontFamily: "'Vazir','IRANSans','Segoe UI',sans-serif",
          fontSize: 14,
          fontWeight: active ? 700 : 500,
          color: active ? "#b92a31" : "#666",
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>

      {active && onRemove && (
        <Box
          component="span"
          onClick={handleRemove}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            ml: 0.25,
            cursor: "pointer",
            color: "#b92a31",
            "&:hover": { opacity: 0.7 },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </Box>
      )}

      {badge !== null && badge > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
            minWidth: 20,
            height: 20,
            px: 0.5,
            borderRadius: "10px",
            backgroundColor: "#b92a31",
            border: "2px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Vazir','IRANSans',sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1,
          }}
        >
          {badge}
        </Box>
      )}
    </Box>
  );
}