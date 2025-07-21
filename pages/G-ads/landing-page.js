import react, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation, Autoplay } from 'swiper';
import Link from 'next/link';
import Image from 'next/image';
import SmallCard from '../../components/cards/SmallCard';
import axios from 'axios';
import Stars from '../../components/others/Stars';
import GAdsLayout from '../../components/layouts/GAdsLayout';
import Style from '../../styles/G-ads/LandingPage.module.css';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Cookies from 'js-cookie';
import { styled } from '@mui/system';
import WelcomePopup from '../../components/G-ads/WelcomePopups';
import Portfolio from '../../components/G-ads/Portfolio';
import ReviewsSwiper from '../../components/G-ads/ReviewsSwiper';
import { useRouter } from "next/router";



function LandingPage() {
    const router = useRouter();

    const onClickDashboard = () => {
        router.push("/G-ads/user-dashboard");
    }

    return (
        <div id="landing-page" className={Style["landing-page"]}>
            <div className={Style["intro"]}>
                <WelcomePopup />
                <button onClick={() => {
                    Cookies.remove('hasSeenIntro');
                }}>
                    Reset
                </button>
            </div>
            <header className={Style["page-header"]}>
                <h2 className={Style["header-title"]}>تبلیغات هدفمند اختصاصی املاک</h2>
            </header>
            <div className={Style["video-section"]}>
                <iframe
                    style={{ width: '100%', aspectRatio: '16/9', border: 'none' }}
                    src="https://www.aparat.com/video/video/embed/videohash/soy1ilj/vt/frame"
                    allowFullScreen={true}
                    webkitallowfullscreen="true"
                    mozallowfullscreen="true"
                    className={Style["video-iframe"]}
                ></iframe>
            </div>
            <div className={Style['pros']}>
                <p>
                    <TaskAltIcon style={{ color: 'green', fontSize: 22, marginLeft: 10 }} />
                    تبلیغات رسمی گوگل

                </p>
                <p>
                    <TaskAltIcon style={{ color: 'green', fontSize: 22, marginLeft: 10 }} />
                    برای اولین بار در بازار ملک ایران
                </p>
                <p>
                    <TaskAltIcon style={{ color: 'green', fontSize: 22, marginLeft: 10 }} />
                    تضمینی بیشتر دیده شوید
                </p>
                <p>
                    <TaskAltIcon style={{ color: 'green', fontSize: 22, marginLeft: 10 }} />
                    راه اندازی آسان تنها با چند کلیک
                </p>
                <p>
                    <TaskAltIcon style={{ color: 'green', fontSize: 22, marginLeft: 10 }} />
                    گزارش و شفافیت در پنل اختصاصی آجر
                </p>
            </div>
            <div className={Style["portfolio-container"]}>
                <h3 className={Style["section-title"]}>برترین مشتریان سرویس تبلیغاتی</h3>
                <Portfolio className="portfolio-cards" />
            </div>
            <div className={Style["reviews-container"]}>
                <h3 className={Style["section-title"]}>نظرات کاربران</h3>
                <ReviewsSwiper />
            </div>
            <div className={Style['button-container']}>
                <button onClick={onClickDashboard} className={Style['start-button']}>ادامه</button>
            </div>
        </div>
    );
}

export default LandingPage;

LandingPage.getLayout = function (page) {
    return <GAdsLayout>{page}</GAdsLayout>;
};
