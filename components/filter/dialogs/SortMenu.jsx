// components/filter/dialogs/SortMenu.jsx
import React from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "oldest", label: "قدیمی‌ترین" },
  { value: "most_viewed", label: "پر بازدید ترین" },
];

export default function SortMenu({ open, anchorEl, current, onChange, onClose }) {
  return (
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          direction: "rtl",
          fontFamily: "'Vazir','IRANSans','Segoe UI',sans-serif",
          minWidth: 180,
          mt: 1,
          borderRadius: "10px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
        },
      }}
    >
      {OPTIONS.map((opt) => {
        const selected = current === opt.value;
        return (
          <MenuItem
            key={opt.value}
            selected={selected}
            onClick={() => onChange(opt.value)}
            sx={{
              fontFamily: "inherit",
              fontSize: 14,
              color: selected ? "#b92a31" : "#333",
              fontWeight: selected ? 700 : 500,
              justifyContent: "space-between",
            }}
          >
            <ListItemText
              primary={opt.label}
              primaryTypographyProps={{
                sx: { fontFamily: "inherit", fontSize: 14, textAlign: "right" },
              }}
            />
            {selected && (
              <ListItemIcon sx={{ minWidth: 0, ml: 1 }}>
                <CheckIcon sx={{ fontSize: 18, color: "#b92a31" }} />
              </ListItemIcon>
            )}
          </MenuItem>
        );
      })}
    </Menu>
  );
}