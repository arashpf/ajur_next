import { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '8%',
        width: '100%',
        // backgroundColor: '#fef6e4',
        backgroundColor: '#333',
        padding: '20px',
        boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
        textAlign: 'right', // تغییر به راست‌چین برای فارسی
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: '10px',
        direction: 'rtl', // افزودن جهت راست به چپ
      }}
    >
      <img
        src="/cookie.png" // آدرس تصویر کوکی خود را اینجا قرار دهید
        alt="کوکی"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
        }}
      />
      <div>
        <p style={{ margin: '0', fontSize: '12px',color:'#f9f9f9' }}>
          ما از کوکی‌ها برای بهبود تجربه شما استفاده می‌کنیم. با استفاده از وب‌سایت ما، شما به کوکی‌های ما رضایت می‌دهید.{' '}
          <a href="/privacy-policy" style={{ textDecoration: 'underline', color: '#c08149' }}>
            بیشتر بدانید
          </a>
        </p>
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={handleAccept}
            style={{
                margin: '5px',
                padding: '8px 15px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '.5px solid #4caf50',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
          >
            پذیرش
          </button>
          <button
            onClick={handleReject}
            style={{
                margin: '5px',
                padding: '8px 15px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '.5px solid #f44336',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
            }}
          >
            رد
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
