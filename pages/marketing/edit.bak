import React, { useState, useEffect} from "react";
import MarketLayout from '../../components/layouts/MarketLayout';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import  MainListItems  from '../../components/panel/listItems';
import Chart from '../../components/panel/Chart';
import Deposits from '../../components/panel/Deposits';
import Orders from '../../components/panel/Orders';
import SpinnerLoader from '../../components/panel/SpinnerLoader';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import CategoryForm from '../../components/panel/new/CategoryForm';
import MainForm from '../../components/panel/new/MainForm';
import TextField from "@mui/material/TextField";
import dynamic from "next/dynamic";
const LocationForm = dynamic(() => import("../../components/panel/new/LocationForm"), { ssr: false });

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/router'



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
});

import axios from 'axios';
import Cookies from 'js-cookie';
const steps = ['اطلاعات عمومی', 'فیلدها', 'نقشه'];



const theme = createTheme();





function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://ajur.app">
        Ajur.app
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 250;

const mdTheme = createTheme();


//start of the main functin

const editMarketer = (props) => {
    const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const [loading, set_loading] = useState(true);
  const [data, set_data] = useState([]);
  const [realstateImage, set_realstateImage] = useState('');
  const [profileImage, set_profileImage] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [cat, set_cat] = React.useState([]);
  const [basecategories, set_basecategories] = useState([]);
  const [returnedWorker, set_returnedWorker] = useState([]);
  const [realstate, set_realstate] = useState([]);
  const [realstate_name, set_realstate_name] = useState('agency');
  const [name, set_name] = useState('arash');
  const [family, set_family] = useState('pf');
  const [description, set_description] = useState('description');

  const [user_name, set_user_name] = useState('');
  const [problem, setProblem] = useState('username_test_problem');
  const [vertical, set_vertical] = useState('top');
  const [horizontal, set_horizontal] = useState('center');
  

  function handleClose(){
    setOpen(false);
    console.log('close snack is cliked'); 
  }


 
  useEffect(() => {


    var token = Cookies.get('id_token');
    if(!token){
      console.log('you have to login');
    }else{
      console.log('you are currently loged in and enjoy');
      console.log(token);
    }

      axios({
        method: 'get',
        url: 'https://api.ajur.app/api/get-user',
        params: {
          token: token,
        },
      }).then(function (response) {

        console.log('the response from the get-user');
        console.log(response.data);

        if(response.data.user.username){
          set_user_name(response.data.user.username);
        }
        // 
        
        set_data(response.data.user);
        set_realstate(response.data.user);
        set_profileImage(response.data.user.profile_url);
        set_realstateImage(response.data.user.realstate_url);

        set_realstate_name(response.data.user.realstate);
        set_name(response.data.user.name);
        set_family(response.data.user.family);
        set_description(response.data.user.description);
        set_loading(false);
      });


            const unloadCallback = (event) => {
         event.preventDefault();
         event.returnValue = "";
         return "";
       };

       window.addEventListener("beforeunload", unloadCallback);
       return () => window.removeEventListener("beforeunload", unloadCallback);

  }, []);


  //function called from the CategoryForm





  //end of the function called from CategoryForm



 

  const handleOpenUserMenu = () => {
    console.log('user avatar clicked');
  }

  const onConfirmEdit = () => {
    // Todo: username must be unique in user table
    if(user_name.length < 3){
        setProblem('نام کاربری باید حد اقل سه حرف باشد')
        setOpen(true);
    }else{
        
        set_loading(false);

        var token = Cookies.get('id_token');
        axios({
            method: 'post',
            url: 'https://api.ajur.app/api/edit-marketer',
            params: {
              token: token,
              user_name : user_name,
              name : name,
              family: family
            },
          }).then(function (response) {
    
            console.log('the response from the edit marketer');
            console.log(response.data);
            
            if(response.data.status = 200) {

                Cookies.set('ref', user_name, { expires: 365 });

                setProblem('اطلاعات شما با موفقیت ویرایش شد');
                setOpen('true');
            
                router.push("/marketing/single");
            }else{
                setProblem('متاسفانه مشکلی پیش آمده ');
                setOpen('true');
            }
    
            
            set_loading(false);
          }).catch(function (error) {
            console.log('something is wrong with axios');
            console.log(error);
            setProblem('متاسفانه مشکلی در سرور  رخ داده ');
            setOpen('true');
          });
    }

   
  }


  if(loading){
    return (
        <SpinnerLoader />
    )
  }else{
    return (
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          
            
         

          {/* start of the componet inside seciotn  */}

          <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>

          <p style={{textAlign:'center'}}>بخش ویرایش اطلاعات بازاریاب</p>
          <ButtonGroup  aria-label="outlined primary button group" fullWidth>
          
          
        </ButtonGroup>

          <Grid container spacing={3}>

            
            <Grid item xs={12} md={12}>
                <TextField
                 
                required
                id="Name"
                autoFocus
                label="نام کاربری (به انگلیسی) "
                fullWidth
                autoComplete="cc-name"
                value={user_name}
                variant="standard"
                onChange={(uname) => set_user_name(uname.target.value)}
                style={{ textAlign: "left", direction: "ltr" }}
              />
            </Grid>

            <Grid item xs={6} md={6}>
                <TextField
                
                id="Name"
                label="نام"
                fullWidth
                autoComplete="cc-name"
                value={name}
                variant="standard"
                onChange={(title) => set_name(title.target.value)}
                style={{ textAlign: "right", direction: "rtl" }}
              />
            </Grid>

            <Grid item xs={6} md={6}>
                <TextField
                
                id="Name"
                label="فامیلی"
                fullWidth
                value={family}
                autoComplete="cc-name"
                variant="standard"
                onChange={(title) => set_family(title.target.value)}
                style={{ textAlign: "right", direction: "rtl" }}
              />
            </Grid>
          </Grid>

          

          
          
          
        </Paper>
        

        
       

        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0,zIndex:10 }} elevation={9}>
				{
                    user_name.length > 0 ?
                    <>
                    <Button onClick={onConfirmEdit} size="large" variant="contained" fullWidth={true} style={{fontSize:20,height:70}}>تایید و ادامه  </Button>
                    </>
                    :
                    <>
                    <Button size="large" disabled variant="contained" fullWidth={true} style={{fontSize:20,height:70}}>تایید و ادامه  </Button>

                    </>
                }
		</Paper>

        <Copyright />

        <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} autoHideDuration={10000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
            {problem}
            </Alert>
        </Snackbar>

      </Container>


          {/* end of the componet inside section  */}

         
        </Box>
       
      </ThemeProvider>
    );
  }




}


export default  editMarketer
editMarketer.getLayout = function(page) {
  return <MarketLayout>{page}</MarketLayout>;
};
