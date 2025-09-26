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
        textAlign: 'center',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: '20px',
      }}
    >
      <img
        src="/cookie.png" // Add your cookie image file here
        alt="Cookie"
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
        }}
      />
      <div>
        <p style={{ margin: '0', fontSize: '16px',color:'#f9f9f9' }}>
          We use cookies to improve your experience. By using our website, you consent to our cookies.{' '}
          <a href="/privacy-policy" style={{ textDecoration: 'underline', color: '#c08149' }}>
            Learn more
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
            Accept
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
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
