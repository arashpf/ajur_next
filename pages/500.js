import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useRouter } from 'next/router';

export default function Custom500() {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Card
          sx={{
            width: '100%',
            textAlign: 'center',
            boxShadow: 3,
            borderRadius: 2,
            p: 4,
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 80,
              color: 'error.main',
              mb: 2,
            }}
          />
          <CardContent>
            <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
              500
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
              خطای سرور داخلی
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              متاسفانه مشکلی در سرور رخ داده است. لطفاً بعداً دوباره تلاش کنید.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/')}
              >
                بازگشت به صفحه اصلی
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.back()}
              >
                بازگشت به صفحه قبل
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
