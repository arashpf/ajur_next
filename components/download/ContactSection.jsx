/**
 * =============================================================================
 * CONTACT SECTION COMPONENT
 * =============================================================================
 *
 * FILE: components/ContactSection.jsx
 * LOCATION: Place in your Next.js 12 project's /components folder
 *
 * PURPOSE:
 * Footer/contact section with:
 * - Animated logo with neon red glowing ring
 * - Company name and tagline
 * - Support phone number (clickable)
 * - Website link (clickable)
 *
 * CUSTOMIZATION:
 * - Update phone number in the tel: href
 * - Update website URL
 * - Replace logo image path
 *
 * ANIMATIONS:
 * - animate-spin-slow: Logo ring rotates slowly
 * - animate-spin-reverse: Outer ring rotates in opposite direction
 * - Neon glow effect using box-shadow
 *
 * =============================================================================
 */

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="h-screen w-full snap-start relative flex flex-col items-center justify-center overflow-hidden bg-white"
    >
      <div className="container mx-auto px-4 text-center z-10">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-center gap-4 md:gap-6">
          {/* Logo with Animated Neon Ring */}
          <div className="w-full md:w-1/2 flex items-center justify-center animate-fade-in-up animation-delay-100">
            <div className="w-40 h-40 md:w-56 md:h-56 relative mb-2 flex items-center justify-center">
              {/* Neon red glowing rotating ring */}
              <div
                className="absolute inset-0 rounded-full border-4 border-red-500/50 animate-spin-slow"
                style={{
                  boxShadow: "0 0 15px 2px rgba(239, 68, 68, 0.5), inset 0 0 15px 2px rgba(239, 68, 68, 0.5)",
                }}
              >
                {/* Glowing decorative dots on the ring */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full shadow-[0_0_20px_5px_rgba(220,38,38,0.8)]"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-red-600 rounded-full shadow-[0_0_20px_5px_rgba(220,38,38,0.8)]"></div>
              </div>

              {/* Outer faint glow ring - rotates in opposite direction */}
              <div className="absolute -inset-4 rounded-full border border-red-500/20 animate-spin-reverse" />

              {/* Logo - centered inside the ring */}
              <div className="w-36 h-36 md:w-48 md:h-48 relative z-10 flex items-center justify-center scale-110 md:scale-120">
                {/* HINT: Update this src to match your logo path */}
                <img
                  src="/logo/ajur.png"
                  alt="Ajur Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
              </div>
            </div>
          </div>

          {/* Company Name and Contact Links */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start gap-2 animate-fade-in-up animation-delay-200">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-0">مشاور املاک هوشمند آجر</h2>

            {/* Tagline */}
            <h3 className="text-lg md:text-xl font-light text-gray-500 mb-0">آجر فراتر از یک آگهی</h3>

            {/* Contact Links */}
            <div className="flex flex-col md:flex-row gap-3 items-center mt-1">
              {/* Phone Number - Clickable to dial */}
              <a
                href="tel:09382740488"
                className="flex items-center gap-3 px-8 py-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors text-gray-800 shadow-sm group"
              >
                {/* Phone icon */}
                <svg
                  className="w-6 h-6 text-red-600 group-hover:rotate-12 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div className="text-right">
                  <div className="text-xs text-gray-500">ارتباط با پشتیبانی</div>
                  {/* HINT: Update this phone number */}
                  <div className="text-xl font-bold font-mono">09382740488</div>
                </div>
              </a>

              {/* Website Link */}
              <a
                href="https://ajur.app"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-gray-900 rounded-2xl hover:bg-black transition-colors text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
              >
                {/* Globe icon */}
                <svg
                  className="w-6 h-6 text-red-500 group-hover:rotate-12 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <div className="text-right">
                  <div className="text-xs text-gray-400">وب‌سایت رسمی</div>
                  {/* HINT: Update this website URL */}
                  <div className="text-xl font-bold font-mono">WWW.AJUR.APP</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Creative Background Elements - Subtle blurred shapes */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gray-200/50 rounded-full blur-3xl -translate-y-1/2"></div>
    </section>
  )
}
