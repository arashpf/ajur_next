"use client"

/**
 * =============================================================================
 * FEATURES SECTION COMPONENT
 * =============================================================================
 *
 * FILE: components/FeaturesSection.jsx
 * LOCATION: Place in your Next.js 12 project's /components folder
 *
 * PURPOSE:
 * Showcases app features using a carousel/slider design:
 * - Navigation dots at the top
 * - Left/right arrow buttons
 * - Animated feature cards with icons
 * - Phone mockup on desktop (hidden on mobile)
 *
 * FEATURES ARRAY:
 * Each feature has: id, icon, title, text, color classes
 * Modify the features array to add/remove/edit features
 *
 * MOBILE OPTIMIZATION:
 * - Phone mockup is hidden on mobile for better UX
 * - Cards are full-width and centered
 * - Touch-friendly navigation
 *
 * =============================================================================
 */

import { useState } from "react"
import PhoneMockup from "./PhoneMockup"
import { FileText, Contact, Calculator, ChevronLeft, ChevronRight } from "./Icons"

export default function FeaturesSection() {
  // Track which feature is currently active
  const [activeFeature, setActiveFeature] = useState(0)

  // Features data - modify this array to change content
  const features = [
    {
      id: 0,
      icon: <FileText className="w-8 h-8" />,
      title: "فایل‌های اختصاصی",
      text: "پنل اختصاصی فایل‌ها با قابلیت‌های پیشرفته برای مدیریت املاک. دسترسی سریع به هزاران فایل ملکی با امکان جستجوی پیشرفته و فیلترهای هوشمند.",
      color: "bg-green-500",
      lightColor: "bg-green-50",
      borderColor: "border-green-500",
    },
    {
      id: 1,
      icon: <Contact className="w-8 h-8" />,
      title: "دفترچه تلفن هوشمند",
      text: "مدیریت مخاطبین و مشتریان با دسته‌بندی‌های هوشمند. همیشه با مشتریان خود در ارتباط باشید و تاریخچه تماس‌ها را پیگیری کنید.",
      color: "bg-blue-600",
      lightColor: "bg-blue-50",
      borderColor: "border-blue-600",
    },
    {
      id: 2,
      icon: <Calculator className="w-8 h-8" />,
      title: "محاسبه کمیسیون",
      text: "محاسبه دقیق و سریع کمیسیون معاملات ملکی طبق آخرین نرخ‌نامه اتحادیه. محاسبه خودکار مالیات و سهم هر طرف معامله.",
      color: "bg-purple-600",
      lightColor: "bg-purple-50",
      borderColor: "border-purple-600",
    },
  ]

  // Navigation handlers
  const nextFeature = () => {
    setActiveFeature((prev) => (prev + 1) % features.length)
  }

  const prevFeature = () => {
    setActiveFeature((prev) => (prev - 1 + features.length) % features.length)
  }

  const currentFeature = features[activeFeature]

  return (
    <section
      id="features"
      className="h-screen w-full snap-start relative bg-gray-50 flex items-center justify-center overflow-hidden py-6 md:py-8"
    >
      <div className="container mx-auto px-4 flex flex-col items-center justify-center relative">
        {/* mobile phone preview removed — single mobile phone is rendered centrally in the page container */}
        {/* Section title */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6 text-center">قابلیت‌های جدید آجر</h2>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 w-full max-w-6xl">
          {/* Phone Mockup - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block z-10 relative order-1 lg:order-2">
            <div className="scale-75 lg:scale-90">
              <PhoneMockup variant="home" disableScroll={true} />
            </div>
          </div>

          {/* Feature Carousel Card */}
          <div className="w-full max-w-lg order-2 lg:order-1" dir="rtl">
            {/* Navigation Dots */}
            <div className="flex justify-center gap-3 mb-6">
              {features.map((feature, index) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeFeature === index ? `${feature.color} scale-125` : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>

            {/* Feature Card - Animated container */}
            <div
              className={`relative rounded-3xl p-6 md:p-8 shadow-xl border-2 transition-all duration-500 ${currentFeature.lightColor} ${currentFeature.borderColor}`}
            >
              {/* Previous Arrow Button */}
              <button
                onClick={prevFeature}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                aria-label="Previous feature"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              {/* Next Arrow Button */}
              <button
                onClick={nextFeature}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                aria-label="Next feature"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>

              {/* Card Content */}
              <div className="flex flex-col items-center text-center px-8">
                {/* Feature Icon */}
                <div
                  className={`${currentFeature.color} w-20 h-20 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}
                >
                  {currentFeature.icon}
                </div>

                {/* Feature Title */}
                <h3 className="font-bold text-2xl md:text-3xl text-gray-800 mb-4">{currentFeature.title}</h3>

                {/* Feature Description - RTL justified text */}
                <p
                  className="text-gray-600 leading-relaxed text-base md:text-lg"
                  style={{ textAlign: "justify", textAlignLast: "center" }}
                >
                  {currentFeature.text}
                </p>
              </div>

              {/* Feature Counter Badge */}
              <div
                className={`absolute -bottom-4 left-1/2 -translate-x-1/2 ${currentFeature.color} text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg`}
              >
                {activeFeature + 1} / {features.length}
              </div>
            </div>

            {/* Helper text for mobile users */}
            <p className="text-center text-gray-500 text-sm mt-8 px-4">
              برای مشاهده قابلیت‌های بیشتر، از دکمه‌های چپ و راست استفاده کنید
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
