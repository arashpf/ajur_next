import React from 'react'
import PropTypes from 'prop-types'
import FileRequest from "../../components/request/FileRequest";
import Head from 'next/head';

const Counseling = (props) => {

  const renderMeta = () => {
    return(
      <Head>
       <meta charset="UTF-8" />
       <meta name="robots" content="max-image-preview:large" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
       <title>  آجر :  درخواست خرید و فروش و رهن و اجاره </title>
       <meta name="description" content="با سیستم یکپارچه ثبت درخواست آجر یک بار بسپارید بقیش با آجر" />
       <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
       <meta property="og:locale" content="fa_IR" />
       <meta property="og:type" content="website" />
       <meta property="og:locale" content="fa_IR" />
       <meta property="og:type" content="website" />
       <meta property="og:title" content="با سیستم یکپارچه ثبت درخواست آجر یک بار بسپارید بقیش با آجر"/>
       <meta property="og:description" content="از خرید و فروش خانه و ویلا تا مشاوره برای سرمایه گزاری در مشاور املاک هوشمند آجر" />
       <meta property="og:url" content="https://ajur.app/Counseling" />
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
    <FileRequest />
    </>
    
  )
}

export default Counseling
