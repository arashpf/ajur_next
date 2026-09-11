import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { keyframes } from '@emotion/react';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const CityChangeAlertDialog = ({
  open,
  onClose,
  onConfirm,
  currentCity,
  newCity,
  title = "نیاز به تغییر شهر در آجر",
  confirmButtonText = "تغییر شهر",
  cancelButtonText = "لغو",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '90%',
          maxWidth: '400px',
          maxHeight: '70vh',
          borderRadius: '16px',
          overflow: 'hidden',
        }
      }}
    >
      {/* Simple header with brand color */}
      <Box
        sx={{
          backgroundColor: '#b92a31',
          padding: '20px 24px 16px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            animation: `${bounce} 2s infinite ease-in-out`,
            marginBottom: '12px',
          }}
        >
          <LocationOnIcon 
            sx={{ 
              fontSize: 36, 
              color: 'white',
            }} 
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 600,
            fontSize: '1.1rem',
            marginBottom: '8px',
          }}
        >
          {title}
        </Typography>
        
        {/* New text below title */}
        
      </Box>

      <DialogContent sx={{ padding: '20px' }}>
        {/* Simple centered content */}
        <Box
          sx={{
            backgroundColor: 'rgba(185, 42, 49, 0.03)',
            borderRadius: '10px',
            padding: '20px',
            border: '1px solid rgba(185, 42, 49, 0.1)',
            marginTop: '8px',
            textAlign: 'center',
          }}
        >
         
          
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              backgroundColor: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              mt: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#666',
              }}
            >
              {currentCity}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#b92a31',
                mx: 1,
              }}
            >
              →
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#b92a31',
                fontWeight: 600,
              }}
            >
              {newCity}
            </Typography>
          </Box>
        </Box>

        {/* Additional note */}
       
      </DialogContent>

      <DialogActions
        sx={{
          padding: '16px 24px 24px',
          borderTop: '1px solid #f0f0f0',
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            borderRadius: '10px',
            padding: '10px',
            borderColor: '#ddd',
            color: '#666',
            fontWeight: 500,
            '&:hover': {
              borderColor: '#999',
              backgroundColor: '#f9f9f9',
            }
          }}
        >
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="outlined"
          fullWidth
          sx={{
            borderRadius: '10px',
            padding: '10px',
            borderColor: '#b92a31',
            color: '#b92a31',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#a0252c',
              backgroundColor: 'rgba(185, 42, 49, 0.04)',
            }
          }}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CityChangeAlertDialog;