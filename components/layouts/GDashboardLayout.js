import React from "react";
import Header from "../parts/Header";
import Footer from "../parts/Footer";
import Style from "../../styles/G-ads/user-dashboard.module.css";
import ContactUsButton from "../G-ads/ContactUsButton";

function GDashboardLayout({ children }) {
    return (
        <div>
            <Header />

                <main>{children}</main>


                <div className={Style["contact-us"]}>
                    <ContactUsButton />
                </div>

                <Footer />
        </div>
    )
}

export default GDashboardLayout;