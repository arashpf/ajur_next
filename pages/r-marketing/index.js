import React from 'react'
import PropTypes from 'prop-types'
import MarketingEntro from '../../components/parts/MarketingEntro';
import MarketingFaq from '../../components/parts/MarketingFaq';

import { useRouter } from 'next/router';
import Head from "next/head";

const index = (props) => {
  const router = useRouter()
  // const { slug,username } = router.query
  const username = router.query.id;
 
  return (
    <div>
      <Head>
     <meta charSet="UTF-8" />
     <meta name="robots" content="max-image-preview:large" />
   <title> مشاور املاک هوشمند آجر | بخش بازاریابی مشاورین املاک   </title>
 <meta name="description" content="بازاریابی اپلیکیشن آجر ، شیوه ای جدید و فرصتی مناسب برای بازاریابان" />
     <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
     <meta property="og:locale" content="fa_IR" />
     <meta property="og:type" content="website" />
     <meta property="og:locale" content="fa_IR" />
     <meta property="og:type" content="website" />
   <meta property="og:title" content="تماس با ما | مشاور املاک هوشمند آجر" />
     <meta property="og:description" content="بازاریابی اپلیکیشن آجر ، شیوه ای جدید و فرصتی مناسب برای بازاریابان"   />
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
    <p>this page is for real estate</p> 
      <MarketingEntro username={username}/>
      <MarketingFaq />
        
     



    </div>
  )
}

export default index
