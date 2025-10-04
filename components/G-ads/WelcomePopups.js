import react, { useEffect, useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation} from 'swiper';
import Style from '../../styles/G-ads/LandingPage.module.css';
import Cookies from 'js-cookie';

function WelcomePopup() {
    const [showIntro, setShowIntro] = useState(false);
    const swiperRef = useRef(null);

    useEffect(() => {
        const seenIntro = Cookies.get('hasSeenIntro');
        if (!seenIntro) {
            setShowIntro(true);
        }
    }, []);

    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 4;
    const isLastSlide = currentSlide === totalSlides - 1;

    const handleFinish = () => {
        setShowIntro(false);
        Cookies.set('hasSeenIntro', true, { expires: 365 });
    };

    const handleNext = () => {
        if (!isLastSlide) {
            if (swiperRef.current) {
                swiperRef.current.slideNext();
            }
        } else {
            handleFinish();
        }
    };

    if (!showIntro) return null;

    return (
        <div className={Style["intro-overlay"]} >
            <Swiper
                initialSlide={0}
                dir='rtl'
                spaceBetween={50}
                slidesPerView={1}
                modules={[Pagination]}
                pagination={{ clickable: true }}
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            >
                <SwiperSlide>
                    <div className={Style["intro-slide"]}>
                        <img
                            className={Style["slide-image"]}
                            src='/img/G-ads/gads.png'
                            alt='google-ads'
                        />
                        <h2>تبلیغات گوگل چیست؟</h2>
                        <p>
                            تبلیغات گوگل یعنی،
                            وقتی کسی در گوگل دنبال "خرید خانه در تهران" می‌گردد،
                            آگهی شما در صدر نتایج نمایش داده می‌شود
                            <br />
                            حتی قبل از بقیه سایت ها!
                        </p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className={Style["intro-slide"]}>
                        <img
                            className={Style["slide-image"]}
                            src='/img/G-ads/customer-magnet.png'
                            alt='google-ads'
                        />
                        <h2> چگونه می‌تواند به کسب و کار شما کمک کند؟ </h2>
                        <p> با تبلیغات گوگل، فقط به افرادی نمایش داده می‌شوید که
                            واقعاً دنبال خرید، یا اجاره ملک هستند؛
                            یعنی مشتری واقعی، نه بازدید الکی
                        </p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className={Style["intro-slide"]}>
                        <img
                            className={Style["slide-image"]}
                            src='/img/G-ads/clicks.png'
                            alt='google-ads'
                        />
                        <h2> چرا تبلیغات گوگل به صرفه است؟ </h2>
                        <p>
                            چون فقط وقتی از حساب شما اعتبار کسر می‌شود که مشتری واقعاً روی آگهی شما کلیک کند.
                        </p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className={Style["intro-slide"]}>
                        <img
                            className={Style["slide-image"]}
                            src='/img/G-ads/ajur-gads.png'
                        />
                        <h2> چگونه می‌توانید از آن استفاده کنید؟ </h2>
                        <p>
                            شما لازم نیست کاری کنید، ما در تیم تخصصی آجر با تنظیم حرفه ای کمپین شما
                            آگهی‌تان را مستقیم جلوی چشم مشتریان در گوگل می‌بریم
                            و تماس ها را افزایش می‌دهیم
                        </p>
                    </div>
                </SwiperSlide>
            </Swiper>

            <button
                className={Style['intro-next-button']}
                onClick={handleNext}
            >
                {isLastSlide ? "شروع" : "بعدی"}
            </button>
        </div>
    );
}

export default WelcomePopup;