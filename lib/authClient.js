import axios from "axios";
import Cookies from "js-cookie";

const API = "https://api.ajur.app";
const RESEND_INTERVAL = 60; // seconds

const COOLDOWN_KEY = "code_requested_at";

export const getCooldownRemaining = () => {
  if (typeof window === "undefined") return 0;
  const last = parseInt(localStorage.getItem(COOLDOWN_KEY), 10);
  if (!last) return 0;
  const now = Math.floor(Date.now() / 1000);
  const remaining = RESEND_INTERVAL - (now - last);
  return remaining > 0 ? remaining : 0;
};

export const setCooldownNow = () => {
  if (typeof window === "undefined") return;
  localStorage.setItem(COOLDOWN_KEY, Math.floor(Date.now() / 1000).toString());
};

export const clearCooldown = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(COOLDOWN_KEY);
};

export const RESEND_SECONDS = RESEND_INTERVAL;

export const sendOtp = async (phone, ref) => {
  const remaining = getCooldownRemaining();
  if (remaining > 0) {
    const err = new Error(`wait_${remaining}`);
    err.code = "COOLDOWN";
    err.remaining = remaining;
    throw err;
  }
  await axios.post(`${API}/webauth/register`, null, {
    params: { phone, ref: ref || undefined },
  });
  setCooldownNow();
  Cookies.set("phone", phone);
};

export const verifyOtp = async (phone, code, ref) => {
  const res = await axios.post(`${API}/webauth/verify`, null, {
    params: {
      phone,
      code,
      ref,
      password: "ddr007",
    },
  });
  if (res.data.status === "success") {
    const { token } = res.data.result;
    Cookies.set("id_token", token, { expires: 30, sameSite: "Lax" });
    if (typeof window !== "undefined") {
      localStorage.setItem("id_token", token);
    }
    Cookies.set("user_name", res.data.user?.name || "");
    clearCooldown();
    return {
      token,
      user: res.data.user,
      isNewUser: res.data.is_new_user === true,
    };
  }
  // Map backend statuses to friendly text
  const status = res.data.status;
  const err = new Error(
    status === "useless" ? "code_expired" : "code_invalid"
  );
  err.code = status === "useless" ? "EXPIRED" : "INVALID";
  throw err;
};