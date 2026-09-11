// components/filter/dialogs/NeighborhoodDialog.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Switch,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const FONT = "'Vazir','IRANSans','Segoe UI',sans-serif";

export default function NeighborhoodDialog({
  open,
  onClose,
  neighborhoods = [],
  selectedIds = [],
  onApply,
}) {
  const [draft, setDraft] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      setDraft(selectedIds.map(String));
      setSearch("");
    }
  }, [open, selectedIds]);

  const filtered = useMemo(() => {
    if (search.trim().length < 2) return neighborhoods;
    const q = search.trim().toLowerCase();
    return neighborhoods.filter((n) =>
      (n.name || n.title || "").toLowerCase().includes(q)
    );
  }, [neighborhoods, search]);

  const toggle = (id) => {
    const s = String(id);
    setDraft((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

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
          انتخاب محله
        </Typography>
        <Typography
          component="span"
          onClick={() => setDraft([])}
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
      </Box>

      <DialogContent sx={{ p: 2, maxHeight: "60vh", overflowY: "auto" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="جستجوی محله..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#999" }} />
              </InputAdornment>
            ),
            sx: { fontFamily: FONT, borderRadius: "10px" },
          }}
          sx={{ mb: 2 }}
        />

        {filtered.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 4,
              color: "#999",
            }}
          >
            <Typography sx={{ fontFamily: FONT, fontSize: 14 }}>
              محله‌ای یافت نشد
            </Typography>
          </Box>
        ) : (
          filtered.map((n) => {
            const id = String(n.id);
            const isSelected = draft.includes(id);
            return (
              <Box
                key={id}
                onClick={() => toggle(id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1.25,
                  px: 1,
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                  borderRadius: "6px",
                  backgroundColor: isSelected ? "#f9f0f0" : "transparent",
                  "&:hover": {
                    backgroundColor: isSelected ? "#f9f0f0" : "#fafafa",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: 15,
                    color: isSelected ? "#b92a31" : "#333",
                    fontWeight: isSelected ? 700 : 500,
                  }}
                >
                  {n.name || n.title}
                </Typography>
                <Switch
                  checked={isSelected}
                  // No onChange — the parent Box owns the toggle so the click
                  // fires only once (no double-toggle).
                  sx={{
                    // Let clicks pass through to the parent Box so both the
                    // label and the switch toggle the same state exactly once.
                    pointerEvents: "none",
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#b92a31" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#b92a31",
                    },
                  }}
                />
              </Box>
            );
          })
        )}
      </DialogContent>

      <Divider />

      <Box sx={{ p: 1.5, display: "flex", gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setDraft([])}
          sx={{
            fontFamily: FONT,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "10px",
            color: "#666",
            borderColor: "#ccc",
            "&:hover": { borderColor: "#999" },
          }}
        >
          پاک کردن
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={() => onApply(draft)}
          sx={{
            fontFamily: FONT,
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            backgroundColor: "#b92a31",
            "&:hover": { backgroundColor: "#a01c22" },
          }}
        >
          تایید {draft.length > 0 ? `(${draft.length})` : ""}
        </Button>
      </Box>
    </Dialog>
  );
}