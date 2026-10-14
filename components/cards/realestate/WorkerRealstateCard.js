import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Styles from "../../styles/WorkerRealstate.module.css";
import Link from "next/link";
import Stars from "../../others/Stars";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CallIcon from "@mui/icons-material/Call";
import axios from "axios";

import ContactDrawer from "../../workers/ContactDrawer";
import useAuthGate from "../../../hooks/useAuthGate";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

// ─── Phone helpers (module scope) ───
function maskPhone(phone) {
  if (!phone) return "";
  const p = String(phone).replace(/\D/g, "");
  if (p.length < 7) return p;
  return `${p.slice(0, 4)} ××× ${p.slice(-3)}`;
}

export default function WorkerRealstateCard(props) {
  const realstate = props.realstate;
  const slug = props.slug;

  const { requireAuth } = useAuthGate();
  const [contactOpen, setContactOpen] = React.useState(false);

  // Note: ContactDrawer expects a `details`-shaped object to read `details.cellphone`.
  // Realstate objects have `phone`, so we shim a minimal details object.
  const drawerDetails = {
    id: realstate?.id,
    name: realstate?.name,
    cellphone: realstate?.phone,
    phone: realstate?.phone,
  };

  const openContactDrawer = () => setContactOpen(true);

  const handleCallClick = () => {
    requireAuth(
      () => openContactDrawer(),
      "برای مشاهده شماره تماس وارد شوید"
    );
  };

  // Kept for backward compat — called from the drawer's onCallTracked.
  const handleCallTracked = async () => {
    try {
      await axios.post("https://api.ajur.app/api/track/agent-call", {
        agent_id: realstate?.id,
      });
    } catch (error) {
      console.error("Call tracking failed:", error);
    }
  };

  return (
    <div
      className={Styles["worker-realstate-card-wrapper"]}
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "0",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        overflow: "hidden",
        direction: "rtl",
        textAlign: "right",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            color: "#888",
            fontWeight: "500",
            marginBottom: "8px",
          }}
        >
          لیست شده توسط
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            direction: "rtl",
          }}
        >
          <div style={{ position: "relative", width: 50, height: 50 }}>
            <Avatar
              alt={realstate?.name + " " + realstate?.family}
              src={realstate?.profile_url}
              sx={{ width: 50, height: 50 }}
            />

            {realstate && realstate.is_verified && (
              <CheckCircleIcon
                style={{
                  color: "#1E88E5",
                  position: "absolute",
                  bottom: -4,
                  left: -4,
                  background: "#fff",
                  borderRadius: "50%",
                  fontSize: 18,
                  boxSizing: "content-box",
                  padding: 2,
                }}
              />
            )}
          </div>

          <div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#222",
              }}
            >
              {realstate?.name} {realstate?.family}
            </div>

            <div style={{ marginTop: 4 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  direction: "ltr",
                }}
              >
                <Stars amount={Math.round(realstate?.stars || 0)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          direction: "rtl",
          padding: "16px",
        }}
      >
        {/* Call button — masked, auth-gated */}
        <button
          type="button"
          onClick={handleCallClick}
          style={{
            flex: 1,
            padding: "12px 16px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "600",
            color: "#222",
            fontSize: "16px",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: "iransans, Arial, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#0066cc";
            e.currentTarget.style.color = "#0066cc";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#ddd";
            e.currentTarget.style.color = "#222";
          }}
          aria-label="نمایش شماره تماس"
        >
          <span style={{ direction: "ltr", fontFamily: "monospace, iransans" }}>
            {maskPhone(realstate?.phone)}
          </span>
          <CallIcon style={{ fontSize: 18 }} />
        </button>

        {/* Agent Page Link — unchanged */}
        <Link
          href={`/realestates/${realstate?.id}?slug=${realstate?.slug || ""}`}
          style={{
            flex: 1,
            padding: "12px 16px",
            background: "#0066cc",
            border: "1px solid #0066cc",
            borderRadius: "8px",
            fontWeight: "600",
            color: "#fff",
            fontSize: "16px",
            textAlign: "center",
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#005bb5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0066cc";
          }}
        >
          صفحه مشاور
        </Link>
      </div>

      {/* Contact drawer (reveals full number + call/SMS) */}
      <ContactDrawer
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        details={drawerDetails}
        realstate={realstate}
        onCallTracked={handleCallTracked}
      />
    </div>
  );
}