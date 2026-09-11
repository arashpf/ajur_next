// pages/share/[shortCode].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import WorkerCard from "../../components/cards/WorkerCard";
import { Box, Container, Typography } from '@mui/material';
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
    // return (
    //   <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    //     <Typography>Loading...</Typography>
    //   </Box>
    // );

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
        <title>Shared Real Estate Listings</title>
        <meta property="og:title" content={`${items.length} Shared Listings`} />
        <meta property="og:description" content="سلام، لطفا یه نگاهی به این فایل ها بندازید" />
      </Head>

      <Container maxWidth="lg" sx={{ py: 4 }}>
  <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 1 ,fontFamily:'iransans'}}>
   {' فایل های ارسالی توسط '}
   {Agent ? `${Agent.name || ''} ${Agent.family || ''}` : ''}
   {' برای شما '}
  </Typography>
        
        {/* Scrollable Grid Container */}
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 3,
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            padding: 2
          }}
        >
          {items.map((item) => (
            <Link key={item.id} href={`/worker/${item.id}?slug=${item.slug}`}>
             
                <WorkerCard worker={item} />
             
            </Link>
          ))}
        </Box>

        {/* <Box textAlign="center" mt={4} sx={{ display: { xs: 'block', sm: 'none' } }}>
  <a 
    href={ajour://share/${shortCode}}
    style={{
      padding: '10px 20px',
      backgroundColor: '#b92a31',
      color: 'white',
      borderRadius: '4px',
      textDecoration: 'none',
      display: 'inline-block'
    }}
  >
    Open in Ajour App
  </a>
</Box> */}
      </Container>
    </div>
  );
}