"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Drawer,
  Typography,
  TextField,
  Button,
  FormHelperText,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
import {
  sendOtp,
  verifyOtp,
  getCooldownRemaining,
  RESEND_SECONDS,
} from "../../lib/authClient";
import { trackEvent } from "../../lib/track";
import PhoneBoxes from "./PhoneBoxes";

const DRAWER_SX = {
  "& .MuiDrawer-paper": {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: { xs: "70vh", sm: "auto" },
    p: { xs: 2, sm: 3 },
    pb: { xs: 3, sm: 4 },
    background: "#fff",
    boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
  },
};

function Grabber() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", pt: 0.5, pb: 1 }}>
      <Box
        sx={{
          width: 44,
          height: 5,
          borderRadius: 3,
          bgcolor: "#ddd",
        }}
      />
    </Box>
  );
}

export default function AuthModal({ open, reason, onClose, onSuccess }) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRef = useRef(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      const saved = Cookies.get("phone");
      setPhone(saved || "");
      setCode("");
      setError("");
      setStep("phone");
      setCooldown(getCooldownRemaining());
    }
  }, [open]);

  // Toggle a body class while the modal is open so global fixed
  // UI (like the Footer) can hide itself.
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (open) {
      document.body.classList.add("auth-modal-open");
    } else {
      document.body.classList.remove("auth-modal-open");
    }

    return () => {
      document.body.classList.remove("auth-modal-open");
    };
  }, [open]);

  // Cooldown tick
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // Autofocus OTP input
  useEffect(() => {
    if (step === "otp" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  // ───── Step 1: send OTP ─────
  const handleSendOtp = async (e) => {
    e?.preventDefault?.();
    setError("");

    if (!phone) return setError("لطفاً شماره تماس خود را وارد کنید");
    if (phone.length !== 11) return setError("شماره موبایل باید ۱۱ رقم باشد");
    if (!/^09\d{9}$/.test(phone)) return setError("شماره موبایل معتبر نیست");

    setLoading(true);
    try {
      const ref = Cookies.get("ref");
      await sendOtp(phone, ref);

      // ─── Analytics: SMS requested via modal ───
      trackEvent("auth", {
        action: "sms_requested",
        method: "phone",
        phone_prefix: phone.slice(0, 4),
        source: "auth-modal",
      });

      setStep("otp");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      if (err.code === "COOLDOWN") {
        setCooldown(err.remaining);
        setError(`لطفاً ${err.remaining} ثانیه صبر کنید`);
      } else {
        setError("خطایی در ارسال درخواست رخ داد");
      }
    } finally {
      setLoading(false);
    }
  };

  // ───── Step 2: verify OTP ─────
  const handleVerify = async (e) => {
    e?.preventDefault?.();
    setError("");

    if (code.length !== 5) return setError("کد باید ۵ رقم باشد");

    setLoading(true);
    try {
      const ref = Cookies.get("ref");
      const result = await verifyOtp(phone, code, ref);

      // ─── Analytics: login vs signup via modal ───
      const isNewUser = result?.isNewUser === true;
      trackEvent("auth", {
        action: isNewUser ? "signup" : "login",
        method: "otp",
        phone_prefix: phone.slice(0, 4),
        source: "auth-modal",
        has_next_redirect: false,
      });

      onSuccess?.(result);
    } catch (err) {
      if (err.code === "EXPIRED") {
        setError("مدت زمان استفاده از این کد تمام شده");
      } else if (err.code === "INVALID") {
        setError("کد وارد شده اشتباه است");
      } else {
        setError("خطا در ارتباط با سرور");
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit OTP at 5 digits
  useEffect(() => {
    if (step === "otp" && code.length === 5 && !loading) {
      handleVerify();
    }
  }, [code]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      const ref = Cookies.get("ref");
      await sendOtp(phone, ref);
      setCode("");
      setCooldown(RESEND_SECONDS);
      setError("");
      inputRef.current?.focus();
    } catch (err) {
      if (err.code === "COOLDOWN") {
        setCooldown(err.remaining);
      } else {
        setError("خطایی در ارسال مجدد کد رخ داد");
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 5);
    if (digits) setCode(digits);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: "blur(2px)" },
        },
      }}
      sx={DRAWER_SX}
    >
      <Grabber />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}>
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="بستن"
          sx={{ color: "#999" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {reason && step === "phone" && (
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "#555",
            mb: 2,
            fontFamily: "iransans, Arial, sans-serif",
          }}
        >
          {reason}
        </Typography>
      )}

      {step === "phone" ? (
        <form onSubmit={handleSendOtp}>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              mb: 2,
              fontFamily: "iransans, Arial, sans-serif",
            }}
          >
            ورود یا ثبت‌نام
          </Typography>

          <PhoneBoxes
            value={phone}
            onChange={(v) => {
              setPhone(v);
              if (error) setError("");
            }}
            autoFocus
          />

          {error && (
            <FormHelperText
              sx={{
                textAlign: "center",
                color: "#b92a31",
                fontFamily: "iransans, Arial, sans-serif",
              }}
            >
              {error}
            </FormHelperText>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.4,
              borderRadius: "12px",
              backgroundColor: "#b92a31",
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              "&:hover": { backgroundColor: "#a01c22" },
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "دریافت کد"
            )}
          </Button>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              mt: 2,
              color: "#888",
              fontFamily: "iransans, Arial, sans-serif",
              lineHeight: 1.7,
            }}
          >
            با ورود،{" "}
            <a
              href="/terms"
              target="_blank"
              style={{ color: "#b92a31", textDecoration: "underline" }}
            >
              قوانین آجر
            </a>{" "}
            را می‌پذیرید
          </Typography>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              mb: 1,
              fontFamily: "iransans, Arial, sans-serif",
            }}
          >
            کد تأیید را وارد کنید
          </Typography>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: "#666",
              mb: 2,
              fontFamily: "iransans, Arial, sans-serif",
            }}
          >
            کد ۵ رقمی به شماره{" "}
            <strong style={{ direction: "ltr", display: "inline-block" }}>
              {phone}
            </strong>{" "}
            ارسال شد
          </Typography>

          <TextField
            fullWidth
            placeholder="- - - - -"
            variant="outlined"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 5))
            }
            onPaste={handlePaste}
            inputProps={{
              inputMode: "numeric",
              dir: "ltr",
              maxLength: 5,
            }}
            error={!!error}
            inputRef={inputRef}
            sx={{
              mb: 1,
              "& input": {
                textAlign: "center",
                fontSize: 24,
                letterSpacing: "10px",
                fontFamily: "iransans, Arial, sans-serif",
              },
            }}
          />

          {error && (
            <FormHelperText
              sx={{
                textAlign: "center",
                color: "#b92a31",
                fontFamily: "iransans, Arial, sans-serif",
              }}
            >
              {error}
            </FormHelperText>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || code.length !== 5}
            sx={{
              mt: 2,
              py: 1.4,
              borderRadius: "12px",
              backgroundColor: "#b92a31",
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              "&:hover": { backgroundColor: "#a01c22" },
              "&.Mui-disabled": { backgroundColor: "#e0b0b3", color: "#fff" },
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "تایید"
            )}
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Button
              size="small"
              onClick={() => {
                setStep("phone");
                setCode("");
                setError("");
              }}
              sx={{
                fontFamily: "iransans, Arial, sans-serif",
                color: "#666",
              }}
            >
              ویرایش شماره
            </Button>

            <Typography
              variant="body2"
              onClick={handleResend}
              sx={{
                color: cooldown > 0 ? "#bbb" : "#b92a31",
                textDecoration: cooldown > 0 ? "none" : "underline",
                cursor: cooldown > 0 ? "default" : "pointer",
                fontFamily: "iransans, Arial, sans-serif",
              }}
            >
              {cooldown > 0
                ? `ارسال مجدد تا ${cooldown} ثانیه`
                : "ارسال مجدد کد"}
            </Typography>
          </Box>
        </form>
      )}
    </Drawer>
  );
}