import React, { useState } from "react";
import { DashboardHeader } from "../G-ads/Header";
import Button from "@mui/material/Button";
import Style from "../../styles/G-ads/user-dashboard.module.css"
import ContactUsButton from "../G-ads/ContactUsButton";

function GDashboardLayout({ children }) {
    return (
        <div>
            <DashboardHeader />

            <main>{children}</main>


            <div className={Style["contact-us"]}>
                <ContactUsButton />
            </div>
        </div>
    )
}

export default GDashboardLayout;