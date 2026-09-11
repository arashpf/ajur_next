// pages/assistant/comissioncalc.jsx

import { useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";

const SITE_URL = "https://ajur.app";
const CANONICAL_URL = `${SITE_URL}/assistant/comissioncalc`;

/*
|--------------------------------------------------------------------------
| Commission configuration
|--------------------------------------------------------------------------
|
| توجه:
| نرخ‌ها و فرمول‌های زیر باید هنگام تغییر تعرفه‌ها به‌روزرسانی شوند.
| تمام مبالغ ورودی و خروجی این فایل بر حسب تومان هستند.
|
*/

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
        { up_to: 2_000_000_000, percent: 0.5 },
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
        { up_to: 3_000_000_000, percent: 0.3 },
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
    display_name: "شهر جدید پرند",
    commission_scheme: {
      type: "tiered",
      per_side: true,
      tiers: [
        { up_to: 1_500_000_000, percent: 0.7 },
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
        { up_to: 2_000_000_000, percent: 1 },
        { up_to: 4_000_000_000, percent: 0.8 },
        { up_to: 6_000_000_000, percent: 0.6 },
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

const TRANSACTION_TYPES = [
  { id: "sale", name: "خرید و فروش" },
  { id: "rent", name: "رهن و اجاره" },
];

const PROPERTY_TYPES = [
  { id: "residential", name: "مسکونی" },
  { id: "commercial", name: "تجاری" },
];

const FAQ_ITEMS = [
  {
    question: "کمیسیون املاک چگونه محاسبه می‌شود؟",
    answer:
      "حق کمیسیون بر اساس نوع معامله، مبلغ خرید یا فروش، مبلغ ودیعه، اجاره ماهانه، نوع کاربری ملک و نرخ تعریف‌شده برای شهر انتخابی محاسبه می‌شود.",
  },
  {
    question: "کمیسیون خرید و فروش ملک را چه کسی پرداخت می‌کند؟",
    answer:
      "در حالت معمول، هر کدام از طرفین معامله سهم کمیسیون مربوط به خود را پرداخت می‌کنند. خروجی این ماشین حساب نیز کمیسیون هر طرف معامله را نمایش می‌دهد.",
  },
  {
    question: "کمیسیون رهن و اجاره چگونه محاسبه می‌شود؟",
    answer:
      "در این ابزار، بخشی از مبلغ ودیعه به اجاره محاسباتی تبدیل و با اجاره ماهانه جمع می‌شود. سپس کمیسیون پایه و مالیات بر اساس مبلغ حاصل محاسبه می‌شود.",
  },
  {
    question: "آیا مالیات به مبلغ کمیسیون اضافه می‌شود؟",
    answer:
      "بله. این ابزار مالیات را جداگانه محاسبه کرده و سپس آن را به کمیسیون پایه اضافه می‌کند. نرخ قابل اجرا ممکن است بر اساس مقررات و زمان معامله تغییر کند.",
  },
  {
    question: "آیا نتیجه محاسبه‌گر کمیسیون آجر قطعی است؟",
    answer:
      "خیر. نتیجه این ابزار تقریبی و صرفاً برای راهنمایی است. برای تعیین مبلغ قطعی باید تعرفه معتبر شهر، نوع قرارداد و شرایط واقعی معامله بررسی شود.",
  },
];

/*
|--------------------------------------------------------------------------
| Structured data
|--------------------------------------------------------------------------
*/

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "محاسبه‌گر آنلاین کمیسیون املاک آجر",
  alternateName: [
    "ماشین حساب کمیسیون املاک",
    "محاسبه حق کمیسیون بنگاه",
  ],
  url: CANONICAL_URL,
  description:
    "ابزار آنلاین محاسبه حق کمیسیون خرید، فروش، رهن و اجاره املاک به همراه مالیات و نمایش سهم هر طرف معامله.",
  applicationCategory: "FinanceApplication",
  applicationSubCategory: "RealEstateCommissionCalculator",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript",
  inLanguage: "fa-IR",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "IRR",
  },
  provider: {
    "@type": "Organization",
    name: "آجر",
    url: SITE_URL,
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "آجر",
      item: `${SITE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "دستیار املاک",
      item: `${SITE_URL}/assistant`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "محاسبه کمیسیون املاک",
      item: CANONICAL_URL,
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

/*
|--------------------------------------------------------------------------
| Utility functions
|--------------------------------------------------------------------------
*/

function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function parseNumber(value) {
  if (value === null || value === undefined) return 0;

  const normalizedValue = String(value).replace(/[^0-9]/g, "");
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function formatNumber(value) {
  const numericValue = String(value ?? "").replace(/[^0-9]/g, "");

  if (!numericValue) return "";

  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "۰ تومان";
  }

  return `${Math.round(numericAmount).toLocaleString("fa-IR")} تومان`;
}

function formatToman(value) {
  const numberValue = parseNumber(value);

  if (!numberValue) return "۰ تومان";

  if (numberValue >= 1_000_000_000_000) {
    return `${(numberValue / 1_000_000_000_000).toLocaleString(
      "fa-IR",
      {
        maximumFractionDigits: 2,
      }
    )} تریلیون تومان`;
  }

  if (numberValue >= 1_000_000_000) {
    return `${(numberValue / 1_000_000_000).toLocaleString("fa-IR", {
      maximumFractionDigits: 2,
    })} میلیارد تومان`;
  }

  if (numberValue >= 1_000_000) {
    return `${(numberValue / 1_000_000).toLocaleString("fa-IR", {
      maximumFractionDigits: 2,
    })} میلیون تومان`;
  }

  if (numberValue >= 1_000) {
    return `${(numberValue / 1_000).toLocaleString("fa-IR", {
      maximumFractionDigits: 2,
    })} هزار تومان`;
  }

  return `${numberValue.toLocaleString("fa-IR")} تومان`;
}

function roundToThousand(amount) {
  return Math.round(amount / 1000) * 1000;
}

/*
|--------------------------------------------------------------------------
| Commission calculation
|--------------------------------------------------------------------------
|
| تمام مبالغ این تابع بر حسب تومان هستند.
|
*/

function calculateCommission(payload) {
  const {
    city,
    transactionType,
    price,
    deposit,
    rent,
    propertyType,
  } = payload;

  let regionData = COMMISSION_REGIONS.find(
    (region) => region.region_id === city
  );

  /*
   * اگر برای شهر انتخابی نرخ جداگانه تعریف نشده باشد،
   * فعلاً نرخ تهران به‌عنوان نرخ پیش‌فرض استفاده می‌شود.
   */
  if (!regionData) {
    regionData = COMMISSION_REGIONS.find(
      (region) => region.region_id === "tehran"
    );
  }

  const scheme = regionData.commission_scheme;
  const isCommercial = propertyType === "commercial";

  let calculationAmount = 0;
  let monthlyRentForCalculation = 0;
  let baseCommission = 0;

  if (transactionType === "rent") {
    /*
     * تبدیل ودیعه به اجاره محاسباتی:
     * ۳ درصد مبلغ ودیعه + اجاره ماهانه
     */
    const depositToRentConversion = deposit > 0 ? deposit * 0.03 : 0;

    monthlyRentForCalculation =
      (rent || 0) + depositToRentConversion;

    calculationAmount = monthlyRentForCalculation;

    const commissionRate = isCommercial ? 1 / 3 : 1 / 4;

    baseCommission = calculationAmount * commissionRate;
  } else {
    calculationAmount = price || 0;

    if (scheme.type === "percentage") {
      const firstTier = scheme.tiers[0];

      baseCommission =
        calculationAmount * (firstTier.percent / 100);
    }

    if (scheme.type === "tiered") {
      let remainingAmount = calculationAmount;
      let previousCap = 0;

      for (const tier of scheme.tiers) {
        if (remainingAmount <= 0) break;

        if (tier.up_to === null) {
          baseCommission +=
            remainingAmount * (tier.percent / 100);

          remainingAmount = 0;
          break;
        }

        const currentTierCapacity = tier.up_to - previousCap;

        const currentTierAmount = Math.min(
          remainingAmount,
          currentTierCapacity
        );

        baseCommission +=
          currentTierAmount * (tier.percent / 100);

        remainingAmount -= currentTierAmount;
        previousCap = tier.up_to;
      }
    }

    if (isCommercial && scheme.commercial_multiplier) {
      baseCommission *= scheme.commercial_multiplier;
    }
  }

  const vatAmount =
    baseCommission * (scheme.vat_percent / 100);

  const totalCommission = baseCommission + vatAmount;

  return {
    base_commission: roundToThousand(baseCommission),
    vat_amount: roundToThousand(vatAmount),
    total_commission: roundToThousand(totalCommission),
    commission_percent_of_price:
      calculationAmount > 0
        ? (totalCommission / calculationAmount) * 100
        : 0,
    region_name: regionData.display_name,
    monthly_rent_for_calculation: monthlyRentForCalculation,
    vat_percent: scheme.vat_percent,
  };
}

/*
|--------------------------------------------------------------------------
| Suggestion dropdown
|--------------------------------------------------------------------------
*/

function SuggestionDropdown({
  suggestions,
  field,
  onSelect,
}) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute top-[calc(100%+8px)] left-0 right-0 z-40 overflow-hidden rounded-xl border border-red-200 bg-white shadow-xl"
      role="listbox"
      aria-label="پیشنهاد مبلغ"
    >
      {suggestions.map((suggestion) => (
        <button
          key={`${field}-${suggestion.value}`}
          type="button"
          role="option"
          className="flex w-full items-center gap-1 border-b border-gray-100 px-3 py-3 text-right text-sm last:border-b-0 hover:bg-red-50"
          onClick={() => onSelect(suggestion, field)}
        >
          <span className="text-gray-500">منظورتان</span>

          <strong className="text-[#bc323a]">
            {suggestion.display}
          </strong>

          <span className="text-gray-500">است؟</span>
        </button>
      ))}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Page component
|--------------------------------------------------------------------------
*/

export default function AjurCommissionPage() {
  const initialFormData = {
    city: "",
    transactionType: "sale",
    propertyType: "residential",
    price: "",
    deposit: "",
    rent: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [priceSuggestions, setPriceSuggestions] = useState([]);
  const [depositSuggestions, setDepositSuggestions] = useState([]);
  const [rentSuggestions, setRentSuggestions] = useState([]);

  const pageRef = useRef(null);
  const resultRef = useRef(null);

  function clearSuggestions(field) {
    if (field === "price") {
      setPriceSuggestions([]);
    }

    if (field === "deposit") {
      setDepositSuggestions([]);
    }

    if (field === "rent") {
      setRentSuggestions([]);
    }
  }

  function setSuggestions(field, suggestions) {
    if (field === "price") {
      setPriceSuggestions(suggestions);
    }

    if (field === "deposit") {
      setDepositSuggestions(suggestions);
    }

    if (field === "rent") {
      setRentSuggestions(suggestions);
    }
  }

  function generatePriceSuggestions(value, field) {
    const numericValue = String(value).replace(/[^0-9]/g, "");

    if (!numericValue) {
      clearSuggestions(field);
      return;
    }

    const baseNumber = Number.parseInt(numericValue, 10);

    if (!Number.isFinite(baseNumber) || baseNumber <= 0) {
      clearSuggestions(field);
      return;
    }

    const suggestions = [];

    if (field === "price" && baseNumber < 1000) {
      suggestions.push({
        display: `${baseNumber.toLocaleString(
          "fa-IR"
        )} میلیارد تومان`,
        value: baseNumber * 1_000_000_000,
      });

      if (baseNumber < 50) {
        suggestions.push({
          display: `${(baseNumber * 10).toLocaleString(
            "fa-IR"
          )} میلیارد تومان`,
          value: baseNumber * 10 * 1_000_000_000,
        });
      }
    }

    if (field === "deposit" && baseNumber < 1000) {
      suggestions.push({
        display: `${baseNumber.toLocaleString(
          "fa-IR"
        )} میلیون تومان`,
        value: baseNumber * 1_000_000,
      });

      suggestions.push({
        display: `${(baseNumber * 10).toLocaleString(
          "fa-IR"
        )} میلیون تومان`,
        value: baseNumber * 10 * 1_000_000,
      });
    }

    if (field === "rent" && baseNumber < 1000) {
      suggestions.push({
        display: `${baseNumber.toLocaleString(
          "fa-IR"
        )} میلیون تومان`,
        value: baseNumber * 1_000_000,
      });

      if (baseNumber < 50) {
        suggestions.push({
          display: `${(baseNumber * 10).toLocaleString(
            "fa-IR"
          )} میلیون تومان`,
          value: baseNumber * 10 * 1_000_000,
        });
      }
    }

    setSuggestions(field, suggestions);
  }

  function handleInputChange(field, rawValue) {
    setError("");
    setResult(null);

    if (
      field === "price" ||
      field === "deposit" ||
      field === "rent"
    ) {
      const numericValue = String(rawValue).replace(
        /[^0-9]/g,
        ""
      );

      setFormData((previousValue) => ({
        ...previousValue,
        [field]: formatNumber(numericValue),
      }));

      generatePriceSuggestions(numericValue, field);
      return;
    }

    setFormData((previousValue) => {
      const nextValue = {
        ...previousValue,
        [field]: rawValue,
      };

      if (field === "transactionType") {
        if (rawValue === "sale") {
          nextValue.deposit = "";
          nextValue.rent = "";
          setDepositSuggestions([]);
          setRentSuggestions([]);
        } else {
          nextValue.price = "";
          setPriceSuggestions([]);
        }
      }

      return nextValue;
    });
  }

  function selectSuggestion(suggestion, field) {
    setFormData((previousValue) => ({
      ...previousValue,
      [field]: formatNumber(suggestion.value),
    }));

    clearSuggestions(field);
    setError("");
    setResult(null);
  }

  function validateForm() {
    if (!formData.city) {
      return "لطفاً شهر را انتخاب کنید.";
    }

    if (
      formData.transactionType === "sale" &&
      parseNumber(formData.price) <= 0
    ) {
      return "لطفاً قیمت صحیح ملک را وارد کنید.";
    }

    if (
      formData.transactionType === "rent" &&
      parseNumber(formData.deposit) <= 0 &&
      parseNumber(formData.rent) <= 0
    ) {
      return "لطفاً مبلغ ودیعه یا اجاره ماهانه را وارد کنید.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setPriceSuggestions([]);
    setDepositSuggestions([]);
    setRentSuggestions([]);

    try {
      const calculationResult = calculateCommission({
        city: formData.city,
        transactionType: formData.transactionType,
        propertyType: formData.propertyType,
        price: parseNumber(formData.price),
        deposit: parseNumber(formData.deposit),
        rent: parseNumber(formData.rent),
      });

      setResult(calculationResult);

      window.setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (calculationError) {
      console.error(
        "Commission calculation error:",
        calculationError
      );

      setError(
        "در محاسبه کمیسیون خطایی رخ داد. لطفاً دوباره تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleRecalculate() {
    setResult(null);
    setError("");
    setFormData(initialFormData);
    setPriceSuggestions([]);
    setDepositSuggestions([]);
    setRentSuggestions([]);

    window.setTimeout(() => {
      pageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  return (
    <>
      <Head>
        <title>
          محاسبه آنلاین کمیسیون املاک | ماشین حساب آجر
        </title>

        <meta
          name="description"
          content="محاسبه آنلاین کمیسیون املاک برای خرید، فروش، رهن و اجاره. شهر و مبلغ معامله را وارد کنید و کمیسیون هر طرف و مالیات را مشاهده کنید."
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        />

        <link rel="canonical" href={CANONICAL_URL} />

        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="آجر" />

        <meta
          property="og:title"
          content="محاسبه آنلاین کمیسیون املاک | آجر"
        />

        <meta
          property="og:description"
          content="ماشین حساب آنلاین حق کمیسیون خرید، فروش، رهن و اجاره ملک به همراه مالیات و سهم هر طرف معامله."
        />

        <meta property="og:url" content={CANONICAL_URL} />

        <meta name="twitter:card" content="summary" />

        <meta
          name="twitter:title"
          content="محاسبه آنلاین کمیسیون املاک | آجر"
        />

        <meta
          name="twitter:description"
          content="محاسبه حق کمیسیون خرید، فروش، رهن و اجاره ملک به همراه مالیات."
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(webApplicationSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(breadcrumbSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(faqSchema),
          }}
        />
      </Head>

      <div
        ref={pageRef}
        dir="rtl"
        className="min-h-screen bg-gray-50 px-4 py-10 font-[Vazir] text-gray-900"
      >
        <div className="mx-auto mb-4 max-w-3xl text-sm text-gray-500">
          <nav aria-label="مسیر صفحه">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-[#bc323a]"
                >
                  آجر
                </Link>
              </li>

              <li aria-hidden="true">/</li>

              <li>
                <Link
                  href="/assistant"
                  className="transition-colors hover:text-[#bc323a]"
                >
                  دستیار املاک
                </Link>
              </li>

              <li aria-hidden="true">/</li>

              <li
                className="text-gray-700"
                aria-current="page"
              >
                محاسبه کمیسیون املاک
              </li>
            </ol>
          </nav>
        </div>

        <main className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white/95 p-5 shadow-xl sm:p-7">
          <header className="mb-6 text-center">
            <h1 className="mb-3 text-2xl font-bold leading-10 text-[#bc323a] sm:text-3xl">
              محاسبه آنلاین کمیسیون املاک
            </h1>

            <p className="mx-auto mb-3 max-w-2xl text-sm leading-7 text-gray-700 sm:text-base">
              با ماشین حساب کمیسیون املاک آجر می‌توانید
              حق کمیسیون خرید، فروش، رهن و اجاره ملک را
              برای هر طرف معامله محاسبه کنید.
            </p>

            <p className="mx-auto max-w-2xl rounded-xl bg-red-50 p-3 text-xs leading-6 text-gray-600">
              نتیجه این ابزار تقریبی است. نرخ‌ها، مالیات،
              تعرفه شهرها و شرایط قرارداد ممکن است متفاوت
              یا متغیر باشند. برای تعیین مبلغ قطعی، تعرفه
              معتبر شهر محل معامله را بررسی کنید.
            </p>
          </header>

          {error && (
            <div
              className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-[#bc323a]"
              role="alert"
            >
              <strong>{error}</strong>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid gap-4"
            noValidate
          >
            <div>
              <label
                htmlFor="commission-city"
                className="mb-1 block text-right font-bold text-[#bc323a]"
              >
                شهر <span aria-hidden="true">*</span>
              </label>

              <select
                id="commission-city"
                name="city"
                value={formData.city}
                onChange={(event) =>
                  handleInputChange("city", event.target.value)
                }
                required
                className="h-12 w-full rounded-xl border border-red-200 bg-white px-3 text-sm outline-none focus:border-[#bc323a] focus:ring-2 focus:ring-red-100"
              >
                <option value="">انتخاب شهر...</option>

                {CITIES_DATA.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="transaction-type"
                className="mb-1 block font-bold text-[#bc323a]"
              >
                نوع معامله
              </label>

              <select
                id="transaction-type"
                name="transactionType"
                value={formData.transactionType}
                onChange={(event) =>
                  handleInputChange(
                    "transactionType",
                    event.target.value
                  )
                }
                className="h-12 w-full rounded-xl border border-red-200 bg-white px-3 text-sm outline-none focus:border-[#bc323a] focus:ring-2 focus:ring-red-100"
              >
                {TRANSACTION_TYPES.map((transactionType) => (
                  <option
                    key={transactionType.id}
                    value={transactionType.id}
                  >
                    {transactionType.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="property-type"
                className="mb-1 block font-bold text-[#bc323a]"
              >
                نوع ملک
              </label>

              <select
                id="property-type"
                name="propertyType"
                value={formData.propertyType}
                onChange={(event) =>
                  handleInputChange(
                    "propertyType",
                    event.target.value
                  )
                }
                className="h-12 w-full rounded-xl border border-red-200 bg-white px-3 text-sm outline-none focus:border-[#bc323a] focus:ring-2 focus:ring-red-100"
              >
                {PROPERTY_TYPES.map((propertyType) => (
                  <option
                    key={propertyType.id}
                    value={propertyType.id}
                  >
                    {propertyType.name}
                  </option>
                ))}
              </select>
            </div>

            {formData.transactionType === "sale" && (
              <div className="relative">
                <label
                  htmlFor="property-price"
                  className="mb-1 block font-bold text-[#bc323a]"
                >
                  قیمت ملک به تومان{" "}
                  <span aria-hidden="true">*</span>
                </label>

                <p className="mb-2 text-xs text-gray-500">
                  مبلغ واردشده: {formatToman(formData.price)}
                </p>

                <input
                  id="property-price"
                  name="price"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={formData.price}
                  onChange={(event) =>
                    handleInputChange(
                      "price",
                      event.target.value
                    )
                  }
                  onBlur={() => {
                    window.setTimeout(
                      () => setPriceSuggestions([]),
                      150
                    );
                  }}
                  placeholder="مثال: 2,000,000,000"
                  aria-describedby="property-price-help"
                  className="w-full rounded-xl border border-red-200 bg-white px-3 py-3 text-right text-sm outline-none focus:border-[#bc323a] focus:ring-2 focus:ring-red-100"
                />

                <span
                  id="property-price-help"
                  className="sr-only"
                >
                  قیمت کامل ملک را بر حسب تومان وارد کنید.
                </span>

                <SuggestionDropdown
                  suggestions={priceSuggestions}
                  field="price"
                  onSelect={selectSuggestion}
                />
              </div>
            )}

            {formData.transactionType === "rent" && (
              <>
                <div className="relative">
                  <label
                    htmlFor="property-deposit"
                    className="mb-1 block font-bold text-[#bc323a]"
                  >
                    مبلغ ودیعه به تومان
                  </label>

                  <p className="mb-2 text-xs text-gray-500">
                    مبلغ واردشده:{" "}
                    {formatToman(formData.deposit)}
                  </p>

                  <input
                    id="property-deposit"
                    name="deposit"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={formData.deposit}
                    onChange={(event) =>
                      handleInputChange(
                        "deposit",
                        event.target.value
                      )
                    }
                    onBlur={() => {
                      window.setTimeout(
                        () => setDepositSuggestions([]),
                        150
                      );
                    }}
                    placeholder="مثال: 100,000,000"
                    className="w-full rounded-xl border border-red-200 bg-white px-3 py-3 text-right text-sm outline-none focus:border-[#bc323a] focus:ring-2 focus:ring-red-100"
                  />

                  <SuggestionDropdown
                    suggestions={depositSuggestions}
                    field="deposit"
                    onSelect={selectSuggestion}
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="monthly-rent"
                    className="mb-1 block font-bold text-[#bc323a]"
                  >
                    اجاره ماهانه به تومان
                  </label>

                  <p className="mb-2 text-xs text-gray-500">
                    مبلغ واردشده:{" "}
                    {formatToman(formData.rent)}
                  </p>

                  <input
                    id="monthly-rent"
                    name="rent"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={formData.rent}
                    onChange={(event) =>
                      handleInputChange(
                        "rent",
                        event.target.value
                      )
                    }
                    onBlur={() => {
                      window.setTimeout(
                        () => setRentSuggestions([]),
                        150
                      );
                    }}
                    placeholder="مثال: 5,000,000"
                    className="w-full rounded-xl border border-red-200 bg-white px-3 py-3 text-right text-sm outline-none focus:border-[#bc323a] focus:ring-2 focus:ring-red-100"
                  />

                  <SuggestionDropdown
                    suggestions={rentSuggestions}
                    field="rent"
                    onSelect={selectSuggestion}
                  />
                </div>
              </>
            )}

            <div className="mt-2 flex gap-3">
              {!result ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#bc323a] py-3 font-bold text-white transition-colors hover:bg-[#a82c32] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "در حال محاسبه..."
                    : "محاسبه کمیسیون"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRecalculate}
                  className="w-full rounded-xl bg-[#bc323a] py-3 font-bold text-white transition-colors hover:bg-[#a82c32]"
                >
                  محاسبه مجدد
                </button>
              )}
            </div>
          </form>

          {result && (
            <section
              ref={resultRef}
              id="results"
              className="mt-8 scroll-mt-6 space-y-3"
              aria-live="polite"
            >
              <h2 className="mb-3 text-lg font-bold text-gray-800">
                نتیجه محاسبه کمیسیون هر طرف معامله
              </h2>

              <div className="flex justify-between rounded-lg border border-red-100 bg-white p-3 shadow-sm">
                <span className="text-gray-500">
                  نرخ محاسباتی منطقه:
                </span>

                <span className="font-bold text-[#bc323a]">
                  {result.region_name}
                </span>
              </div>

              {formData.transactionType === "rent" &&
                result.monthly_rent_for_calculation > 0 && (
                  <div className="rounded-lg border border-red-100 bg-white p-3 shadow-sm">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="text-gray-500">
                        مبلغ اجاره محاسباتی:
                      </span>

                      <span className="font-bold text-[#bc323a]">
                        {formatCurrency(
                          result.monthly_rent_for_calculation
                        )}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-6 text-gray-500">
                      شامل اجاره ماهانه به‌علاوه تبدیل مبلغ
                      ودیعه به اجاره محاسباتی
                    </p>
                  </div>
                )}

              <div className="rounded-lg border border-red-100 bg-white p-3 shadow-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="text-gray-500">
                    کمیسیون پایه:
                  </span>

                  <span className="font-bold text-[#bc323a]">
                    {formatCurrency(result.base_commission)}
                  </span>
                </div>

                {formData.transactionType === "rent" && (
                  <p className="mt-2 text-xs leading-6 text-gray-500">
                    مبنای محاسبه برای ملک{" "}
                    {formData.propertyType === "commercial"
                      ? "تجاری، یک‌سوم"
                      : "مسکونی، یک‌چهارم"}{" "}
                    اجاره محاسباتی در نظر گرفته شده است.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap justify-between gap-2 rounded-lg border border-red-100 bg-white p-3 shadow-sm">
                <span className="text-gray-500">
                  مالیات ({result.vat_percent.toLocaleString(
                    "fa-IR"
                  )}
                  ٪):
                </span>

                <span className="font-bold text-[#bc323a]">
                  {formatCurrency(result.vat_amount)}
                </span>
              </div>

              <div className="flex flex-wrap justify-between gap-2 rounded-lg border border-red-100 bg-white p-3 shadow-sm">
                <span className="text-gray-500">
                  درصد کمیسیون همراه مالیات:
                </span>

                <span className="font-bold text-[#bc323a]">
                  {result.commission_percent_of_price.toLocaleString(
                    "fa-IR",
                    {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 3,
                    }
                  )}
                  ٪
                </span>
              </div>

              <div className="flex flex-wrap justify-between gap-2 rounded-lg border-2 border-[#bc323a] bg-red-100 p-4">
                <span className="font-bold text-[#bc323a]">
                  کل کمیسیون هر طرف:
                </span>

                <span className="text-lg font-bold text-[#bc323a]">
                  {formatCurrency(result.total_commission)}
                </span>
              </div>

              <p className="rounded-lg bg-yellow-50 p-3 text-xs leading-6 text-gray-600">
                این مبلغ تقریبی است و نباید جایگزین تعرفه
                رسمی، مفاد قرارداد یا استعلام از مرجع معتبر
                شود.
              </p>
            </section>
          )}
        </main>

        <section className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            کمیسیون املاک چگونه محاسبه می‌شود؟
          </h2>

          <div className="space-y-4 text-sm leading-8 text-gray-700 sm:text-base">
            <p>
              حق کمیسیون املاک به نوع معامله، قیمت ملک،
              مبلغ ودیعه، اجاره ماهانه، نوع کاربری ملک و
              تعرفه قابل اجرا در شهر محل معامله بستگی دارد.
              در بعضی شهرها نرخ کمیسیون ثابت و در بعضی مناطق
              پلکانی است.
            </p>

            <p>
              برای محاسبه کمیسیون خرید و فروش، ابتدا شهر،
              نوع ملک و قیمت کامل معامله را انتخاب یا وارد
              کنید. ماشین حساب آجر کمیسیون پایه، مالیات و
              مبلغ نهایی قابل پرداخت توسط هر طرف را جداگانه
              نمایش می‌دهد.
            </p>
          </div>

          <h2 className="mb-4 mt-8 text-xl font-bold text-gray-800">
            محاسبه کمیسیون رهن و اجاره
          </h2>

          <div className="space-y-4 text-sm leading-8 text-gray-700 sm:text-base">
            <p>
              در قراردادهای رهن و اجاره، مبلغ ودیعه بر اساس
              فرمول این ابزار به اجاره محاسباتی تبدیل می‌شود.
              سپس اجاره ماهانه به مبلغ حاصل اضافه شده و
              کمیسیون هر طرف محاسبه می‌شود.
            </p>

            <p>
              برای استفاده از محاسبه‌گر رهن و اجاره، لازم
              نیست هر دو مبلغ ودیعه و اجاره را وارد کنید؛
              وارد کردن حداقل یکی از این دو مبلغ برای انجام
              محاسبه کافی است.
            </p>
          </div>

          <h2 className="mb-4 mt-8 text-xl font-bold text-gray-800">
            تفاوت کمیسیون پایه، مالیات و مبلغ نهایی
          </h2>

          <ul className="list-inside list-disc space-y-3 text-sm leading-8 text-gray-700 sm:text-base">
            <li>
              <strong>کمیسیون پایه:</strong> مبلغی که پیش از
              اضافه شدن مالیات محاسبه می‌شود.
            </li>

            <li>
              <strong>مالیات:</strong> مبلغی که بر اساس نرخ
              تعریف‌شده به کمیسیون پایه اضافه می‌شود.
            </li>

            <li>
              <strong>کل کمیسیون:</strong> مجموع کمیسیون پایه
              و مالیات برای هر طرف معامله است.
            </li>
          </ul>

          <div className="mt-8 rounded-xl border border-red-100 bg-red-50 p-4">
            <h2 className="mb-2 text-lg font-bold text-[#bc323a]">
              آیا مبلغ محاسبه‌شده قطعی است؟
            </h2>

            <p className="text-sm leading-8 text-gray-700">
              خیر. این ماشین حساب برای ارائه برآورد اولیه
              طراحی شده است. تعرفه‌ها و قوانین ممکن است تغییر
              کنند و نرخ قابل اجرا در هر شهر یا قرارداد
              متفاوت باشد. پیش از پرداخت، مبلغ قطعی را از
              اتحادیه یا مشاور املاک معتبر استعلام کنید.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-6 text-xl font-bold text-gray-800">
            سؤالات متداول محاسبه کمیسیون املاک
          </h2>

          <div className="divide-y divide-gray-100">
            {FAQ_ITEMS.map((item) => (
              <article
                key={item.question}
                className="py-5 first:pt-0 last:pb-0"
              >
                <h3 className="mb-2 font-bold leading-7 text-gray-800">
                  {item.question}
                </h3>

                <p className="text-sm leading-8 text-gray-600">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <aside className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
          <h2 className="mb-4 text-lg font-bold text-gray-800">
            ابزارهای مرتبط آجر
          </h2>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/assistant"
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-[#bc323a] transition-colors hover:bg-red-50"
            >
              دستیار املاک آجر
            </Link>

            <Link
              href="/search"
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-[#bc323a] transition-colors hover:bg-red-50"
            >
              جستجوی ملک
            </Link>

            <Link
              href="/file-request"
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-[#bc323a] transition-colors hover:bg-red-50"
            >
              ثبت درخواست ملک
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
