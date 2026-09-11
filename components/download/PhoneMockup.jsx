/**
 * =============================================================================
 * PHONE MOCKUP COMPONENT
 * =============================================================================
 *
 * FILE: components/PhoneMockup.jsx
 * LOCATION: Place in your Next.js 12 project's /components folder
 *
 * PURPOSE:
 * Renders a realistic iPhone-style phone mockup with app content inside.
 * Has two variants: "home" (app home screen) and "consultants" (agents list)
 *
 * PROPS:
 * - variant: "home" | "consultants" - Which screen to show
 * - disableScroll: boolean - Whether to disable internal scrolling
 *
 * REQUIRED IMAGES:
 * - /images/ajur-1200.png (Ajur logo for bottom nav)
 * - /modern-living-room.png (Property image)
 * - /placeholder.svg (Placeholder for profile images)
 *
 * =============================================================================
 */
import Image from 'next/image';
import {
  FileText,
  Contact,
  Folder,
  GraduationCap,
  TrendingUp,
  Settings,
  Calculator,
  Megaphone,
  Menu,
  MapPin,
  Trophy,
  User,
} from "./Icons"

export default function PhoneMockup({ variant = "home", disableScroll = false, sizeClasses = "" }) {
  const baseClasses = "relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] shadow-xl";
  const sizeClassString = sizeClasses || "h-[420px] w-[260px] md:h-[600px] md:w-[300px]";
  return (
    <div className={`${baseClasses} ${sizeClassString}`}>
      {/* Phone notch */}
      <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-10"></div>

      {/* Physical buttons - left side */}
      <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>

      {/* Physical button - right side (power) */}
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>

      {/* Phone screen container - match outer container size so screen doesn't overflow the frame */}
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative flex flex-col">
        {/* Status Bar */}
        <div className="h-8 bg-gray-100 w-full flex justify-between px-6 items-center text-[10px] font-bold text-gray-800 z-20">
          <span>1:11</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-800 rounded-full opacity-20"></div>
            <div className="w-3 h-3 bg-gray-800 rounded-full opacity-20"></div>
          </div>
        </div>

        {/* Screen content - changes based on variant prop */}
        {variant === "home" && <HomeScreen disableScroll={disableScroll} />}
        {variant === "consultants" && <ConsultantsScreen />}

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center px-2 z-20">
          <NavIcon icon={<Menu className="w-5 h-5" />} />
          <NavIcon icon={<MapPin className="w-5 h-5" />} />

          {/* Center logo button - elevated design */}
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center -mt-6 shadow-lg border-4 border-white overflow-hidden">
            {/* HINT: Update this src to match your logo path */}
            <img src="/logo/ajur.png" alt="Logo" className="w-full h-full object-contain p-0" />
          </div>

          <NavIcon icon={<Trophy className="w-5 h-5" />} />
          <NavIcon icon={<User className="w-5 h-5" />} />
        </div>
      </div>
    </div>
  )
}

/**
 * Home Screen - Shows app icons grid and property preview
 */
function HomeScreen({ disableScroll = false }) {
  return (
    <>
      {/* Header with settings and profile */}
      <div className="px-4 py-2 flex justify-between items-center bg-white shadow-sm z-10">
        <Settings className="w-5 h-5 text-gray-500" />
        <span className="font-bold text-gray-800">دستیار هوشمند</span>
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
          <img src="/img/ajur.png?height=32&width=32" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Scrollable content area */}
      <div
        className={`flex-1 p-4 space-y-4 pb-20 no-scrollbar relative ${disableScroll ? "overflow-hidden" : "overflow-y-auto"}`}
      >
        {/* App icons grid - 2 columns */}
        <div className="grid grid-cols-2 gap-3">
          <AppIcon color="bg-green-500" icon={<FileText className="text-white w-6 h-6" />} label="فایل‌ها" />
          <AppIcon color="bg-blue-800" icon={<Contact className="text-white w-6 h-6" />} label="دفترچه تلفن" />
          <AppIcon color="bg-purple-500" icon={<Folder className="text-white w-6 h-6" />} label="بانک فایل" />
          <AppIcon color="bg-blue-500" icon={<GraduationCap className="text-white w-6 h-6" />} label="آموزش" />
          <AppIcon color="bg-pink-500" icon={<TrendingUp className="text-white w-6 h-6" />} label="افزایش بازدید" />
          <AppIcon color="bg-red-500" icon={<Settings className="text-white w-6 h-6" />} label="مدیریت" />
          <AppIcon color="bg-purple-600" icon={<Calculator className="text-white w-6 h-6" />} label="محاسبه کمیسیون" />
          <AppIcon color="bg-orange-500" icon={<Megaphone className="text-white w-6 h-6" />} label="بازاریابی آجر" />
        </div>

        {/* Featured property image */}
        <div className="mt-4 rounded-xl overflow-hidden shadow-md relative h-32 w-full">
          {/* HINT: Update this src to match your image path */}
          {/* <img src="/modern-living-room.png" alt="Living room" className="w-full h-full object-cover" /> */}

          <Image 
  src="/img/espinas.jpg" 
  alt="Living room" 
  fill
  className="object-cover"
  sizes="100vw"
/>
         
          <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">جدید</div>
        </div>

        {/* Property description text */}
        <div className="text-right p-2">
          <h3 className="font-bold text-sm text-gray-800">تور مجازی چیست</h3>
          <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
            در عصر دیجیتال، فناوری نقش تعیین‌کننده‌ای در نحوه ارتباط، تعامل و حتی خرید و فروش ایفا می‌کند.
          </p>
        </div>
      </div>
    </>
  )
}

/**
 * Consultants Screen - Shows list of real estate agents
 */
function ConsultantsScreen() {
  return (
    <>
      {/* Header with search and filters */}
      <div className="px-4 py-3 bg-white shadow-sm z-10">
        {/* Tab switcher */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-5 h-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <span className="px-3 py-1 rounded-md text-xs text-gray-500">مشاغل</span>
            <span className="px-3 py-1 rounded-md text-xs bg-red-500 text-white shadow-sm">مشاورین</span>
            <span className="px-3 py-1 rounded-md text-xs text-gray-500">املاک</span>
          </div>
          <div className="w-5 h-5"></div>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm">
          <div className="w-4 h-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="جستجو مشاور: مثلا محمد دهقان"
            className="flex-1 bg-transparent text-xs outline-none text-gray-700 text-right"
            dir="rtl"
          />
          <MapPin className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Consultants list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-20 bg-gray-50">
        <ConsultantCard name="مسعود قهرمانی" role="مشاور . ستاره شهر" rating={5} logo/>
        <ConsultantCard name="علیرضا عباسی" role="مشاور . ستاره شهر" rating={5} logo verified />
        <ConsultantCard name="پویا عباسی" role="دپارتمان املاک ۲۴" rating={0} logo />
      </div>
    </>
  )
}

/**
 * Consultant Card - Individual agent card in the list
 */
function ConsultantCard({ name, role, rating, verified = false, logo = false }) {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 relative">
      {/* Share button */}
      <div className="absolute top-3 left-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        {/* Profile image */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
            {logo ? (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xs">
                LOGO
              </div>
            ) : (
              <img src="/img/ajur.png" alt={name} className="w-full h-full object-cover" />
            )}
          </div>
          {/* Verified badge */}
          {verified && (
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Name and role */}
        <div>
          <h4 className="font-bold text-gray-800 text-sm">{name}</h4>
          <p className="text-[10px] text-gray-500 mt-0.5">{role}</p>
        </div>

        {/* Star rating */}
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`text-sm ${i <= rating ? "text-yellow-400" : "text-gray-200"}`}>
              &#9733;
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * App Icon - Grid item for home screen apps
 */
function AppIcon({ color, icon, label }) {
  return (
    <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer">
      <div className={`${color} w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </div>
  )
}

/**
 * Nav Icon - Bottom navigation bar item
 */
function NavIcon({ icon }) {
  return <div className="text-gray-400 hover:text-red-500 cursor-pointer p-2">{icon}</div>
}
