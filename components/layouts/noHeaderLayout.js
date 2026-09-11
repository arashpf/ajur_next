import React, { useEffect } from "react"

import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"


import Header from '../parts/Header'
import Footer from '../parts/Footer'
import AIOverlayComponent from "../parts/AIOverlayComponent"
import GoogleAnalytics from '../parts/GoogleAnalytics';
// import { GoogleTagManager } from '@next/third-parties/google';
import AppWrapper from './AppWrapper';





function NoHeaderLayout({ children }) {
  return (
    <AppWrapper>
      <div>
        <GoogleAnalytics />
        {/* <GoogleTagManager id="GTM-WNKQBXPR" /> */}
        <main>{children}</main>
        <Footer />
      </div>
    </AppWrapper>
  );
}

export default NoHeaderLayout;
