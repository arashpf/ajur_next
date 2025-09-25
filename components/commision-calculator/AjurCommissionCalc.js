// pages/ajur-commission.jsx
import { useState, useRef } from "react";
import Head from "next/head";
import AjurCommissionCalculator from "./AjurCommissionCalculator";

/* -------------------------
   COMMISSION / CITIES DATA
   (unchanged logic from your RN code)
   -------------------------*/
const COMMISSION_REGIONS = [
  {
    region_id: "tehran",
    display_name: "تهران",
    commission_scheme: {
      type: "percentage",
      per_side: true,
      tiers: [{ up_to: null, percent: 0.25 }],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
  {
    region_id: "isfahan",
    display_name: "اصفهان",
    commission_scheme: {
      type: "tiered",
      per_side: true,
      tiers: [
        { up_to: 2000000000, percent: 0.5 },
        { up_to: null, percent: 0.25 },
      ],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
  {
    region_id: "mashhad",
    display_name: "مشهد",
    commission_scheme: {
      type: "tiered",
      per_side: true,
      tiers: [
        { up_to: 3000000000, percent: 0.3 },
        { up_to: null, percent: 0.2 },
      ],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
  {
    region_id: "shiraz",
    display_name: "شیراز",
    commission_scheme: {
      type: "percentage",
      per_side: true,
      tiers: [{ up_to: null, percent: 0.3 }],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
  {
    region_id: "robatkarim",
    display_name: "رباط‌کریم",
    commission_scheme: {
      type: "percentage",
      per_side: true,
      tiers: [{ up_to: null, percent: 0.75 }],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
  {
    region_id: "parand",
    display_name: "پرند",
    commission_scheme: {
      type: "tiered",
      per_side: true,
      tiers: [
        { up_to: 1500000000, percent: 0.7 },
        { up_to: null, percent: 0.35 },
      ],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
  {
    region_id: "rasht",
    display_name: "رشت",
    commission_scheme: {
      type: "tiered",
      per_side: true,
      tiers: [
        { up_to: 2000000000, percent: 1 },
        { up_to: 4000000000, percent: 0.8 },
        { up_to: 6000000000, percent: 0.6 },
        { up_to: null, percent: 0.5 },
      ],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
];

const CITIES_DATA = [
  { id: "astaneh_ashrafiyeh", name: "آستانه اشرفیه" },
  { id: "rasht", name: "رشت" },
  { id: "mashhad", name: "مشهد" },
  { id: "lahijan", name: "لاهیجان" },
  { id: "chaf_chamkhaleh", name: "چاف و چمخاله" },
  { id: "masal", name: "ماسال" },
  { id: "ahvaz", name: "اهواز" },
  { id: "qom", name: "قم" },
  { id: "amol", name: "آمل" },
  { id: "eslamshahr", name: "اسلامشهر" },
  { id: "pakdasht", name: "پاکدشت" },
  { id: "chalus", name: "چالوس" },
  { id: "bumehen", name: "بومهن" },
  { id: "ramsar", name: "رامسر" },
  { id: "tehran", name: "تهران" },
  { id: "sari", name: "ساری" },
  { id: "damavand", name: "دماوند" },
  { id: "rudehen", name: "رودهن" },
  { id: "parand", name: "شهر جدید پرند" },
  { id: "robatkarim", name: "رباط کریم" },
  { id: "rey", name: "ری" },
  { id: "andisheh", name: "اندیشه" },
  { id: "shahriyar", name: "شهریار" },
  { id: "sabashahr", name: "صباشهر" },
  { id: "firoozkooh", name: "فیروزکوه" },
  { id: "qods", name: "قدس" },
  { id: "nowshahr", name: "نوشهر" },
  { id: "malard", name: "ملارد" },
  { id: "varamin", name: "ورامین" },
  { id: "isfahan", name: "اصفهان" },
  { id: "kish", name: "کیش" },
  { id: "kermanshah", name: "کرمانشاه" },
  { id: "shiraz", name: "شیراز" },
  { id: "yazd", name: "یزد" },
];

/* -------------------------
   Commission calculation (same as your RN logic)
   -------------------------*/
const calculateCommission = (payload) => {
  const { city, transactionType, price, deposit, rent, propertyType } = payload;

  let regionData = COMMISSION_REGIONS.find((r) => r.region_id === city);
  if (!regionData) {
    regionData = COMMISSION_REGIONS.find((r) => r.region_id === "tehran");
  }

  const scheme = regionData.commission_scheme;
  const isCommercial = propertyType === "commercial";

  let calculationAmount = 0;
  let monthlyRentForCalculation = 0;

  switch (transactionType) {
    case "sale":
      calculationAmount = price;
      break;
    case "rent": {
      const depositToRentConversion = deposit ? deposit * 0.03 : 0; // 3% of deposit as rent
      monthlyRentForCalculation = (rent || 0) + depositToRentConversion;
      calculationAmount = monthlyRentForCalculation;
      break;
    }
    default:
      calculationAmount = price;
  }

  const calculationAmountInRial = calculationAmount * 10;

  let baseCommission = 0;

  if (transactionType === "rent") {
    const commissionRate = isCommercial ? 1 / 3 : 1 / 4;
    baseCommission = calculationAmountInRial * commissionRate;
  } else {
    if (scheme.type === "percentage") {
      baseCommission =
        calculationAmountInRial * (scheme.tiers[0].percent / 100);
    } else if (scheme.type === "tiered") {
      let remaining = calculationAmountInRial;
      let previousCap = 0;
      for (const tier of scheme.tiers) {
        if (remaining <= 0) break;
        const tierCap = tier.up_to || remaining + previousCap;
        const tierAmount = Math.min(remaining, tierCap - previousCap);
        baseCommission += tierAmount * (tier.percent / 100);
        remaining -= tierAmount;
        previousCap = tierCap;
      }
    }
    if (isCommercial && scheme.commercial_multiplier) {
      baseCommission *= scheme.commercial_multiplier;
    }
  }

  const vatAmount = baseCommission * (scheme.vat_percent / 100);
  const totalCommission = baseCommission + vatAmount;

  const roundToThousand = (amount) => Math.round(amount / 10000) * 1000;

  return {
    base_commission: roundToThousand(baseCommission),
    vat_amount: roundToThousand(vatAmount),
    total_commission: roundToThousand(totalCommission),
    commission_percent_of_price:
      calculationAmount > 0
        ? (totalCommission / calculationAmountInRial) * 100
        : 0,
    region_name: regionData.display_name,
    monthly_rent_for_calculation: monthlyRentForCalculation,
  };
};

/* -------------------------
   Page Component
   -------------------------*/
export default function AjurCommissionPage() {
  const [formData, setFormData] = useState({
    city: "",
    transactionType: "sale",
    propertyType: "residential",
    price: "",
    deposit: "",
    rent: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [priceSuggestions, setPriceSuggestions] = useState([]);
  const [depositSuggestions, setDepositSuggestions] = useState([]);
  const [rentSuggestions, setRentSuggestions] = useState([]);

  const pageRef = useRef(null);

  const purpleColor = "#9C27B0";
  const purpleLight = "#E1BEE7";
  const purpleDark = "#7B1FA2";
  const purpleBg = "#F3E5F5";

  const AjurRed = '#bc323a'
  const redColor = "#D32F2F";
  const redLight = "#FFCDD2";
  const redDark = "#B71C1C";
  const redBg = "#FFEBEE";

  const formatToman = (val) => {
    const numberVal = Number(val.toString().replace(/,/g, ""));
    if (isNaN(numberVal)) return "۰ تومان";

    if (numberVal >= 1000000000000) {
        return (numberVal / 1000000000000).toLocaleString('fa') + ' تریلیون تومان';
    } else if (numberVal >= 1000000000) {
        return (numberVal / 1000000000).toLocaleString('fa') + ' میلیارد تومان';
    } else if (numberVal >= 1000000){
      return (numberVal / 1000000).toLocaleString('fa') + ' میلیون تومان';
    }
    return numberVal.toLocaleString('fa') + ' تومان';
};


  const transactionTypes = [
    { id: "sale", name: "فروش" },
    { id: "rent", name: "اجاره" },
  ];

  const propertyTypes = [
    { id: "residential", name: "مسکونی" },
    { id: "commercial", name: "تجاری" },
  ];

  // Helpers
  function formatNumber(value) {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function generatePriceSuggestions(value, field) {
    if (!value || value.length < 1) {
      if (field === "price") setPriceSuggestions([]);
      else if (field === "deposit") setDepositSuggestions([]);
      else if (field === "rent") setRentSuggestions([]);
      return;
    }

    const numericValue = value.replace(/[^0-9]/g, "");
    if (!numericValue) {
      if (field === "price") setPriceSuggestions([]);
      else if (field === "deposit") setDepositSuggestions([]);
      else if (field === "rent") setRentSuggestions([]);
      return;
    }

    const suggestions = [];
    const baseNumber = Number.parseInt(numericValue);

    if (baseNumber > 0) {
      if (field === "price") {
        if (baseNumber < 100) {
          suggestions.push({
            display: `${baseNumber} میلیارد تومان`,
            value: baseNumber.toString(),
          });
          if (baseNumber < 50) {
            suggestions.push({
              display: `${baseNumber * 10} میلیارد تومان`,
              value: (baseNumber * 10).toString(),
            });
          }
        }
      } else if (field === "deposit") {
        if (baseNumber < 100) {
          suggestions.push({
            display: `${baseNumber} میلیون تومان`,
            value: baseNumber.toString(),
          });
          suggestions.push({
            display: `${baseNumber * 10} میلیون تومان`,
            value: (baseNumber * 10).toString(),
          });
        }
      } else if (field === "rent") {
        if (baseNumber < 100) {
          suggestions.push({
            display: `${baseNumber} میلیون تومان`,
            value: baseNumber.toString(),
          });
          if (baseNumber < 50) {
            suggestions.push({
              display: `${baseNumber * 10} میلیون تومان`,
              value: (baseNumber * 10).toString(),
            });
          }
        }
      }
    }
  }

  function handleInputChange(field, rawValue) {
    if (field === "price" || field === "deposit" || field === "rent") {
      const numericValue = rawValue.replace(/[^0-9]/g, "");
      const formattedValue = formatNumber(numericValue);
      setFormData((prev) => ({ ...prev, [field]: formattedValue }));
      generatePriceSuggestions(numericValue, field);
    } else {
      setFormData((prev) => ({ ...prev, [field]: rawValue }));
    }
  }

  function selectSuggestion(suggestion, field) {
    const formattedValue = formatNumber(suggestion.value);
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    if (field === "price") setPriceSuggestions([]);
    else if (field === "deposit") setDepositSuggestions([]);
    else if (field === "rent") setRentSuggestions([]);
  }

  function formatCurrency(amount) {
    if (!amount) return "0 تومان";
    return `${Math.round(amount).toLocaleString()} تومان`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Validation based on transaction type
    if (!formData.city) {
      setError("لطفاً شهر را وارد کنید");
      return;
    }

    if (formData.transactionType === "sale" && !formData.price) {
      setError("لطفاً قیمت ملک را وارد کنید");
      return;
    }

    if (
      formData.transactionType === "rent" &&
      !formData.deposit &&
      !formData.rent
    ) {
      setError("لطفاً ودیعه یا اجاره ماهانه را وارد کنید");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const priceInToman = formData.price
        ? Number.parseFloat(formData.price.replace(/,/g, ""))
        : 0;
      const depositInToman = formData.deposit
        ? Number.parseFloat(formData.deposit.replace(/,/g, ""))
        : 0;
      const rentInToman = formData.rent
        ? Number.parseFloat(formData.rent.replace(/,/g, ""))
        : 0;

      const calculationResult = calculateCommission({
        city: formData.city,
        transactionType: formData.transactionType,
        price: priceInToman,
        deposit: depositInToman,
        rent: rentInToman,
        propertyType: formData.propertyType,
      });

      setResult(calculationResult);

      // Scroll to bottom to show results
      setTimeout(() => {
        pageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    } catch (err) {
      console.error("Commission calculation error:", err);
      setError("خطا در محاسبه کمیسیون");
    } finally {
      setLoading(false);
    }
  }

  function handleRecalculate(e) {
    e.preventDefault();
    setResult(null);
    setFormData({
      city: "",
      transactionType: "sale",
      propertyType: "residential",
      price: "",
      deposit: "",
      rent: "",
    });

    // Scroll back to top
    setTimeout(() => {
      pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function SuggestionDropdown({ suggestions, field }) {
    if (!suggestions || suggestions.length === 0) return null;
    return (
      <div className="absolute top-[calc(100%+10px)] left-0 right-0 z-40 bg-white/95 rounded-xl border border-red-200 shadow-lg">
        {suggestions.map((s, i) => (
          <button
            key={i}
            type="button"
            className="w-full text-right px-3 py-2 text-sm hover:bg-red-50 flex gap-1"
            onClick={() => selectSuggestion(s, field)}
          >
            <span className="text-gray-500">منظورتان </span>
            <strong style={{ color: redColor }}>{s.display}</strong>
            <span className="text-gray-500"> هست؟</span>
          </button>
        ))}
      </div>
    );
  }

 return (
  <>
    <Head>
      <title>محاسبه‌گر کمیسیون — آجر</title>
    </Head>

    <div
      ref={pageRef}
      dir="rtl"
      className="min-h-screen bg-gray-50 px-4 py-10 font-[Vazir] text-gray-900"
    >
      <main className="max-w-3xl mx-auto bg-white/95 border border-red-200 rounded-2xl shadow-xl p-7">
        <h1 className="text-[#bc323a] text-2xl font-bold text-center mb-2">
          محاسبه‌گر کمیسیون
        </h1>
        <p className="text-gray-600 text-sm text-center mb-5">
          این ماشین‌حساب یک ابزار آزمایشی است. آجر هیچ گونه مسئولیتی در قبال
          عدم درستی کمیسیون‌ها قبول نمی‌کند. نرخ مصوب و عرف بازار ممکن است
          متفاوت باشد.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg text-[#bc323a] text-center p-3 mb-4">
            <strong>{error}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* city */}
          <div>
            <label className="block font-bold text-[#bc323a] mb-1 text-right">
              شهر *
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full h-12 px-3 rounded-xl border border-red-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#bc323a]"
            >
              <option value="">انتخاب شهر...</option>
              {CITIES_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* transaction type */}
          <div>
            <label className="block font-bold text-[#bc323a] mb-1">
              نوع معامله
            </label>
            <select
              value={formData.transactionType}
              onChange={(e) =>
                handleInputChange("transactionType", e.target.value)
              }
              className="w-full h-12 px-3 rounded-xl border border-red-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#bc323a]"
            >
              {transactionTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* property type */}
          <div>
            <label className="block font-bold text-[#bc323a] mb-1">
              نوع ملک
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) =>
                handleInputChange("propertyType", e.target.value)
              }
              className="w-full h-12 px-3 rounded-xl border border-red-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#bc323a]"
            >
              {propertyTypes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* price */}
          {formData.transactionType === "sale" && (
            <div className="relative">
              <label className="block font-bold text-[#bc323a] mb-1">
                قیمت ملک * - {formatToman(formData.price)}
              </label>
              <input
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="مثال: 2,000,000,000"
                className="w-full px-3 py-3 rounded-xl bg-white border border-red-200 text-sm outline-none focus:ring-2 focus:ring-[#bc323a] text-right"
              />
              <SuggestionDropdown
                suggestions={priceSuggestions}
                field="price"
              />
            </div>
          )}

          {/* rent */}
          {formData.transactionType === "rent" && (
            <>
              <div className="relative">
                <label className="block font-bold text-[#bc323a] mb-1">
                  ودیعه - تومان
                </label>
                <input
                  value={formData.deposit}
                  onChange={(e) =>
                    handleInputChange("deposit", e.target.value)
                  }
                  placeholder="مثال: 100,000,000"
                  className="w-full px-3 py-3 rounded-xl border bg-white border-red-200 text-sm outline-none focus:ring-2 focus:ring-[#bc323a] text-right"
                />
                <SuggestionDropdown
                  suggestions={depositSuggestions}
                  field="deposit"
                />
              </div>
              <div className="relative">
                <label className="block font-bold text-[#bc323a] mb-1">
                  اجاره ماهانه - تومان
                </label>
                <input
                  value={formData.rent}
                  onChange={(e) => handleInputChange("rent", e.target.value)}
                  placeholder="مثال: 5,000,000"
                  className="w-full px-3 py-3 bg-white rounded-xl border border-red-200 text-sm outline-none focus:ring-2 focus:ring-[#bc323a] text-right"
                />
                <SuggestionDropdown
                  suggestions={rentSuggestions}
                  field="rent"
                />
              </div>
            </>
          )}

          {/* actions */}
          <div className="mt-2 flex gap-3">
            {!!!0 ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white bg-[#bc323a] hover:bg-[#a82c32] disabled:opacity-50"
              >
                {loading ? "در حال محاسبه..." : "محاسبه کمیسیون"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRecalculate}
                className="w-full py-3 rounded-xl font-bold text-white bg-[#bc323a] hover:bg-[#a82c32]"
              >
                محاسبه مجدد
              </button>
            )}
          </div>
        </form>

        {/* results */}
        {result && (
          <section id="results" className="mt-6 space-y-3">
            <h2 className="text-lg font-bold text-gray-700 mb-2">
              نتایج محاسبه کمیسیون هر طرف
            </h2>

            <div className="bg-white rounded-lg border border-red-100 shadow-sm p-3 flex justify-between">
              <span className="text-gray-500 text-right text-md">منطقه:</span>
              <span className="text-[#bc323a] text-right font-bold">
                {result.region_name}
              </span>
            </div>

            {formData.transactionType === "rent" &&
              result.monthly_rent_for_calculation > 0 && (
                <div className="bg-white rounded-lg border border-red-100 shadow-sm p-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-md">
                      مبلغ اجاره محاسباتی:
                    </span>
                    <span className="text-[#bc323a] font-bold">
                      {formatCurrency(result.monthly_rent_for_calculation)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    (شامل اجاره ماهیانه + تبدیل ودیعه به اجاره)
                  </p>
                </div>
              )}

            <div className="bg-white rounded-lg border border-red-100 shadow-sm p-3">
              <div className="flex justify-between">
                <span className="text-gray-500 text-md">کمیسیون پایه:</span>
                <span className="text-[#bc323a] font-bold">
                  {formatCurrency(result.base_commission)}
                </span>
              </div>
              {formData.transactionType === "rent" && (
                <p className="text-gray-500 text-xs mt-1">
                  (
                  {formData.propertyType === "commercial" ? "یک سوم" : "یک چهارم"}{" "}
                  از اجاره محاسباتی)
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg border border-red-100 shadow-sm p-3 flex justify-between">
              <span className="text-gray-500 text-md">مالیات (۹٪):</span>
              <span className="text-[#bc323a] font-bold">
                {formatCurrency(result.vat_amount)}
              </span>
            </div>

            <div className="bg-white rounded-lg border border-red-100 shadow-sm p-3 flex justify-between">
              <span className="text-gray-500 text-md">درصد از قیمت:</span>
              <span className="text-[#bc323a] font-bold">
                {result.commission_percent_of_price?.toFixed(3)}%
              </span>
            </div>

            <div className="bg-red-100 border-2 border-[#bc323a] rounded-lg p-4 flex justify-between">
              <span className="text-[#bc323a] font-bold">کل کمیسیون:</span>
              <span className="text-[#bc323a] font-bold">
                {formatCurrency(result.total_commission)}
              </span>
            </div>
          </section>
        )}
      </main>
    </div>
  </>
);

}
