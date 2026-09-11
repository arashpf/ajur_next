// components/panel/new/components/PropertyFields.js
// Ported from NewWorker.js <PropertyFields> — 1:1

import React, { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NormalFieldInput from "./NormalFieldInput";
import TickFieldSelector from "./TickFieldSelector";
import PredefineFieldInput from "./PredefineFieldInput";
import ExtraFieldsModal from "./ExtraFieldsModal";

const PropertyFields = ({
  normalFields,
  tickFields,
  predefineFields,
  properties,
  loading,
  onAddProperty,
  onRemoveProperty,
  onUpdateProperty,
  onUpsertProperty,
  calculateAutomatic,
  numToPersian,
}) => {
  const [showExtraModal, setShowExtraModal] = useState(false);

  // ---------- handlers ----------
  const handleNormalFieldChange = useCallback(
    (field, text) => {
      const numeric = String(text).replace(/[^0-9]/g, "");
      if (numeric.length > 0) {
        onUpsertProperty({
          name: field.value,
          value: numeric,
          kind: 1,
          special: field.special,
          order: field.sort,
        });
        if (calculateAutomatic) {
          calculateAutomatic(field.value, numeric);
        }
      } else {
        onRemoveProperty(field.value);
      }
    },
    [onUpsertProperty, onRemoveProperty, calculateAutomatic]
  );

  const handleTickSelect = useCallback(
    (field, value) => {
      if (value === 1 || value === 0) {
        onUpsertProperty({
          name: field.value,
          value,
          kind: 2,
          special: field.special,
          order: field.sort,
        });
      } else {
        onRemoveProperty(field.value);
      }
    },
    [onUpsertProperty, onRemoveProperty]
  );

  const handlePredefineChange = useCallback(
    (field, value) => {
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
    },
    [onUpsertProperty, onRemoveProperty]
  );

  // ---------- split required vs optional ----------
  const requiredNormal = normalFields.filter((f) => f.special === "1");
  const requiredTicks = tickFields.filter((f) => f.special === "1");
  const requiredPredefine = predefineFields.filter((f) => f.special === "1");

  const optionalNormal = normalFields.filter((f) => f.special === "0");
  const optionalTicks = tickFields.filter((f) => f.special === "0");
  const optionalPredefine = predefineFields.filter((f) => f.special === "0");

  const hasExtra =
    optionalNormal.length > 0 ||
    optionalTicks.length > 0 ||
    optionalPredefine.length > 0;

  const selectedCount = useCallback(() => {
    const names = [
      ...optionalNormal.map((f) => f.value),
      ...optionalTicks.map((f) => f.value),
      ...optionalPredefine.map((f) => f.value),
    ];
    return names.filter((name) =>
      properties.some((p) => p.name === name && p.value !== "" && p.value != null)
    ).length;
  }, [properties, optionalNormal, optionalTicks, optionalPredefine])();

  // ---------- render ----------
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 6,
        }}
      >
        <CircularProgress sx={{ color: "#a92b31" }} />
      </Box>
    );
  }

  const getFieldValue = (name) => {
    const existing = properties.find((p) => p.name === name);
    return existing ? String(existing.value) : "";
  };

  const getTickValue = (name) => {
    const existing = properties.find((p) => p.name === name);
    return existing ? Number(existing.value) : null;
  };

  return (
    <>
      {/* Required normal fields */}
      {requiredNormal.map((fl) => (
        <NormalFieldInput
          key={`required_${fl.value}`}
          field={fl}
          value={getFieldValue(fl.value)}
          onChangeText={(text) => handleNormalFieldChange(fl, text)}
          numToPersian={numToPersian}
          isRequired
        />
      ))}

      {/* Required tick fields */}
      {requiredTicks.map((fl) => (
        <TickFieldSelector
          key={`required_tick_${fl.id}`}
          field={fl}
          value={getTickValue(fl.value)}
          onSelect={(value) => handleTickSelect(fl, value)}
          isRequired
        />
      ))}

      {/* Required predefine fields */}
      {requiredPredefine.map((fl) => (
        <PredefineFieldInput
          key={`required_pre_${fl.id}`}
          field={fl}
          value={getFieldValue(fl.value)}
          onChange={(value) => handlePredefineChange(fl, value)}
          isRequired
        />
      ))}

      {/* Extra fields trigger */}
      {hasExtra && (
        <Box
          onClick={() => setShowExtraModal(true)}
          sx={{
            mx: { xs: 0.5, md: 1 },
            my: 0.75,
            px: 2,
            py: 1.5,
            borderRadius: "10px",
            border: "1.5px solid #e0e0e0",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "#a92b31",
              backgroundColor: "#fef8f8",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {selectedCount > 0 ? (
              <Box
                sx={{
                  backgroundColor: "#a92b31",
                  color: "white",
                  px: 1.25,
                  py: 0.4,
                  borderRadius: "12px",
                  fontFamily: "iransans, Arial, sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {selectedCount} مورد
              </Box>
            ) : (
              <Typography
                sx={{
                  fontFamily: "iransans, Arial, sans-serif",
                  fontSize: 14,
                  color: "#a92b31",
                  fontWeight: 500,
                }}
              >
                انتخاب
              </Typography>
            )}
            <ChevronLeftIcon sx={{ color: "#a92b31", fontSize: 20 }} />
          </Box>
          <Typography
            sx={{
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 15,
              fontWeight: 500,
              color: "#333",
            }}
          >
            سایر ویژگی‌ها و امکانات
          </Typography>
        </Box>
      )}

      <ExtraFieldsModal
        isVisible={showExtraModal}
        onClose={() => setShowExtraModal(false)}
        onConfirm={() => {}}
        normalFields={normalFields}
        tickFields={tickFields}
        predefineFields={predefineFields}
        properties={properties}
        onUpsertProperty={onUpsertProperty}
        onRemoveProperty={onRemoveProperty}
        numToPersian={numToPersian}
      />
    </>
  );
};

export default PropertyFields;