import react, { useState, useEffect, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';

import GAdsLayout from '../../../components/layouts/GAdsLayout'
import Style from '../../../styles/G-ads/LandingPage.module.css';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Cookies from 'js-cookie';
import IntroSlider from "../../../components/common/IntroSlider/IntroSlider";
import Portfolio from '../../../components/G-ads/Portfolio';
import ReviewsSwiper from '../../../components/G-ads/ReviewsSwiper';
import { useRouter } from "next/router";



function LandingPage() {
    const router = useRouter();

    const onClickDashboard = () => {
        router.push("/G-ads/user-dashboard");
    }

    const [showIntroSlider, setShowIntroSlider] = useState(false);

    const gadsSlides = [
        {
            id: 1,
            title: 'تبلیغات گوگل چیست؟',
            description: 'تبلیغات گوگل یعنی آگهی شما وقتی کسی دنبال ملک می‌گردد در صدر نتایج نمایش داده می‌شود، حتی قبل از بقیه سایت‌ها.',
            image: '/img/G-ads/gads.png',
            color: '#2196F3'
        },
        {
            id: 2,
            title: 'مشتری واقعی جذب کنید',
            description: 'با تبلیغات گوگل فقط به افرادی که واقعاً دنبال خرید یا اجاره هستند نمایش داده می‌شوید؛ یعنی مشتری واقعی نه بازدید الکی.',
            image: '/img/G-ads/customer-magnet.png',
            color: '#4CAF50'
        },
        {
            id: 3,
            title: 'پرداخت به ازای کلیک',
            description: 'فقط وقتی مشتری روی آگهی شما کلیک کند از حساب شما کسر می‌شود؛ کنترل کامل هزینه‌ها.',
            image: '/img/G-ads/clicks.png',
            color: '#FF9800'
        },
        {
            id: 4,
            title: 'ما کمپین شما را مدیریت می‌کنیم',
            description: 'تیم تخصصی آجر کمپین شما را به صورت حرفه‌ای تنظیم و بهینه‌سازی می‌کند تا تماس‌ها افزایش یابد.',
            image: '/img/G-ads/ajur-gads.png',
            color: '#9C27B0'
        }
    ];

    useEffect(() => {
        if (!router || !router.isReady) return;
        try {
            const hasSeen = typeof window !== 'undefined' ? Cookies.get('hasSeenIntro') : null;
            const q = router.query || {};
            const force = q.showIntro === '1' || q.showIntro === 'true' || q.forceIntro === '1' || q.forceIntro === 'true';
            if (force || !hasSeen) setShowIntroSlider(true);
        } catch (e) {
            // ignore
        }
    }, [router && router.isReady, router && router.query]);

    const handleIntroClose = () => {
        try { Cookies.set('hasSeenIntro', true, { expires: 365 }); } catch (e) {}
        setShowIntroSlider(false);
    };

    return (
        <div id="landing-page" className={Style["landing-page"]}>
            <div className={Style["intro"]}>
                <IntroSlider
                    visible={showIntroSlider}
                    hasSkip={false}
                    onClose={handleIntroClose}
                    slides={gadsSlides}
                    lastButtonLabel={"شروع"}
                    onLastButtonClick={() => { setShowIntroSlider(false); }}
                />
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
