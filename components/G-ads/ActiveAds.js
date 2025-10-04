import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { AdCollapsibles } from "./ad-collapsibles";
import Style from "../../components/styles/g-ads/ad-collapsibles.module.css"
import NewAd from "./new-add";

export function ActiveAds({ ads }) {


    if (!ads || ads.length === 0) return (
        <div style={{ justifyItems: 'center' }}>
            <p>!هنوز تبلیغی ندارید</p>
        </div>)
    return (
        <div className={Style["ads-container"]}>
            <AdCollapsibles ads={ads} />
        </div>
    )
}