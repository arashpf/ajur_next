import {useState, useRef} from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Button,
  ScrollView,
  Pressable,
  Spinner,
  Alert,
  ChevronDownIcon,
} from 'native-base';

// Commission data for different regions
const COMMISSION_REGIONS = [
  {
    region_id: 'tehran',
    display_name: 'تهران',
    commission_scheme: {
      type: 'percentage',
      per_side: true,
      tiers: [{up_to: null, percent: 0.25}],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
  {
    region_id: 'isfahan',
    display_name: 'اصفهان',
    commission_scheme: {
      type: 'tiered',
      per_side: true,
      tiers: [
        {up_to: 2000000000, percent: 0.5},
        {up_to: null, percent: 0.25},
      ],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
  {
    region_id: 'mashhad',
    display_name: 'مشهد',
    commission_scheme: {
      type: 'tiered',
      per_side: true,
      tiers: [
        {up_to: 3000000000, percent: 0.3},
        {up_to: null, percent: 0.2},
      ],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
  {
    region_id: 'shiraz',
    display_name: 'شیراز',
    commission_scheme: {
      type: 'percentage',
      per_side: true,
      tiers: [{up_to: null, percent: 0.3}],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
  {
    region_id: 'robatkarim',
    display_name: 'رباط‌کریم',
    commission_scheme: {
      type: 'percentage',
      per_side: true,
      tiers: [{up_to: null, percent: 0.75}],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
  {
    region_id: 'parand',
    display_name: 'پرند',
    commission_scheme: {
      type: 'tiered',
      per_side: true,
      tiers: [
        {up_to: 1500000000, percent: 0.7},
        {up_to: null, percent: 0.35},
      ],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
  {
    region_id: 'rasht',
    display_name: 'رشت',
    commission_scheme: {
      type: 'tiered',
      per_side: true,
      tiers: [
        {up_to: 2000000000, percent: 1},
        {up_to: 4000000000, percent: 0.8},
        {up_to: 6000000000, percent: 0.6},
        {up_to: null, percent: 0.5},
      ],
      vat_percent: 9,
      commercial_multiplier: 1.5,
    },
  },
];

// Cities data for dropdown
const CITIES_DATA = [
  {id: 'astaneh_ashrafiyeh', name: 'آستانه اشرفیه'},
  {id: 'rasht', name: 'رشت'},
  {id: 'mashhad', name: 'مشهد'},
  {id: 'lahijan', name: 'لاهیجان'},
  {id: 'chaf_chamkhaleh', name: 'چاف و چمخاله'},
  {id: 'masal', name: 'ماسال'},
  {id: 'ahvaz', name: 'اهواز'},
  {id: 'qom', name: 'قم'},
  {id: 'amol', name: 'آمل'},
  {id: 'eslamshahr', name: 'اسلامشهر'},
  {id: 'pakdasht', name: 'پاکدشت'},
  {id: 'chalus', name: 'چالوس'},
  {id: 'bumehen', name: 'بومهن'},
  {id: 'ramsar', name: 'رامسر'},
  {id: 'tehran', name: 'تهران'},
  {id: 'sari', name: 'ساری'},
  {id: 'damavand', name: 'دماوند'},
  {id: 'rudehen', name: 'رودهن'},
  {id: 'parand', name: 'شهر جدید پرند'},
  {id: 'robatkarim', name: 'رباط کریم'},
  {id: 'rey', name: 'ری'},
  {id: 'andisheh', name: 'اندیشه'},
  {id: 'shahriyar', name: 'شهریار'},
  {id: 'sabashahr', name: 'صباشهر'},
  {id: 'firoozkooh', name: 'فیروزکوه'},
  {id: 'qods', name: 'قدس'},
  {id: 'nowshahr', name: 'نوشهر'},
  {id: 'malard', name: 'ملارد'},
  {id: 'varamin', name: 'ورامین'},
  {id: 'isfahan', name: 'اصفهان'},
  {id: 'kish', name: 'کیش'},
  {id: 'kermanshah', name: 'کرمانشاه'},
  {id: 'shiraz', name: 'شیراز'},
  {id: 'yazd', name: 'یزد'},
];

// Main commission calculation function
const calculateCommission = payload => {
  const {city, transactionType, price, deposit, rent, propertyType} = payload;

  // Find region data or use Tehran as default
  let regionData = COMMISSION_REGIONS.find(r => r.region_id === city);
  if (!regionData) {
    regionData = COMMISSION_REGIONS.find(r => r.region_id === 'tehran');
  }

  const scheme = regionData.commission_scheme;
  const isCommercial = propertyType === 'commercial';

  let calculationAmount = 0;
  let monthlyRentForCalculation = 0;

  switch (transactionType) {
    case 'sale':
      calculationAmount = price;
      break;
    case 'rent':
      // Convert deposit to rent: every 1 million Toman deposit = 30,000 Toman rent
      const depositToRentConversion = deposit ? deposit * 0.03 : 0; // 3% of deposit as rent
      monthlyRentForCalculation = (rent || 0) + depositToRentConversion;
      calculationAmount = monthlyRentForCalculation;
      break;
    default:
      calculationAmount = price;
      break;
  }

  // Convert from Toman to Rial for calculation (1 Toman = 10 Rials)
  const calculationAmountInRial = calculationAmount * 10;

  let baseCommission = 0;

  if (transactionType === 'rent') {
    // For rent: residential gets 1/4, commercial gets 1/3 of monthly rent
    const commissionRate = isCommercial ? 1 / 3 : 1 / 4;
    baseCommission = calculationAmountInRial * commissionRate;
  } else {
    // For sale transactions, use the original calculation
    if (scheme.type === 'percentage') {
      baseCommission =
        calculationAmountInRial * (scheme.tiers[0].percent / 100);
    } else if (scheme.type === 'tiered') {
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

    // Apply commercial multiplier if applicable
    if (isCommercial && scheme.commercial_multiplier) {
      baseCommission *= scheme.commercial_multiplier;
    }
  }

  // Calculate VAT
  const vatAmount = baseCommission * (scheme.vat_percent / 100);
  const totalCommission = baseCommission + vatAmount;

  // Convert back to Toman and round to nearest thousand
  const roundToThousand = amount => Math.round(amount / 10000) * 1000;

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

// Main component
function AjurCommissionCalculator() {
  const [formData, setFormData] = useState({
    city: '',
    transactionType: 'sale',
    propertyType: 'residential',
    price: '',
    deposit: '',
    rent: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [priceSuggestions, setPriceSuggestions] = useState([]);
  const [depositSuggestions, setDepositSuggestions] = useState([]);
  const [rentSuggestions, setRentSuggestions] = useState([]);

  const scrollViewRef = useRef(null);

  // Define purple color scheme
  const purpleColor = '#9C27B0';
  const purpleLight = '#E1BEE7';
  const purpleDark = '#7B1FA2';
  const purpleBg = '#F3E5F5';

  // Transaction type options
  const transactionTypes = [
    {id: 'sale', name: 'فروش'},
    {id: 'rent', name: 'اجاره'},
  ];

  // Property type options
  const propertyTypes = [
    {id: 'residential', name: 'مسکونی'},
    {id: 'commercial', name: 'تجاری'},
  ];

  // Generate price suggestions based on user input
  function generatePriceSuggestions(value, field) {
    if (!value || value.length < 1) {
      if (field === 'price') setPriceSuggestions([]);
      else if (field === 'deposit') setDepositSuggestions([]);
      else if (field === 'rent') setRentSuggestions([]);
      return;
    }

    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) {
      if (field === 'price') setPriceSuggestions([]);
      else if (field === 'deposit') setDepositSuggestions([]);
      else if (field === 'rent') setRentSuggestions([]);
      return;
    }

    const suggestions = [];
    const baseNumber = Number.parseInt(numericValue);

    if (baseNumber > 0) {
      if (field === 'price') {
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
      } else if (field === 'deposit') {
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
      } else if (field === 'rent') {
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

    const limitedSuggestions = suggestions.slice(0, 3);
    if (field === 'price') setPriceSuggestions(limitedSuggestions);
    else if (field === 'deposit') setDepositSuggestions(limitedSuggestions);
    else if (field === 'rent') setRentSuggestions(limitedSuggestions);
  }

  // Handle form submission
  async function handleSubmit() {
    // Validation based on transaction type
    if (!formData.city) {
      setError('لطفاً شهر را وارد کنید');
      return;
    }

    if (formData.transactionType === 'sale' && !formData.price) {
      setError('لطفاً قیمت ملک را وارد کنید');
      return;
    }

    if (formData.transactionType === 'rent' && !formData.deposit && !formData.rent) {
      setError('لطفاً ودیعه یا اجاره ماهانه را وارد کنید');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const priceInToman = formData.price ? Number.parseFloat(formData.price.replace(/,/g, '')) : 0;
      const depositInToman = formData.deposit
        ? Number.parseFloat(formData.deposit.replace(/,/g, ''))
        : 0;
      const rentInToman = formData.rent
        ? Number.parseFloat(formData.rent.replace(/,/g, ''))
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
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    } catch (err) {
      console.error('Commission calculation error:', err);
      setError('خطا در محاسبه کمیسیون');
    } finally {
      setLoading(false);
    }
  }

  // Reset form for new calculation
  function handleRecalculate() {
    setResult(null);
    setFormData({
      city: '',
      transactionType: 'sale',
      propertyType: 'residential',
      price: '',
      deposit: '',
      rent: '',
    });

    // Scroll back to top
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({y: 0, animated: true});
    }, 100);
  }

  // Format numbers with commas
  function formatNumber(value) {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Handle input changes
  function handleInputChange(field, value) {
    if (field === 'price' || field === 'deposit' || field === 'rent') {
      const numericValue = value.replace(/[^0-9]/g, '');
      const formattedValue = formatNumber(numericValue);
      setFormData(prev => ({...prev, [field]: formattedValue}));
      generatePriceSuggestions(numericValue, field);
    } else {
      setFormData(prev => ({...prev, [field]: value}));
    }
  }

  // Handle suggestion selection
  function selectSuggestion(suggestion, field) {
    const formattedValue = formatNumber(suggestion.value);
    setFormData(prev => ({...prev, [field]: formattedValue}));
    if (field === 'price') setPriceSuggestions([]);
    else if (field === 'deposit') setDepositSuggestions([]);
    else if (field === 'rent') setRentSuggestions([]);
  }

  // Format currency for display
  function formatCurrency(amount) {
    if (!amount) return '0 تومان';
    return `${Math.round(amount).toLocaleString()} تومان`;
  }

  // Suggestion dropdown component
  function SuggestionDropdown({suggestions, field, onSelect}) {
    if (suggestions.length === 0) return null;

    return (
      <Box
        position="absolute"
        top="100%"
        left={0}
        right={0}
        zIndex={20}
        mt={2}
        bg="rgba(255,255,255,0.95)"
        borderRadius="25"
        shadow={9}
        borderWidth={1}
        borderColor={purpleLight}>
        {suggestions.map((suggestion, index) => (
          <Pressable
            key={index}
            onPress={() => onSelect(suggestion, field)}
            _pressed={{bg: purpleLight}}
            px={6}
            py={4}
            borderBottomWidth={index < suggestions.length - 1 ? 1 : 0}
            borderBottomColor={purpleLight}>
            <HStack space={2} alignItems="center">
              <Text fontSize="sm" color="gray.500">
                منظورتان
              </Text>
              <Text fontSize="lg" fontWeight="bold" color={purpleColor}>
                {suggestion.display}
              </Text>
              <Text fontSize="sm" color="gray.500">
                است؟
              </Text>
            </HStack>
          </Pressable>
        ))}
      </Box>
    );
  }

  return (
    <ScrollView flex={1} bg="gray.50" ref={scrollViewRef}>
      <Box maxW="100%" width="100%" mx="auto" mt={8} mb={8} px={4}>
        {/* Calculator Form */}
        <Box
          p={8}
          bg="rgba(255,255,255,0.95)"
          borderRadius="25"
          shadow={9}
          borderWidth={1}
          borderColor={purpleLight}>
          <VStack space={6} alignItems="center" mb={10}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color={purpleColor}
              textAlign="center">
              محاسبه‌گر کمیسیون
            </Text>

            <Text
              fontSize="sm"
              fontWeight="bold"
              color={purpleColor}
              textAlign="center"
              mt={2}>
              این ماشین‌حساب یک ابزار آزمایشی است. آجر هیچ گونه مسئولیتی در قبال
              عدم درستی کمیسیون‌ها قبول نمی‌کند. توجه داشته باشید که نرخ محاسبه
              املاک و عرف بازار در هر شهر ممکن است با نرخ مصوب اتحادیه متفاوت
              باشد.
            </Text>
          </VStack>

          {error && (
            <Alert status="error" mt={8} borderRadius="25" bg={purpleBg}>
              <Alert.Icon />
              <Text
                color={purpleDark}
                fontWeight="medium"
                textAlign="center"
                flex={1}>
                {error}
              </Text>
            </Alert>
          )}

          <VStack space={8}>
            {/* City Selection */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" color={purpleColor} mb={3}>
                شهر *
              </Text>
              <Select
                selectedValue={formData.city}
                onValueChange={value => handleInputChange('city', value)}
                placeholder="انتخاب شهر..."
                bg="rgba(255,255,255,0.8)"
                borderRadius="25"
                borderColor={purpleLight}
                _focus={{borderColor: purpleColor, bg: 'rgba(255,255,255,0.9)'}}
                dropdownIcon={<ChevronDownIcon size="5" color={purpleColor} />}
                fontSize="md"
                fontWeight="medium"
                color="gray.800"
                py={4}
                px={6}>
                {CITIES_DATA.map(city => (
                  <Select.Item
                    key={city.id}
                    label={city.name}
                    value={city.id}
                  />
                ))}
              </Select>
            </Box>

            {/* Transaction Type */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" color={purpleColor} mb={3}>
                نوع معامله
              </Text>
              <Select
                selectedValue={formData.transactionType}
                onValueChange={value =>
                  handleInputChange('transactionType', value)
                }
                bg="rgba(255,255,255,0.8)"
                borderRadius="25"
                borderColor={purpleLight}
                _focus={{borderColor: purpleColor, bg: 'rgba(255,255,255,0.9)'}}
                dropdownIcon={<ChevronDownIcon size="5" color={purpleColor} />}
                fontSize="md"
                fontWeight="medium"
                color="gray.800"
                py={4}
                px={6}>
                {transactionTypes.map(type => (
                  <Select.Item
                    key={type.id}
                    label={type.name}
                    value={type.id}
                  />
                ))}
              </Select>
            </Box>

            {/* Property Type */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" color={purpleColor} mb={3}>
                نوع ملک
              </Text>
              <Select
                selectedValue={formData.propertyType}
                onValueChange={value =>
                  handleInputChange('propertyType', value)
                }
                bg="rgba(255,255,255,0.8)"
                borderRadius="25"
                borderColor={purpleLight}
                _focus={{borderColor: purpleColor, bg: 'rgba(255,255,255,0.9)'}}
                dropdownIcon={<ChevronDownIcon size="5" color={purpleColor} />}
                fontSize="md"
                fontWeight="medium"
                color="gray.800"
                py={4}
                px={6}>
                {propertyTypes.map(type => (
                  <Select.Item
                    key={type.id}
                    label={type.name}
                    value={type.id}
                  />
                ))}
              </Select>
            </Box>

            {/* Price Input (only for sale transactions) */}
            {formData.transactionType === 'sale' && (
              <Box position="relative">
                <Text fontSize="sm" fontWeight="bold" color={purpleColor} mb={3}>
                  قیمت ملک * - تومان
                </Text>
                <Input
                  value={formData.price}
                  onChangeText={value => handleInputChange('price', value)}
                  placeholder="مثال: 2,000,000,000"
                  bg="rgba(255,255,255,0.8)"
                  borderRadius="25"
                  borderColor={purpleLight}
                  _focus={{borderColor: purpleColor, bg: 'rgba(255,255,255,0.9)'}}
                  fontSize="md"
                  fontWeight="medium"
                  color="gray.800"
                  py={4}
                  px={6}
                  keyboardType="numeric"
                />
                <SuggestionDropdown
                  suggestions={priceSuggestions}
                  field="price"
                  onSelect={selectSuggestion}
                />
              </Box>
            )}

            {/* Deposit and Rent Inputs (only for rent transactions) */}
            {formData.transactionType === 'rent' && (
              <>
                <Box position="relative">
                  <Text fontSize="sm" fontWeight="bold" color={purpleColor} mb={3}>
                    ودیعه - تومان
                  </Text>
                  <Input
                    value={formData.deposit}
                    onChangeText={value => handleInputChange('deposit', value)}
                    placeholder="مثال: 100,000,000"
                    bg="rgba(255,255,255,0.8)"
                    borderRadius="25"
                    borderColor={purpleLight}
                    _focus={{
                      borderColor: purpleColor,
                      bg: 'rgba(255,255,255,0.9)',
                    }}
                    fontSize="md"
                    fontWeight="medium"
                    color="gray.800"
                    py={4}
                    px={6}
                    keyboardType="numeric"
                  />
                  <SuggestionDropdown
                    suggestions={depositSuggestions}
                    field="deposit"
                    onSelect={selectSuggestion}
                  />
                </Box>
                <Box position="relative">
                  <Text fontSize="sm" fontWeight="bold" color={purpleColor} mb={3}>
                    اجاره ماهانه - تومان
                  </Text>
                  <Input
                    value={formData.rent}
                    onChangeText={value => handleInputChange('rent', value)}
                    placeholder="مثال: 5,000,000"
                    bg="rgba(255,255,255,0.8)"
                    borderRadius="25"
                    borderColor={purpleLight}
                    _focus={{
                      borderColor: purpleColor,
                      bg: 'rgba(255,255,255,0.9)',
                    }}
                    fontSize="md"
                    fontWeight="medium"
                    color="gray.800"
                    py={4}
                    px={6}
                    keyboardType="numeric"
                  />
                  <SuggestionDropdown
                    suggestions={rentSuggestions}
                    field="rent"
                    onSelect={selectSuggestion}
                  />
                </Box>
              </>
            )}

            {/* Submit Button */}
            {!0 ? (
              <Button
                onPress={handleSubmit}
                isDisabled={loading}
                bg={purpleColor}
                _pressed={{bg: purpleDark}}
                _disabled={{bg: purpleLight}}
                borderRadius="25"
                py={4}
                px={8}
                shadow={6}
                size="lg">
                {loading ? (
                  <HStack space={3} alignItems="center">
                    <Spinner color="white" size="sm" />
                    <Text color="white" fontSize="lg" fontWeight="bold">
                      در حال محاسبه...
                    </Text>
                  </HStack>
                ) : (
                  <Text color="white" fontSize="lg" fontWeight="bold">
                    محاسبه کمیسیون
                  </Text>
                )}
              </Button>
            ) : (
              <Button
                onPress={handleRecalculate}
                bg={purpleColor}
                _pressed={{bg: purpleDark}}
                borderRadius="25"
                py={4}
                px={8}
                shadow={6}
                size="lg">
                <Text color="white" fontSize="lg" fontWeight="bold">
                  محاسبه مجدد
                </Text>
              </Button>
            )}
          </VStack>
        </Box>

        {/* Results Section */}
        {result && (
          <Box mt={6} p={0}>
            <Box
              p={8}
              bg={purpleBg}
              borderRadius="25"
              shadow={9}
              borderWidth={2}
              borderColor={purpleLight}>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={purpleDark}
                mb={6}
                textAlign="center">
                نتایج محاسبه کمیسیون هر طرف
              </Text>

              <VStack space={4}>
                {/* Region */}
                <Box bg="white" borderRadius="20" p={4} shadow={3}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontWeight="bold" color={purpleColor} fontSize="lg">
                      {result.region_name}
                    </Text>
                    <Text color="gray.700" fontWeight="medium" fontSize="md">
                      منطقه:
                    </Text>
                  </HStack>
                </Box>

                {/* Calculated Rent Amount (only for rent transactions) */}
                {formData.transactionType === 'rent' &&
                  result.monthly_rent_for_calculation > 0 && (
                    <Box bg="white" borderRadius="20" p={4} shadow={3}>
                      <HStack
                        justifyContent="space-between"
                        alignItems="center">
                        <Text fontWeight="bold" color={purpleColor} fontSize="lg">
                          {formatCurrency(result.monthly_rent_for_calculation)}
                        </Text>
                        <Text
                          color="gray.700"
                          fontWeight="medium"
                          fontSize="md">
                          مبلغ اجاره محاسباتی:
                        </Text>
                      </HStack>
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        mt={2}
                        textAlign="left">
                        (شامل اجاره ماهیانه + تبدیل ودیعه به اجاره)
                      </Text>
                    </Box>
                  )}

                {/* Base Commission */}
                <Box bg="white" borderRadius="20" p={4} shadow={3}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontWeight="bold" color={purpleColor} fontSize="lg">
                      {formatCurrency(result.base_commission)}
                    </Text>
                    <Text color="gray.700" fontWeight="medium" fontSize="md">
                      کمیسیون پایه:
                    </Text>
                  </HStack>
                  {formData.transactionType === 'rent' && (
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      mt={2}
                      textAlign="left">
                      (
                      {formData.propertyType === 'commercial'
                        ? 'یک سوم'
                        : 'یک چهارم'}{' '}
                      از اجاره محاسباتی)
                    </Text>
                  )}
                </Box>

                {/* VAT Amount */}
                <Box bg="white" borderRadius="20" p={4} shadow={3}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontWeight="bold" color={purpleColor} fontSize="lg">
                      {formatCurrency(result.vat_amount)}
                    </Text>
                    <Text color="gray.700" fontWeight="medium" fontSize="md">
                      مالیات (۹٪):
                    </Text>
                  </HStack>
                </Box>

                {/* Commission Percentage */}
                <Box bg="white" borderRadius="20" p={4} shadow={3}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontWeight="bold" color={purpleColor} fontSize="lg">
                      {result.commission_percent_of_price?.toFixed(3)}%
                    </Text>
                    <Text color="gray.700" fontWeight="medium" fontSize="md">
                      درصد از قیمت:
                    </Text>
                  </HStack>
                </Box>

                {/* Total Commission */}
                <Box
                  bg={purpleLight}
                  borderRadius="20"
                  p={5}
                  shadow={4}
                  borderWidth={2}
                  borderColor={purpleColor}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontWeight="bold" color={purpleDark} fontSize="xl">
                      {formatCurrency(result.total_commission)}
                    </Text>
                    <Text color={purpleDark} fontWeight="bold" fontSize="xl">
                      کل کمیسیون:
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </Box>
          </Box>
        )}
      </Box>
    </ScrollView>
  );
}

export default AjurCommissionCalculator;