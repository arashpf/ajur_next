import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import StarIcon from "@mui/icons-material/Star";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import BlockIcon from "@mui/icons-material/Block";

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
  };

  const items = [
    { type: "all", title: "همه آگهی ها", color: "#1976d2", icon: <CampaignIcon /> },
    { type: "special", title: "ویژه", color: "#8e24aa", icon: <StarIcon /> },
    { type: "urgent", title: "فوری", color: "#f57c00", icon: <FlashOnIcon /> },
    { type: "expired", title: "منقضی شده", color: "#d32f2f", icon: <BlockIcon /> },
    { type: "pending", title: "در انتظار تایید", color: "#ed6c02", icon: <HourglassEmptyIcon /> },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {items.map((item) => {
        const active = selected === item.type;

        return (
          <Grid item xs={2.4} key={item.type}>   {/* <- ALWAYS one row */}
            <Paper
              onClick={() => onFilterChange(item.type)}
              elevation={active ? 6 : 2}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 3,
                height: 120,
                cursor: "pointer",
                border: active
                  ? `2px solid ${item.color}`
                  : "2px solid transparent",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                },
              }}
            >
              <Box sx={{ color: item.color, mb: 1 }}>{item.icon}</Box>

              <Typography fontWeight="bold">
                {counts[item.type] || 0}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {item.title}
              </Typography>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
