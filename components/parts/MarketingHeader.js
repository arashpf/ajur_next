import React, { useState } from "react";

export default function MarketingHeader({ name, balance, profileImage, quote }) {
  const [isOpen, setIsOpen] = useState(false);

  // Format balance as Iranian Tomans with comma separators
  const formattedBalance =
    typeof balance === "number"
      ? `${balance.toLocaleString("fa-IR")} تومان`
      : balance;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md p-3">
      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between">
        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <img
            src={profileImage}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{name}</span>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">موجودی: {formattedBalance}</span>
              <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded-xl hover:bg-blue-700">
                برداشت
              </button>
            </div>
          </div>
        </div>

        {/* Hamburger (Right side) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {/* Hamburger icon */}
        </button>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col items-center lg:hidden relative">
        <img
          src={profileImage}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-2 border-2"
        />
        <span className="font-semibold text-lg">{name}</span>
        <span className="text-md">{quote?.persian || ''}</span>
        <span className="font-semibold text-md">{'"' + quote?.owner + '"'}</span>

        {/* موجودی , برداشت  */}
        <div className="flex justify-between items-center w-full px-6 mt-2">
          <button className="bg-blue-600 text-white text-sm px-4 py-1 rounded-xl hover:bg-blue-700">
            برداشت
          </button>
          <span className="text-gray-600">موجودی: {formattedBalance}</span>
        </div>

        {/* Hamburger (Right, floating at top) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
        >
          {/* Hamburger icon */}
        </button>
      </div>
    </header>
  );
}
