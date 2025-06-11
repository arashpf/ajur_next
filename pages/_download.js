import React, { useState, useEffect } from "react";
import ContactUs from '../components/parts/ContactUs';
import AboutUs from '../components/parts/AboutUs';
import WorkTime from '../components/parts/WorkTime';
import Head from "next/head";
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import DownloadIcon from '@mui/icons-material/Download';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { Button, Grid, Box, Typography, Paper } from '@mui/material';

 // PWA Install Button Logic
let deferredPrompt;

const Contact = (props) => {

    const [installPrompt, setInstallPrompt] = useState(false);
    useEffect(() => {
        
        // Detect if the app can be installed (only on mobile)
        const handler = (e) => {
          e.preventDefault();
          deferredPrompt = e;
          setInstallPrompt(true);
        };
        
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
      }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            console.log(choiceResult.outcome);
            setInstallPrompt(false); // Hide the button after installation prompt is shown
          });
        }
      };
  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="robots" content="max-image-preview:large" />
        <title>دانلود اپلیکیشن آجر | مشاور املاک هوشمند آجر</title>
        <meta name="description" content="دانلود اپلیکیشن آجر برای اندروید و iOS | مشاور املاک هوشمند آجر" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="دانلود اپلیکیشن آجر | مشاور املاک هوشمند آجر" />
        <meta property="og:description" content="دانلود اپلیکیشن آجر برای اندروید و iOS | مشاور املاک هوشمند آجر" />
        <meta property="og:url" content="https://ajur.app/download" />
        <meta property="og:site_name" content="مشاور املاک هوشمند آجر" />
        <meta property="og:image" content="https://ajur.app/logo/ajour-meta-image.jpg" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="533" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://ajur.app/download" />
      </Head>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 ,background:'#f9f9f9'}}>
        {/* Download Section */}
        <Box sx={{ mb: 6 }}>
          <h1 variant="h3" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
             دانلود اپلیکیشن آجر
          </h1>
          
          {/* Android Download */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <div sx={{ display: 'flex', alignItems: 'center', mb: 3,textAlign:'center' }}>
              
              <p variant="h5" align="center" component="h2" sx={{ fontWeight: 'medium',textAlign:'center',align:'center' }}>
                نسخه اندروید
                <AndroidIcon color="success" sx={{ fontSize: 32, ml: 1,textAlign:'center' }} />
              </p>
            </div>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  href="https://api.ajur.app/download/ajur.apk"
                  startIcon={<DownloadIcon />}
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
                    <Box component="img" src="/logo/bazaar.png"  alt="Café Bazaar" sx={{ height: 24, ml: 1 }} />
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
          
          {/* iOS Download */}
          <Paper elevation={3} sx={{ p: 4 }} >
            

            <div sx={{ display: 'flex', alignItems: 'center', mb: 3,textAlign:'center' }}>
              
              <p variant="h5" align="center" component="h2" sx={{ fontWeight: 'medium',textAlign:'center',align:'center' }}>
              iOS  نسخه 
              <AppleIcon sx={{ fontSize: 32, ml: 1 }} />
              </p>
            </div>
            
            <Grid container spacing={3}>
              {/* <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ 
                    backgroundColor: 'black',
                    '&:hover': { backgroundColor: '#333' },
                    py: 2
                  }}
                  size="large"
                  href="YOUR_APPSTORE_LINK"
                  startIcon={<AppleIcon />}
                >
                  دانلود از اپ استور
                </Button>
              </Grid> */}
              
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                //   href="YOUR_PWA_LINK"
                  onClick={handleInstallClick}
                  startIcon={<PhoneIphoneIcon />}
                  sx={{ py: 2 }}
                >
                PWA  نصب نسخه  ( وب اپلیکیشن)
                </Button>
              </Grid>
            </Grid>
            
         
          </Paper>
        </Box>
        
        
      </Box>

      {/* <ContactUs />
      <WorkTime />
      <AboutUs /> */}
    </div>
  )
}

export default Contact