"use client";
import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CallIcon from "@mui/icons-material/Call";
import SmsIcon from "@mui/icons-material/Sms";
import axios from "axios";

const DrawerSX = {
  "& .MuiDrawer-paper": {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85vh",
    p: 2,
    pb: 3,
    background: "#fff",
    boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
  },
};

function Grabber() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", pt: 0.5, pb: 1.5 }}>
      <Box sx={{ width: 44, height: 5, borderRadius: 3, bgcolor: "#ddd" }} />
    </Box>
  );
}

// Format: 09358457933 → 0935 845 7933
function formatPhone(phone) {
  if (!phone) return "";
  const p = String(phone).replace(/\D/g, "");
  if (p.length !== 11) return p;
  return p.slice(0, 4) + " " + p.slice(4, 7) + " " + p.slice(7);
}

export default function ContactDrawer({
  open,
  onClose,
  details,
  realstate,
  onCallTracked,
}) {
  const ownerPhone = details?.cellphone || details?.phone || "";
  const activePhone = realstate?.phone || ownerPhone;

  const handleCall = async (phone) => {
    if (!phone) return;
    try {
      await axios.post("https://api.ajur.app/api/track/worker-call", {
        worker_id: details?.id,
      });
    } catch (err) {
      /* silent */
    }
    onCallTracked?.();
    window.location.href = `tel:${phone}`;
  };

  const handleSms = (phone) => {
    if (!phone) return;
    window.location.href = `sms:${phone}`;
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={DrawerSX}
      slotProps={{
        backdrop: { sx: { backdropFilter: "blur(2px)" } },
      }}
    >
      <Grabber />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton size="small" onClick={onClose} aria-label="بستن">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ─── Title ─── */}
      <Typography
        sx={{
          textAlign: "center",
          fontFamily: "iransans, Arial, sans-serif",
          fontWeight: 700,
          fontSize: 18,
          mb: 2,
          color: "#222",
        }}
      >
        اطلاعات تماس
      </Typography>

      {/* ─── Primary phone number ─── */}
      {activePhone && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            p: 2,
            mb: 2,
            border: "1px solid #eee",
            borderRadius: "14px",
            backgroundColor: "#fafafa",
          }}
        >
          <Typography
            sx={{
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 13,
              color: "#888",
            }}
          >
            شماره تماس
          </Typography>

          <Typography
            sx={{
              fontFamily: "monospace, iransans",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "2px",
              direction: "ltr",
              color: "#222",
            }}
          >
            {formatPhone(activePhone)}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              width: "100%",
              mt: 1,
            }}
          >
            <Button
              onClick={() => handleCall(activePhone)}
              startIcon={<CallIcon />}
              fullWidth
              variant="contained"
              sx={{
                py: 1.4,
                borderRadius: "12px",
                backgroundColor: "#b92a31",
                fontFamily: "iransans, Arial, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                "&:hover": { backgroundColor: "#a01c22" },
              }}
            >
              تماس
            </Button>
            <Button
              onClick={() => handleSms(activePhone)}
              startIcon={<SmsIcon />}
              fullWidth
              variant="outlined"
              sx={{
                py: 1.4,
                borderRadius: "12px",
                borderColor: "#b92a31",
                color: "#b92a31",
                fontFamily: "iransans, Arial, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                "&:hover": {
                  backgroundColor: "#fdf2f3",
                  borderColor: "#a01c22",
                },
              }}
            >
              پیامک
            </Button>
          </Box>
        </Box>
      )}

      {/* ─── Fallback if nothing to show ─── */}
      {!activePhone && (
        <Typography
          sx={{
            textAlign: "center",
            p: 3,
            color: "#888",
            fontFamily: "iransans, Arial, sans-serif",
          }}
        >
          اطلاعات تماس در دسترس نیست
        </Typography>
      )}
    </Drawer>
  );
}