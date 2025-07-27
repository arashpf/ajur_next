'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Slider,
    Autocomplete,
    Modal,
    createTheme,
    ThemeProvider,
} from '@mui/material';


const theme = createTheme({
    direction: 'rtl',
});


const options = [
    'میخواهم بخرم',
    'میخواهم بفروشم',
    'میخواهم اجاره دهم',
    'میخواهم اجاره کنم',
];

export default function FileRequestForm() {
    // Per-field error state and refs
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const nameRef = useRef(null);
    const cityRef = useRef(null);
    const propertyTypeRef = useRef(null);
    const descriptionRef = useRef(null);
    const phoneRef = useRef(null);
    const depositRef = useRef(null);
    const rentRef = useRef(null);

    const validateFields = () => {
        const errors = {};
        if (!selectedOption) errors.selectedOption = 'لطفا یکی از گزینه‌ها را انتخاب کنید.';
        if (name.trim().length < 3) errors.name = 'نام باید حداقل ۳ کاراکتر باشد.';
        if (!selectedCity) errors.city = 'لطفا شهر را انتخاب کنید.';
        if (!propertyType) errors.propertyType = 'لطفا نوع ملک را انتخاب کنید.';
        if (description.trim().length === 0) errors.description = 'توضیحات نمی‌تواند خالی باشد.';
        if (!/^09\d{9}$/.test(phone)) errors.phone = 'شماره موبایل را صحیح وارد کنید.';
        if (requestType === 'for_rent' || requestType === 'need_rent') {
            if (!deposit || isNaN(deposit) || Number(deposit) < 0) errors.deposit = 'مبلغ ودیعه معتبر نیست.';
            if (!rent || isNaN(rent) || Number(rent) < 0) errors.rent = 'مبلغ اجاره معتبر نیست.';
        } else {
            if (budgetRange[0] < 0 || budgetRange[1] < 0 || budgetRange[0] > budgetRange[1]) errors.budget = 'محدوده بودجه معتبر نیست.';
        }
        if (areaRange[0] < 0 || areaRange[1] < 0 || areaRange[0] > areaRange[1]) errors.area = 'محدوده متراژ معتبر نیست.';
        return errors;
    };

    const scrollToError = (errors) => {
        if (errors.name && nameRef.current) nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        else if (errors.city && cityRef.current) cityRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        else if (errors.propertyType && propertyTypeRef.current) propertyTypeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        else if (errors.description && descriptionRef.current) descriptionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        else if (errors.phone && phoneRef.current) phoneRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        else if (errors.deposit && depositRef.current) depositRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        else if (errors.rent && rentRef.current) rentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Helper to update a single field error on change
    const updateFieldError = (field, value) => {
        if (!submitAttempted) return;
        let error = undefined;
        switch (field) {
            case 'name':
                if (value.trim().length < 3) error = 'نام باید حداقل ۳ کاراکتر باشد.';
                break;
            case 'city':
                if (!value) error = 'لطفا شهر را انتخاب کنید.';
                break;
            case 'propertyType':
                if (!value) error = 'لطفا نوع ملک را انتخاب کنید.';
                break;
            case 'description':
                if (value.trim().length === 0) error = 'توضیحات نمی‌تواند خالی باشد.';
                break;
            case 'phone':
                if (!/^09\d{9}$/.test(value)) error = 'شماره موبایل را صحیح وارد کنید.';
                break;
            case 'deposit':
                if (requestType === 'for_rent' || requestType === 'need_rent') {
                    if (!value || isNaN(value) || Number(value) < 0) error = 'مبلغ ودیعه معتبر نیست.';
                }
                break;
            case 'rent':
                if (requestType === 'for_rent' || requestType === 'need_rent') {
                    if (!value || isNaN(value) || Number(value) < 0) error = 'مبلغ اجاره معتبر نیست.';
                }
                break;
            default:
                break;
        }
        setFieldErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleFormSubmit = () => {
        setSubmitAttempted(true);
        const errors = validateFields();
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) {
            scrollToError(errors);
            return;
        }
        handleSendVerification();
    };
    const [selectedOption, setSelectedOption] = useState('');
    const [name, setName] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [budgetRange, setBudgetRange] = useState([0, 5000000000]);
    const [areaRange, setAreaRange] = useState([0, 500]);
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [propertyType, setPropertyType] = useState(null);
    const propertyOptions = ['زمین', 'ویلایی', 'آپارتمان', 'تجاری', 'صنعتی'];
    const [codeSent, setCodeSent] = useState(false);
    const [smsCode, setSmsCode] = useState('');
    const [requestId, setRequestId] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [deposit, setDeposit] = useState('');
    const [rent, setRent] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [confirmedPhone, setConfirmedPhone] = useState('');
    const [formErrors, setFormErrors] = useState([]);



    const convertOptionToType = (persian) => {
        if (persian === 'میخواهم بخرم') return 'buy';
        if (persian === 'میخواهم بفروشم') return 'sell';
        if (persian === 'میخواهم اجاره دهم') return 'for_rent';
        if (persian === 'میخواهم اجاره کنم') return 'need_rent';
        return 'not_set';
    };

    const descriptionHints = {
        buy: "مثلا : دنبال خونه دوخوابه میگردم",
        sell: "مثلا : یه باغچه هزار متری دارم با سند تک برگ ، آب و برق داره نزدیک جاده اصلیه",
        for_rent: "مثلا : یه واحد ۱۰۰ متری دارم فقط به خانواده میدم ، تبدیلم نمیکنم",
        need_rent: "مثلا : دنبال سالن میگردم برا کار ناخن ، یه ماه وقت دارم جا بجا بشم، ترجیجا اجاره ندم",
    };

    function renderDescriptionHint() {
        const type = convertOptionToType(selectedOption);
        return descriptionHints[type] || "";
    }

    const requestType = convertOptionToType(selectedOption);


    useEffect(() => {
        const cachedCities = localStorage.getItem('ajur_cities');
        if (cachedCities) {
            setCities(JSON.parse(cachedCities));
        } else {
            axios.get("https://api.ajur.app/api/search-cities")
                .then((res) => {
                    const items = res.data.items || [];
                    setCities(items);
                    localStorage.setItem('ajur_cities', JSON.stringify(items));
                })
                .catch((err) => console.error("City fetch failed:", err));
        }
    }, []);


    const formatToman = (val) => {
        if (val >= 1000000000) {
            return (val / 1000000000).toLocaleString('fa') + ' میلیارد تومان';
        } else if (val >= 1000000) {
            return (val / 1000000).toLocaleString('fa') + ' میلیون تومان';
        }
        return val.toLocaleString('fa') + ' تومان';
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    // Helper to format numbers with commas
    const formatNumberWithCommas = (value) => {
        if (!value) return '';
        const num = Number(value);
        if (isNaN(num)) return '';
        return num.toLocaleString('fa-IR');
    };

    // Helper to convert numbers to Persian words
    const numberToPersianText = (num) => {
        if (!num || isNaN(Number(num))) return '';
        const persianNumbers = [
            '', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه', 'ده',
            'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده', 'بیست'
        ];
        const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
        const hundreds = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
        const thousands = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];

        let n = Number(num);
        if (n === 0) return 'صفر';
        let parts = [];
        let k = 0;
        while (n > 0) {
            let chunk = n % 1000;
            if (chunk) {
                let chunkText = '';
                let h = Math.floor(chunk / 100);
                let t = chunk % 100;
                if (h) chunkText += hundreds[h] + (t ? ' و ' : '');
                if (t) {
                    if (t < 21) chunkText += persianNumbers[t];
                    else {
                        let ten = Math.floor(t / 10);
                        let one = t % 10;
                        chunkText += tens[ten];
                        if (one) chunkText += ' و ' + persianNumbers[one];
                    }
                }
                if (thousands[k]) chunkText += ' ' + thousands[k];
                parts.unshift(chunkText);
            }
            n = Math.floor(n / 1000);
            k++;
        }
        return parts.join(' و ');
    };


    const generatePayload = () => ({
        phone,
        name,
        city_id: selectedCity?.id || 0,
        request_type_value: propertyType,
        description,
        type: requestType,
        persian_type: selectedOption,
        area_min: areaRange[0],
        area_max: areaRange[1],
        ...(requestType === 'for_rent' || requestType === 'need_rent'
            ? {
                deposit: deposit ? Number(deposit) : undefined,
                rent: rent ? Number(rent) : undefined
            }
            : {
                budget_min: budgetRange[0],
                budget_max: budgetRange[1]
            }),
    });

    const resetForm = () => {
        setSelectedOption('');
        setName('');
        setSelectedCity(null);
        setBudgetRange([0, 5000000000]);
        setAreaRange([0, 500]);
        setPhone('');
        setDescription('');
        setPropertyType(null);
        setDeposit('');
        setRent('');
        setSmsCode('');
        setCodeSent(false);
        setRequestId(null);
        setSubmitAttempted(false);
        setFieldErrors({});
    };


    const handleSendVerification = () => {
        const errors = [];
        if (!selectedOption) errors.push("لطفا یکی از گزینه‌ها را انتخاب کنید.");
        if (name.trim().length < 3) errors.push("نام باید حداقل ۳ کاراکتر باشد.");
        if (!selectedCity) errors.push("لطفا شهر را انتخاب کنید.");
        if (!propertyType) errors.push("لطفا نوع ملک را انتخاب کنید.");
        if (description.trim().length === 0) errors.push("توضیحات نمی‌تواند خالی باشد.");
        if (!/^09\d{9}$/.test(phone)) errors.push("شماره موبایل را صحیح وارد کنید.");
        if (requestType === 'for_rent' || requestType === 'need_rent') {
            if (!deposit || isNaN(deposit) || Number(deposit) < 0) errors.push("مبلغ ودیعه معتبر نیست.");
            if (!rent || isNaN(rent) || Number(rent) < 0) errors.push("مبلغ اجاره معتبر نیست.");
        } else {
            if (budgetRange[0] < 0 || budgetRange[1] < 0 || budgetRange[0] > budgetRange[1]) errors.push("محدوده بودجه معتبر نیست.");
        }
        if (areaRange[0] < 0 || areaRange[1] < 0 || areaRange[0] > areaRange[1]) errors.push("محدوده متراژ معتبر نیست.");

        setFormErrors(errors);
        if (errors.length > 0) return;

        setVerifying(true);
        axios.post("https://api.ajur.app/webauth/property-request-register", null, {
            params: generatePayload(),
        }).then((res) => {
            setRequestId(res.data.property_request_id);
            setCodeSent(true);
            setVerifying(false);
        })
            .catch((err) => {
                console.error("Error sending verification code:", err);
                setVerifying(false);
            });
    };

    const handleResendCode = () => {
        if (!phone || phone.length !== 11) {
            alert("شماره موبایل معتبر نیست.");
            return;
        }
        setVerifying(true);
        axios.post("https://api.ajur.app/webauth/property-request-register", null, {
            params: generatePayload(),
        }).then((res) => {
            setRequestId(res.data.property_request_id);
            setCodeSent(true);
            setVerifying(false);
            alert("کد مجدداً ارسال شد.");
        })
            .catch((err) => {
                alert("خطا در ارسال مجدد کد. لطفا دوباره تلاش کنید.");
                setVerifying(false);
            });
    };

    const handleVerifyCode = () => {
        if (smsCode.length !== 5) {
            alert("کد تایید باید ۵ رقم باشد.");
            return;
        }

        axios.post("https://api.ajur.app/webauth/property-request-verify", null, {
            params: {
                phone,
                code: parseInt(smsCode),
                password: "ddr007",
                property_request_id: requestId
            }
        })
            .then((res) => {
                if (res.data.status === "success") {
                    handleSuccess(res.data);
                } else {
                    alert("کد وارد شده معتبر نیست.");
                }
            })
            .catch(() => alert("مشکلی پیش آمده. لطفا دوباره تلاش کنید."));
    };

    const handleSuccess = (data) => {
        setConfirmedPhone(phone);
        setShowSuccessModal(true);
        resetForm();
    };

    // Function to reset all form fields and close the modal
    const resetFormAndCloseModal = () => {
        setShowSuccessModal(false);
        resetForm();
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#fff',
                py: 6,
                px: 2,
                direction: 'rtl',
            }}
        >
            <Box
                sx={{
                    maxWidth: 600,
                    mx: 'auto',
                    backgroundColor: '#fff',
                    p: 3,
                    borderRadius: 2,
                }}
            >
                {/* Removed form error hints and main title as requested */}

                {/* Option Buttons */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {options.map((option) => (
                        <Grid item xs={6} sm={3} key={option}>
                            <Button
                                fullWidth
                                variant={selectedOption === option ? 'contained' : 'outlined'}
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: selectedOption === option ? '#bc323a' : undefined,
                                    color: selectedOption === option ? '#fff' : '#bc323a',
                                    borderColor: '#bc323a',
                                    '&:hover': {
                                        backgroundColor: selectedOption === option ? '#a72b32' : '#fef0f1',
                                        color: selectedOption === option ? '#fff' : '#a72b32',
                                    },
                                }}
                                onClick={() => handleOptionClick(option)}
                            >
                                {option}
                            </Button>
                        </Grid>
                    ))}
                </Grid>

                {/* Name Input */}
                <div ref={nameRef} />
                {submitAttempted && fieldErrors.name && (
                    <Typography color="error" variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{fieldErrors.name}</Typography>
                )}
                <TextField
                    fullWidth
                    label="نام شما"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        updateFieldError('name', e.target.value);
                    }}
                    sx={{ mb: 2 }}
                />

                {/* City Selector */}
                <div ref={cityRef} />
                {submitAttempted && fieldErrors.city && (
                    <Typography color="error" variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{fieldErrors.city}</Typography>
                )}
                <Autocomplete
                    fullWidth
                    options={cities}
                    getOptionLabel={(option) => option?.title || ''}
                    value={selectedCity}
                    onChange={(event, newValue) => {
                        setSelectedCity(newValue);
                        updateFieldError('city', newValue);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="شهر" placeholder="انتخاب شهر" />
                    )}
                    sx={{ mb: 2 }}
                    noOptionsText="شهری پیدا نشد"
                />

                <div ref={propertyTypeRef} />
                {submitAttempted && fieldErrors.propertyType && (
                    <Typography color="error" variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{fieldErrors.propertyType}</Typography>
                )}
                <Autocomplete
                    fullWidth
                    options={propertyOptions}
                    value={propertyType}
                    onChange={(event, newValue) => {
                        setPropertyType(newValue);
                        updateFieldError('propertyType', newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="نوع ملک"
                            placeholder="انتخاب نوع ملک"
                        />
                    )}
                    sx={{ mb: 2 }}
                    noOptionsText="گزینه‌ای پیدا نشد"
                />

                {/* Budget Range Slider */}
                {(requestType === 'for_rent' || requestType === 'need_rent') ? (
                    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="ودیعه"
                                type="text"
                                value={deposit}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^\d]/g, '');
                                    setDeposit(val);
                                    updateFieldError('deposit', val);
                                }}
                                fullWidth
                                placeholder="مبلغ ودیعه به تومان"
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', dir: 'rtl', style: { MozAppearance: 'textfield' } }}
                            />
                            {deposit && (
                                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, display: 'block', textAlign: 'right', direction: 'rtl', fontSize: '0.9rem' }}>
                                    {numberToPersianText(deposit)} تومان
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="اجاره"
                                type="text"
                                value={rent}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^\d]/g, '');
                                    setRent(val);
                                    updateFieldError('rent', val);
                                }}
                                fullWidth
                                placeholder="مبلغ اجاره ماهانه به تومان"
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', dir: 'rtl', style: { MozAppearance: 'textfield' } }}
                            />
                            {rent && (
                                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, display: 'block', textAlign: 'right', direction: 'rtl', fontSize: '0.9rem' }}>
                                    {numberToPersianText(rent)} تومان
                                </Typography>
                            )}
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            بودجه (اختیاری): از {formatToman(budgetRange[0])} تا{" "}
                            {budgetRange[1] >= 5000000000
                                ? "۵ میلیارد یا بیشتر"
                                : formatToman(budgetRange[1])}
                        </Typography>
                        <Slider
                            value={budgetRange}
                            onChange={(e, newValue) => setBudgetRange(newValue)}
                            valueLabelDisplay="off"
                            min={0}
                            max={5000000000}
                            step={20000000}
                            sx={{ color: '#bc323a', width: '95%', mx: 'auto', display: 'block' }}
                        />
                    </Box>
                )}

                {/* Area Range Slider */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        متراژ (اختیاری): از {areaRange[0].toLocaleString('fa')} متر تا{" "}
                        {areaRange[1] >= 500 ? "۵۰۰ متر یا بیشتر" : `${areaRange[1].toLocaleString('fa')} متر`}
                    </Typography>
                    <Slider
                        value={areaRange}
                        onChange={(e, newValue) => setAreaRange(newValue)}
                        valueLabelDisplay="off"
                        min={0}
                        max={500}
                        step={5}
                        sx={{ color: '#bc323a', width: '95%', mx: 'auto', display: 'block' }}
                    />
                </Box>

                {/* Description */}
                <div ref={descriptionRef} />
                {submitAttempted && fieldErrors.description && (
                    <Typography color="error" variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{fieldErrors.description}</Typography>
                )}
                <TextField
                    sx={{ mb: 2 }}
                    label="توضیحات بیشتر"
                    multiline
                    fullWidth
                    minRows={1}
                    maxRows={10}
                    placeholder={renderDescriptionHint()}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        updateFieldError('description', e.target.value);
                    }}
                />

                {/* Phone */}
                <div ref={phoneRef} />
                {submitAttempted && fieldErrors.phone && (
                    <Typography color="error" variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{fieldErrors.phone}</Typography>
                )}
                <TextField
                    type='tel'
                    fullWidth
                    label="شماره تماس"
                    value={phone}
                    onChange={(e) => {
                        setPhone(e.target.value);
                        updateFieldError('phone', e.target.value);
                    }}
                    sx={{ mb: 3 }}
                    placeholder='09*********'
                />
            </Box>

            {!codeSent ? (
                <Box sx={{ maxWidth: 555, mx: 'auto', mt: 0 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleFormSubmit}
                        disabled={verifying}
                        sx={{ py: 1.5, fontWeight: 600, fontSize: 16, backgroundColor: '#bc323a', '&:hover': { backgroundColor: '#a72b32' } }}
                    >
                        ادامه
                    </Button>
                </Box>
            ) : (
                <>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <TextField
                            fullWidth
                            label="کد تایید پیامک"
                            value={smsCode}
                            onChange={(e) => setSmsCode(e.target.value)}
                            placeholder='- - - - -'
                        />
                        <Button
                            variant="outlined"
                            onClick={handleResendCode}
                            disabled={verifying}
                            sx={{ minWidth: 120, fontWeight: 600, color: '#bc323a', borderColor: '#bc323a', '&:hover': { backgroundColor: '#fef0f1', borderColor: '#a72b32', color: '#a72b32' } }}
                        >
                            ارسال مجدد کد
                        </Button>
                    </Box>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleVerifyCode}
                        sx={{ py: 1.5, fontWeight: 600, fontSize: 16, backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
                    >
                        تایید کد و ثبت نهایی
                    </Button>
                </>
            )}
            <div>
                <Modal open={showSuccessModal} onClose={resetFormAndCloseModal}>
                    <Box sx={{ maxWidth: 600, bgcolor: 'background.paper', p: 4, mx: 'auto', mt: 10, borderRadius: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography align="center" color="green" fontWeight={600}>درخواست شما با موفقیت ثبت شد</Typography>
                                <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
                                    در بعضی موارد به خاطر حجم بالای درخواست ها ممکن است تا ۴۸ ساعت زمان نیاز داشته باشیم
                                    تا درخواست شما را برسی کنیم، لطفا شماره {confirmedPhone} را روشن و در دسترس داشته باشید.
                                </Typography>
                                <Typography align="center" sx={{ mt: 2 }}>با تشکر از اعتماد شما، تیم بررسی فایل آجر</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Button fullWidth variant="contained" onClick={resetFormAndCloseModal}>متوجه شدم</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </div>
        </Box>
    );
}
