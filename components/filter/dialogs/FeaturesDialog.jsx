// components/filter/dialogs/FeaturesDialog.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Switch,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FONT = "'Vazir','IRANSans','Segoe UI',sans-serif";

export default function FeaturesDialog({
  open,
  onClose,
  features = [],
  selectedNames = [],
  onApply,
}) {
  const [draft, setDraft] = useState([]);

  useEffect(() => {
    if (open) setDraft([...selectedNames]);
  }, [open, selectedNames]);

  const normalized = useMemo(() => {
    return features.map((f) => {
      if (typeof f === "string") return { name: f, value: f };
      return {
        name: f.name || f.value || f.label || "",
        value: f.value || f.name || f.label || "",
      };
    });
  }, [features]);

  const toggle = (name) => {
    setDraft((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
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
          امکانات
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
        {normalized.length === 0 ? (
          <Typography
            sx={{ fontFamily: FONT, fontSize: 14, color: "#999", textAlign: "center", py: 4 }}
          >
            موردی یافت نشد
          </Typography>
        ) : (
          normalized.map((f, idx) => {
            const isSelected = draft.includes(f.value);
            return (
              <Box
                key={`${f.value}-${idx}`}
                onClick={() => toggle(f.value)}
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
                  "&:hover": { backgroundColor: isSelected ? "#f9f0f0" : "#fafafa" },
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
                  {f.name}
                </Typography>
                <Switch
                  checked={isSelected}
                  onChange={() => toggle(f.value)}
                  sx={{
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

      <Box sx={{ p: 1.5 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => onApply(draft)}
          sx={{
            fontFamily: FONT,
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            py: 1.25,
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