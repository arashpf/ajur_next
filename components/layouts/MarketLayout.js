import React, { useEffect } from "react"

import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"


import MarketingHeader from "../parts/MarketingHeader"
import Footer from "../parts/Footer"





function MarketLayout({ children }) {



  return (


      <div>
  {/* <MarketingHeader /> */}
  <main>{children}</main>
  <Footer />
      </div>



  );
}

export default MarketLayout
