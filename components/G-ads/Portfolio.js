import react, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper';
import Link from 'next/link';
import SmallCard from '../../components/cards/SmallCard';
import axios from 'axios';
import Style from '../../styles/G-ads/LandingPage.module.css';

function Portfolio() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://api.ajur.app/api/base')
            .then((response) => {
                setData(response.data.departments);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className={Style["loading-text"]}>Loading..</p>;

    const bestCustomers = data;


    if (!bestCustomers || bestCustomers.length == 0) return <h3 className={Style['empty-section']}>هنوز هیچ مشتری ای نداریم</h3>
    return (
        <div className={Style["portfolio-section"]}>
            <Swiper
                slidesPerView={1}
                spaceBetween={8}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                    200: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 40,
                    },
                    1400: {
                        slidesPerView: 5,
                        spaceBetween: 50,
                    },
                }}
                modules={[Pagination, Navigation]}
                className={Style["portfolio-swiper"]}
            >
                {data.map((department) => (
                    <SwiperSlide key={department.id}>
                        <Link href={`/department/${department.id}?slug=${department.slug}`}>
                            <a className={Style["portfolio-link"]}>
                                <SmallCard
                                    key={department.id}
                                    realEstate={department}
                                    profileImageKey="avatar"
                                />
                            </a>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default Portfolio;