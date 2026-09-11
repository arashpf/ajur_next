import React, { useEffect } from "react"

import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"



import Header from '../parts/Header'
import Footer from '../parts/Footer'





function PanelLayout({ children }) {



  return (


      <div>
        <Header />
        <main>{children}</main>
        <Footer />
        
      </div>



  );
}

export default PanelLayout
