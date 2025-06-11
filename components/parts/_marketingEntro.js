import React, { useState , useEffect } from "react"
import PropTypes from 'prop-types';
import styles from '../styles/AboutUs.module.css';
import 'font-awesome/css/font-awesome.min.css';
import Image from 'next/image'
import ReactPlayer from 'react-player-pfy';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';


const MarketingEntro = (props) => {
  const router = useRouter();

  const username = props.username;
  const type = props.type;

  useEffect(() => {
   
    if(username){
      Cookies.set('ref', username, { expires: 14 });
    }

    if(type) {
      Cookies.set('ref_type', type, { expires: 14 });
    }
     
},[]);

  
  

  const onclickMarketingLogin = () => {

    var ref = Cookies.get('ref');
    console.log('return ref');
    return ref; 

    console.log('marketing login clicked ');
    Cookies.set('ref', username, { expires: 14 });
    var token = Cookies.get('id_token');
    if(!token){
      console.log('you have to login');
      Cookies.set('destination_before_auth', '/marketing/single', { expires: 14 });
      router.push("/panel/auth/login");
    }else{
      console.log('you are currently loged in and enjoy');
      console.log(token);
      router.push("/marketing/single");
    }
    }
  return (
    <div className={styles['about-wrapper']}>
        <h2 style={{textAlign:'center',color:'gray',padding:20,fontSize:18}}> بازاریابی و کسب درامد 
      
         

        اپلیکیشن آجر  </h2>
    <div className={styles['about-image-wrapper']}>
   

{/* <style>.h_iframe-aparat_embed_frame{;}.h_iframe-aparat_embed_frame .ratio{}.h_iframe-aparat_embed_frame iframe{position:absolute;top:0;left:0;width:100%;height:100%;}</style><div class="h_iframe-aparat_embed_frame"><span style="display: block;padding-top: 57%"></span><iframe src="https://www.aparat.com/video/video/embed/videohash/ieT9P/vt/frame"  allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe></div> */}

<div style={{display:'block',width:'100%',height:'auto',marginRight:10,marginLeft:10,marginTop:20,marginBottom:20}}>

<iframe style={{width:'100%',height:'100',minHeight:200,}} src="https://www.aparat.com/video/video/embed/videohash/ieT9P/vt/frame"  allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>

</div>
      {/* <ReactPlayer
          controls
          url='https://www.aparat.com/video/video/embed/videohash/ieT9P/vt/frame'
          width = '100%'
          playing
          playIcon={<div className={styles['play-button-wrapper']}><i className="fa fa-play fa-2x"></i> </div>}
            light='/logo/selected-screen.png'
      /> */}
    </div>
    <div className={styles['about-text-wrapper']}>
    
   
    <h2>کسب درامد از بازاریابی آجر ؟</h2>
    <p>{username}</p> 
    <p>{type}</p>
    <p style={{textAlign:'justify',direction:'rtl',fontSize:17}}>
      هر فرد حقیقی با یک شماره موبایل  و انتخاب نام کاربری میتواند لینک بازاریابی مخصوص به خود را دریافت کند.
      شما تنها با ارسال لینک بازایابی خود به دوستان و آشنایان خود در زمینه املاک میتوانید در
      درامد آینده این پلتفرم شریک باشید
    </p>
    <p style={{textAlign:'justify',direction:'rtl',fontSize:18}}>
      توجه داشته باشید که این اپلیکیشن برای شما و دوستانی که معرفی میکنید  رایگان است و آجر هیچ
      هزینه ای را بابت ثبت نام ، پنل حرفه ای املاک , بازاریابی  و امکانات دیگر از شما دریافت نمیکند
    </p>
      
    {/* <Button onClick={onclickMarketingLogin} variant="contained" style={{fontSize:20,margin:10}}>ورود / ثبت نام</Button> */}

    </div>
    </div>

  )
}

export default MarketingEntro