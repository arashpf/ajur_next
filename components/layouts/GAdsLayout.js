import React from "react";
import Header from "../parts/Header";
import Footer from "../parts/Footer";
import AppWrapper from "./AppWrapper";




function GAdsLayout({ children }) {



    return (
        <AppWrapper>
            <div>
                <Header />
                <main>{children}</main>
                <Footer />
            </div>
        </AppWrapper>
    );
}

export default GAdsLayout
