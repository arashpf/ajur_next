// components/cards/PanelWorkerCard.js
// Ported from WorkerRealEstateCard (React Native) → Next.js + MUI
// One card = one property. Click opens a bottom action sheet.

import React, { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Cookies from "js-cookie";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fa";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

dayjs.extend(relativeTime);
dayjs.locale("fa");

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// ---------- helpers ----------
const relativeFa = (dateString) => {
  if (!dateString) return "";
  try {
    return dayjs(dateString).fromNow();
  } catch (e) {
    return "";
  }
};

const daysSince = (dateString) => {
  if (!dateString) return 0;
  try {
    const diff = Date.now() - new Date(dateString).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

const getStatusBadge = (status) => {
  switch (String(status)) {
    case "1":
      return { text: "تایید شده", color: "#4CAF50" };
    case "2":
      return { text: "در انتظار تایید", color: "#FF9800" };
    case "3":
      return { text: "نیاز به تغییرات", color: "#F44336" };
    case "4":
      return { text: "رد شده", color: "red" };
    case "5":
      return { text: "بایگانی شده", color: "#9E9E9E" };
    default:
      return { text: "نامشخص", color: "#9E9E9E" };
  }
};

const extractSpecials = (worker) => {
  let name1 = worker.specialname1;
  let value1 = worker.specialvalue1;
  let name2 = worker.specialname2;
  let value2 = worker.specialvalue2;

  if ((!name1 || !value1) && worker.json_properties) {
    try {
      const props =
        typeof worker.json_properties === "string"
          ? JSON.parse(worker.json_properties)
          : worker.json_properties;
      const specials = props
        .filter((p) => p.special === "1" || p.special === 1)
        .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
      if (!name1 && specials[0]) {
        name1 = specials[0].name;
        value1 = specials[0].value;
      }
      if (!name2 && specials[1]) {
        name2 = specials[1].name;
        value2 = specials[1].value;
      }
    } catch (e) {
      // ignore
    }
  }

  return { name1, value1, name2, value2 };
};

// ---------- component ----------
const PanelWorkerCard = ({
  worker,
  isSelected = false,
  selectMode = false,
  onPress,
  onLongPress,
  onDeleteSuccess,
}) => {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [faded, setFaded] = useState(false);
  const [shareFallback, setShareFallback] = useState({
    open: false,
    url: "",
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = (message, severity = "info") =>
    setToast({ open: true, message, severity });

  const handleToastClose = (e, reason) => {
    if (reason === "clickaway") return;
    setToast((t) => ({ ...t, open: false }));
  };

  // -------- card click / long press --------
  const handleCardClick = () => {
    if (selectMode || isSelected) {
      onPress && onPress();
    } else {
      setSheetOpen(true);
    }
  };

  const handleCardLongPress = () => {
    onLongPress && onLongPress();
  };

  // -------- sheet actions --------
  const closeSheet = () => setSheetOpen(false);

  const handleAction = (action) => {
    closeSheet();
    switch (action) {
      case "boost":
        router.push(`/panel/upgrade/${worker.id}`);
        break;
      case "edit":
        router.push(`/panel/new?edit_id=${worker.id}`);
        break;
      case "preview":
        router.push(`/worker/${worker.id}`);
        break;
      case "stats":
        // TODO: replace with real chart route when ready
        alert("its chart press");
        break;
      case "share":
        handleShare();
        break;
      case "delete":
        setConfirmOpen(true);
        break;
      default:
        break;
    }
  };

  // -------- share (native → clipboard → fallback dialog) --------
  const handleShare = async () => {
    const url = `https://ajur.app/worker/${worker.id}`;
    const message = worker.description || "";

    // 1. Native share sheet (mobile)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "اشتراک گذاری ملک",
          text: message,
          url,
        });
        return;
      } catch (err) {
        // user cancelled — silent
        if (err?.name === "AbortError") return;
        // otherwise fall through to next option
      }
    }

    // 2. Clipboard API (desktop, HTTPS or localhost)
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      try {
        await navigator.clipboard.writeText(url);
        showToast("لینک کپی شد", "success");
        return;
      } catch (err) {
        // fall through
      }
    }

    // 3. Fallback: show a dialog with the URL pre-selected
    setShareFallback({ open: true, url });
  };

  // -------- delete --------
  const performDelete = async () => {
    setConfirmOpen(false);
    setDeleting(true);

    try {
      const token = Cookies.get("id_token");
      await axios({
        method: "get",
        url: "https://api.ajur.app/api/destroy-worker",
        params: { token, workerid: worker.id },
      });

      setFaded(true);
      setTimeout(() => {
        if (onDeleteSuccess) onDeleteSuccess(worker.id);
      }, 300);
    } catch (err) {
      console.error("destroy-worker error:", err);
      setDeleting(false);
      showToast("مشکلی پیش آمده!!", "error");
    }
  };

  // -------- derived data --------
  const statusInfo = getStatusBadge(worker.status);
  const lastUpdate = worker.updated_at ? relativeFa(worker.updated_at) : "";
  const needsUpdate = daysSince(worker.updated_at) >= 22;
  const isSpecial = worker.is_special === true;
  const isUrgent = worker.is_urgent === true;
  const categoryName = worker.cat_name || worker.category_name || "";
  const { name1, value1, name2, value2 } = extractSpecials(worker);

  // -------- render --------
  return (
    <>
      <Box
        onClick={handleCardClick}
        onContextMenu={(e) => {
          e.preventDefault();
          handleCardLongPress();
        }}
        onTouchStart={() => {
          window.__lpTimer = setTimeout(handleCardLongPress, 500);
        }}
        onTouchEnd={() => {
          if (window.__lpTimer) {
            clearTimeout(window.__lpTimer);
            window.__lpTimer = null;
          }
        }}
        sx={{
          display: "flex",
          flexDirection: "row",
          height: 130,
          backgroundColor: isSelected ? "#e3f2fd" : "#fff",
          border: isSelected
            ? "1px solid #007AFF"
            : isSpecial || isUrgent
            ? "1px solid #dadada"
            : "1px solid transparent",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          cursor: "pointer",
          opacity: faded ? 0 : 1,
          transition: "opacity 0.3s ease",
          position: "relative",
          mb: 1.5,
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* ---- selection checkbox ---- */}
        {(selectMode || isSelected) && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: "2px solid #007AFF",
              backgroundColor: isSelected ? "#007AFF" : "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
            }}
          >
            {isSelected && <CheckIcon sx={{ fontSize: 14, color: "white" }} />}
          </Box>
        )}

        {/* ---- image ---- */}
        <Box
          sx={{
            position: "relative",
            width: 110,
            height: 130,
            flexShrink: 0,
            overflow: "hidden",
            backgroundColor: "#eee",
          }}
        >
          <img
            src={worker.thumb}
            alt={worker.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* فوری ribbon */}
          {isUrgent && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: -30,
                backgroundColor: "#a92b31",
                py: 0.5,
                px: 5,
                transform: "rotate(-45deg)",
                zIndex: 10,
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: "bold",
                  fontFamily: "iransans, Arial, sans-serif",
                }}
              >
                فوری
              </Typography>
            </Box>
          )}

          {/* نیاز به بروز رسانی ribbon */}
          {needsUpdate && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                backgroundColor: "#E53935",
                py: 0.5,
                px: 1,
                borderTopRightRadius: "8px",
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  color: "#fff",
                  fontFamily: "iransans, Arial, sans-serif",
                }}
              >
                نیاز به بروز رسانی
              </Typography>
            </Box>
          )}
        </Box>

        {/* ---- info ---- */}
        <Box
          sx={{
            flex: 1,
            p: 1.25,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: isSpecial ? "#eee" : "#fff",
            direction: "rtl",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 0.5,
              mb: 0.75,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "#222",
                fontFamily: "iransans, Arial, sans-serif",
                textAlign: "right",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "70%",
              }}
            >
              {worker.name}
            </Typography>

            {isSpecial && (
              <Box
                sx={{
                  backgroundColor: "#DAA520",
                  px: 0.75,
                  py: 0.25,
                  borderRadius: "4px",
                }}
              >
                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: "bold",
                    fontFamily: "iransans, Arial, sans-serif",
                  }}
                >
                  ویژه
                </Typography>
              </Box>
            )}
          </Box>

          {name1 && value1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.5,
                px: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#333",
                  fontFamily: "iransans, Arial, sans-serif",
                  maxWidth: "60%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {value1}
              </Typography>
              <Typography
                sx={{
                  fontSize: 10,
                  color: "#888",
                  fontFamily: "iransans, Arial, sans-serif",
                }}
              >
                {name1}
              </Typography>
            </Box>
          )}

          {name2 && value2 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.5,
                px: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#333",
                  fontFamily: "iransans, Arial, sans-serif",
                  maxWidth: "60%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {value2}
              </Typography>
              <Typography
                sx={{
                  fontSize: 10,
                  color: "#888",
                  fontFamily: "iransans, Arial, sans-serif",
                }}
              >
                {name2}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              mt: 0.5,
              pt: 0.5,
              borderTop: "0.5px solid #e0e0e0",
            }}
          >
            <Typography
              sx={{
                fontSize: 10,
                color: "#666",
                fontFamily: "iransans, Arial, sans-serif",
                textAlign: "right",
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {categoryName} {worker.region} {worker.neighbourhood}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box
                sx={{
                  backgroundColor: statusInfo.color,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: "4px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 9,
                    color: "#fff",
                    fontFamily: "iransans, Arial, sans-serif",
                  }}
                >
                  {statusInfo.text}
                  {lastUpdate ? ` | ${lastUpdate}` : ""}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ---- bottom action sheet ---- */}
      <Drawer
        anchor="bottom"
        open={sheetOpen}
        onClose={closeSheet}
        PaperProps={{
          sx: {
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            p: 2.5,
            pb: 3,
            direction: "rtl",
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: "#ddd",
            mx: "auto",
            mb: 2,
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
            pb: 1.5,
            borderBottom: "0.5px solid #e0e0e0",
          }}
        >
          <Box
            onClick={() => {
              closeSheet();
              onLongPress && onLongPress();
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
            }}
          >
            {isSelected ? (
              <CheckBoxOutlineBlankIcon
                sx={{ fontSize: 24, color: "#007AFF" }}
              />
            ) : (
              <>
                <CheckBoxOutlineBlankIcon
                  sx={{ fontSize: 24, color: "gray" }}
                />
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#666",
                    fontFamily: "iransans, Arial, sans-serif",
                  }}
                >
                  انتخاب
                </Typography>
              </>
            )}
          </Box>

          <Typography
            sx={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#222",
              fontFamily: "iransans, Arial, sans-serif",
              flex: 1,
              textAlign: "right",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {worker.name}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              gap: 1,
            }}
          >
            <OptionButton
              icon={<RocketLaunchIcon sx={{ fontSize: 28, color: "#f57c00" }} />}
              label="افزایش بازدید"
              onClick={() => handleAction("boost")}
            />
            <OptionButton
              icon={<EditIcon sx={{ fontSize: 28, color: "#4CAF50" }} />}
              label="ویرایش"
              onClick={() => handleAction("edit")}
            />
            <OptionButton
              icon={<VisibilityIcon sx={{ fontSize: 28, color: "#2196F3" }} />}
              label="پیش نمایش"
              onClick={() => handleAction("preview")}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              gap: 1,
            }}
          >
            <OptionButton
              icon={<BarChartIcon sx={{ fontSize: 28, color: "#9C27B0" }} />}
              label="آمار بازدید"
              onClick={() => handleAction("stats")}
            />
            <OptionButton
              icon={<ShareIcon sx={{ fontSize: 28, color: "#FF9800" }} />}
              label="اشتراک گذاری"
              onClick={() => handleAction("share")}
            />
            <OptionButton
              icon={<DeleteIcon sx={{ fontSize: 28, color: "#ff3b30" }} />}
              label="حذف"
              danger
              onClick={() => handleAction("delete")}
            />
          </Box>
        </Box>
      </Drawer>

      {/* ---- delete confirmation ---- */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", direction: "rtl" } }}
      >
        <DialogContent sx={{ p: 3, textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: "bold",
              fontFamily: "iransans, Arial, sans-serif",
              color: "#333",
              mb: 1.5,
            }}
          >
            هشدار
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              fontFamily: "iransans, Arial, sans-serif",
              color: "#666",
              mb: 3,
            }}
          >
            آیا مطمئن هستید که می‌خواهید این فایل را حذف کنید؟
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              onClick={() => setConfirmOpen(false)}
              sx={{
                flex: 1,
                py: 1.25,
                borderRadius: "10px",
                border: "1px solid #ccc",
                textAlign: "center",
                cursor: "pointer",
                color: "#333",
                fontFamily: "iransans, Arial, sans-serif",
                fontSize: 14,
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              انصراف
            </Box>
            <Box
              onClick={performDelete}
              sx={{
                flex: 1,
                py: 1.25,
                borderRadius: "10px",
                backgroundColor: "#ff3b30",
                textAlign: "center",
                cursor: "pointer",
                color: "white",
                fontFamily: "iransans, Arial, sans-serif",
                fontSize: 14,
                "&:hover": { backgroundColor: "#e63529" },
              }}
            >
              {deleting ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                "حذف"
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ---- share fallback dialog ---- */}
      <Dialog
        open={shareFallback.open}
        onClose={() => setShareFallback({ open: false, url: "" })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", direction: "rtl", p: 1 },
        }}
      >
        <DialogContent sx={{ p: 3, textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: "bold",
              fontFamily: "iransans, Arial, sans-serif",
              color: "#333",
              mb: 1,
            }}
          >
            اشتراک گذاری
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              fontFamily: "iransans, Arial, sans-serif",
              color: "#666",
              mb: 2,
            }}
          >
            لینک زیر را کپی کنید
          </Typography>

          <TextField
            fullWidth
            value={shareFallback.url}
            readOnly
            onClick={(e) => e.target.select()}
            variant="outlined"
            size="small"
            InputProps={{ sx: { direction: "ltr" } }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontFamily: "monospace",
                fontSize: 13,
              },
              "& .MuiInputBase-input": {
                textAlign: "left",
                direction: "ltr",
              },
            }}
          />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              onClick={() => {
                // best-effort copy from the dialog too
                try {
                  const input = document.createElement("input");
                  input.value = shareFallback.url;
                  document.body.appendChild(input);
                  input.select();
                  document.execCommand("copy");
                  document.body.removeChild(input);
                  showToast("لینک کپی شد", "success");
                  setShareFallback({ open: false, url: "" });
                } catch (e) {
                  // if copy still fails, just leave the dialog open
                }
              }}
              sx={{
                flex: 1,
                py: 1.25,
                borderRadius: "10px",
                backgroundColor: "#1976d2",
                textAlign: "center",
                cursor: "pointer",
                color: "white",
                fontFamily: "iransans, Arial, sans-serif",
                fontSize: 14,
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              کپی لینک
            </Box>

            <Box
              onClick={() => setShareFallback({ open: false, url: "" })}
              sx={{
                flex: 1,
                py: 1.25,
                borderRadius: "10px",
                border: "1px solid #ccc",
                textAlign: "center",
                cursor: "pointer",
                color: "#333",
                fontFamily: "iransans, Arial, sans-serif",
                fontSize: 14,
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              بستن
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ---- toast ---- */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleToastClose} severity={toast.severity}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// ---------- small helper component for sheet options ----------
const OptionButton = ({ icon, label, onClick, danger }) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 0.75,
      py: 1.5,
      px: 1,
      borderRadius: "12px",
      backgroundColor: danger ? "#fff5f5" : "#f8f9fa",
      minWidth: 80,
      cursor: "pointer",
      transition: "background-color 0.2s",
      "&:hover": {
        backgroundColor: danger ? "#ffe0e0" : "#eef0f3",
      },
    }}
  >
    {icon}
    <Typography
      sx={{
        fontSize: 11,
        fontFamily: "iransans, Arial, sans-serif",
        color: danger ? "#ff3b30" : "#333",
        textAlign: "center",
      }}
    >
      {label}
    </Typography>
  </Box>
);

export default PanelWorkerCard;