import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import DownloadIcon from "@mui/icons-material/Download";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";
import ShareIcon from "@mui/icons-material/Share";

const DownloadPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // ✅ Handle referral detection
  useEffect(() => {
    if (router.isReady) {
      const { ref } = router.query;
      if (ref) {
        Cookies.set("ref", ref, { expires: 7 });
        router.push("/panel/auth/login");
      }
    }
  }, [router.isReady]);

  // ✅ Detect iOS, PWA support, etc.
  useEffect(() => {
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    const checkStandalone = () => {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone ||
        document.referrer.includes("android-app://")
      );
    };
    setIsStandalone(checkStandalone());

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      showSnackbar("اپلیکیشن قابل نصب است");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      showIOSInstallInstructions();
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") showSnackbar("در حال نصب اپلیکیشن...");
      setDeferredPrompt(null);
      return;
    }

    showSnackbar("مرورگر شما از نصب خودکار پشتیبانی نمی‌کند");
  };

  const showIOSInstallInstructions = () => {
    setShowIOSInstructions(true);
  };

  const handleCloseIOSInstructions = () => setShowIOSInstructions(false);
  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <Box
      sx={{
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        py: 6,
        direction: "rtl",
        fontFamily: "iransans",
      }}
    >
      <Head>
        <title>دانلود اپلیکیشن آجر | Ajur</title>
        <meta name="description" content="دانلود اپلیکیشن آجر برای اندروید و iOS" />
      </Head>

      <Box sx={{ maxWidth: 900, mx: "auto", px: 3 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          sx={{ color: "#a92b31", mb: 4 }}
        >
          دانلود اپلیکیشن آجر
        </Typography>

        {/* --- Android Section --- */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 5,
            borderRadius: 4,
            textAlign: "center",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h5" fontWeight="500" sx={{ mb: 3 }}>
            نسخه اندروید <AndroidIcon color="success" sx={{ verticalAlign: "middle", ml: 1 }} />
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                href="https://api.ajur.app/download/ajur.apk"
                startIcon={<DownloadIcon />}
                sx={{
                  py: 1.5,
                  backgroundColor: "#a92b31",
                  "&:hover": { backgroundColor: "#8e2529" },
                }}
              >
                دانلود مستقیم (APK)
              </Button>
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                href="https://cafebazaar.ir/app/com.Ajour"
                sx={{
                  py: 1.5,
                  backgroundColor: "#43a047",
                  "&:hover": { backgroundColor: "#388e3c" },
                }}
              >
                <Box component="img" src="/logo/bazaar.png" alt="bazaar" sx={{ height: 24, ml: 1 }} />
                بازار
              </Button>
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                href="https://myket.ir/app/com.Ajour"
                sx={{
                  py: 1.5,
                  backgroundColor: "#673ab7",
                  "&:hover": { backgroundColor: "#5e35b1" },
                }}
              >
                <Box component="img" src="/logo/myket.png" alt="myket" sx={{ height: 24, ml: 1 }} />
                مایکت
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* --- iOS / PWA Section --- */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h5" fontWeight="500" sx={{ mb: 3 }}>
            نسخه {isIOS ? "iOS" : "PWA"}{" "}
            <AppleIcon color="action" sx={{ verticalAlign: "middle", ml: 1 }} />
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleInstallClick}
            startIcon={isIOS ? <ShareIcon /> : <AddToHomeScreenIcon />}
            disabled={isStandalone}
            sx={{
              py: 1.5,
              px: 6,
              backgroundColor: "#a92b31",
              "&:hover": { backgroundColor: "#8e2529" },
            }}
          >
            {isStandalone ? "اپلیکیشن نصب شده است" : "نصب اپلیکیشن"}
          </Button>

          {isIOS && !isStandalone && (
            <Typography
              variant="body2"
              sx={{ mt: 3, color: "text.secondary", fontSize: "14px" }}
            >
              در iOS لطفاً از Safari استفاده کرده و گزینه "Add to Home Screen" را بزنید.
            </Typography>
          )}
        </Paper>
      </Box>

      {/* --- iOS Instruction Dialog --- */}
      <Dialog open={showIOSInstructions} onClose={handleCloseIOSInstructions} fullScreen={isMobile}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "iransans",
          }}
        >
          <Typography fontWeight="bold">راهنمای نصب در iOS</Typography>
          <IconButton onClick={handleCloseIOSInstructions}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ direction: "rtl" }}>
          <Typography variant="body1" gutterBottom>
            برای نصب اپلیکیشن آجر بر روی دستگاه iOS:
          </Typography>
          <ol style={{ paddingRight: 20 }}>
            <li>در مرورگر Safari روی دکمه "اشتراک‌گذاری" بزنید.</li>
            <li>گزینه "Add to Home Screen" را انتخاب کنید.</li>
            <li>روی "Add" در بالای صفحه بزنید.</li>
          </ol>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseIOSInstructions}
            variant="contained"
            sx={{
              backgroundColor: "#a92b31",
              "&:hover": { backgroundColor: "#8e2529" },
            }}
          >
            فهمیدم
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Snackbar --- */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default DownloadPage;
