import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import CallIcon from '@mui/icons-material/Call';
import Share from '@mui/icons-material/Share';
import AddCircle from '@mui/icons-material/AddCircle';
import Home from '@mui/icons-material/Home';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { useRouter } from 'next/router';

//handler function


const actions = [
    { icon: <AddCircle />, name: 'فایل جدید',  operation: 'new'},
    { icon: <Share />, name: 'اشتراک گذاری ',  operation: 'share' }
  ]

export default function BasicSpeedDial() {
    const router = useRouter();

    function handleClick (e,operation){

  
      console.log('home dial clicked');
      router.push("/");
       e.preventDefault();
    
     };
     
  return (
    <div className="speed-dial-fixed">
    <Box md={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="ثبت فایل جدید"
        sx={{ position: 'fixed', bottom: 30, left: 16 }}
        icon={<Home  />}
        onClick={handleClick}
        FabProps={{
          sx: {
            bgcolor: '#b92a31',
            '&:hover': {
              bgcolor: 'primary.main',
            }
          }
        }}
        
      >
     
      </SpeedDial>
    </Box>
    </div>
  );
}
