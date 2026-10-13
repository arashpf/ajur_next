// components/panel/WorkerTypesInformation.jsx
import React from "react";
import { Typography, Box } from "@mui/material";

export default function WorkerTypesInformation({
  workers = [],
  selected = "all",
  onFilterChange,
}) {
  const counts = {
    all: workers.length,
    special: workers.filter((w) => w.is_special).length,
    urgent: workers.filter((w) => w.is_urgent).length,
    expired: workers.filter((w) => w.status === "5").length,
    pending: workers.filter((w) => w.status === "2").length,
    disapproved: workers.filter((w) => w.status === "4").length,
  };

  const items = [
    { type: "all", title: "همه", color: "#1976d2" },
    { type: "special", title: "ویژه", color: "#8e24aa" },
    { type: "urgent", title: "فوری", color: "#f57c00" },
    { type: "expired", title: "منقضی", color: "#d32f2f" },
    { type: "pending", title: "در انتظار", color: "#ed6c02" },
    { type: "disapproved", title: "رد شده", color: "#c62828" },
  ];

  return (
    <Box
      sx={{
        mb: 2,
        borderBottom: "1px solid #e0e0e0",
        // Scroll horizontally on mobile so 6 tabs stay on one row.
        overflowX: { xs: "auto", md: "visible" },
        "&::-webkit-scrollbar": { display: "none" }, // Chrome/Safari
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "stretch",
          flexWrap: "nowrap", // ← never wrap to a second line
          justifyContent: { xs: "flex-start", md: "center" },
          width: "max-content", // ← let the row grow so overflow triggers
          minWidth: { xs: "100%", md: "auto" }, // ← still center on desktop
          mx: "auto",
        }}
      >
        {items.map((item) => {
          const active = selected === item.type;
          const count = counts[item.type] || 0;

          return (
            <Box
              key={item.type}
              onClick={() => onFilterChange(item.type)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.25,
                px: { xs: 1.25, md: 3 },
                py: 1,
                minWidth: { xs: 64, md: 92 },
                flexShrink: 0, // ← prevent tabs from squeezing
                cursor: "pointer",
                position: "relative",
                color: active ? item.color : "#888",
                transition: "color 0.15s ease",
                "&:hover": {
                  color: item.color,
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  fontFamily: "iransans, Arial, sans-serif",
                  color: "inherit",
                  lineHeight: 1.1,
                }}
              >
                {count}
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  fontFamily: "iransans, Arial, sans-serif",
                  fontWeight: active ? 700 : 400,
                  color: "inherit",
                  whiteSpace: "nowrap",
                  lineHeight: 1.1,
                }}
              >
                {item.title}
              </Typography>

              <Box
                sx={{
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: active ? item.color : "transparent",
                  borderRadius: "3px 3px 0 0",
                  transition: "background-color 0.15s ease",
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}