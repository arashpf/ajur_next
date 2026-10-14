"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import Cookies from "js-cookie";
import AuthModal from "./AuthModal";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [open, setOpen] = useState(false);
  // Pending actions to run after a successful login.
  // We keep at most ONE at a time — a new openAuth() replaces the previous.
  const pendingActionsRef = useRef([]);
  const [reason, setReason] = useState("");

  const openAuth = useCallback((onSuccess, reasonText = "") => {
    // Replace any pending action — a new request supersedes the old one.
    pendingActionsRef.current = [];
    if (typeof onSuccess === "function") {
      pendingActionsRef.current.push(onSuccess);
    }
    setReason(reasonText);
    setOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setOpen(false);
    setReason("");
    // User dismissed the modal — discard pending actions so they don't
    // fire later when a *different* action opens the modal.
    pendingActionsRef.current = [];
  }, []);

  const handleLoginSuccess = useCallback((result) => {
    setOpen(false);
    setReason("");
    const actions = pendingActionsRef.current;
    pendingActionsRef.current = [];
    // Fire them in order (usually just one)
    actions.forEach((fn) => {
      try {
        fn(result);
      } catch (e) {
        console.error("[AuthProvider] pending action failed", e);
      }
    });
  }, []);

  const requireAuth = useCallback(
    (onSuccess, reasonText = "") => {
      const token =
        typeof window !== "undefined" ? Cookies.get("id_token") : null;
      if (token) {
        if (typeof onSuccess === "function") onSuccess();
        return true;
      }
      openAuth(onSuccess, reasonText);
      return false;
    },
    [openAuth]
  );

  return (
    <AuthContext.Provider
      value={{ openAuth, closeAuth, requireAuth, isOpen: open }}
    >
      {children}
      <AuthModal
        open={open}
        reason={reason}
        onClose={closeAuth}
        onSuccess={handleLoginSuccess}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}