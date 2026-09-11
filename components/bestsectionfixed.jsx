<section className="py-24 px-4 bg-primary/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-[10%] w-96 h-96 bg-gradient-to-br from-[oklch(0.58_0.14_20)] to-transparent rounded-full blur-3xl opacity-5 animate-pulse-slow" />
      <div className="absolute bottom-20 left-[15%] w-[500px] h-[500px] bg-gradient-to-tr from-[oklch(0.58_0.14_20)] to-transparent rounded-full blur-3xl opacity-4 animate-pulse-slower" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
         <div className="max-w-7xl mx-auto my-6 text-center">
              <h1 className="text-2xl md:text-3xl font-bold">بهترین‌های آجر</h1>
            </div>
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">بهترین‌های آجر</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            دسترسی سریع به برترین خدمات و امکانات آجر
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => {
                // Empty onClick - to be filled by friend
              }}
              className="group relative cursor-pointer h-full animate-fade-in-up"
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: "backwards",
              }}
            >
              {/* Moving Neon Border Container */}
              <div className="relative h-full overflow-hidden rounded-3xl p-[3px] isolate transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                {/* Spinning Gradient Border */}
                <div className="absolute inset-[-100%] animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,#ffcdd2_0%,#ff5252_25%,#d32f2f_50%,#ff5252_75%,#ffcdd2_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Static Border for non-hover state */}
                <div className="absolute inset-[-100%] bg-gradient-to-br from-red-200/30 to-red-300/30 group-hover:opacity-0 transition-opacity duration-500" />

                {/* Inner Card Content */}
                <div className="relative h-full w-full rounded-[22px] bg-gradient-to-br from-[#ffebee] via-[#ffcdd2] to-[#ffb3ba] p-8 flex flex-col justify-between overflow-hidden">
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Animated background particles */}
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/50 rounded-full blur-3xl animate-float" />
                  <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/50 rounded-full blur-3xl animate-float-delayed" />

                  <div className="relative z-10">
                    {/* Icon with animation */}
                    <div className="w-20 h-20 bg-white/70 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/60 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <svg
                        className="w-10 h-10 text-[#D93025]"
                        strokeWidth={2}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={card.iconPath} />
                      </svg>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-balance">{card.title}</h3>
                    <p className="text-gray-800 font-medium text-base leading-relaxed text-balance">
                      {card.description}
                    </p>
                  </div>

                  {/* Hover indicator */}
                  <div className="relative z-10 mt-6 group-hover:translate-x-2 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-gray-700 group-hover:text-[#D93025] transition-colors font-semibold">
                      <span className="text-sm">مشاهده بیشتر</span>
                      <svg
                        className="w-5 h-5 animate-arrow-bounce"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.05;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.08;
          }
        }

        @keyframes pulse-slower {
          0%, 100% {
            transform: scale(1);
            opacity: 0.04;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.07;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.3) rotate(90deg);
            opacity: 0.5;
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.2) rotate(-90deg);
            opacity: 0.4;
          }
        }

        @keyframes arrow-bounce {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-4px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 10s ease-in-out infinite 2s;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite 1s;
        }

        .animate-arrow-bounce {
          animation: arrow-bounce 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>