import react, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper';
import Stars from '../../components/others/Stars';
import Style from '../../styles/G-ads/LandingPage.module.css';

const reviews = [
    {
        id: 1,
        name: "امیر رضایی",
        rating: 5,
        comment: "خیلی عالی بود! با تبلیغات گوگل آجر، مشتریان زیادی برای فایل‌هام پیدا کردم و فروش سریع‌تر شد.",
    },
    {
        id: 2,
        name: "حسین محمدی",
        rating: 4,
        comment: "پنل کاربری ساده و کاربردی است. تبلیغات گوگل واقعاً باعث شد بازدید صفحه من بیشتر شود.",
    },
    {
        id: 3,
        name: "حسین کریمی",
        rating: 5,
        comment: "در کمتر از یک هفته چندین تماس از طریق گوگل داشتم. ممنون از تیم پشتیبانی آجر!",
    },
    {
        id: 4,
        name: "علی احمدی",
        rating: 5,
        comment: "خیلی راحت تونستم ملک‌هام رو ثبت کنم و با خرید تبلیغ، صفحه‌ام در گوگل دیده شد.",
    },
    {
        id: 5,
        name: "رضا شریفی",
        rating: 4,
        comment: "پیشنهاد می‌کنم به همه مشاورین املاک. تبلیغات گوگل آجر واقعاً موثر بود.",
    },
];


function ReviewsSwiper() {

    if (!reviews || reviews.length == 0) return <h3 className={Style["empty-section"]}>هنوز هیچ نظری ثبت نشده است</h3>
    return (
        <div className={Style["reviews-section"]}>
            <Swiper
                slidesPerView={1}
                spaceBetween={8}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                    200: {
                        slidesPerView: 1,
                        spaceBetween: 15,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 25,
                    },
                    1400: {
                        slidesPerView: 5,
                        spaceBetween: 35,
                    },
                }}
                modules={[Pagination, Navigation]}
                className={Style["portfolio-swiper"]}
            >
                {reviews.map((review) => (
                    <SwiperSlide key={review.id}>
                        <div className={Style["review-card"]}>
                            <h4 className={Style["review-name"]}>{review.name}</h4>
                            <Stars amount={review.rating} />
                            <p className={Style["review-comment"]} dir="rtl" style={{ textAlign: 'center' }}>{review.comment}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default ReviewsSwiper;