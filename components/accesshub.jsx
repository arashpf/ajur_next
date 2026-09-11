"use client"
import { useRouter } from 'next/router'

export default function FeaturesHub() {
  const router = useRouter()

  const handleFeatureClick = (feature) => {
    if (feature.link) {
      if (feature.external) {
        window.open(feature.link, '_blank', 'noopener,noreferrer')
      } else {
        router.push(feature.link)
      }
    }
  }

  return (
    <section 
    style={{ 
      background: 'linear-gradient(180deg, #ffffff 0%, #a92b31 100%)',
      borderRadius: 14 
    }} 
    className="w-full py-16 px-4 md:px-6 mx-0 text-center" 
    dir="rtl"
  >
    <div className="grid md:grid-cols-3 gap-x-5 gap-y-20 justify-items-center">
      {features.map((feature, index) => (
        <CircleFeature key={index} feature={feature} index={index} onFeatureClick={handleFeatureClick} />
      ))}
    </div>
  </section>
  )
}

function CircleFeature({ feature, index, onFeatureClick }) {
  return (
    <div
      className="relative group cursor-pointer p-2 md:p-3"
      style={{
        animation: `fadeInUp 0.6s ease-out forwards ${index * 0.15}s`,
        opacity: 0,
      }}
      onClick={() => onFeatureClick(feature)}
    >
      {/* Redesigned circle with neon rotating border and glow */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
        {/* Subtle tinted shadow instead of neon gradient (strengthened) */}
        <div
          className="absolute -inset-[6px] rounded-full pointer-events-none"
          style={{
            boxShadow: '0 24px 48px rgba(220, 38, 38, 0.12)',
            background: 'rgba(220,38,38,0.02)'
          }}
        />

        {/* Inner Content Circle */}
        <div className="relative w-full h-full rounded-full bg-white flex flex-col items-center justify-center gap-3 z-10 transition-transform duration-300 transform group-hover:scale-105" style={{boxShadow: '0 18px 36px rgba(0,0,0,0.10)'}}>
          {/* Glass border overlay (curved glass effect) */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none z-0"
            style={{
              border: '1px solid rgba(255,255,255,0.6)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))',
              // removed backdrop-filter to avoid blurring child text
            }}
          />

          {/* Icon (red) */}
          <div className="relative z-20 text-red-500 group-hover:text-red-600 transition-colors duration-200">
            {feature.icon}
          </div>

          {/* Title */}
          <span className="relative z-20 text-gray-800 font-semibold text-sm md:text-base text-center px-2 group-hover:text-black transition-colors">
            {feature.title}
          </span>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    title: "محاسبه کمیسیون",
    link: "/assistant/comissioncalc",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="16" y1="14" x2="16" y2="18" />
        <path d="M16 10h.01" />
        <path d="M12 10h.01" />
        <path d="M8 10h.01" />
        <path d="M12 14h.01" />
        <path d="M8 14h.01" />
        <path d="M12 18h.01" />
        <path d="M8 18h.01" />
      </svg>
    ),
  },
  {
    title: "دفترچه تلفن",
    link: "/assistant/notebook",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "بازاریابی آجر",
    link: "/marketing",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    ),
  },
  {
    title: "افزایش بازدید",
    link: "/assistant/G-ads/landing-page",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
  {
    title: "مجله آجر",
    link: "https://mag.ajur.app/category/educational/",
    external: true,
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    title: "بانک فایل",
    link: "/assistant/filebank",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

const styleTag = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`

// Inject styles
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = styleTag
  document.head.appendChild(style)
}
