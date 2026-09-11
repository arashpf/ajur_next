/**
 * =============================================================================
 * CONSULTANTS SECTION COMPONENT
 * =============================================================================
 *
 * FILE: components/ConsultantsSection.jsx
 * LOCATION: Place in your Next.js 12 project's /components folder
 *
 * PURPOSE:
 * Showcases the platform's active real estate consultants:
 * - Bold red background with wave decoration
 * - Phone mockup showing the agents list view
 * - Descriptive text about the consultant network
 * - Download CTA button
 *
 * ANIMATIONS:
 * - Phone slides in from left (animate-fade-in-left-spring)
 * - Text fades in from bottom (animate-fade-in-up)
 *
 * =============================================================================
 */

import PhoneMockup from "./PhoneMockup"

export default function ConsultantsSection() {
  return (
    <section
      id="consultants"
      className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden bg-[#B92B27]"
    >
      {/* Background Waves - SVG decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-full opacity-20" preserveAspectRatio="none">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,122.7C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-12 h-full flex flex-col items-center justify-center relative z-10 py-6">
        {/* Desktop: Phone mockup left, text right */}
        <div className="hidden md:flex w-full flex-row items-center justify-center gap-8 lg:gap-12">
          <div className="flex-shrink-0 flex justify-center items-center">
            <PhoneMockup variant="consultants" />
          </div>
          <div dir="rtl" className="flex-1 text-white text-right flex flex-col items-end gap-4 animate-fade-in-up animation-delay-300 max-w-lg">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">هزاران مشاور فعال در آجر</h2>
            <div className="space-y-3 text-sm md:text-base lg:text-lg opacity-95 leading-relaxed text-right">
              <p>آجر بستری برای حرفه‌ای‌های املاک.</p>
              <p>مشاورین متخصص در آجر همیشه درحال جستجوی بهترین و به‌قیمت‌ترین ملک‌ها برای شما هستند.</p>
            </div>
            <button className="mt-4 relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-red-600 group hover:scale-105 active:scale-95 whitespace-nowrap">
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative text-lg">برای دانلود کلیک کنید</span>
            </button>
          </div>
        </div>
        {/* Mobile: Centered phone, title, button */}
        <div className="md:hidden flex flex-col items-center justify-center gap-4 pt-4">
          <div style={{ transform: 'translateY(-10%)' }} className="w-full flex items-center justify-center">
            <PhoneMockup
              variant="consultants"
              sizeClasses="h-[480px] w-[230px] md:h-[580px] md:w-[255px]"
            />
          </div>
          <div className="-mt-6 flex flex-col items-center px-4">
            <h2 className="text-2xl font-bold text-white text-center">هزاران مشاور فعال در آجر</h2>
            <button className="mt-3 relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-bold text-white transition-all duration-300 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-red-600 group hover:scale-105 active:scale-95">
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative text-base sm:text-lg">برای دانلود کلیک کنید</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
