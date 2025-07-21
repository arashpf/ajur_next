import { Dashboard } from "@mui/icons-material";
import { urPK } from "@mui/x-date-pickers";
import React, { useState, useEffect } from "react";
import GDashboardLayout from "../../components/layouts/GDashboardLayout";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation, Autoplay } from 'swiper';
import { Header } from "../../components/G-ads/Header";
import { ActiveAds } from "../../components/G-ads/ActiveAds";
import Style from "../../styles/G-ads/user-dashboard.module.css"
import NewAd from "../../components/G-ads/new-add";
import Button from "@mui/material/Button";




const dummyAds = [
    {
        AdUrl: "#",
        name: "تبلیغات 1",
        startDate: "2025/07/13",
        expiryDate: "2025/08/13",
        clickedamount: "50",
        clicksLeft: "150",
        callCount: "20",
        status: "active",
        chart: [
            { date: "2025/07/13", views: 20 },
            { date: "2025/07/14", views: 40 },
            { date: "2025/07/15", views: 45 },
            { date: "2025/07/16", views: 45 },
        ],
    }, {
        AdUrl: "#",
        name: "تبلیغات 2",
        startDate: "2025/07/15",
        expiryDate: "2025/08/15",
        clickedamount: "0",
        clicksLeft: "100",
        callCount: "0",
        status: "pending",
        chart: [
        ],
    }, {
        AdUrl: "#",
        name: "تبلیغات 3",
        startDate: "2025/05/12",
        expiryDate: "2025/05/18",
        clickedamount: "100",
        clicksLeft: "0",
        callCount: "40",
        status: "unactive",
        chart: [
            { date: "2025/05/12", views: 20 },
            { date: "2025/05/13", views: 40 },
            { date: "2025/05/14", views: 45 },
            { date: "2025/05/15", views: 60 },
            { date: "2025/05/16", views: 70 },
            { date: "2025/05/17", views: 25 },
            { date: "2025/05/18", views: 40 },
        ],
    },
]


function UserDashboard() {


    return (
        <div id="dashboard" className={Style["main-wrapper"]}>
            <div className={Style["active-ads"]}>
                <ActiveAds ads={dummyAds} />
            </div>
            <div className={Style["new-ad-container"]}>
                <NewAd />
            </div>
            <div className={Style["graphs"]}>

            </div>
        </div>
    )
}

export default UserDashboard;

UserDashboard.getLayout = function (page) {
    return <GDashboardLayout>{page}</GDashboardLayout>;
};