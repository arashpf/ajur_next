import React, { useState, useEffect} from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import styles from '../../styles/newBase.module.css';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PersonIcon from '@mui/icons-material/Person';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import Faq from '../../components/parts/Faq';

import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const new_base = (props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [problem, setProblem] = useState('test');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const onClickNewFromAgent = () => {
    console.log('new worker clicked from an agent');
    var token = Cookies.get('id_token');
    if(!token){
      console.log('you have to login');
      router.push("/panel/auth/login");
    }else{
      console.log('you are currently loged in and enjoy');
      console.log(token);
      router.push("/panel/new");
    }
  }
  const onClickNewFromPerson = () => {
    console.log('new worker clicked from a person');
    var token = Cookies.get('id_token');
    if(!token){
      console.log('you have to login');
      Cookies.set('destination_before_auth', '/panel/new', { expires: 14 });
      router.push("/panel/auth/login");
    }else{
      console.log('you are currently loged in and enjoy');
      console.log(token);
      router.push("/Counseling");
    }
  }

  const onClickNewConstruction = () => {
    console.log('new fro construction');
    setProblem('آجر سازندگان در حال حاضر در دسترس نیست');
    
    setOpen(true);
  }

  const renderNewKinds = () => {
    if(1){
      return(
        <Grid container spacing={3}>
    <Grid item xs={0} md={3}></Grid>
    <Grid item xs={12} md={6} justify='center' alignItems='center' >
        <Box sx={{ width: '100%',padding:5 }}>
          <Stack spacing={5}  >
            <div onClick={onClickNewFromPerson} className={styles.new_single_type_wrapper}>
              <div className={styles.single_icon}>
                <p><ArrowBackIosNewIcon/></p>
                </div>
              <div className={styles.single_info}>
                <p>ثبت ملک شخصی</p>
                <p><PersonIcon/></p>
              </div>
            </div>
            <div onClick={onClickNewFromAgent} className={styles.new_single_type_wrapper}>
              <div className={styles.single_icon}>
                <p><ArrowBackIosNewIcon/></p>
                </div>
              <div   className={styles.single_info} >
                <p>ثبت  فایل املاک</p>
                <p><SupportAgentIcon/></p>
              </div>
            </div>
            <div onClick={onClickNewConstruction} className={styles.new_single_type_wrapper}>
              <div className={styles.single_icon}>
                <p><ArrowBackIosNewIcon/></p>
                </div>
              <div className={styles.single_info}>
                <p>ثبت برای سازندگان </p>
                <p><HolidayVillageIcon/></p>
              </div>
            </div>
            
          
          </Stack>
        </Box>

        <Faq />

    </Grid>
    </Grid>
        
      )
    }
  }
  return (
    <div>
      {renderNewKinds()}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          {problem}
        </Alert>
      </Snackbar>
      
    </div>
  )
};

export default new_base;

