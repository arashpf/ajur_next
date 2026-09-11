import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Image from "next/image";

const MagCards = dynamic(() => import("../../components/workers/MagCards"), {
  ssr: false,
});

export default function AssistantButtons() {
  const router = useRouter();
  const buttons = [
    {
      key: "phonebook",
      link: "/assistant/notebook",
      label: "دفترچه تلفن",
      color: "#ffffff",
      icon: "/Assistant-Icons/notebook",
    },
    {
      key: "files",
      link: "/panel",
      label: "فایل‌ها",
      color: "#ffffff",
      icon: "/Assistant-Icons/file",
    },
    {
      key: "comissionfee",
      link: "/assistant/comissioncalc",
      label: "محاسبه کمیسیون",
      color: "#ffffff",
      icon: "/Assistant-Icons/calculator",
    },
    {
      key: "management",
      link: "/panel/department-entro",
      label: "مدیریت",
      color: "#ffffff",
      icon: "/Assistant-Icons/management",
    },
    {
      key: "filebank",
      link: "/assistant/filebank",
      label: "بانک فایل",
      color: "#ffffff",
      icon: "/Assistant-Icons/file-bank",
    },
    {
      key: "education",
      link: "https://mag.ajur.app/category/real-estate-education/",
      label: "آموزش",
      color: "#ffffff",
      icon: "/Assistant-Icons/instruction",
      external: true
    },
    {
      key: "views",
      link: "/assistant/G-ads/landing-page",
      label: "افزایش بازدید",
      color: "#ffffff",
      icon: "/Assistant-Icons/view",
    },
    {
      key: "marketing",
      link: "/marketing",
      label: "بازاریابی آجر",
      color: "#ffffff",
      icon: "/Assistant-Icons/marketing",
    },
  ];

  const [showTop, setShowTop] = React.useState(false);
  ("/");
  // React.useEffect(() => {
  //   function onScroll() {
  //     setShowTop(window.scrollY > 300);
  //   }
  //   window.addEventListener("scroll", onScroll);
  //   return () => window.removeEventListener("scroll", onScroll);
  // }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleClick(button) {
  if (button.external) {
    window.open(button.link, '_blank', 'noopener,noreferrer');
  } else if (button.link) {
    router.push(button.link);
  }
}

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-start pt-5 px-2 bg-transparent"
    >
      <div className="w-full grid grid-cols-2 gap-[14px] max-w-[420px] assistant-grid-responsive">
        {buttons.map((b) => (
          <button
            key={b.key}
            aria-label={b.label}
            onClick={() => handleClick(b)}
            className="group flex flex-row items-center gap-[14px] p-2 bg-white rounded-[14px] shadow-md hover:shadow-lg border border-[rgba(0,0,0,0.03)] cursor-pointer text-right w-full"
            dir="ltr"
          >
            <div
              className="w-16 h-16 flex items-center rounded-full justify-center flex-none transform transition-transform duration-200 ease-out group-hover:scale-110"
              style={{ background: b.color }}
              aria-hidden
            >
              <Image
                src={`${b.icon}.png`}
                alt={b.label}
                width={40}
                height={40}
              />
            </div>
            <div
              className="text-base text-[#222] mr-1 flex-1 text-right"
              dir="rtl"
            >
              {b.label}
            </div>
          </button>
        ))}
      </div>
      <style jsx>{`
        @media (min-width: 900px) {
          .assistant-grid-responsive {
            grid-template-columns: repeat(4, 1fr) !important;
            max-width: 1000px !important;
          }
        }
      `}</style>
      <MagCards />
      {showTop && (
        <button
          aria-label="بازگشت به بالا"
          onClick={scrollToTop}
          className="fixed right-4 bottom-[78px] w-12 h-12 rounded-full bg-red-600 border-0 flex items-center justify-center shadow-md cursor-pointer z-[1200]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 5l-7 7h4v7h6v-7h4l-7-7z" fill="#fff" />
          </svg>
        </button>
      )}
    </div>
  );
}
