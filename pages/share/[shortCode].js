// pages/share/[shortCode].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import WorkerCard from "../../components/cards/WorkerCard";
import { Box, Container, Typography, Grid } from '@mui/material';
import Link from "next/link";

export default function SharePage() {
  const router = useRouter();
  const { shortCode } = router.query; 
  const [items, setItems] = useState([]);
  const [Agent, setAgent] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shortCode) return;

    const fetchSharedItems = async () => {
      try {
        const res = await fetch(`https://api.ajur.app/api/share/${shortCode}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to load shared items');

        setItems(data.items || []);
        setAgent(data.shared_by || null);

        // Check if user is on mobile and redirect to app
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.location.href = `ajour://share/${shortCode}`;
        }
      } catch (err) {
        setError(err && err.message ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSharedItems();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="spinnerImageView">
        <img
          className="spinner-image"
          src="/logo/ajour-gif.gif"
          alt="ajur logo"
        />
      </div>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Head>
        <title>لیست اختصاصی آجر</title>
        <meta property="og:title" content="لیست اختصاصی آجر" />
        <meta property="og:description" content={`${items.length} فایل به اشتراک گذاشته شده توسط ${Agent ? `${Agent.name || ''} ${Agent.family || ''}` : ''}`} />
      </Head>

      <Box sx={{ padding: "10px 2px", flexGrow: 1 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            padding: 2,
            color: '#555',
            fontSize: 22,
            fontFamily: 'iransans'
          }}
        >
          فایل های ارسالی توسط {Agent ? `${Agent.name || ''} ${Agent.family || ''}` : ''} برای شما
        </Typography>
        
        <Box sx={{ flexGrow: 1, py: 3, px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2}>
            {items.length > 0 ? (
              items.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Link 
                    href={`/worker/${item.id}?slug=${item.slug}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <WorkerCard worker={item} />
                  </Link>
                </Grid>
              ))
            ) : (
              <Grid item xs={12} style={{ background: "white" }}>
                <p style={{ textAlign: "center", padding: 20 }}>
                  متاسفانه موردی یافت نشد
                </p>
                <div style={{ textAlign: "center", margin: "20px 0" }}>
                  <img
                    src="/logo/not-found.png"
                    alt="ملکی پیدا نشد"
                    width={200}
                    height={120}
                    style={{ maxWidth: "100%" }}
                  />
                </div>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </div>
  );
}