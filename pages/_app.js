import React, { useEffect } from "react"
import FrontLayout from '../components/layouts/FrontLayout'
import '../styles/globals.css'
import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"


import Header from '../components/parts/Header'
import Footer from '../components/parts/Footer'
import Head from 'next/head';

import CookieConsent from '../components/others/CookieConsent';

import SmartAppBanner from "../components/banner/SmartAppBanner";







export default function MyApp({ Component, pageProps }) {
  const renderWithLayout =
    Component.getLayout ||
    function (page) {
      return <FrontLayout>
        {page}
        <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-11545772692"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-11545772692');
            `,
          }}
        ></script>
      </Head>
        <CookieConsent />
        <SmartAppBanner />
        </FrontLayout>;
    };
  return renderWithLayout(<Component {...pageProps} />); 
}
