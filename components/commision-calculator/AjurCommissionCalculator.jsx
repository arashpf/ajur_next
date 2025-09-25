"use client"

import { useState, useEffect } from "react"

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
      // thresholds are now expressed in تومان
      tiers: [
        { up_to: 200000000, percent: 0.5 },
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
        { up_to: 300000000, percent: 0.3 },
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
      vat_percent: 9  ,
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
        { up_to: 150000000, percent: 0.7 },
        { up_to: null, percent: 0.35 },
      ],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
]

const CITIES_DATA = [
  { id: "astaneh_ashrafiyeh", name: "آستانه اشرفیه", name_en: "Astaneh Ashrafiyeh" },
  { id: "rasht", name: "رشت", name_en: "Rasht" },
  { id: "mashhad", name: "مشهد", name_en: "Mashhad" },
  { id: "lahijan", name: "لاهیجان", name_en: "Lahijan" },
  { id: "chaf_chamkhaleh", name: "چاف و چمخاله", name_en: "Chaf and Chamkhaleh" },
  { id: "masal", name: "ماسال", name_en: "Masal" },
  { id: "ahvaz", name: "اهواز", name_en: "Ahvaz" },
  { id: "qom", name: "قم", name_en: "Qom" },
  { id: "amol", name: "آمل", name_en: "Amol" },
  { id: "eslamshahr", name: "اسلامشهر", name_en: "Eslamshahr" },
  { id: "pakdasht", name: "پاکدشت", name_en: "Pakdasht" },
  { id: "chalus", name: "چالوس", name_en: "Chalus" },
  { id: "bumehen", name: "بومهن", name_en: "Bumehen" },
  { id: "ramsar", name: "رامسر", name_en: "Ramsar" },
  { id: "tehran", name: "تهران", name_en: "Tehran" },
  { id: "sari", name: "ساری", name_en: "Sari" },
  { id: "damavand", name: "دماوند", name_en: "Damavand" },
  { id: "rudehen", name: "رودهن", name_en: "Rudehen" },
  { id: "parand", name: "شهر جدید پرند", name_en: "Parand New City" },
  { id: "robatkarim", name: "رباط کریم", name_en: "Robat Karim" },
  { id: "rey", name: "ری", name_en: "Rey" },
  { id: "andisheh", name: "اندیشه", name_en: "Andisheh" },
  { id: "shahriyar", name: "شهریار", name_en: "Shahriyar" },
  { id: "sabashahr", name: "صباشهر", name_en: "Sabashahr" },
  { id: "firoozkooh", name: "فیروزکوه", name_en: "Firoozkooh" },
  { id: "qods", name: "قدس", name_en: "Qods" },
  { id: "nowshahr", name: "نوشهر", name_en: "Nowshahr" },
  { id: "malard", name: "ملارد", name_en: "Malard" },
  { id: "varamin", name: "ورامین", name_en: "Varamin" },
  { id: "isfahan", name: "اصفهان", name_en: "Isfahan" },
  { id: "kish", name: "کیش", name_en: "Kish" },
  { id: "kermanshah", name: "کرمانشاه", name_en: "Kermanshah" },
  { id: "shiraz", name: "شیراز", name_en: "Shiraz" },
  { id: "yazd", name: "یزد", name_en: "Yazd" },
]

const NEIGHBORHOODS_DATA = {
  tehran: [
    { id: "tehran_elahiyeh", name: "الهیه" },
    { id: "tehran_zaferanieh", name: "زعفرانیه" },
    { id: "tehran_niavaran", name: "نیاوران" },
    { id: "tehran_tajrish", name: "تجریش" },
    { id: "tehran_darband", name: "دربند" },
    { id: "tehran_darakeh", name: "درکه" },
    { id: "tehran_velenjak", name: "ولنجک" },
    { id: "tehran_fereshteh", name: "فرشته" },
    { id: "tehran_mahmoodiyeh", name: "محمودیه" },
    { id: "tehran_kamraniyeh", name: "کامرانیه" },
    { id: "tehran_farmanieh", name: "فرمانیه" },
    { id: "tehran_saadat_abad", name: "سعادت آباد" },
    { id: "tehran_shahrak_gharb", name: "شهرک غرب" },
    { id: "tehran_farahzad", name: "فرهزاد" },
    { id: "tehran_ekhtiariyeh", name: "اختیاریه" },
    { id: "tehran_pasdaran", name: "پاسداران" },
    { id: "tehran_darrous", name: "دروس" },
    { id: "tehran_jordan", name: "جردن" },
    { id: "tehran_vanak", name: "ونک" },
    { id: "tehran_mirdamad", name: "میرداماد" },
    { id: "tehran_yousef_abad", name: "یوسف آباد" },
    { id: "tehran_chitgar", name: "چیتگر" },
    { id: "tehran_pars", name: "تهران پارس" },
    { id: "tehran_sadeghieh", name: "صادقیه" },
  ],
  parand: [
    { id: "parand_phase1", name: "فاز ۱ پرند" },
    { id: "parand_phase2", name: "فاز ۲ پرند" },
    { id: "parand_phase3", name: "فاز ۳ پرند" },
    { id: "parand_phase4", name: "فاز ۴ پرند" },
    { id: "parand_phase5", name: "فاز ۵ پرند" },
    { id: "parand_phase6", name: "فاز ۶ پرند" },
    { id: "parand_phase7", name: "فاز ۷ پرند" },
    { id: "parand_phase8", name: "فاز ۸ پرند" },
    { id: "parand_center", name: "مرکز شهر پرند" },
    { id: "parand_commercial", name: "منطقه تجاری پرند" },
  ],
  robatkarim: [
    { id: "robatkarim_center", name: "مرکز رباط‌کریم" },
    { id: "robatkarim_golbagh", name: "گلباغ" },
    { id: "robatkarim_kalako", name: "کلاکو" },
    { id: "robatkarim_qods_town", name: "شهرک قدس" },
    { id: "robatkarim_industrial", name: "شهرک صنعتی" },
    { id: "robatkarim_new_city", name: "شهر جدید رباط‌کریم" },
    { id: "robatkarim_shahryar_road", name: "جاده شهریار" },
    { id: "robatkarim_saveh_road", name: "جاده ساوه" },
  ],
  mashhad: [
    { id: "mashhad_vakilabad", name: "وکیل آباد" },
    { id: "mashhad_koohsangi", name: "کوهسنگی" },
    { id: "mashhad_hashemieh", name: "هاشمیه" },
    { id: "mashhad_sajjad", name: "سجاد" },
    { id: "mashhad_golshahr", name: "گلشهر" },
    { id: "mashhad_ahmad_abad", name: "احمدآباد" },
    { id: "mashhad_mellat", name: "ملت" },
    { id: "mashhad_samen", name: "ثامن" },
    { id: "mashhad_paradise", name: "پردیس" },
    { id: "mashhad_tabarsi", name: "طبرسی" },
    { id: "mashhad_daneshgah", name: "دانشگاه" },
    { id: "mashhad_center", name: "مرکز شهر مشهد" },
  ],
  isfahan: [
    { id: "isfahan_center", name: "مرکز اصفهان" },
    { id: "isfahan_khomeini_shahr", name: "خمینی‌شهر" },
    { id: "isfahan_najaf_abad", name: "نجف‌آباد" },
    { id: "isfahan_shahin_shahr", name: "شاهین‌شهر" },
    { id: "isfahan_foolad_shahr", name: "فولادشهر" },
    { id: "isfahan_majlesi", name: "مجلسی" },
    { id: "isfahan_khorasgan", name: "خوراسگان" },
    { id: "isfahan_dastgerd", name: "دستگرد" },
    { id: "isfahan_golpayegan", name: "گلپایگان" },
    { id: "isfahan_sepahan_shahr", name: "سپاهان‌شهر" },
  ],
  shiraz: [
    { id: "shiraz_center", name: "مرکز شیراز" },
    { id: "shiraz_golshan", name: "گلشن" },
    { id: "shiraz_chamran", name: "چمران" },
    { id: "shiraz_ghasrodasht", name: "قصردشت" },
    { id: "shiraz_sadra", name: "صدرا" },
    { id: "shiraz_eram", name: "ارم" },
    { id: "shiraz_mellat", name: "ملت" },
    { id: "shiraz_valiasr", name: "ولیعصر" },
    { id: "shiraz_zargari", name: "زرگری" },
    { id: "shiraz_koye_zahra", name: "کوی زهرا" },
  ],
  rasht: [
    { id: "rasht_center", name: "مرکز رشت" },
    { id: "rasht_golsar", name: "گلسار" },
    { id: "rasht_lachin", name: "لاچین" },
    { id: "rasht_saravan", name: "ساراوان" },
    { id: "rasht_kashani", name: "کاشانی" },
    { id: "rasht_anzali_road", name: "جاده انزلی" },
    { id: "rasht_tohid", name: "توحید" },
    { id: "rasht_moalem", name: "معلم" },
  ],
  ahvaz: [
    { id: "ahvaz_center", name: "مرکز اهواز" },
    { id: "ahvaz_kianpars", name: "کیانپارس" },
    { id: "ahvaz_golestan", name: "گلستان" },
    { id: "ahvaz_koye_alavi", name: "کوی علوی" },
    { id: "ahvaz_koye_fadak", name: "کوی فدک" },
    { id: "ahvaz_zeytounkaran", name: "زیتون‌کاران" },
    { id: "ahvaz_ramin", name: "رامین" },
    { id: "ahvaz_koye_mellat", name: "کوی ملت" },
  ],
  qom: [
    { id: "qom_center", name: "مرکز قم" },
    { id: "qom_pardisan", name: "پردیسان" },
    { id: "qom_shahrak_qods", name: "شهرک قدس" },
    { id: "qom_koye_daneshgah", name: "کوی دانشگاه" },
    { id: "qom_salafchegan", name: "سلفچگان" },
    { id: "qom_imam_khomeini", name: "امام خمینی" },
    { id: "qom_koye_mehr", name: "کوی مهر" },
  ],
  amol: [
    { id: "amol_center", name: "مرکز آمل" },
    { id: "amol_haraz_road", name: "جاده هراز" },
    { id: "amol_imam_reza", name: "امام رضا" },
    { id: "amol_taleb_amoli", name: "طالب آملی" },
    { id: "amol_shahid_rajaei", name: "شهید رجایی" },
    { id: "amol_koye_golha", name: "کوی گل‌ها" },
    { id: "amol_industrial", name: "شهرک صنعتی" },
  ],
  sari: [
    { id: "sari_center", name: "مرکز ساری" },
    { id: "sari_koye_daneshgah", name: "کوی دانشگاه" },
    { id: "sari_farah_abad", name: "فرح‌آباد" },
    { id: "sari_koye_karmandan", name: "کوی کارمندان" },
    { id: "sari_shahrak_taleghani", name: "شهرک طالقانی" },
    { id: "sari_koye_mellat", name: "کوی ملت" },
  ],
}

const calculateCommission = (payload) => {
  const { city, transactionType, price, deposit, rent, propertyType } = payload

  // Find region data or use default
  let regionData = COMMISSION_REGIONS.find((r) => r.region_id === city)
  if (!regionData) {
    regionData = COMMISSION_REGIONS.find((r) => r.region_id === "tehran") // Default fallback
  }

  const scheme = regionData.commission_scheme
  const isCommercial = propertyType === "commercial"

  let calculationAmount = 0
  switch (transactionType) {
    case "sale":
      calculationAmount = price
      break
    case "rent":
      calculationAmount = rent || price
      break
    default:
      calculationAmount = price
      break
  }

  // Calculate base commission
  let baseCommission = 0
  if (scheme.type === "percentage") {
    baseCommission = calculationAmount * (scheme.tiers[0].percent / 100)
  } else if (scheme.type === "tiered") {
    let remaining = calculationAmount
    let previousCap = 0

    for (const tier of scheme.tiers) {
      if (remaining <= 0) break

      const tierCap = tier.up_to || remaining + previousCap
      const tierAmount = Math.min(remaining, tierCap - previousCap)
      baseCommission += tierAmount * (tier.percent / 100)

      remaining -= tierAmount
      previousCap = tierCap
    }
  }

  // Apply commercial multiplier
  if (isCommercial && scheme.commercial_multiplier) {
    baseCommission *= scheme.commercial_multiplier
  }

  // Calculate VAT
  const vatAmount = baseCommission * (scheme.vat_percent / 100)
  const totalCommission = baseCommission + vatAmount

  // Round to thousands
  const roundToThousand = (amount) => Math.round(amount / 1000) * 1000

  return {
    base_commission: roundToThousand(baseCommission),
    vat_amount: roundToThousand(vatAmount),
    total_commission: roundToThousand(totalCommission),
    commission_percent_of_price: calculationAmount > 0 ? (totalCommission / calculationAmount) * 100 : 0,
    region_name: regionData.display_name,
  }
}

function AjurCommissionCalculator() {
  const [formData, setFormData] = useState({
    city: "",
    neighborhood: "",
    transactionType: "sale",
    propertyType: "residential",
    price: "",
    deposit: "",
    rent: "",
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [neighborhoods, setNeighborhoods] = useState([])
  const [priceSuggestions, setPriceSuggestions] = useState([])
  const [depositSuggestions, setDepositSuggestions] = useState([])
  const [rentSuggestions, setRentSuggestions] = useState([])

  useEffect(() => {
    if (formData.city) {
      const cityNeighborhoods = NEIGHBORHOODS_DATA[formData.city] || [
        { id: `${formData.city}_center`, name: `مرکز ${getCityName(formData.city)}` },
        { id: `${formData.city}_new_town`, name: `شهر جدید ${getCityName(formData.city)}` },
        { id: `${formData.city}_industrial`, name: `شهرک صنعتی ${getCityName(formData.city)}` },
      ]
      setNeighborhoods(cityNeighborhoods)
    } else {
      setNeighborhoods([])
    }
  }, [formData.city])

  function getCityName(cityId) {
    const city = CITIES_DATA.find((c) => c.id === cityId)
    return city ? city.name : cityId
  }

  const transactionTypes = [
    { id: "sale", name: "فروش" },
    { id: "rent", name: "اجاره" },
  ]

  const propertyTypes = [
    { id: "residential", name: "مسکونی" },
    { id: "commercial", name: "تجاری" },
  ]

  function generatePriceSuggestions(value, field) {
    if (!value || value.length < 1) {
      if (field === "price") setPriceSuggestions([])
      else if (field === "deposit") setDepositSuggestions([])
      else if (field === "rent") setRentSuggestions([])
      return
    }

    const numericValue = value.replace(/[^0-9]/g, "")
    if (!numericValue) {
      if (field === "price") setPriceSuggestions([])
      else if (field === "deposit") setDepositSuggestions([])
      else if (field === "rent") setRentSuggestions([])
      return
    }

    const suggestions = []
    const baseNumber = Number.parseInt(numericValue)

    if (baseNumber > 0) {
      if (field === "price") {
        if (baseNumber < 100) {
          suggestions.push({
            display: `${baseNumber} میلیارد تومان`,
            // store suggestion values in تومان
            value: (baseNumber * 1000000000).toString(),
          })
          if (baseNumber < 50) {
            suggestions.push({
              display: `${baseNumber * 10} میلیارد تومان`,
              value: (baseNumber * 10000000000).toString(),
            })
          }
        }
      } else if (field === "deposit") {
        if (baseNumber < 100) {
          suggestions.push({
            display: `${baseNumber} میلیون تومان`,
            value: (baseNumber * 1000000).toString(),
          })
          suggestions.push({
            display: `${baseNumber * 10} میلیون تومان`,
            value: (baseNumber * 10000000).toString(),
          })
        }
      } else if (field === "rent") {
        if (baseNumber < 100) {
          suggestions.push({
            display: `${baseNumber} میلیون تومان`,
            value: (baseNumber * 1000000).toString(),
          })
          if (baseNumber < 50) {
            suggestions.push({
              display: `${baseNumber * 10} میلیون تومان`,
              value: (baseNumber * 10000000).toString(),
            })
          }
        }
      }
    }

    const limitedSuggestions = suggestions.slice(0, 3)
    if (field === "price") setPriceSuggestions(limitedSuggestions)
    else if (field === "deposit") setDepositSuggestions(limitedSuggestions)
    else if (field === "rent") setRentSuggestions(limitedSuggestions)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!formData.city || !formData.price) {
      setError("لطفاً شهر و قیمت را وارد کنید")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Inputs are now in تومان and stored as formatted strings with commas.
      const priceInToman = Number.parseFloat(formData.price.replace(/,/g, ""))
      const depositInToman = formData.deposit ? Number.parseFloat(formData.deposit.replace(/,/g, "")) : 0
      const rentInToman = formData.rent ? Number.parseFloat(formData.rent.replace(/,/g, "")) : 0

      const calculationResult = calculateCommission({
        city: formData.city,
        transactionType: formData.transactionType,
        // pass Tomans throughout the calculation
        price: priceInToman,
        deposit: depositInToman,
        rent: rentInToman,
        propertyType: formData.propertyType,
      })

      setResult(calculationResult)
    } catch (err) {
      console.error("Commission calculation error:", err)
      setError("خطا در محاسبه کمیسیون")
    } finally {
      setLoading(false)
    }
  }

  function formatNumber(value) {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  function handleInputChange(field, value) {
    if (field === "price" || field === "deposit" || field === "rent") {
      // keep only digits, treat them as تومان
      const numericValue = value.replace(/[^0-9]/g, "")
      const formattedValue = formatNumber(numericValue)
      setFormData((prev) => ({ ...prev, [field]: formattedValue }))
      generatePriceSuggestions(numericValue, field)
    } else if (field === "city") {
      setFormData((prev) => ({ ...prev, [field]: value, neighborhood: "" }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  function selectSuggestion(suggestion, field) {
    // suggestion.value is in تومان
    const formattedValue = formatNumber(suggestion.value)
    setFormData((prev) => ({ ...prev, [field]: formattedValue }))
    if (field === "price") setPriceSuggestions([])
    else if (field === "deposit") setDepositSuggestions([])
    else if (field === "rent") setRentSuggestions([])
  }

  function formatCurrency(amount, showToman = true) {
    if (amount === null || amount === undefined) return "0"
    // Internally amounts are now stored in تومان. Display in تومان directly.
    if (showToman) {
      return `${Math.round(amount).toLocaleString()} تومان`
    }
    return `${amount.toLocaleString()} تومان`
  }

  function SuggestionDropdown({ suggestions, field, onSelect }) {
    if (suggestions.length === 0) return null

    return (
      <div className="absolute z-20 w-full mt-2 backdrop-blur-xl bg-white/80 border border-red-200/50 rounded-3xl shadow-2xl overflow-hidden">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(suggestion, field)}
            className="w-full px-6 py-4 text-left hover:bg-red-500/10 focus:bg-red-500/20 focus:outline-none transition-all duration-200 backdrop-blur-sm"
          >
            <span className="text-sm text-gray-500">منظورتان</span>{" "}
            <span className="font-semibold text-red-600 text-lg">{suggestion.display}</span>{" "}
            <span className="text-sm text-gray-500">است؟</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mb-[100px] mt-2 p-8 backdrop-blur-2xl bg-gradient-to-br from-white/90 to-red-50/80 rounded-3xl shadow-2xl border border-red-100/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none"></div>

      <div className="relative z-10">
          <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-3">
            محاسبه‌گر کمیسیون هوشمند آجر
          </h1>
          <p className="text-sm text-gray-600">توجه: مقادیر ورودی و نتایج همگی به تومان وارد و نمایش داده می‌شوند.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-md text-right mr-4 font-semibold text-red-700 mb-3">شهر</label>
            <div className="relative">
              <select
                value={formData.city}
                placeholder='انتخاب شهر'
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-6 py-4 backdrop-blur-xl bg-white/70 border border-red-200/50 rounded-full focus:ring-4 focus:ring-red-500/20 focus:border-red-500/50 transition-all duration-300 appearance-none text-gray-800 font-medium shadow-lg"
                required
              >
                <option value="">انتخاب شهر...</option>
                {CITIES_DATA.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {formData.city && (
            <div>
              <label className="block text-md text-right mr-4 font-semibold text-red-700 mb-3">محله</label>
              <div className="relative">
                <select
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                  className="w-full px-6 py-4 backdrop-blur-xl bg-white/70 border border-red-200/50 rounded-full focus:ring-4 focus:ring-red-500/20 focus:border-red-500/50 transition-all duration-300 appearance-none text-gray-800 font-medium shadow-lg"
                >
                  <option value="">انتخاب محله...</option>
                  {neighborhoods.map((neighborhood) => (
                    <option key={neighborhood.id} value={neighborhood.id}>
                      {neighborhood.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-md text-right mr-4 font-semibold text-red-700 mb-3">نوع معامله</label>
            <div className="relative">
              <select
                value={formData.transactionType}
                onChange={(e) => handleInputChange("transactionType", e.target.value)}
                className="w-full px-6 py-4 backdrop-blur-xl bg-white/70 border border-red-200/50 rounded-full focus:ring-4 focus:ring-red-500/20 focus:border-red-500/50 transition-all duration-300 appearance-none text-gray-800 font-medium shadow-lg"
              >
                {transactionTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-md text-right mr-4 font-semibold text-red-700 mb-3">نوع ملک </label>
            <div className="relative">
              <select
                value={formData.propertyType}
                onChange={(e) => handleInputChange("propertyType", e.target.value)}
                className="w-full px-6 py-4 backdrop-blur-xl bg-white/70 border border-red-200/50 rounded-full focus:ring-4 focus:ring-red-500/20 focus:border-red-500/50 transition-all duration-300 appearance-none text-gray-800 font-medium shadow-lg"
              >
                {propertyTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

            <div className="relative">
              <label className="block text-md text-right mr-4 font-semibold text-red-700 mb-3">قیمت (تومان)</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="مثال: 20,000,000"
              className="w-full px-6 py-4 backdrop-blur-xl bg-white/70 border border-red-200/50 rounded-full focus:ring-4 focus:ring-red-500/20 focus:border-red-500/50 transition-all duration-300 text-gray-800 font-medium shadow-lg placeholder-gray-400"
              required
            />
            <SuggestionDropdown suggestions={priceSuggestions} field="price" onSelect={selectSuggestion} />
          </div>

          {formData.transactionType === "rent" && (
            <>
              <div className="relative">
                <label className="block text-md text-right mr-4 font-semibold text-red-700 mb-3">ودیعه (تومان)</label>
                <input
                  type="text"
                  value={formData.deposit}
                  onChange={(e) => handleInputChange("deposit", e.target.value)}
                  placeholder="مثال: 1,000,000"
                  className="w-full px-6 py-4 backdrop-blur-xl bg-white/70 border border-red-200/50 rounded-full focus:ring-4 focus:ring-red-500/20 focus:border-red-500/50 transition-all duration-300 text-gray-800 font-medium shadow-lg placeholder-gray-400"
                />
                <SuggestionDropdown suggestions={depositSuggestions} field="deposit" onSelect={selectSuggestion} />
              </div>
              <div className="relative">
                <label className="block text-md text-right mr-4 font-semibold text-red-700 mb-3">اجاره ماهانه (تومان)</label>
                <input
                  type="text"
                  value={formData.rent}
                  onChange={(e) => handleInputChange("rent", e.target.value)}
                  placeholder="مثال: 50,000"
                  className="w-full px-6 py-4 backdrop-blur-xl bg-white/70 border border-red-200/50 rounded-full focus:ring-4 focus:ring-red-500/20 focus:border-red-500/50 transition-all duration-300 text-gray-800 font-medium shadow-lg placeholder-gray-400"
                />
                <SuggestionDropdown suggestions={rentSuggestions} field="rent" onSelect={selectSuggestion} />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-300 disabled:to-red-400 text-white py-4 px-8 rounded-full font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                در حال محاسبه...
              </div>
            ) : (
              "محاسبه کمیسیون"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-8 p-6 backdrop-blur-xl bg-red-50/80 border border-red-200/50 rounded-3xl shadow-lg">
            <p className="text-red-700 text-center font-medium">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-10 p-8 backdrop-blur-2xl bg-gradient-to-br from-red-50/90 to-white/80 border border-red-200/50 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">نتایج محاسبه کمیسیون</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-4 px-6 backdrop-blur-xl bg-white/60 rounded-2xl border border-red-100/50 shadow-lg">
                <span className="text-gray-700 font-medium">منطقه:</span>
                <span className="font-semibold text-red-700">{result.region_name}</span>
              </div>
              <div className="flex justify-between items-center py-4 px-6 backdrop-blur-xl bg-white/60 rounded-2xl border border-red-100/50 shadow-lg">
                <span className="text-gray-700 font-medium">کمیسیون پایه:</span>
                <span className="font-semibold text-red-700">{formatCurrency(result.base_commission)}</span>
              </div>
              <div className="flex justify-between items-center py-4 px-6 backdrop-blur-xl bg-white/60 rounded-2xl border border-red-100/50 shadow-lg">
                <span className="text-gray-700 font-medium">مالیات بر ارزش افزوده:</span>
                <span className="font-semibold text-red-700">{formatCurrency(result.vat_amount)}</span>
              </div>
              <div className="flex justify-between items-center py-5 px-6 backdrop-blur-xl bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-2xl border border-red-300/50 shadow-xl">
                <span className="text-red-800 font-bold text-lg">کل کمیسیون:</span>
                <span className="font-bold text-red-800 text-2xl">{formatCurrency(result.total_commission)}</span>
              </div>
              <div className="flex justify-between items-center py-4 px-6 backdrop-blur-xl bg-white/60 rounded-2xl border border-red-100/50 shadow-lg">
                <span className="text-gray-700 font-medium">درصد از قیمت:</span>
                <span className="font-semibold text-red-700">{result.commission_percent_of_price?.toFixed(3)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AjurCommissionCalculator;
