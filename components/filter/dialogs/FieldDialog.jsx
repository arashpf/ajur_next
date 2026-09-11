// components/filter/dialogs/FieldDialog.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Switch,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  formatNumber,
  formatNumberWithWords,
  getFieldDisplayName,
} from "../utils/fieldUtils";

const FONT = "'Vazir','IRANSans','Segoe UI',sans-serif";

export default function FieldDialog({
  open,
  field,
  fieldValue,
  unit,
  onApply,
  onRemove,
  onClose,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const type = String(field?.type || "");
  const name = getFieldDisplayName(field);
  const theUnit = unit || field?.unit || "";

  const [rangeDraft, setRangeDraft] = useState({ min: "", max: "" });
  const [tickDraft, setTickDraft] = useState([]);
  const [predefineDraft, setPredefineDraft] = useState("");

  const minInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    if (type === "2") {
      setTickDraft(Array.isArray(fieldValue) ? [...fieldValue] : []);
    } else if (
      type === "1" ||
      (typeof fieldValue === "object" &&
        fieldValue !== null &&
        !Array.isArray(fieldValue))
    ) {
      setRangeDraft({
        min: fieldValue?.min?.toString() || "",
        max: fieldValue?.max?.toString() || "",
      });
    } else {
      setPredefineDraft(fieldValue?.toString() || "");
    }
  }, [open, fieldValue, type]);

  useEffect(() => {
    if (!open) return;
    const isRange =
      type === "1" ||
      (typeof fieldValue === "object" &&
        fieldValue !== null &&
        !Array.isArray(fieldValue));
    if (!isRange) return;

    const id = setTimeout(() => {
      minInputRef.current?.focus();
    }, 250);
    return () => clearTimeout(id);
  }, [open, type, fieldValue]);

  const maxWord = useMemo(
    () => (rangeDraft.max ? formatNumberWithWords(rangeDraft.max) : ""),
    [rangeDraft.max]
  );
  const minWord = useMemo(
    () => (rangeDraft.min ? formatNumberWithWords(rangeDraft.min) : ""),
    [rangeDraft.min]
  );

  const handleApply = () => {
    if (type === "2") {
      onApply(tickDraft);
    } else if (
      type === "1" ||
      (field && typeof fieldValue === "object" && fieldValue !== null)
    ) {
      onApply({
        min: rangeDraft.min === "" ? "" : String(rangeDraft.min),
        max: rangeDraft.max === "" ? "" : String(rangeDraft.max),
      });
    } else {
      onApply(predefineDraft);
    }
  };

  const stripNonDigits = (s) =>
    String(s || "")
      .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
      .replace(/[^\d]/g, "");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          direction: "rtl",
          fontFamily: FONT,
          borderRadius: isMobile ? "20px 20px 0 0" : "16px",
          overflow: "hidden",
          p: 0,
          position: isMobile ? "fixed" : "relative",
          // ⬇️ Lift the whole dialog up off the keyboard on mobile
          bottom: isMobile ? "16px" : "auto",
          left: isMobile ? 0 : "auto",
          right: isMobile ? 0 : "auto",
          top: isMobile ? "auto" : "unset",
          // ⬇️ Side gap on mobile so it doesn't touch the screen edges
          m: isMobile ? "0 8px" : "auto",
          // Cap the Paper to the visual viewport (dvh shrinks with keyboard).
          // Subtract 40px so lifted dialog never touches the top edge.
          maxHeight: isMobile
            ? "calc(100dvh - 40px)"
            : "min(90vh, 600px)",
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "auto" : "100%",
        },
      }}
      sx={{
        "& .MuiDialog-container": {
          alignItems: isMobile ? "flex-end" : "center",
          height: isMobile ? "100dvh" : "auto",
        },
        "& .MuiDialog-scrollPaper": {
          maxHeight: isMobile ? "100dvh" : "none",
        },
      }}
    >
      {/* Grabber bar */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          pt: 1.25,
          pb: 0.25,
          flexShrink: 0,
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

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.25,
          borderBottom: "1px solid #f0f0f0",
          flexShrink: 0,
        }}
      >
        <IconButton size="small" onClick={onClose} sx={{ color: "#333" }}>
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
          {name}
          {theUnit ? ` (${theUnit})` : ""}
        </Typography>

        {fieldValue !== undefined && fieldValue !== "" ? (
          <Typography
            component="span"
            onClick={() => onRemove?.()}
            sx={{
              fontFamily: FONT,
              fontSize: 13,
              color: "#b92a31",
              fontWeight: 600,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            حذف
          </Typography>
        ) : (
          <Box sx={{ width: 32 }} />
        )}
      </Box>

      {/* Body */}
      <DialogContent
        sx={{
          p: 2,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          flex: "1 1 auto",
          minHeight: 0,
          maxHeight: isMobile ? "60dvh" : "none",
        }}
      >
        {(type === "1" ||
          (typeof fieldValue === "object" &&
            fieldValue !== null &&
            !Array.isArray(fieldValue))) && (
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {/* از (min) */}
            <Box sx={{ flex: 1 }}>
              <TextField
                inputRef={minInputRef}
                fullWidth
                size="small"
                placeholder={`از ${name}`}
                value={rangeDraft.min ? formatNumber(rangeDraft.min) : ""}
                onChange={(e) =>
                  setRangeDraft((p) => ({
                    ...p,
                    min: stripNonDigits(e.target.value),
                  }))
                }
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  autoComplete: "off",
                }}
                InputProps={{
                  sx: {
                    fontFamily: FONT,
                    textAlign: "center",
                    "& input": { textAlign: "center" },
                    borderRadius: "10px",
                  },
                }}
              />
              {minWord && (
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: 12,
                    color: "#888",
                    textAlign: "center",
                    mt: 0.5,
                    fontStyle: "italic",
                  }}
                >
                  {minWord} {theUnit}
                </Typography>
              )}
            </Box>

            {/* تا (max) */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={`تا ${name}`}
                value={rangeDraft.max ? formatNumber(rangeDraft.max) : ""}
                onChange={(e) =>
                  setRangeDraft((p) => ({
                    ...p,
                    max: stripNonDigits(e.target.value),
                  }))
                }
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  autoComplete: "off",
                }}
                InputProps={{
                  sx: {
                    fontFamily: FONT,
                    textAlign: "center",
                    "& input": { textAlign: "center" },
                    borderRadius: "10px",
                  },
                }}
              />
              {maxWord && (
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: 12,
                    color: "#888",
                    textAlign: "center",
                    mt: 0.5,
                    fontStyle: "italic",
                  }}
                >
                  {maxWord} {theUnit}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {type === "2" && (
          <Box>
            {(field.options || []).map((opt, idx) => {
              const val = opt.value || opt.id || opt.name || opt;
              const label = opt.label || opt.name || opt.value || `گزینه ${idx + 1}`;
              const isSelected = tickDraft.some((v) => String(v) === String(val));
              return (
                <Box
                  key={`${val}-${idx}`}
                  onClick={() =>
                    setTickDraft((prev) =>
                      prev.some((v) => String(v) === String(val))
                        ? prev.filter((v) => String(v) !== String(val))
                        : [...prev, val]
                    )
                  }
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1.25,
                    px: 1,
                    borderBottom: "1px solid #f0f0f0",
                    borderRadius: "6px",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "#f9f0f0" : "transparent",
                    "&:hover": { backgroundColor: "#fafafa" },
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
                    {label}
                  </Typography>
                  <Switch
                    checked={isSelected}
                    onChange={() =>
                      setTickDraft((prev) =>
                        prev.some((v) => String(v) === String(val))
                          ? prev.filter((v) => String(v) !== String(val))
                          : [...prev, val]
                      )
                    }
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#b92a31" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#b92a31",
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        )}

        {type === "3" && (
          <FormControl fullWidth size="small">
            <Select
              value={predefineDraft}
              onChange={(e) => setPredefineDraft(e.target.value)}
              displayEmpty
              sx={{
                fontFamily: FONT,
                borderRadius: "10px",
                textAlign: "right",
                "& .MuiSelect-select": { textAlign: "right", fontFamily: FONT },
              }}
              renderValue={(selected) =>
                selected === ""
                  ? `${name} را انتخاب کنید`
                  : (field.options || []).find(
                      (o) => String(o.value || o.id || o.name) === String(selected)
                    )?.label ||
                    (field.options || []).find(
                      (o) => String(o.value || o.id || o.name) === String(selected)
                    )?.name ||
                    selected
              }
            >
              <MenuItem value="" sx={{ fontFamily: FONT }}>
                <em>انتخاب نشده</em>
              </MenuItem>
              {(field.options || []).map((opt, idx) => {
                const val = opt.value || opt.id || opt.name;
                const label = opt.label || opt.name || opt.value || `گزینه ${idx + 1}`;
                return (
                  <MenuItem key={`${val}-${idx}`} value={val} sx={{ fontFamily: FONT }}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      </DialogContent>

      <Divider sx={{ flexShrink: 0 }} />

      {/* Footer */}
      <Box
        sx={{
          p: 2.5,
          flexShrink: 0,
          backgroundColor: "#fff",
          pb: isMobile ? "max(20px, env(safe-area-inset-bottom))" : 1.5,
        }}
      >
        <Button
          fullWidth
          onClick={handleApply}
          variant="contained"
          sx={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 15,
            py: 1.75,
            borderRadius: "10px",
            textTransform: "none",
            backgroundColor: "#b92a31",
            "&:hover": { backgroundColor: "#a01c22" },
          }}
        >
          تایید
        </Button>
      </Box>
    </Dialog>
  );
}