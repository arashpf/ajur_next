import React from "react";

// Lightweight SVG substitutes for lucide icons (keeps visuals but no external lib)
const Smartphone = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="6"
      y="2.5"
      width="12"
      height="19"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <circle cx="12" cy="18" r="0.8" fill="currentColor" />
  </svg>
);
const QrCode = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="28"
    height="28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="3"
      y="3"
      width="6"
      height="6"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect
      x="15"
      y="3"
      width="6"
      height="6"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect
      x="3"
      y="15"
      width="6"
      height="6"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect x="12" y="12" width="3" height="3" fill="currentColor" />
    <rect x="17" y="12" width="1.5" height="1.5" fill="currentColor" />
  </svg>
);
const BotIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="6"
      y="3"
      width="12"
      height="10"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <rect
      x="8"
      y="13"
      width="8"
      height="6"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <circle cx="9.5" cy="8" r="0.8" fill="currentColor" />
    <circle cx="14.5" cy="8" r="0.8" fill="currentColor" />
  </svg>
);
const BookUser = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M4 19.5V4.5h12v15" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8 8.5h6" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);
const Trophy = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7 4h10v3a4 4 0 0 1-4 4H11A4 4 0 0 1 7 7V4z"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M8 19h8v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-1z"
      stroke="currentColor"
      strokeWidth="1.4"
    />
  </svg>
);

export default function Download() {
  const [showQr, setShowQr] = React.useState(false);
  return (
    <section className="px-4 py-12 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 max-w-7xl mx-auto">
        {/* Left Content (text + CTAs) */}
        <div className="flex-1 text-center lg:text-right lg:order-1 iransans">
          <h1
            className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center iransans-heading"
            style={{ fontFamily: 'iransans, Sahel, Tanha, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif', fontWeight: 800 }}
          >
            اپلیکیشن آجر را دریافت کنید
          </h1>
          <p
            className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto lg:mr-0"
            dir="rtl"
          >
            اپلیکیشن برتر املاک ما را دانلود کنید تا از تمامی امکانات پیشرفته‌ی
            آجر بهترین استفاده را ببرید.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/download"
              className="inline-flex px-8 py-4 bg-red-600 text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition-colors items-center gap-2 shadow-lg shadow-red-600/20"
            >
              <Smartphone className="w-5 h-5" />
              دانلود اپلیکیشن
            </a>
          </div>
        </div>

        {/* Right Image (Phone Mockup) */}
        <div className="flex-1 relative lg:order-2 w-full max-w-md lg:max-w-none flex justify-center lg:justify-start">
          {/* Floating Cards - improved visibility, larger, more shadow, less blur, higher z-index */}
          <div className="absolute -right-24 top-4 z-50 animate-float-slow hidden lg:block">
            <div
              className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-200 flex items-center gap-4"
              style={{
                minWidth: 180,
                filter: "drop-shadow(0 6px 32px rgba(0,0,0,0.10))",
              }}
            >
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <img
                  src="/logo/ajur.png"
                  alt="ajur"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-gray-800">هوش مصنوعی</p>
                <p className="text-xs text-gray-500">تحلیل قیمت</p>
              </div>
            </div>
          </div>

          <div className="absolute -left-28 top-40 z-40 animate-float-medium hidden lg:block">
            <div
              className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-200 flex items-center gap-4"
              style={{
                minWidth: 180,
                filter: "drop-shadow(0 6px 32px rgba(0,0,0,0.10))",
              }}
            >
              <div className="bg-green-100 p-3 rounded-xl text-green-600">
                <img
                  src="/logo/ajur.png"
                  alt="ajur"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-gray-800">دفترچه تلفن</p>
                <p className="text-xs text-gray-500">مشاوران برتر</p>
              </div>
            </div>
          </div>

          <div className="absolute -left-24 bottom-8 z-30 animate-float-fast hidden lg:block">
            <div
              className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-200 flex items-center gap-4"
              style={{
                minWidth: 180,
                filter: "drop-shadow(0 6px 32px rgba(0,0,0,0.10))",
              }}
            >
              <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
                <img
                  src="/logo/ajur.png"
                  alt="ajur"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-gray-800">برترین‌ها</p>
                <p className="text-xs text-gray-500">املاک لوکس</p>
              </div>
            </div>
          </div>

          <div className="relative w-[280px] sm:w-[320px] aspect-[9/19] bg-gray-900 rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden z-10">
            {/* Screen Content */}
            <div className="absolute inset-0 bg-gray-50 flex flex-col">
              {/* Status Bar */}
              <div className="h-6 bg-white w-full absolute top-0 z-20 shadow-sm"></div>

              {/* App Header */}
              <div className="mt-6 px-4 py-3 bg-white border-b flex items-center justify-between z-10 relative">
                <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="font-bold text-gray-800 flex items-center gap-2">
                  <img
                    src="/logo/ajur.png"
                    alt="ajur"
                    className="w-6 h-6 object-contain"
                  />{" "}
                  <span>Ajur App</span>
                </div>
                <div className="w-8 h-8"></div>
              </div>

              <div className="flex-1 overflow-hidden relative">
                <div className="animate-scroll-vertical space-y-4 p-4 absolute w-full">
                  {/* Listing Items (Duplicated for loop) */}
                  {[1, 2, 3, 4, 1, 2, 3, 4].map((item, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      <div className="h-32 bg-gray-200 relative">
                        {/* Mock Image Gradient */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${
                            i % 3 === 0
                              ? "from-blue-100 to-blue-50"
                              : i % 3 === 1
                              ? "from-red-100 to-red-50"
                              : "from-green-100 to-green-50"
                          }`}
                        ></div>
                        <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold">
                          {i % 2 === 0 ? "فروش" : "اجاره"}
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
                        <div className="flex justify-between">
                          <div className="h-2 w-1/3 bg-gray-100 rounded"></div>
                          <div className="h-2 w-1/4 bg-red-50 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gradient Overlay for smooth fade out */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
              </div>

              {/* Floating Notification inside phone */}
              <div className="absolute bottom-8 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-100 animate-bounce-subtle z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                    <img
                      src="/logo/ajur.png"
                      alt="ajur"
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-sm font-bold text-gray-800">
                      پیشنهاد هوشمند!
                    </p>
                    <p className="text-xs text-gray-500">
                      ملک جدید مطابق سلیقه شما
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-red-50/50 to-gray-50/50 rounded-full blur-3xl"></div>
        </div>
      </div>

      <style jsx>{`
        /* simple floating animations used instead of framer-motion */
        @keyframes float-slow {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes float-medium {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-14px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes float-fast {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-18px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float-slow {
          animation: float-slow 3.6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 3s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 2.2s ease-in-out infinite;
        }

        @keyframes scroll-vertical {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .animate-scroll-vertical {
          animation: scroll-vertical 12s linear infinite;
        }

        @keyframes bounce-subtle {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* QR overlay */}
      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowQr(false)}
          />
          <div className="relative bg-white rounded-xl p-6 shadow-2xl z-60 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/logo/ajur.png"
                  alt="ajur"
                  className="w-8 h-8 object-contain"
                />
                <div className="font-bold">اسکن برای دانلود</div>
              </div>
              <button
                onClick={() => setShowQr(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                بستن
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src="/logo/qr.png"
                alt="qr code"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}