"use client"

/**
 * =============================================================================
 * AJUR LANDING PAGE - MAIN PAGE
 * =============================================================================
 *
 * FILE: pages/index.js
 * LOCATION: Place in your Next.js 12 project's /pages folder
 *
 * DEPENDENCIES:
 * - React (comes with Next.js)
 * - Tailwind CSS v3
 *
 * IMPORTS NEEDED:
 * - Make sure all component files exist in /components folder
 * - Make sure globals.css is imported in _app.js
 *
 * =============================================================================
 */

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/router"
import Cookies from "js-cookie"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Snackbar,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

// HINT: These components should be in your /components folder
import HeroSection from "../../components/download/HeroSection"
import FeaturesSection from "../../components/download/FeaturesSection"
import ConsultantsSection from "../../components/download/ConsultantsSection"
import ContactSection from "../../components/download/ContactSection"
import PhoneMockup from "../../components/download/PhoneMockup"
export default function LandingPage() {
  const containerRef = useRef(null)
  const router = useRouter()

  // Referral + device/PWA detection state (migrated from old download page)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [hasRef, setHasRef] = useState(false)

  // Referral detection
  useEffect(() => {
    if (!router) return
    if (router.isReady) {
      const { ref } = router.query
      if (ref && String(ref).trim() !== "") {
        Cookies.set("ref", String(ref), { expires: 7 })
        setHasRef(true)
      }
    }
  }, [router?.isReady, router?.query])

  // Device / PWA detection and beforeinstallprompt handler
  useEffect(() => {
    try {
      const ios =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
      setIsIOS(ios)

      const checkStandalone = () => {
        return (
          window.matchMedia("(display-mode: standalone)").matches ||
          window.navigator.standalone ||
          (document.referrer && document.referrer.includes("android-app://"))
        )
      }
      setIsStandalone(checkStandalone())

      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
        showSnackbar("اپلیکیشن قابل نصب است")
      }

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    } catch (err) {
      // ignore server-side or navigator access errors
    }
  }, [])

  // MUI theme / mobile breakpoint for dialogs
  const theme = useTheme && useTheme()
  const isMobile = useMediaQuery && useMediaQuery(theme ? theme.breakpoints.down("md") : "(max-width:900px)")

  const showSnackbar = (message) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }

  // Handlers migrated from old download page
  const handleDownloadAction = async (downloadType = "pwa") => {
    if (hasRef) {
      const downloadData = { type: downloadType, timestamp: Date.now() }
      if (downloadType === "direct") downloadData.url = "https://api.ajur.app/download/ajur.apk"
      else if (downloadType === "bazaar") downloadData.url = "https://cafebazaar.ir/app/com.Ajour"
      else if (downloadType === "myket") downloadData.url = "https://myket.ir/app/com.Ajour"

      localStorage.setItem("pendingDownload", JSON.stringify(downloadData))
      router.push("/panel/auth/login")
      return
    }

    // No referral — proceed with install flow
    if (isIOS) {
      showIOSInstallInstructions()
      return
    }

    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        const choice = await deferredPrompt.userChoice
        if (choice && choice.outcome === "accepted") showSnackbar("در حال نصب اپلیکیشن...")
      } catch (err) {
        console.warn("PWA prompt failed", err)
      }
      setDeferredPrompt(null)
      return
    }

    showSnackbar("مرورگر شما از نصب خودکار پشتیبانی نمی‌کند")
  }

  const handleDirectDownload = (url, type) => {
    if (hasRef) {
      const downloadData = { type, url, timestamp: Date.now() }
      localStorage.setItem("pendingDownload", JSON.stringify(downloadData))
      router.push("/panel/auth/login")
    } else {
      window.open(url, "_blank")
    }
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      showIOSInstallInstructions()
      return
    }

    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        const choice = await deferredPrompt.userChoice
        if (choice && choice.outcome === "accepted") showSnackbar("در حال نصب اپلیکیشن...")
      } catch (err) {
        console.warn(err)
      }
      setDeferredPrompt(null)
      return
    }

    showSnackbar("مرورگر شما از نصب خودکار پشتیبانی نمی‌کند")
  }

  const showIOSInstallInstructions = () => {
    if (hasRef) {
      const downloadData = { type: "ios", timestamp: Date.now() }
      localStorage.setItem("pendingDownload", JSON.stringify(downloadData))
      router.push("/panel/auth/login")
      return
    }
    setShowIOSInstructions(true)
  }

  const handleCloseIOSInstructions = () => setShowIOSInstructions(false)
  const handleCloseSnackbar = () => setSnackbarOpen(false)

  /**
   * Smooth scroll function for navigation
   * @param {string} id - The section ID to scroll to
   */
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-y-auto snap-y snap-mandatory scroll-smooth snap-container"
    >
      {/* Header Title Above Cards */}
      <div className="w-full flex justify-center mt-6 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 font-iransans">
          آجر، مشاور املاک هوشمند
        </h1>
      </div>
      {/* 
        SECTION 1: Hero Section 
        - Red gradient background
        - Download buttons for Android/iOS
        - Phone mockup on the right
      */}
      <HeroSection
        scrollToSection={scrollToSection}
        onDirectDownload={handleDirectDownload}
        onDownloadAction={handleDownloadAction}
        isIOS={isIOS}
        isStandalone={isStandalone}
        hasRef={hasRef}
      />

      {/* Mobile phone preview removed to avoid distortion on small screens */}

      {/* 
        SECTION 2: Features Section 
        - Gray background
        - Feature carousel with navigation
        - Phone mockup (hidden on mobile)
      */}
      <FeaturesSection />

      {/* 
        SECTION 3: Consultants Section 
        - Red background with wave decoration
        - Phone mockup showing consultants list
        - Text content on the right
      */}
      <ConsultantsSection />

      {/* 
        SECTION 4: Contact Section 
        - White background
        - Logo with neon ring animation
        - Contact info and website link
      */}
      <ContactSection />

      {/* iOS Instruction Dialog */}
      <Dialog open={showIOSInstructions} onClose={handleCloseIOSInstructions} fullScreen={isMobile}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "iransans" }}>
          راهنمای نصب در iOS
          <IconButton onClick={handleCloseIOSInstructions}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ direction: "rtl" }}>
          <p>برای نصب اپلیکیشن آجر بر روی دستگاه iOS:</p>
          <ol style={{ paddingRight: 20 }}>
            <li>در مرورگر Safari روی دکمه "اشتراک‌گذاری" بزنید.</li>
            <li>گزینه "Add to Home Screen" را انتخاب کنید.</li>
            <li>روی "Add" در بالای صفحه بزنید.</li>
          </ol>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIOSInstructions} variant="contained" sx={{ backgroundColor: "#a92b31", "&:hover": { backgroundColor: "#8e2529" } }}>
            فهمیدم
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
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
    </div>
  )
}
