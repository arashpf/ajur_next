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

const RESEND_INTERVAL = 60; // seconds

function Verify() {
    const router = useRouter();
    const { next } = router.query;
    const [code, setCode] = useState('');
    const [number, setNumber] = useState('');
    const [ref, setRef] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [cooldown, setCooldown] = useState(RESEND_INTERVAL);


    useEffect(() => {
        const phone = Cookies.get('phone');
        const refCookie = Cookies.get('ref');
        if (phone) setNumber(phone);
        if (refCookie) setRef(refCookie);

        const lastRequest = parseInt(localStorage.getItem('code_requested_at'), 10);
        const now = Math.floor(Date.now() / 1000);
        if (lastRequest && now - lastRequest < RESEND_INTERVAL) {
            setCooldown(RESEND_INTERVAL - (now - lastRequest));
        } else {
            setCooldown(0);
        }
    }, []);


    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (code.length !== 5) {
            setError('کد باید ۵ رقم باشد');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await axios.post('https://api.ajur.app/webauth/verify', null, {
                params: {
                    phone: number,
                    code,
                    ref,
                    password: 'ddr007',
                },
            });

            if (res.data.status === 'success') {
                const { token } = res.data.result;
                Cookies.set('id_token', token, { expires: 30, sameSite: 'Lax' });
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem('id_token', token);
                }
                Cookies.set('user_name', res.data.user.name);

                // ✅ Clear cooldown so user can re-register cleanly later
                localStorage.removeItem('code_requested_at');

                // Redirect to next param if present, else to /panel
                if (next) {
                    router.replace(next);
                } else {
                    router.push('/panel');
                }
            } else {
                setError(
                    res.data.status === 'useless'
                        ? 'مدت زمان استفاده از این کد تمام شده'
                        : 'کد وارد شده اشتباه است'
                );
            }
        } catch {
            setError('خطا در ارتباط با سرور');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;

        try {
            await axios.post('https://api.ajur.app/webauth/register', null, {
                params: {
                    phone: number,
                    ref: ref,
                },
            });

            const now = Math.floor(Date.now() / 1000);
            localStorage.setItem('code_requested_at', now.toString());
            setCooldown(RESEND_INTERVAL);
            setError('');
        } catch {
            setError('خطایی در ارسال مجدد کد رخ داد');
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
                onClick={() => router.back()}
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
                    کد تأیید را وارد کنید
                </Typography>
                <Typography
                    variant="body2"
                    mb={1}
                    fontSize={{ xs: '14px', sm: '16px', md: '17px' }}
                >
                    کد تأیید ارسال‌شده به شماره زیر را وارد کنید:
                </Typography>

                <Typography
                    variant="caption"
                    display="block"
                    mb={{ xs: 2, sm: 3, md: 3.5 }}
                    fontSize={{ xs: '14px', sm: '15px', md: '16px' }}
                >
                    {number}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        placeholder="- - - - -"
                        variant="standard"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        inputProps={{
                            inputMode: 'numeric',
                            dir: 'ltr',
                            maxLength: 5,
                        }}
                        error={!!error}
                        sx={{
                            input: {
                                color: '#fff',
                                fontSize: { xs: '20px', sm: '22px', md: '24px' },
                                textAlign: 'center',
                                letterSpacing: '10px',
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
                        disabled={loading}
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
                        تایید
                    </Button>
                </form>

                <Typography
                    variant="body2"
                    sx={{
                        color: cooldown > 0 ? '#ccc' : '#add8e6',
                        mt: 2,
                        textDecoration: cooldown > 0 ? 'none' : 'underline',
                        cursor: cooldown > 0 ? 'default' : 'pointer',
                        transition: 'color 0.3s',
                    }}
                    onClick={handleResend}
                >
                    {cooldown > 0
                        ? `ارسال مجدد کد تا ${cooldown} ثانیه دیگر`
                        : 'ارسال مجدد کد'}
                </Typography>

                <Typography
                    variant="caption"
                    color="#ccc"
                    mt={3}
                    display="block"
                    fontSize="12px"
                >
                    © {new Date().getFullYear()} Ajur.app
                </Typography>
            </Box>
        </Container>
    );
}

export default Verify;

Verify.getLayout = function (page) {
    return <MarketLayout>{page}</MarketLayout>;
};
