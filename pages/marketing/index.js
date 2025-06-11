import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import MarketingEntro from '../../components/parts/MarketingEntro';
import MarketingFaq from '../../components/parts/MarketingFaq';
import MarketingFaqForMarketer from '../../components/parts/MarketingFaqForMarketer';
import MarketLayout from '../../components/layouts/MarketLayout';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';

import { useRouter } from 'next/router';
import Head from "next/head";

const index = (props) => {
  const router = useRouter()
  // const { slug,username } = router.query
  const username = router.query.id;
  const type = router.query.type; 
  Cookies.set('ref', router.query.id, { expires: 255 });
 



  const renderMarketingFaq = () => {
    if(type == 'marketer'){
      return(
        <MarketingFaqForMarketer />
      )
    }else{
      return(
        <MarketingFaq />
      )
      
    }
  }

  const onclickMarketingLogin = () => {
    console.log('marketing login clicked ');
    
    var ref_cookie = Cookies.get('ref');
    console.log('ref_cookie now is');
    console.log(ref_cookie);
   

  
    var token = Cookies.get('id_token');
    if(!token){
      console.log('you have to login');
      Cookies.set('destination_before_auth', '/marketing/single', { expires: 14 });
      router.push("/panel/auth/login");
    }else{
      console.log('you are currently loged in and enjoy');
      console.log(token);
      router.push("/marketing/single");
    }
    }

    const onclickRealestateLogin = () => {
      console.log('real login clicked ');
     
      var token = Cookies.get('id_token');
      if(!token){
        console.log('you have to login');
        Cookies.set('destination_before_auth', '/', { expires: 14 });
        router.push("/panel/auth/login");
      }else{
        console.log('you are currently loged in and enjoy');
        console.log(token);
        router.push("/");
      }
      }

    

  const renderRegisterButton =() => {

    if( type == 'marketer'){
      return(
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0,zIndex:10 }} elevation={9}>
				  <Button size="large" color="success" onClick={onclickMarketingLogin} variant="contained" fullWidth={true} style={{fontSize:20,marginBottom:5}}>ورود / ثبت نام</Button>
			  </Paper>
      )
    }else{
      return(
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0,zIndex:10 }} elevation={9}>
				  <Button size="large"  onClick={onclickRealestateLogin} variant="contained" fullWidth={true} style={{fontSize:20}}>ورود  مشاور</Button>
			  </Paper>
      )
      
    }

  }
 
  return (
    <div>
      <Head>
     <meta charset="UTF-8" />
     <meta name="robots" content="max-image-preview:large" />
   <title> مشاور املاک هوشمند آجر | بخش بازاریابی   </title> 
 <meta name="description" content="کسب درامد، فقط با ارسال لینک بازاریابی آجر" />
     <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
     <meta property="og:locale" content="fa_IR" />
     <meta property="og:type" content="website" />
   <meta property="og:title" content="  کسب درامد دیجیتال |   بازاریابی آجر" />
     <meta property="og:description" content="فقط با اشتراک لینک کسب درامد کنید"/>
   <meta property="og:url" content="https://ajur.app" />
   <meta property="og:site_name" content="مشاور املاک هوشمند آجر" />
     <meta property="article:published_time" content="2023-05-19T21:34:43+00:00" />
     <meta property="article:modified_time" content="2024-01-28T03:47:57+00:00" />
   <meta property="og:image" content="https://ajur.app/img/big-logo-180.png" />
 <meta property="og:image:width" content="180" />
<meta property="og:image:height" content="180" />
     <meta name="twitter:card" content="summary_large_image" />
     <meta name="twitter:label1" content="Written by" />
     <meta name="twitter:data1" content="آرش پیمانی فر" />
     <link rel="icon" href="/favicon.ico" />
   <link rel="canonical" href="https://ajur.app/marketing" />
    </Head>
      <MarketingEntro username={username} type={type}/>
    
     <div style={{marginBottom:100}}>
     {renderMarketingFaq()}
     </div> 
      {renderRegisterButton()}
        
     



    </div>
  )
}

export default index
index.getLayout = function(page) {
  return <MarketLayout>{page}</MarketLayout>;
};
