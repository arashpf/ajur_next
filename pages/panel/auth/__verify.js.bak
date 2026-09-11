import React, { useState, useEffect } from "react";
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

export default function Verify() {



  const router = useRouter();
  const [text, set_text] = useState(2);
  const [code, set_code] = useState(0);
  const [loading, set_loading] = useState('false');
  const [open, setOpen] = useState(false);
  const [problem, setProblem] = useState('test');
  const [number, set_number] = useState(0);

  const [ref, set_ref] = useState('arashpf');

  // Hint: if user indtroduce from a marketer just set the marketer username here 
  useEffect(() => {
    var ref = Cookies.get('ref');
    if (ref) {
      set_ref(ref);
    } else {
    }
  }, []);

  useEffect(() => {
    console.log('the cookie passed from login section is ');
    var phone = Cookies.get('phone');
    console.log(phone);
    set_number(phone);

  }, [])
  const change_code = (code) => {
    console.log(code.target.value);
    set_code(code.target.value);
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


    console.log(code);

    if (code.length != 5) {
      setProblem('کد باید ۵ رقم باشد');
      console.log('the length of phone');
      setOpen(true);
      console.log(code.length);
      // toast.show({
      //   render: () => {
      //     return <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
      //           <Text style={{color:'white',fontSize:16}}>  فرمت شماره معتبر نیست</Text>
      //           </Box>;
      //   }
      // });

    } else {
      // AsyncStorage.setItem('cellphone', phone);
      // TODO: set the session of cellphone here

      console.log('the phone number is :');
      console.log(number);

      console.log('the code came from user input');
      console.log(code);

      set_loading(true);

      //axios  call


      console.log('the cookie passed from login section is ');

      axios({
        method: 'post',
        url: 'https://api.ajur.app/webauth/verify',
        params: {
          phone: number,
          code: code,
          ref: ref,
          password: 'ddr007'
        },
      })
        .then(function (response) {

          console.log('the response in axios of verify is : ');
          console.log(response.data);

          set_loading('false');



          if (response.data.status == 'success') {


            setProblem('با موفقیت وارد شدید');
            console.log('the length of phone');
            setOpen(true);



            Cookies.set('id_token', response.data.result.token, { expires: 30 });
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem('id_token', response.data.result.token);
            }
            Cookies.set('stars', JSON.stringify(response.data.stars));
            Cookies.set('user_name', response.data.user.name);
            Cookies.set('user_family', response.data.user.family);
            Cookies.set('user_phone', response.data.user.phone);
            Cookies.set('user_realstate', response.data.user.realstate);
            Cookies.set('user_city', response.data.user.city);
            Cookies.set('user_description', response.data.user.description);
            Cookies.set('user_profile_url', response.data.user.profile_url);
            Cookies.set('user_realstate_url', response.data.user.realstate_url);

            var destination_before_auth = Cookies.get('destination_before_auth');
            if (destination_before_auth) {


              Cookies.remove('destination_before_auth');
              router.push(destination_before_auth);

            } else {
              router.push("/panel");
            }





          } else if (response.data.status == 'useless') {


            setProblem('مدت زمان استفاده از این کد تمام شده');
            setOpen(true);

            return {
              redirect: {
                destination: '/panel/auth/login',
                permanent: true,
              },
            }

          }
          else {
            setProblem('کد وارد شده اشتباه است ');
            setOpen(true);
          }



        })

      //end of axios  call




    }

  };




  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" style={{ background: 'white' }}>
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
          <Typography component="h1" variant="h5">
            کد تایید را وارد کنید
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Input
              placeholder={number}

              disabled
              style={{ fontSize: 18 }}
              margin="normal"
              required
              fullWidth




            />
            <Input
              margin="normal"
              required
              type="tel"
              fullWidth
              style={{ fontSize: 30 }}
              id="code"
              placeholder="- - - - -"
              name="code"
              autoComplete="code"
              onChange={(code) => change_code(code)}
              autoFocus
            />

            <Button
              type="submit"

              fullWidth
              variant="contained"
              sx={{ mt: 0, mb: 2 }}
              size="small"
            >
              <div style={{ fontSize: 20 }}>
                تایید
              </div>

            </Button>
            <Grid container>
              <Grid item xs>
                <Link href={'/panel/auth/login'} variant="body2">
                  شماره اشتباه؟ / ارسال مجدد کد؟
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {number}
                </Link>
              </Grid>
            </Grid>
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
