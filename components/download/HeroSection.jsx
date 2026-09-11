"use client"

/**
 * =============================================================================
 * HERO SECTION COMPONENT
 * =============================================================================
 *
 * FILE: components/HeroSection.jsx
 * LOCATION: Place in your Next.js 12 project's /components folder
 *
 * PURPOSE:
 * The main landing section with:
 * - Red gradient background
 * - App title and tagline (Persian text)
 * - Download buttons for Android (direct, Myket, Bazaar) and iOS (PWA)
 * - Phone mockup showing the app
 * - Scroll-down indicator
 *
 * PROPS:
 * - scrollToSection: function(id) - Scrolls to a section by ID
 *
 * CUSTOMIZATION:
 * - Update download button links in the href attributes
 * - Modify colors in the gradient classes
 *
 * =============================================================================
 */

import PhoneMockup from "./PhoneMockup"
import { Apple, Smartphone, Download, ChevronDown } from "./Icons"

export default function HeroSection({ scrollToSection, onDirectDownload, onDownloadAction, isIOS, isStandalone, hasRef }) {
  return (
    <section
      id="hero"
      className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#8B1D1D] via-[#A62727] to-[#C93838]"
    >
      {/* Abstract Background Waves - decorative blurred shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-red-900 rounded-full blur-[100px]"></div>
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-red-600 rounded-full blur-[80px]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-12 h-full flex flex-col md:flex-row items-center md:items-center md:justify-center gap-2 md:gap-2 md:space-x-4 relative z-10 py-4 md:py-0">
        {/* Text Content - Left side on desktop, bottom on mobile */}
        <div dir="rtl" className="w-full md:w-1/2 text-white text-center order-1 md:order-1 flex flex-col items-center gap-2 justify-center mt-0 md:mt-0 md:pr-0 h-full">
          {/* Ajur Logo above title, not stretched */}
          <img src="/logo/ajur.png" alt="Ajur Logo" className="w-16 h-16 md:w-20 md:h-20 mb-2 md:mb-4 object-contain mx-auto" style={{maxWidth:'80px',maxHeight:'80px'}} />
          {/* Main title with animation */}
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-1 leading-tight">
              مشاور املاک <span className="text-red-200">هوشمند</span> آجر
            </h1>
            <h2 className="hidden md:block text-2xl md:text-4xl font-light opacity-90 mb-2">آجر فراتر از یک آگهی</h2>
          </div>

          {/* Android Downloads Section */}
          <div className="w-full max-w-md animate-fade-in-left animation-delay-200">
            <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
              <span className="text-lg opacity-90">دانلود نسخه android</span>
              <div className="h-[1px] bg-white/30 flex-1"></div>
            </div>

            {/* Download buttons grid */}
            <div className="grid grid-cols-3 gap-3">
              <DownloadButton icon={<Download className="w-5 h-5" />} text="لینک مستقیم" onClick={() => onDirectDownload && onDirectDownload("https://api.ajur.app/download/ajur.apk", "direct")} />
              {/* <DownloadButton icon={<Smartphone className="w-5 h-5" />} text="مایکت" highlight onClick={() => onDirectDownload && onDirectDownload("https://myket.ir/app/com.Ajour", "myket")} /> */}
              <DownloadButton icon={<Smartphone className="w-5 h-5" />} text="بازار" highlight green onClick={() => onDirectDownload && onDirectDownload("https://cafebazaar.ir/app/com.Ajour", "bazaar")} />
            </div>
          </div>

          {/* iOS Downloads Section */}
          <div className="w-full max-w-md mt-1 animate-fade-in-left animation-delay-400">
            <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
              <span className="text-lg opacity-90">دانلود نسخه ios</span>
              <div className="h-[1px] bg-white/30 flex-1"></div>
            </div>

            <div className="w-full">
              {/* HINT: Add href="your-pwa-link" to make this functional */}
              <button
                className="w-full bg-white text-gray-900 rounded-xl py-3 px-6 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-lg group"
                onClick={() => onDownloadAction && onDownloadAction('pwa')}
                disabled={isStandalone}
              >
                <Apple className="w-6 h-6" />
                <span className="font-bold text-lg">PWA</span>
                <span className="text-sm text-gray-500 font-medium group-hover:text-gray-700">نسخه وب</span>
              </button>
            </div>
          </div>
        </div>

        {/* Phone Mockup - full on md+, clipped top-half on mobile */}
        <div className="hidden lg:flex w-full lg:w-1/2 order-2 lg:order-2 justify-center lg:justify-end animate-fade-in-up-rotate animation-delay-100">
          <div className="origin-center md:origin-right overflow-visible max-h-[420px] md:max-h-[600px]">
            <div className="scale-75 md:scale-90 lg:scale-100">
              <PhoneMockup variant="home" />
            </div>
          </div>
        </div>

        {/* mobile phone preview removed — single mobile phone is rendered centrally in the page container */}
      </div>

      {/* Scroll Down Button - Fixed at bottom center */}
      <button
        onClick={() => scrollToSection("features")}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 hover:text-white flex flex-col items-center gap-1 z-20 cursor-pointer animate-bounce-slow"
      >
        <span className="text-sm font-light">بیشتر بدانید</span>
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  )
}

/**
 * Download Button - Styled button for app store links
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.text - Button label text
 * @param {boolean} props.highlight - If true, uses solid white background
 * @param {boolean} props.green - If true, uses green background (for Bazaar)
 */
function DownloadButton({ icon, text, highlight = false, green = false, onClick }) {
  // Determine background color based on props
  let bgClass = "bg-white/10 hover:bg-white/20 text-white"
  if (highlight) bgClass = "bg-white text-gray-900 hover:bg-gray-100"
  if (green) bgClass = "bg-[#4CAF50] text-white hover:bg-[#43A047]"

  return (
    <button
      onClick={onClick}
      className={`${bgClass} rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 transition-all shadow-md active:scale-95`}
    >
      {icon}
      <span className="text-xs font-bold">{text}</span>
    </button>
  )
}
