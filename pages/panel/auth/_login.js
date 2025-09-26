import React, { useState, useEffect} from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import Stack from '@mui/material/Stack';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://ajur.app/">
        Ajur.app
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Login() {

  const router = useRouter();
  const [text, set_text] = useState(2);
  const [phone, set_phone] = useState(0);
  const [loading, set_loading] = useState('false');
  const [open, setOpen] = useState(false);
  const [problem, setProblem] = useState('test');



  useEffect(() => {
    var token = Cookies.get('id_token');
    if(token){
      router.push("/panel");
    }else{

    }
  }, []);





  const change_phone = (phone) => {
    console.log(phone.target.value);
     set_phone(phone.target.value);
}

const handleClick = () => {
   setOpen(true);
 };


 const handleClose = (event, reason) => {
   if (reason === 'clickaway') {
     return;
   }
   setOpen(false);
 };

  const handleSubmit = (event) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // console.log({
    //   email: data.get('email'),
    //   password: data.get('password'),
    // });


    console.log(phone);

   if(phone.length != 11 ){
          setProblem('شماره موبایل باید ۱۱ رقم باشد');
           console.log('the length of phone');
           setOpen(true);
           console.log(phone.length);
           // toast.show({
           //   render: () => {
           //     return <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
           //           <Text style={{color:'white',fontSize:16}}>  فرمت شماره معتبر نیست</Text>
           //           </Box>;
           //   }
           // });

    }else{
      // AsyncStorage.setItem('cellphone', phone);
      // TODO: set the session of cellphone here

      set_loading(true);
      var ref = Cookies.get('ref');

      axios({
            method:'post',
            url:'https://api.ajur.app/webauth/register',
            params: {
             phone: phone,
             ref: ref,
              },

      })
      .then(function (response) {

       })
       set_loading('false');

       setProblem('لطفا کد تایید را از اس ام اس ارسالی وارد کنید');

        setOpen(true);

       console.log('please provide the fu..king code we send you !!!');

        Cookies.set('phone', phone);

       router.push("/panel/auth/verify");
       // toast.show({
       //   render: () => {
       //     return <Box bg="green.700" px="15" py="3" rounded="md" mb={5}>
       //           <Text style={{color:'white',fontSize:16}}>لطفا کد تایید را از اس ام اس دریافتی وارد کنید</Text>
       //           </Box>;
       //   },
       //   placement: "top"
       // });
        // navigation.navigate('Rvalidation', {
        //      phone: phone,
        //    })
        // TODO: link to the validation page with phone number
    }

  };




  return (
    <ThemeProvider theme={theme} style={{background:'white'}}>
      <Container component="main" maxWidth="xs" style={{background:'white'}}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h3" variant="h6">
             <p>لطفا شماره موبایل خود را وارد کنید</p>
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Input
             placeholder="09XXXXXXXX"
             type="tel"
              style={{fontSize:26}}
              margin="normal"
              required
              fullWidth
              id="email"
              label="شماره موبایل"
              name="email"
              autoComplete="email"
              onChange={(phone) => change_phone(phone)}
              autoFocus
            />

            <Button
              type="submit"
              
              
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
            >
              <div style={{fontSize:18}}>دریافت کد اس ام اسی</div>
            </Button>

          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          {problem}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
