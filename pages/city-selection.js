import React, { useState, useEffect} from "react";
import Head from 'next/head';
import styles from '../styles/CitySelection.module.css';
import Link from 'next/link';
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
});

const CitySelection = ({data}) => {
  const router = useRouter();
  console.log('the data come form search-cities in city seletion is');
  console.log(data);
  const[search , set_search] = useState('');
  const[selected_cities , set_selected_cities] = useState(data.items);

  const[is_all_shown , set_is_all_shown] = useState(0);
  const[loading , set_loading] = useState(false);
  const [open, setOpen] = useState(false);
  const [problem, setProblem] = useState('city_name');
  const [vertical, set_vertical] = useState('top');
  const [horizontal, set_horizontal] = useState('center');
 
  const handleChangeInput = (e) => {
    console.log('form changed');
    console.log(e.target.value);
    if(e.target.value){
      var title = e.target.value;

      set_search(title);
     
      axios({
              method:'get',
              url:'https://api.ajur.app/api/search-cities',
              params: {
                title: title,
              },
            })

          .then(function (response) {

            set_selected_cities(response.data.items)
             
              console.log(response.data);


            })



    }else{

      // set_search('');
    }
  }

  function handleClose(){
    console.log('close snack is cliked'); 
  }

  const renderCitySearch = () => {
    return(
      <div style={{background:'#f1f1f1',padding:20}}>
        <Form className={styles.navbar_search}>
              <Form.Control
                type="search"
                placeholder="جستجو شهر"

                className={styles.navbar_single}

                aria-label="Search"
                onChange={handleChangeInput}
                
              />
          </Form>
      </div>

    )
  }

  const renderCities = () => {

    if(loading){
      return(
        <p style={{textAlign:'center',color:'orange',width:'100%',fontSize:40}}>...</p>
      )
    }

    return selected_cities.map( place =>
      
      <Grid onClick={()=>onSingleCityCicked(place)}  style={{cursor:'pointer'}} key={place.id}  item xs={4} md={3} className={styles.single_city}>
       <p>{place.title}</p> 
        </Grid>
     
    );
  }

  const onallCityCicked = () => {
    set_is_all_shown(!is_all_shown);

    set_loading(true);

    axios({
      method:'get',
      url:'https://api.ajur.app/api/search-cities',
      params: {
        kind:'all'

      },
    })

  .then(function (response) {

    set_loading(false);
    
    set_selected_cities(response.data.items)
     
      console.log(response.data);


    }).catch(function(err){
      log('problem on axios');
      set_is_all_shown(!is_all_shown);
    })

    console.log('on all city clicked');
  }

  const onMainCityCicked = () => {
    set_is_all_shown(!is_all_shown);
    axios({
      method:'get',
      url:'https://api.ajur.app/api/search-cities',
      
    })

  .then(function (response) {
    set_selected_cities(response.data.items)
      console.log(response.data);
    })

    console.log('on all city clicked');
  }

  const onSingleCityCicked = (place) => {
    console.log('the single city clicked');
    console.log(place.title);
    Cookies.set('selected_city', place.title, { expires: 365 });
    Cookies.set('selected_city_lat', place.center_lat, { expires: 365 });
    Cookies.set('selected_city_lng', place.center_lng, { expires: 365 });

    setProblem('شهر شما : ' + place.title);
   
    setOpen(true);

     router.push("/"+place.title); 
    // router.replace("/").then(() => router.reload());
    // router.replace("/"+place.title).then(() => router.reload());
  }

  
  
  const renderAllCitiesButton = () => {
    if(!is_all_shown){
      return(
        <Grid   item xs={12} md={12} className={styles.all_city}>
          <div onClick={()=>onallCityCicked()}   style={{display:'flex',flexDirection:'row',textAlign:'center',
          justifyContent:'center',cursor : 'pointer'}}>
          <p style={{paddingRight:15,paddingLeft:15}}>نمایش همه شهرها</p> 
          <p> <i className="fa fa-arrow-down"></i> </p>
          </div>
           
        
        </Grid>
      )
    }else{
      return(
        <Grid   item xs={12} md={12} className={styles.base_city}>
      <div onClick={()=>onMainCityCicked()}   style={{display:'flex',flexDirection:'row',textAlign:'center',
      justifyContent:'center',cursor : 'pointer'}}>
      <p style={{paddingRight:15,paddingLeft:15}}>نمایش شهرهای پر طرفدار</p> 
      <p> <i className="fa fa-arrow-up"></i> </p>
      </div>  
      </Grid>
      )
      

    }
  }

  
  const renderMeta = () => {
    return(
      <Head>
       <meta charset="UTF-8" />
       <meta name="robots" content="max-image-preview:large" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
       <title>  آجر : انتخاب شهر </title>
       <meta name="description" content="مشاور املاک هوشمند آجر مشاور املاکی به وسعت ایران با صدها مشاور مسلط به منطقه" />
       <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
       <meta property="og:locale" content="fa_IR" />
       <meta property="og:type" content="website" />
       <meta property="og:locale" content="fa_IR" />
       <meta property="og:type" content="website" />
       <meta property="og:title" content="آجر : انتخاب شهر " />
       <meta property="og:description" content="از خرید و فروش خانه و ویلا تا مشاوره برای سرمایه گزاری در مشاور املاک هوشمند آجر" />
       <meta property="og:url" content="https://ajur.app" />
       <meta property="og:site_name" content="مشاور املاک هوشمند آجر" />
       <meta property="article:published_time" content="2020-05-19T21:34:43+00:00" />
       <meta property="article:modified_time" content="2022-01-28T03:47:57+00:00" />
       <meta property="og:image" content="https://ajur.app/logo/ajour-meta-image.jpg" />
       <meta property="og:image:width" content="1080" />
       <meta property="og:image:height" content="702" />
       <meta name="twitter:card" content="summary_large_image" />
       <meta name="twitter:label1" content="Written by" />
       <meta name="twitter:data1" content="آرش پیمانی فر" />
       <link rel="icon" href="/favicon.ico" />
       <link rel="canonical" href="https://ajur.app" />
      </Head>
    )
  }




  return (
    <>
    {renderMeta()}
    <Grid container spacing={3} style={{background:'white'}}>
    <Grid item xs={0} md={3}></Grid>
    <Grid item xs={12} md={6} justify='center' alignItems='center' >
      <p style={{textAlign:'center'}}>لطفا شهر خود را انتخاب کنید</p>
{/* Todo : search in city is now useless , because we just have to city for now  */}
      {/* {renderCitySearch()} */}
      
      <Grid container  className={styles.cities_wraper}>
      {renderCities()}
      {/* {renderAllCitiesButton()} */}
      </Grid>
      

    </Grid>
    <Grid item xs={0} md={3}></Grid>
    </Grid>
     <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} autoHideDuration={10000} onClose={handleClose}>
     <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
       {problem}
     </Alert>
   </Snackbar>
   </>
  )
};

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://api.ajur.app/api/search-cities`)
  const data = await res.json()

  if(!data){

  }


  // Pass data to the page via props
  return { props: { data } }
}

export default CitySelection;
