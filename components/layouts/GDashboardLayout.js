import React from "react";
import Header from "../parts/Header";
import Footer from "../parts/Footer";
import Style from "../../styles/G-ads/user-dashboard.module.css";
import ContactUsButton from "../G-ads/ContactUsButton";
import AppWrapper from "./AppWrapper";

function GDashboardLayout({ children }) {
    return (
        <AppWrapper>
            <div>
                <Header />

                    <main>{children}</main>


                    <div className={Style["contact-us"]}>
                        <ContactUsButton />
                    </div>

                    <Footer />
            </div>
        </AppWrapper>
    )
}

export default GDashboardLayout;