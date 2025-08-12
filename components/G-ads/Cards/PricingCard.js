import React from "react";
import num2persian from "num2persian";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Style from "../../styles/g-ads/pricing-card.module.css"

const PricingCard = ({
    description,
    price,
    originalPrice,
    type,
    buttonText,
    active,
    features = [], // ✅ NEW: expects an array of {label, value}
    onButtonClick = () => { },
}) => {
    const formattedPrice = price ? num2persian(price) : "";

    return (
        <div
            className="flex-[0_0_auto] px-2"
            dir="rtl"
            style={{
                aspectRatio: "4 / 3",   // Width:Height ratio
                width: "100%",          // full width of container or flex basis
                maxWidth: "320px",      // optional max width limit
            }}
        >
            <div className="relative z-10 mb-10 overflow-hidden rounded-[10px] border-2 border-stroke bg-white px-8 py-8 shadow-pricing dark:border-dark-3 dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-[50px]">
                <span className="mb-3 block text-lg font-semibold text-primary text-right">
                    {type}
                </span>

                <h2 className="mb-3 text-3xl font-bold text-dark dark:text-white text-right flex flex-col break-words leading-snug">
                    {originalPrice && originalPrice !== price && (
                        <span className="text-base text-red-500 line-through ml-2">
                            {num2persian(originalPrice)}
                        </span>
                    )}
                    {formattedPrice} <span className="text-sm text-gray-600">تومان</span>
                </h2>

                <p className="mb-8 border-b border-stroke pb-4 text-base text-body-color dark:border-dark-3 dark:text-dark-6 text-right">
                    {description}
                </p>

                {/* ✅ Features list */}
                <div className="mb-4 flex flex-col gap-2">
                    {features.map(({ label, value }, index) => {
                        const isFalse = value === false;
                        const isNumber = typeof value === "number";
                        const isString = typeof value === "string";

                        return (
                            <div
                                key={index}
                                className="flex justify-between items-center text-right text-sm text-dark dark:text-white border-b border-gray-100 pb-1"
                            >
                                <span className={`${isFalse ? "line-through text-gray-400" : ""}`}>
                                    {label}
                                </span>

                                <span className="text-left whitespace-nowrap flex items-center justify-end gap-1">
                                    {isFalse ? (
                                        <CancelIcon className="text-red-500" fontSize="small" />
                                    ) : isNumber ? (
                                        (value)
                                    ) : isString ? (
                                        value
                                    ) : (
                                        <CheckCircleIcon className="text-green-500" fontSize="small" />
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <button
                    onClick={onButtonClick}
                    className={`${Style['button']} text-center border border-primary text-base font-medium transition block w-full rounded-md p-3
                        }`}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};


export default PricingCard;
