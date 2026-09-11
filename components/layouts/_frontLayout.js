import React, { useEffect } from "react"

import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"


import Header from '../parts/Header'
import SearchBars from '../parts/SearchBars'
import { useRouter } from 'next/router'
import Footer from '../parts/Footer'
import AIOverlayComponent from "../parts/AIOverlayComponent"
import GoogleAnalytics from '../parts/GoogleAnalytics';
import { GoogleTagManager } from '@next/third-parties/google';
import { CityProvider } from '../parts/CityContext'
import AppWrapper from './AppWrapper'





function FrontLayout({ children }) {
  const router = useRouter();

  const isHome = router && (router.pathname === '/' || router.asPath === '/');

  return (
    <AppWrapper>
      <CityProvider>
        <div>
          {/* Sticky header container: keeps Header or SearchBars fixed at top */}
          <div style={{ position: 'sticky', top: 0, zIndex: 1100, background: 'white', paddingBottom: '0px' }}>
            <SearchBars/> 
          </div>

          <GoogleAnalytics />
          <GoogleTagManager id="GTM-WNKQBXPR" />
          <main>{children}</main>
          <Footer />
        </div>
      </CityProvider>
    </AppWrapper>
  );
}

export default FrontLayout
