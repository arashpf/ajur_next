import React from "react";
import Header from "../parts/Header";
import Footer from "../parts/Footer";




function GAdsLayout({ children }) {



    return (


        <div>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>



    );
}

export default GAdsLayout
