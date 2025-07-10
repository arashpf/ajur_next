import React, { useState, useEffect } from "react";
import Head from "next/head";
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import DownloadIcon from '@mui/icons-material/Download';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { 
  Button, 
  Grid, 
  Box, 
  Typography, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton,
  Snackbar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';

const DownloadPage = () => {
    const [installPrompt, setInstallPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isSafari, setIsSafari] = useState(false);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        // Check if user is on iOS
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        setIsIOS(ios);
        
        // Check if user is on Safari
        const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        setIsSafari(safari);
        
        // Check if app is already installed
        const checkStandalone = () => {
            return window.matchMedia('(display-mode: standalone)').matches || 
                   window.navigator.standalone || 
                   document.referrer.includes('android-app://');
        };
        setIsStandalone(checkStandalone());

        // PWA installation prompt for Android/desktop
        const handleBeforeInstallPrompt = (e) => {
            console.log('beforeinstallprompt event fired');
            e.preventDefault();
            setInstallPrompt(true);
            setDeferredPrompt(e);
            showSnackbar('اپلیکیشن قابل نصب است');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleInstallClick = async () => {
        console.log('Install button clicked');
        
        // For iOS devices
        if (isIOS) {
            // Check if this is Safari (the only browser that supports Add to Home Screen on iOS)
            if (isSafari) {
                showIOSInstallInstructions();
            } else {
                showSnackbar('لطفاً از مرورگر Safari برای نصب استفاده کنید');
            }
            return;
        }

        // For Android/desktop Chrome
        if (deferredPrompt) {
            try {
                console.log('Prompting installation');
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                console.log(`User response: ${outcome}`);
                if (outcome === 'accepted') {
                    showSnackbar('در حال نصب اپلیکیشن...');
                    console.log('User accepted the install prompt');
                } else {
                    showSnackbar('نصب لغو شد');
                    console.log('User dismissed the install prompt');
                }
                
                setDeferredPrompt(null);
                setInstallPrompt(false);
            } catch (error) {
                console.error('Error during installation:', error);
                showSnackbar('خطا در نصب. لطفاً دوباره امتحان کنید');
                // Fallback for browsers that don't support deferredPrompt.prompt()
                window.open('https://ajur.app', '_blank');
            }
            return;
        }

        // Fallback for browsers that don't support beforeinstallprompt
        console.log('Showing manual installation instructions');
        showSnackbar('مرورگر شما از نصب خودکار پشتیبانی نمی‌کند');
        isIOS && showIOSInstallInstructions();
    };

    

    const showIOSInstallInstructions = () => {
        if (isMobile) {
            // Try to trigger the native share dialog on mobile
            if (navigator.share) {
                navigator.share({
                    title: 'نصب اپلیکیشن آجر',
                    text: 'برای نصب اپلیکیشن آجر، لطفاً از گزینه Add to Home Screen استفاده کنید',
                    url: 'https://ajur.app',
                })
                .catch(err => {
                    console.log('Error sharing:', err);
                    setShowIOSInstructions(true);
                });
            } else {
                setShowIOSInstructions(true);
            }
        } else {
            setShowIOSInstructions(true);
        }
    };

    const handleCloseIOSInstructions = () => {
        setShowIOSInstructions(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>دانلود اپلیکیشن آجر | مشاور املاک هوشمند آجر</title>
                <meta name="description" content="دانلود اپلیکیشن آجر برای اندروید و iOS | مشاور املاک هوشمند آجر" />
                
                {/* PWA Meta Tags */}
                <link rel="manifest" href="/manifest.json" />
                <meta name="application-name" content="آجر" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="آجر" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-TileColor" content="#bc323a" />
                <meta name="theme-color" content="#bc323a" />
                
                {/* Apple Touch Icons */}
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
                
                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />
                <link rel="canonical" href="https://ajur.app/download" />
            </Head>

            <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4, background: '#f9f9f9' }}>
                {/* Download Section */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom sx={{  fontFamily:'iransans'}}>
                        دانلود اپلیکیشن املاک آجر
                    </Typography>
                    
                    {/* Android Download */}
                    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium' }}>
                                نسخه اندروید
                                <AndroidIcon color="success" sx={{ fontSize: 32, ml: 1 }} />
                            </Typography>
                        </Box>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    href="https://api.ajur.app/download/ajur.apk"
                                    startIcon={<DownloadIcon fontSize="large"  />}
                                    
                                    sx={{ py: 2 }}
                                >
                                    دانلود مستقیم (APK)
                                </Button>
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ 
                                        backgroundColor: '#FF5722',
                                        '&:hover': { backgroundColor: '#E64A19' },
                                        py: 2
                                    }}
                                    size="large"
                                    href="https://cafebazaar.ir/app/com.Ajour"
                                    startIcon={
                                        <Box component="img" src="/logo/bazaar.png" alt="Café Bazaar"  sx={{ height: 24, ml: 1 }} />
                                    }
                                >
                                    دانلود از بازار
                                </Button>
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ 
                                        backgroundColor: '#9C27B0',
                                        '&:hover': { backgroundColor: '#7B1FA2' },
                                        py: 2
                                    }}
                                    size="large"
                                    href="https://myket.ir/app/com.Ajour"
                                    startIcon={
                                        <Box component="img" src="/logo/myket.png" alt="Myket" sx={{ height: 24, ml: 1 }} />
                                    }
                                >
                                    دانلود از مایکت
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                    
                    {/* iOS/PWA Download */}
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium' }}>
                                {isIOS ? 'iOS' : 'PWA'} نسخه 
                                <AppleIcon sx={{ fontSize: 32, ml: 1 }} />
                            </Typography>
                        </Box>
                        
                        <Grid container spacing={3} justifyContent="center">
                            <Grid item xs={12} md={6}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    onClick={handleInstallClick}
                                    startIcon={isIOS ? <ShareIcon /> : <AddToHomeScreenIcon />}
                                    sx={{ py: 2 }}
                                    disabled={isStandalone}
                                >
                                    {isStandalone ? 'اپلیکیشن نصب شده است' : 
                                     (isIOS ? 'نصب وب اپلیکیشن' : 'نصب نسخه PWA')}
                                </Button>
                            </Grid>
                        </Grid>
                        
                        {isIOS && !isStandalone && (
                            <Box sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
                                <Typography variant="body2">
                                    در iOS، لطفاً از مرورگر Safari استفاده کنید و پس از باز کردن سایت، گزینه "Add to Home Screen" را انتخاب نمایید.
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Box>

            {/* iOS Installation Instructions Dialog */}
            <Dialog 
                open={showIOSInstructions} 
                onClose={handleCloseIOSInstructions}
                fullScreen={isMobile}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">راهنمای نصب روی iOS</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseIOSInstructions}
                        sx={{ color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ mb: 3,direction:'rtl' }}>
                        <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            برای نصب اپلیکیشن آجر بر روی دستگاه iOS:
                        </Typography>
                        <ol style={{ paddingLeft: '20px' }}>
                            <li style={{ marginBottom: '10px' }}>
                                <Typography variant="body1">
                                    در مرورگر Safari، روی دکمه <strong>"اشتراک گذاری"</strong> (مربع با فلش رو به بالا) ضربه بزنید
                                </Typography>
                            </li>
                            <li style={{ marginBottom: '10px' }}>
                                <Typography variant="body1">
                                    گزینه <strong>"Add to Home Screen"</strong> را انتخاب کنید
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body1">
                                    روی <strong>"Add"</strong> در بالای صفحه ضربه بزنید
                                </Typography>
                            </li>
                        </ol>
                    </Box>
                    {/* <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <img 
                            src="/ios-install-instructions.png" 
                            alt="iOS Installation Instructions" 
                            style={{ 
                                maxWidth: '100%', 
                                height: 'auto', 
                                border: '1px solid #eee',
                                borderRadius: '8px'
                            }}
                        />
                    </Box> */}
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleCloseIOSInstructions} 
                        color="primary"
                        variant="contained"
                        fullWidth={isMobile}
                        size="large"
                    >
                        فهمیدم
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleCloseSnackbar}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                sx={{
                    [theme.breakpoints.up('md')]: {
                        bottom: '24px'
                    }
                }}
            />
        </div>
    )
}

export default DownloadPage;