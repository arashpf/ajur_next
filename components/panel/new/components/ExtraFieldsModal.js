// components/panel/new/components/ExtraFieldsModal.js
// Ported from NewWorker.js <ExtraFieldsModal>
// Full-screen dialog with all optional fields.

import React from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import NormalFieldInput from "./NormalFieldInput";
import TickFieldSelector from "./TickFieldSelector";
import PredefineFieldInput from "./PredefineFieldInput";

const ExtraFieldsModal = ({
  isVisible,
  onClose,
  onConfirm,
  normalFields,
  tickFields,
  predefineFields,
  properties,
  onUpsertProperty,
  onRemoveProperty,
  numToPersian,
}) => {
  const getFieldValue = (fieldName) => {
    const existing = properties.find((p) => p.name === fieldName);
    return existing ? String(existing.value) : "";
  };

  const getTickValue = (fieldName) => {
    const existing = properties.find((p) => p.name === fieldName);
    return existing ? Number(existing.value) : null;
  };

  const handleNormalFieldChange = (field, text) => {
    const numeric = String(text).replace(/[^0-9]/g, "");
    if (numeric.length > 0) {
      onUpsertProperty({
        name: field.value,
        value: numeric,
        kind: 1,
        special: field.special,
        order: field.sort,
      });
    } else {
      onRemoveProperty(field.value);
    }
  };

  const handleTickSelect = (field, value) => {
    if (value === 1 || value === 0) {
      onUpsertProperty({
        name: field.value,
        value,
        kind: 2,
        special: field.special,
      });
    } else {
      onRemoveProperty(field.value);
    }
  };

  const handlePredefineChange = (field, value) => {
    if (value && value !== "-") {
      onUpsertProperty({
        name: field.value,
        value,
        kind: 3,
        special: field.special || 0,
        order: field.sort || 0,
      });
    } else {
      onRemoveProperty(field.value);
    }
  };

  const optionalNormal = normalFields.filter((f) => f.special === "0");
  const optionalTicks = tickFields.filter((f) => f.special === "0");
  const optionalPredefine = predefineFields.filter((f) => f.special === "0");

  return (
    <Dialog
      open={isVisible}
      onClose={onClose}
      fullScreen
      PaperProps={{ sx: { backgroundColor: "white" } }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 1.5,
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Typography
            sx={{
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 18,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            سایر ویژگی‌ها و امکانات
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 1, py: 1 }}>
          {optionalNormal.map((fl) => (
            <NormalFieldInput
              key={`modal_normal_${fl.value}`}
              field={fl}
              value={getFieldValue(fl.value)}
              onChangeText={(text) => handleNormalFieldChange(fl, text)}
              numToPersian={numToPersian}
              isRequired={false}
            />
          ))}

          {optionalTicks.map((fl) => (
            <TickFieldSelector
              key={`modal_tick_${fl.id}`}
              field={fl}
              value={getTickValue(fl.value)}
              onSelect={(value) => handleTickSelect(fl, value)}
              isRequired={false}
            />
          ))}

          {optionalPredefine.map((fl) => (
            <PredefineFieldInput
              key={`modal_pre_${fl.id}`}
              field={fl}
              value={getFieldValue(fl.value)}
              onChange={(value) => handlePredefineChange(fl, value)}
              isRequired={false}
            />
          ))}

          <Box sx={{ height: 20 }} />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            pb: 3,
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Button
            fullWidth
            onClick={() => {
              onConfirm();
              onClose();
            }}
            sx={{
              py: 1.75,
              borderRadius: "12px",
              backgroundColor: "#a92b31",
              color: "white",
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 16,
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { backgroundColor: "#8a2228" },
            }}
          >
            تأیید
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ExtraFieldsModal;