// pages/signup.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    Typography,
    TextField,
    Button,
    Container,
    FormHelperText,
    IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import Cookies from 'js-cookie';
import MarketLayout from '../../../components/layouts/MarketLayout';


function Login() {
    const router = useRouter();
    const { next } = router.query;
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = Cookies.get('id_token');
        if (token) {
            router.push("/panel");
        }
    }, []);

    const RESEND_INTERVAL = 60; // seconds


    const handleSubmit = async (e) => {
        e.preventDefault();

        const lastRequest = localStorage.getItem('code_requested_at');
        const now = Math.floor(Date.now() / 1000);

        if (lastRequest && now - lastRequest < RESEND_INTERVAL) {
            const remaining = RESEND_INTERVAL - (now - lastRequest);
            setError(`لطفاً ${remaining} ثانیه صبر کنید و سپس دوباره تلاش کنید.`);
            return;
        }

        if (!phoneNumber) {
            setError('لطفاً شماره تماس خود را وارد کنید');
            return;
        }

        if (phoneNumber.length !== 11) {
            setError('شماره موبایل باید ۱۱ رقم باشد');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const ref = Cookies.get('ref');

            await axios.post('https://api.ajur.app/webauth/register', null, {
                params: {
                    phone: phoneNumber,
                    ref: ref,
                },
            });

            // ✅ Set timestamp for cooldown
            localStorage.setItem('code_requested_at', now.toString());

            Cookies.set('phone', phoneNumber);
            // Pass next param to verify page if present
            if (next) {
                router.push(`/panel/auth/verify?next=${encodeURIComponent(next)}`);
            } else {
                router.push('/panel/auth/verify');
            }
        } catch (err) {
            setError('خطایی در ارسال درخواست رخ داد');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Container
            maxWidth="xs"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                backgroundImage: "url('/img/SignUp/signupback.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 4, sm: 6, md: 8 },
            }}
        >
            {/* دکمه برگشت */}
            <IconButton
                sx={{
                    position: 'absolute',
                    top: { xs: 8, sm: 16, md: 24 },
                    left: { xs: 8, sm: 16, md: 24 },
                    color: '#fff',
                    zIndex: 3,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                }}
                onClick={() => router.push('/')}
            >
                <ArrowBackIcon sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />
            </IconButton>

            <Box
                sx={{
                    width: '100%',
                    zIndex: 2,
                    textAlign: 'center',
                    color: '#fff',
                    mt: { xs: -10, sm: -15, md: -18 },
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={{ xs: 1.5, sm: 2, md: 2.5 }}
                    fontSize={{ xs: '20px', sm: '24px', md: '26px' }}
                >
                    ورود به پنل شخصی
                </Typography>
                <Typography
                    variant="body2"
                    mb={1}
                    fontSize={{ xs: '14px', sm: '16px', md: '17px' }}
                >
                    جهت ورود شماره تماس خود را وارد کنید
                </Typography>
                <Typography
                    variant="caption"
                    display="block"
                    mb={{ xs: 2, sm: 3, md: 3.5 }}
                    fontSize={{ xs: '12px', sm: '13px', md: '14px' }}
                >
                    شما با وارد کردن شماره خود{' '}
                    <a href="#" style={{ color: '#add8e6', textDecoration: 'underline' }}>
                        قوانین و مقررات آجر
                    </a>{' '}
                    را قبول می‌کنید
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        placeholder="شماره تماس"
                        variant="standard"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        error={!!error}
                        inputProps={{
                            inputMode: 'numeric',
                            dir: 'ltr',
                        }}
                        sx={{
                            input: {
                                color: '#fff',
                                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                                textAlign: 'center',
                            },
                            '& .MuiInput-underline:before': {
                                borderBottomColor: '#fff',
                            },
                            '& .MuiInput-underline:after': {
                                borderBottomColor: '#fff',
                            },
                        }}
                    />
                    {error && (
                        <FormHelperText sx={{ textAlign: 'center', color: '#ffdede' }}>
                            {error}
                        </FormHelperText>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: '#e3e0db',
                            color: '#a92a21',
                            borderRadius: '25px',
                            fontWeight: 'bold',
                            mt: { xs: 3, sm: 4, md: 5 },
                            py: 1.5,
                            fontSize: { xs: '14px', sm: '16px', md: '18px' },
                            boxShadow: '4px 4px 0px rgba(0,0,0,0.4)',
                            '&:hover': {
                                backgroundColor: '#d5d3cf',
                            },
                        }}
                    >
                        دریافت کد
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default Login;

Login.getLayout = function (page) {
    return <MarketLayout>{page}</MarketLayout>;
};