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

import KeywordClicksBarChart from "../../components/G-ads/KeywordClicksBarChart";
import KeywordClicksDoughnutChart from "../../components/G-ads/KeywordClicksDoughnutChart";




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
        plan: "diamond",
        chart: [
            { date: "2025/07/13", views: 20 },
            { date: "2025/07/14", views: 40 },
            { date: "2025/07/15", views: 45 },
            { date: "2025/07/16", views: 45 },
        ],
        keywordClicks: [
            { keyword: "خانه", clicks: 20 },
            { keyword: "ویلایی", clicks: 10 },
            { keyword: "زمین", clicks: 5 },
            { keyword: "زیر قیمت", clicks: 2 },
            { keyword: "سند دار", clicks: 6 },
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
        plan: "gold",
        chart: [
        ],
        keywordClicks: [
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
        plan: "silver",
        chart: [
            { date: "2025/05/12", views: 20 },
            { date: "2025/05/13", views: 40 },
            { date: "2025/05/14", views: 45 },
            { date: "2025/05/15", views: 60 },
            { date: "2025/05/16", views: 70 },
            { date: "2025/05/17", views: 25 },
            { date: "2025/05/18", views: 40 },
        ],
        keywordClicks: [
            { keyword: "آپارتمان", clicks: 15 },
            { keyword: "خانه", clicks: 12 },
            { keyword: "تجاری", clicks: 7 },
        ],
    },
]



function aggregateKeywordClicks(ads) {
    const keywordMap = {};
    ads.forEach(ad => {
        if (Array.isArray(ad.keywordClicks)) {
            ad.keywordClicks.forEach(kc => {
                if (!keywordMap[kc.keyword]) keywordMap[kc.keyword] = 0;
                keywordMap[kc.keyword] += kc.clicks;
            });
        }
    });
    const labels = Object.keys(keywordMap);
    const values = labels.map(k => keywordMap[k]);
    return { labels, values };
}

function UserDashboard() {
    const keywordClicksData = aggregateKeywordClicks(dummyAds);

    return (
        <div id="dashboard" className={Style["main-wrapper"]}>
            <div className={Style["active-ads"]}>
                <ActiveAds ads={dummyAds} />
            </div>
            <div className={Style["new-ad-container"]}>
                <NewAd />
            </div>
            <div className={Style["graphs"]}>
                <div style={{ textAlign: "center", fontWeight: 600, fontSize: 18, margin: "24px 0 8px 0" }}>
                    تعداد کلیک هر کلیدواژه
                </div>
                <KeywordClicksDoughnutChart data={keywordClicksData} style={{ width: 400, height: 400 }} />
            </div>
        </div>
    )
}

export default UserDashboard;

UserDashboard.getLayout = function (page) {
    return <GDashboardLayout>{page}</GDashboardLayout>;
};