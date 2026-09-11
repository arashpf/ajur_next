import React from 'react'
import PropTypes from 'prop-types'
import DepartmentEntro from '../../components/parts/DepartmentEntro';
import DepartmentFaq from '../../components/parts/DepartmentFaq';

import { useRouter } from 'next/router';
import Head from "next/head";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';

const DepartmentEn = (props) => {
  const router = useRouter()
  // const { slug,username } = router.query

  const onclickCreateDepartment =  () => {

    
    var token = Cookies.get('id_token');
    if(!token){
      console.log('you have to login');
      Cookies.set('destination_before_auth', '/', { expires: 14 });
      router.push("/panel/auth/login");
    }else{
      console.log('you are currently loged in and enjoy');
      console.log(token);
      router.push("/panel/new_department");
    }

  }

  const renderRegisterButton = () => {

  
      return(
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0,zIndex:11 }} elevation={9}>
				  <Button size="large"  onClick={onclickCreateDepartment} variant="contained" fullWidth={true} style={{fontSize:20}}>ورود یا ایجاد دپارتمان مجازی</Button>
			  </Paper>
      )

     
  }
  
 
  return (
    <div>
      <Head>
     <meta charSet="UTF-8" />
     <meta name="robots" content="max-image-preview:large" />
   <title> مشاور املاک هوشمند آجر |  دپارتمان  مجازی   </title>
 <meta name="description" content="دپارتمان مجازی آجر| مدیریت دپارتمان " />
     <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
     <meta property="og:locale" content="fa_IR" />
     <meta property="og:type" content="website" />
     <meta property="og:locale" content="fa_IR" />
     <meta property="og:type" content="website" />
   <meta property="og:title" content="دپارتمان مجازی آجر| مدیریت دپارتمان "/>
     <meta property="og:description" content="دپارتمان مجازی آجر| مدیریت دپارتمان" />
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
   <link rel="canonical" href="https://ajur.app/panel/department-entro" />
    </Head>
    
      <DepartmentEntro />
      <DepartmentFaq />

      {renderRegisterButton()}
        
     



    </div>
  )
}

export default DepartmentEn
