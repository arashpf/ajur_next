import React, { useState, useEffect, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Lightweight snackbar provider that exposes window.__showSnackbar(message, {severity, duration})
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MuiSnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [duration, setDuration] = useState(4000);

  const show = useCallback((msg, opts = {}) => {
    setMessage(msg || '');
    setSeverity(opts.severity || 'info');
    setDuration(typeof opts.duration === 'number' ? opts.duration : 4000);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__showSnackbar = show;
    }

    return () => {
      if (typeof window !== 'undefined') {
        try { delete window.__showSnackbar; } catch (e) { window.__showSnackbar = undefined; }
      }
    };
  }, [show]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          // push snackbar up so it's not hidden by bottom nav / FAB
          bottom: { xs: '110px', sm: '80px' },
        }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MuiSnackbarProvider;
