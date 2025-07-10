import React from 'react'
import PropTypes from 'prop-types'
import ContactUs from '../components/parts/ContactUs';
import AboutUs from '../components/parts/AboutUs';
import WorkTime from '../components/parts/WorkTime';
import Head from "next/head";

const Contact = (props) => {
  return (
    <div>
      <Head>
     <meta charset="UTF-8" />
     <meta name="robots" content="max-image-preview:large" />
   <title>تماس با ما | مشاور املاک هوشمند آجر</title>
 <meta name="description" content="صفحه تماس و ارتباط با مشاور املاک هوشمند آجر" />
     <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
     <meta property="og:locale" content="fa_IR" />
     <meta property="og:type" content="website" />
     <meta property="og:locale" content="fa_IR" />
     <meta property="og:type" content="website" />
   <meta property="og:title" content="تماس با ما | مشاور املاک هوشمند آجر" />
     <meta property="og:description" content="صفحه تماس و ارتباط با مشاور املاک هوشمند آجر" />
   <meta property="og:url" content="https://ajur.app/panel/agent_agreement" />
   <meta property="og:site_name" content="مشاور املاک هوشمند آجر" />
     <meta property="article:published_time" content="2020-05-19T21:34:43+00:00" />
     <meta property="article:modified_time" content="2022-01-28T03:47:57+00:00" />
   <meta property="og:image" content="https://ajur.app/logo/ajour-meta-image.jpg" />
 <meta property="og:image:width" content="800" />
<meta property="og:image:height" content="533" />
     <meta name="twitter:card" content="summary_large_image" />
     <meta name="twitter:label1" content="Written by" />
     <meta name="twitter:data1" content="آرش پیمانی فر" />
     <link rel="icon" href="/favicon.ico" />
   <link rel="canonical" href="https://ajur.app/panel/agent_agreement" />
    </Head>
      <AboutUs />
      <ContactUs />
        <WorkTime />




    </div>
  )
}

export default Contact
