import React, { useState, useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CameraIndoorIcon from "@mui/icons-material/CameraIndoor";
import CollectionsIcon from "@mui/icons-material/Collections";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Cookies from "js-cookie";
import axios from "axios";
import { Box, Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { parseISO, differenceInDays } from "date-fns";

import Styles from "../styles/WorkerCard.module.css";
import { trackEvent } from "../lib/track";
import useAuthGate from "../../hooks/useAuthGate"; // ← ADDED

const API_BASE = "https://api.ajur.app/api";

// ─── Local favorites helpers (cookie) ───
const readLocalFavorites = () => {
  try {
    const raw = Cookies.get("favorited");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch {
    return [];
  }
};

const writeLocalFavorites = (ids) => {
  try {
    const trimmed = ids.slice(-20);
    Cookies.set("favorited", JSON.stringify(trimmed), { expires: 365 });
  } catch {
    /* ignore */
  }
};

// ─────────────────────────────────────────────────────────────
// Module-level toast pub/sub (avoids a Context provider)
// ─────────────────────────────────────────────────────────────
let toastListeners = [];
const emitToast = (message, severity = "success") => {
  toastListeners.forEach((fn) => fn({ message, severity }));
};

export default function ImgMediaCard(props) {
  const worker = props.worker;
  const { requireAuth } = useAuthGate(); // ← ADDED
  const [imageLoaded, setImageLoaded] = useState(false);
  const [properties, set_properties] = useState([]);
  const [hasQuickHints, setHasQuickHints] = useState(false);
  const [isfavorite, set_isfavorite] = useState("off");
  const [heartAnimating, setHeartAnimating] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const listener = ({ message, severity }) => {
      setToast({ open: true, message, severity });
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== listener);
    };
  }, []);

  const closeToast = (event, reason) => {
    if (reason === "clickaway") return;
    setToast((t) => ({ ...t, open: false }));
  };

  // ─────────────────────────────────────────────────────────────
  // Parse json_properties
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      if (worker?.json_properties) {
        set_properties(
          typeof worker.json_properties === "string"
            ? JSON.parse(worker.json_properties)
            : worker.json_properties
        );
      } else {
        set_properties([]);
      }
    } catch {
      set_properties([]);
    }
  }, [worker?.json_properties]);

  useEffect(() => {
    const hints = properties.filter(
      (pr) => pr.special === "1" && pr.kind === 2 && pr.value == 1
    );
    setHasQuickHints(hints.length > 0);
  }, [properties]);

  // ─────────────────────────────────────────────────────────────
  // Favorite state — cookie only for instant UI
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!worker?.id) return;
    const id = Number(worker.id);
    const localIds = readLocalFavorites();
    set_isfavorite(localIds.includes(id) ? "on" : "off");
  }, [worker?.id]);

  // ─────────────────────────────────────────────────────────────
  // Toggle handlers
  // ─────────────────────────────────────────────────────────────
  const triggerHeartAnimation = () => {
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 600);
  };

  // The actual add-to-favorites work — runs ONLY when logged in
  const doAddFavorite = () => {
    const id = Number(worker.id);
    const localIds = readLocalFavorites();

    if (!localIds.includes(id)) {
      localIds.push(id);
      writeLocalFavorites(localIds);
    }

    set_isfavorite("on");
    triggerHeartAnimation();
    emitToast("ملک به علاقه‌مندی‌های شما اضافه شد", "success");

    // Analytics
    trackEvent("listing_favorite", {
      listing_id: id,
      action: "add",
      creator_user_id: worker.user_id ?? null,
      city_id: worker.city_id ?? null,
      category_id: worker.category_id ?? null,
      source: "worker-card",
    });

    const token = Cookies.get("id_token");
    if (token) {
      axios({
        method: "post",
        url: `${API_BASE}/favorites/toggle`,
        params: { token },
        data: { worker_id: id },
      }).catch((err) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkerCard] favorite toggle failed:", err?.message);
        }
      });
    }
  };

  // The actual remove-from-favorites work
  const doRemoveFavorite = () => {
    const id = Number(worker.id);
    const localIds = readLocalFavorites();
    const filtered = localIds.filter((x) => x !== id);
    writeLocalFavorites(filtered);

    set_isfavorite("off");
    emitToast("ملک از علاقه‌مندی‌های شما حذف شد", "info");

    // Analytics
    trackEvent("listing_favorite", {
      listing_id: id,
      action: "remove",
      creator_user_id: worker.user_id ?? null,
      city_id: worker.city_id ?? null,
      category_id: worker.category_id ?? null,
      source: "worker-card",
    });

    const token = Cookies.get("id_token");
    if (token) {
      axios({
        method: "post",
        url: `${API_BASE}/favorites/toggle`,
        params: { token },
        data: { worker_id: id },
      }).catch((err) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkerCard] favorite toggle-off failed:", err?.message);
        }
      });
    }
  };

  // Public handlers — favorite requires auth, unfavorite doesn't
  const onPressMakeWorkerfavorite = () => {
    requireAuth(
      () => doAddFavorite(),
      "برای افزودن به علاقه‌مندی‌ها وارد شوید"
    );
  };

  const onPressMakeWorkerUnfavorite = () => {
    // Removing is always allowed — even guests can clear their own local list
    doRemoveFavorite();
  };

  // ─────────────────────────────────────────────────────────────
  // PriceBubble
  // ─────────────────────────────────────────────────────────────
  const PriceBubble = ({ children }) => {
    const summaryRef = useRef(null);
    const [truncated, setTruncated] = useState(false);

    useEffect(() => {
      const el = summaryRef.current;
      if (!el) return;
      const check = () => {
        setTruncated(el.scrollWidth > el.clientWidth + 1);
      };
      check();
      const ro = new ResizeObserver(check);
      ro.observe(el);
      window.addEventListener("resize", check);
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", check);
      };
    }, [children]);

    return (
      <div
        className={`${Styles["price-container"]} ${
          truncated ? "has-overflow" : ""
        }`}
      >
        <div ref={summaryRef} className={Styles["price-summary"]}>
          {children}
        </div>
        {truncated && <div className={Styles["price-bubble"]}>{children}</div>}
      </div>
    );
  };

  const renderNeighborHoodRibbon = () => {
    if (worker.neighbourhood) {
      return (
        <div className={Styles["card-inside-neighbor"]}>
          <p style={{ fontSize: 13, color: "#222", display: "flex" }}>
            {worker.neighbourhood} {worker.city}
          </p>
        </div>
      );
    }
  };

  const renderHeart = () => {
    const handleUnfavoriteClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      onPressMakeWorkerUnfavorite();
    };
    const handleFavoriteClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      onPressMakeWorkerfavorite();
    };

    return isfavorite === "on" ? (
      <div
        onClick={handleUnfavoriteClick}
        role="button"
        tabIndex={0}
        className={Styles["card-inside-heart"]}
      >
        <FavoriteIcon
          className={heartAnimating ? Styles["heart-pop"] : ""}
          style={{ color: "#b92a31" }}
        />
      </div>
    ) : (
      <div
        onClick={handleFavoriteClick}
        role="button"
        tabIndex={0}
        className={Styles["card-inside-heart"]}
      >
        <FavoriteBorderIcon />
      </div>
    );
  };

  const rednerPrice = () => {
    var price_per_m2_list = properties.filter((item) => item.name == "قیمت هر متر");
    var price_item = properties.filter((item) => item.name == "قیمت");
    var rent_front = properties.filter((item) => item.name == "پول پیش");
    var rent_per_mounth = properties.filter((item) => item.name == "اجاره ماهیانه");

    if (price_item[0]) {
      var price_no_format = price_item[0].value ?? 0;
      var price_per_m2_val = price_per_m2_list[0] ? price_per_m2_list[0].value : 0;
      return (
        <PriceBubble>
          <p style={{ direction: "rtl" }}>
            <strong style={{ fontSize: "17px", color: "#111" }}>
              {String(price_no_format).replace(/(.)(?=(\d{3})+$)/g, "$1,")} تومان |
            </strong>{" "}
            متری {String(price_per_m2_val).replace(/(.)(?=(\d{3})+$)/g, "$1,")} تومان
          </p>
        </PriceBubble>
      );
    } else if (rent_front[0]) {
      var rent_front_no_format = rent_front[0].value ?? 0;
      var rent_per_mounth_no_format = rent_per_mounth[0]
        ? rent_per_mounth[0].value
        : 0;
      return (
        <PriceBubble>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            {rent_per_mounth_no_format != 0 ? (
              <p style={{ direction: "rtl", paddingRight: 4 }}>
                <strong style={{ fontSize: "16px" }}>
                  {String(rent_per_mounth_no_format).replace(
                    /(.)(?=(\d{3})+$)/g,
                    "$1,"
                  )}{" "}
                  اجاره
                </strong>
              </p>
            ) : (
              <strong style={{ fontSize: "16px" }}>
                <p style={{ direction: "rtl", paddingRight: 4 }}>کامل</p>
              </strong>
            )}
            <p style={{ direction: "rtl" }}>
              <strong style={{ fontSize: "16px" }}>
                {String(rent_front_no_format).replace(
                  /(.)(?=(\d{3})+$)/g,
                  "$1,"
                )}{" "}
                رهن
              </strong>
            </p>
          </div>
        </PriceBubble>
      );
    }
    return null;
  };

  const renderPropertiesCustomized = (pr) => {
    if (["قیمت", "پول پیش", "اجاره ماهیانه", "قیمت هر متر"].includes(pr.name))
      return;
    if (pr.kind == 1) {
      return (
        <span key={pr.id}>
          {" "}
          <span>
            | {pr.name}{" "}
            {String(pr.value).replace(/(.)(?=(\d{3})+$)/g, "$1,")}
          </span>
          {"."}
        </span>
      );
    }
  };

  const rednerProperties = () => {
    return properties.map((pr) => (
      <React.Fragment key={pr.id}>
        {pr.special == "1" && renderPropertiesCustomized(pr)}
      </React.Fragment>
    ));
  };

  const renderVideoOrImageIcon = () => (
    <>
      {worker.video_count > 0 && (
        <span className={Styles["card-top-icon-wrapper"]}>
          <CameraIndoorIcon />
        </span>
      )}
      {worker.image_count > 0 && (
        <span className={Styles["card-top-icon-wrapper"]}>
          {worker.image_count} <CollectionsIcon />
        </span>
      )}
    </>
  );

  const renderQuickHint = () => {
    if (!properties) return null;
    const hints = properties
      .filter((pr) => pr.special === "1" && pr.kind === 2)
      .map((pr, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {pr.value == 1 && (
            <Chip
              label={
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {pr.name}
                  <CheckIcon sx={{ fontSize: 13, color: "white", ml: 0.5 }} />
                </Box>
              }
              sx={{
                px: 0.5,
                py: 0,
                m: 0,
                bgcolor: "#b9272e",
                color: "white",
                borderRadius: 1,
                width: 90,
                fontSize: 13,
                height: 24,
                "& .MuiChip-label": { px: 0.5 },
              }}
            />
          )}
        </Box>
      ));
    return hints.length > 0 ? hints : null;
  };

  return (
    <div>
      <Card
        sx={{ width: "100%", borderRadius: "10px" }}
        className={`notailwind ${Styles["card-wrapper"]} ${
          worker.is_special ? Styles["card-wrapper-special"] : ""
        } ${worker.is_urgent ? Styles["card-wrapper-urgent"] : ""}`}
      >
        <Snackbar
          open={toast.open}
          autoHideDuration={2500}
          onClose={closeToast}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          sx={{
            zIndex: 9999,
            bottom: { xs: "100px !important", sm: "70px !important" },
            "& .MuiSnackbar-root": { bottom: "50px" },
          }}
        >
          <Alert
            onClose={closeToast}
            severity={toast.severity}
            variant="filled"
            sx={{
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 14,
              borderRadius: "10px",
              direction: "rtl",
              textAlign: "right",
              minWidth: 280,
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>

        {renderNeighborHoodRibbon()}
        {renderHeart()}

        <div style={{ position: "relative" }}>
          {worker.is_urgent && (
            <div className={Styles["urgent-ribbon"]}>
              <p>فوری</p>
            </div>
          )}
          {!imageLoaded && (
            <div className={Styles["image-skeleton"]} aria-hidden="true" />
          )}
          <CardMedia
            component="img"
            alt={worker.name}
            className={`notailwind ${Styles["card-media"]} card-media-global`}
            image={worker.thumb}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? "block" : "none" }}
          />
        </div>

        <div className={Styles["card-inside-top"]}>
          <div className={Styles["inside-top-left"]}>
            {renderVideoOrImageIcon()}
          </div>
          <div className={Styles["inside-top-right"]}>
            <p className={Styles["worker-title"]}>
              {worker.name}
              {worker.is_special && (
                <span className={Styles["ad-badge"]}> آگهی </span>
              )}
            </p>
          </div>
        </div>

        <CardContent className={Styles["card-content"]}>
          <div className={Styles["price-wrapper"]}>{rednerPrice()}</div>
          <div className={Styles["properties-wrapper"]}>
            {rednerProperties()}
          </div>
          <div
            className={`${Styles["properties-hint"]} ${
              !hasQuickHints ? Styles["no-hints"] : ""
            }`}
          >
            {hasQuickHints && renderQuickHint()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}