// import React, { useState, useEffect} from "react";
// import PanelLayout from '../../components/layouts/PanelLayout';
// import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import MuiDrawer from '@mui/material/Drawer';
// import Avatar from '@mui/material/Avatar';
// import Box from '@mui/material/Box';
// import Tooltip from '@mui/material/Tooltip';
// import MuiAppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import List from '@mui/material/List';
// import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
// import Badge from '@mui/material/Badge';
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import Link from '@mui/material/Link';
// import MenuIcon from '@mui/icons-material/Menu';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import  MainListItems  from '../../components/panel/listItems';
// import Chart from '../../components/panel/Chart';
// import Deposits from '../../components/panel/Deposits';
// import Orders from '../../components/panel/Orders';
// import SpinnerLoader from '../../components/panel/SpinnerLoader';
// import SpeedDial from '../../components/panel/SpeedDial';
// import CatCard2 from '../../components/cards/CatCard2';
// import WorkerCard from '../../components/cards/WorkerCard';
// import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { useRouter } from 'next/router';
// import Styles from '../../components/styles/panel/index.module.css'


// import axios from 'axios';
// import Cookies from 'js-cookie';


// function Copyright(props) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://ajur.app">
//         Ajur.app
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

// const drawerWidth = 250;

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(['width', 'margin'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(['width', 'margin'], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

// const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
//   ({ theme, open }) => ({
//     '& .MuiDrawer-paper': {
//       position: 'relative',
//       whiteSpace: 'nowrap',
//       width: drawerWidth,
//       transition: theme.transitions.create('width', {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.enteringScreen,
//       }),
//       boxSizing: 'border-box',
//       ...(!open && {
//         overflowX: 'hidden',
//         transition: theme.transitions.create('width', {
//           easing: theme.transitions.easing.sharp,
//           duration: theme.transitions.duration.leavingScreen,
//         }),
//         width: theme.spacing(0),
//         [theme.breakpoints.up('sm')]: {
//           width: theme.spacing(0),
//         },
//       }),
//     },
//   }),
// );
// const mdTheme = createTheme();

// const DashboardContent = (props) => {
//   const router = useRouter();
//   const [open, setOpen] = React.useState(false);

//   const [loading, set_loading] = useState(true);
//   const [data, set_data] = useState([]);
//   const [realstateImage, set_realstateImage] = useState('');
//   const [profileImage, set_profileImage] = useState(false);
//   const [workers, set_workers] = useState([]);
//   const [selectedcat, set_selectedcat] = useState(0);
//   const [userInitialLat, set_userInitialLat] = useState(false);
//   const [userInitialLong, set_userInitialLong] = useState(false);
//   const [subcategories, set_subcategories] = useState([]);
//     const [nopost, set_nopost] = useState(false);

//   useEffect(() => {
//     var token = Cookies.get('id_token');
//     if(!token){
//       router.push("/panel/auth/login");
//     }else{

//       axios({
//         method: 'get',
//         url: 'https://api.ajur.app/api/get-user',
//         params: {
//           token: token,
//         },
//       }).then(function (response) {



//         set_data(response.data.user);
//         set_profileImage(response.data.user.profile_url);
//         set_realstateImage(response.data.user.realstate_url);
//         set_loading(false);
//       });



//       axios({
//               method:'get',
//               url:'https://api.ajur.app/api/realstate-workers',
//               params: {
//                 title: 'title',
//                 lat : 35.12,
//                 long : 36.11,
//                 selectedcat : selectedcat,
//                 token:token,
//                 collect: 'all'
//               },
//         })
//       .then(function (response) {



//          set_workers(response.data.workers);
//          set_subcategories(response.data.subcategories);
//          set_loading(false);
//          if(response.data.workers.length > 0){
//              set_nopost(false);
//          }else{
//            set_nopost(true)
//          }


//       })

//     }


//   }, []);




//     const fetchWorker = () => {
//       var token = Cookies.get('id_token');

//       axios({
//               method:'get',
//               url:'https://api.ajur.app/api/realstate-workers',
//               params: {
//                 title: 'title',
//                 lat : 35.12,
//                 long : 36.11,
//                 selectedcat : selectedcat,
//                 token:token,
//                 collect: 'all'
//               },
//         })
//       .then(function (response) {



//          set_workers(response.data.workers);
//          set_subcategories(response.data.subcategories);
//          set_loading(false);
//          if(response.data.workers.length > 0){
//              set_nopost(false);
//          }else{
//            set_nopost(true)
//          }


//       })
//     }

//   const toggleDrawer = () => {
//     setOpen(!open);
//   };

//   const handleOpenUserMenu = () => {

//   }

//   const renderSliderCategories =() => {
//     return subcategories.map(cat =>


//           <Grid item xs={12} md={3} lg={2} >

//             <CatCard2   selectedcat={selectedcat} cat={cat} handleParentClick={handleParentClick}/>
//             </Grid>
//       // TODO: i remove <SwiperSlide> wrapper because flexDirection:row dosent worke
//       // this make swipper dosent work


//      );
//    }

//    const renderWorkers = () => {
//      if(workers.length > 0 ){
//        return workers.map(worker =>
//          <Grid item md={4} xs={12} key={worker.id}>
//            <Link
//                  href={`/worker/${worker.id}?slug=${worker.slug}`}
//                  key={worker.id}
//                >
//                  <a>
//                    <WorkerCard key={worker.id} worker = {worker}/>
//                  </a>
//           </Link>
//          </Grid>
//        )
//      }else{
//        return(
//          <Grid item md={12} xs={12}>
//            <p>متاسفانه موردی یافت نشد</p>
//          </Grid>
//        )
//      }
//    }

//    const handleParentClick = (cat) => {

//     set_selectedcat(cat.id);
//     fetchWorker();
//    }

//   if(loading){
//     return (
//         <SpinnerLoader />
//     )


//   }else{
//     return (
//       <ThemeProvider theme={mdTheme}>
//         <Box sx={{ display: 'flex' }}>
//           <CssBaseline />
//           <AppBar position="absolute" open={open}>
//             <Toolbar
//               sx={{
//                 pr: '24px', // keep right padding when drawer closed
//               }}
//             >
//               <IconButton
//                 edge="start"
//                 color="inherit"
//                 aria-label="open drawer"
//                 onClick={toggleDrawer}
//                 sx={{
//                   marginRight: '36px',
//                   ...(open && { display: 'none' }),
//                 }}
//               >
//                 <MenuIcon />
//               </IconButton>

//             { !open ?
//               <>
//               <Typography
//                 component="h1"
//                 variant="h6"
//                 color="inherit"
//                 noWrap
//                 sx={{ flexGrow: 1 ,textAlign:'center'}}
//               >
//                 {data.phone}
//               </Typography>

//             </>
//               :
//               <Typography
//                 component="h1"
//                 variant="h6"
//                 color="inherit"
//                 noWrap
//                 sx={{ flexGrow: 1 }}
//               >

//               </Typography>

//              }


//               <Box sx={{ flexGrow: 0 }}>
//               <Tooltip title="انتخاب عکس">
//                 <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                   <Avatar alt="Remy Sharp" src={profileImage} />
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             </Toolbar>
//           </AppBar>
//           <Drawer variant="permanent" open={open}>

//             <Toolbar
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'flex-end',
//                 px: [1],
//               }}
//             >
//               <Typography
//                 component="h1"
//                 variant="h6"
//                 color="inherit"
//                 noWrap
//                 sx={{ flexGrow: 1 ,textAlign:'center'}}
//               >
//                 {data.phone}
//               </Typography>
//               <IconButton onClick={toggleDrawer}>
//                 <ChevronLeftIcon />
//               </IconButton>
//             </Toolbar>
//             <Divider />
//             <List component="nav">
//               <MainListItems  onGrabClicked = {(value) => {
//                          console.log("clicked from mainlist item and trigered in parent controll",value);
//                          setOpen(false);

//                      }}/>


//             </List>
//             <div style={{
//               position: 'fixed',
//               bottom: '5%',
//             left: '2%',


//                 zIndex:1,
//             }}>
//                 <Avatar alt="Remy Sharp" src='/logo/ajour-new-logo-web-loop.png' />
//               <p>v 1.0</p>
//             </div>
//           </Drawer>
//           <Box
//             component="main"
//             sx={{
//               backgroundColor: (theme) =>
//                 theme.palette.mode === 'light'
//                   ? theme.palette.grey[100]
//                   : theme.palette.grey[900],
//               flexGrow: 1,
//               height: '100vh',
//               overflow: 'auto',
//             }}
//           >
//             <Toolbar />
//             <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//               <Grid container spacing={3}>
//                 {/* Chart */}
//                 {/* <Grid item xs={12} md={8} lg={9}>
//                   <Paper
//                     sx={{
//                       p: 2,
//                       display: 'flex',
//                       flexDirection: 'column',
//                       height: 240,
//                     }}
//                   >
//                     <Chart />
//                   </Paper>
//                 </Grid> */}
//                 {/* Recent Deposits */}
//                 <Grid container >


//                   {renderSliderCategories()}




//                 </Grid>





//                 {/* Recent Orders */}
//                 <Grid item xs={12}>

//                     <Box sx={{ flexGrow: 1 }}>
//                       <Grid container spacing={2}>
//                         {renderWorkers()}
//                       </Grid>
//                     </Box>

//                 </Grid>
//               </Grid>
//               <Copyright sx={{ pt: 4 }} />
//             </Container>
//           </Box>
//         </Box>
//         <SpeedDial />
//       </ThemeProvider>
//     );
//   }




// }


// export default  Support

// DashboardContent.getLayout = function(page) {
//   return <PanelLayout>{page}</PanelLayout>;
// };

import React from "react"

const support = (props) => {
  return (
    <div>
      <p>support page</p>
      
    </div>
  )
};

export default support;

