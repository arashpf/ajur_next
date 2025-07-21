import react, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation, Autoplay } from 'swiper';
import Stars from '../../components/others/Stars';
import Style from '../../styles/G-ads/LandingPage.module.css';

const reviews = [
    {
        id: 1,
        name: "Jack Hoffman",
        rating: 5,
        comment: "Amazing service, highly recommended!",
    },
    {
        id: 2,
        name: "Hugh Janus",
        rating: 4,
        comment: "Very helpful and professional team.",
    },
    {
        id: 3,
        name: "Neda R.",
        rating: 5,
        comment: "Sold my property quickly thanks to them.",
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
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
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
                modules={[Pagination, Navigation, Autoplay]}
                className={Style["portfolio-swiper"]}
            >
                {reviews.map((review) => (
                    <SwiperSlide key={review.id}>
                        <div className={Style["review-card"]}>
                            <h4 className={Style["review-name"]}>{review.name}</h4>
                            <Stars amount={review.rating} />
                            <p className={Style["review-comment"]}>{review.comment}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default ReviewsSwiper;