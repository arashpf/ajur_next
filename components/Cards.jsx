import React from "react";

// Simple inline ArrowLeft icon
const ArrowLeft = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width="16"
    height="16"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M14 6L8 12l6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Cards component accepts features = [{ id, title, description, illustration, action, onClick }]
export default function Cards({ features = [] }) {
  const [hovered, setHovered] = React.useState(null);
  return (
    <section className="py-8 sm:py-20 px-0 sm:px-4 bg-gradient-to-b from-background to-secondary/30 iransans">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-2 sm:gap-8">
          {features.map((feature) => {
            // Make buy/rent/register actions use the red hover style
            const isRed = ["ثبت آگهی", "خرید", "اجاره"].includes(feature.title || feature.action);
            const isDisabled = !!feature.disabled;
            return (
            <div
              key={feature.id}
              className="group transform transition-all duration-300 mx-auto w-full px-4 sm:px-0"
              style={{ willChange: "transform, opacity" }}
              // make entire card clickable optionally
              onClick={(e) => {
                if (!feature.onClick) return;
                // prevent double-invocation when clicking inner button
                if (e.target.closest("button")) return;
                feature.onClick(e);
              }}
            >
              <div className={`${isDisabled ? 'bg-gray-50 text-gray-600 border border-gray-200' : 'bg-white'} rounded-xl sm:rounded-3xl p-4 sm:p-8 h-full flex flex-col gap-3 sm:gap-6 shadow-sm sm:shadow-lg ${isDisabled ? '' : 'hover:shadow-2xl hover:-translate-y-1'} transition-all duration-300 ring-1 ring-gray-100` }>
                {/* Illustration */}
                  <div className={`mx-auto transition-transform duration-300 ${isDisabled ? '' : 'group-hover:scale-105'}`}>
                  <div className="relative w-32 h-32 sm:w-52 sm:h-52 mx-auto">
                    <img
                      src={feature.illustration || "/placeholder.svg"}
                      alt={feature.title || "illustration"}
                      className={`w-full h-full object-contain drop-shadow-lg ${isDisabled ? 'opacity-60' : ''}`}
                      style={{ display: "block" }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-2 sm:gap-4 text-center">
                  <h3 className="text-lg sm:text-2xl font-bold text-foreground iransans-heading">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-balance iransans text-xs sm:text-base">
                    {feature.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    if (isDisabled) return;
                    e.stopPropagation();
                    if (typeof feature.onClick === "function") feature.onClick(e);
                  }}
                  onMouseEnter={() => setHovered(feature.id)}
                  onMouseLeave={() => setHovered(null)}
                  disabled={isDisabled}
                  className={`w-full sm:w-10/12 mx-auto py-4 px-12 rounded-full font-bold text-lg sm:text-base transition-all duration-300 flex items-center justify-center gap-2 ${isDisabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'text-white'}`}
                  style={{
                    background:
                      !isDisabled && (
                        // bluish gradient default, slightly darker on hovered red-target actions
                        isRed && hovered === feature.id
                          ? 'linear-gradient(135deg,#1e40af,#1e3a8a)'
                          : 'linear-gradient(135deg,#3b82f6,#2563eb)'
                      ),
                    transform: !isDisabled ? 'scale(1.0)' : undefined,
                  }}
                >
                  {feature.action}
                  <ArrowLeft className={`w-4 h-4 transition-transform ${isDisabled ? '' : 'group-hover:-translate-x-1'}`} />
                </button>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}