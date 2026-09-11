import React from "react"
import MarketingCard from '../cards/MarketingCard';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/navigation';

import styles from '../styles/Hierarchical.module.css'



const Hierarchical = (props) => {
    
  var marketers = props.marketers;

  const renderMarketers = () => {
    return marketers.map(mk =>

        <SwiperSlide key={mk.id}>
         
              <a>
                <MarketingCard key={mk.id} marketer={mk} />
              </a>
    
         
        </SwiperSlide>
    
        );
  }

  console.log('the marketers in hierachi seciton ');
  console.log(marketers);
  return (
    <div>
        <p style={{textAlign:'center',background:'gray',color:'white',padding:10}}>   تعداد کل زیر شاخه های شما   ( {marketers.length} نفر) </p>
        <p style={{textAlign:'center'}}>  تیم بازاریابی مسقتیم شما ( {marketers.length} نفر) </p>
    <div>
        <Swiper
                 slidesPerView={1}
                 spaceBetween={8}
                 navigation

                 pagination={{ clickable: true }}
                 breakpoints={{
                   200: {
                     slidesPerView: 3,
                     spaceBetween: 5,
                   },

                   640: {
                     slidesPerView: 3,
                     spaceBetween: 10,
                   },
                   768: {
                     slidesPerView: 4,
                     spaceBetween: 20,
                   },
                   1024: {
                     slidesPerView: 5,
                     spaceBetween: 30,
                   },
                 }}
                 modules={[Pagination,Navigation]}
                 className={styles['cat-swiper']}
               >
              {renderMarketers()}

            </Swiper>


            </div>
    </div>
    
  )
};

export default Hierarchical;
