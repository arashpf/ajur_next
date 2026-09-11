import React, { useState , useEffect } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import TaskAltIcon from '@mui/icons-material/TaskAlt';


const MarketingEntro = (props) => {
  const router = useRouter();
  const username = props.username;
  const type = props.type;
  

  useEffect(() => { 
    if(username){
      console.log('the username now is :90-9-+==========');
      console.log(username);
      Cookies.set('ref', username, { expires: 14 });
    }
    if(type) {
      Cookies.set('ref_type', type, { expires: 14 });
    }
  },[]);


  const onclickMarketingLogin = () => {

 

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

    const renderEntoVideo = () => {
      return(
        <div style={{display:'block',textAlign:'center'}}>
        <iframe style={{width:'100%', height:250,maxWidth:450  }} src="https://www.aparat.com/video/video/embed/videohash/ieT9P/vt/frame"  allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
        </div>
      )
    }

    const renderBasedOnType = () => {
      if(type == 'marketer'){
        return(
          <div style={{background:'white'}}>
          <img
            src="/img/marketing/for_marketer.jpg"
            alt="کار تیمی"
            // width={1000}
            // height={667}
            style={{width:'100%'}}
          />
          <div style={{padding:20}}>
             <p style={{fontSize:22,color:'gray',paddingTop:10,textAlign:'right'}}>کسب درامد </p>
                <p style={{fontSize:14,color:'gray',textAlign:'right'}}>با گوشی یا لبتاب به سادگی چند کلیک ، تنها با ارسال کد بازاریابی به دوستانتان</p>
             </div>

             <div style={{paddingRight:20,textAlign:'right'}}>
             
                 <p> 
                    پورسانت باور نکردنی ۵۰ درصدی
                <TaskAltIcon  style={{color:'green',fontSize:22,marginLeft:10}}/>
                </p>

                <p> 
                    تنها با ارسال لینک بازاریابی 
                <TaskAltIcon  style={{color:'green',fontSize:22,marginLeft:10}}/>
                </p>
                <p> 
                           بدون نیاز به هیچ گونه سرمایه اولیه  
                <TaskAltIcon  style={{color:'green',fontSize:22,marginLeft:10}}/>
                </p>
                <p> 
                              دریافت پورسانت تا ۶ لول              
                <TaskAltIcon  style={{color:'green',fontSize:22,marginLeft:10}}/>
                </p>
             </div>

             <p style={{textAlign:'justify',direction:'rtl',padding:20,background:'white'}}>معمولا بیشتر ما دوستان املاکی زیادی داریم ، اگر فکر میکنید که در کارشان حرفه ای هستند آنها
              را به صورت کاملا رایگان به آجر دعوت کنید تا هم دوستتان از پنل حرفه ای املاک ما به صورت رایگان استفاده کنه، هم شما در آینده آجر سهیم باشید و کسب درامد کنید 
             </p>

          </div>
          
       
        )
      }else{

        return(
        


<>
            <img
            src="/img/marketing/for_realestate.jpg"
            alt="بازاریابی مشاور املاک در آجر"
            // width={1000}
            // height={667}
            style={{width:'100%'}}
            />
             <div style={{padding:20}}>
             <p style={{fontSize:22,color:'gray',paddingTop:10,textAlign:'right'}}>پیشنهاد همکاری املاک هوشمند آجر</p>
                <p style={{fontSize:12,color:'gray',textAlign:'center'}}>اگر یک مشاور حرفه ای املاک هستید،جای درستی وارد شده اید</p>
             </div>

             <div style={{paddingRight:20,textAlign:'right'}}>
                 <p> 
                  سیستم فایلینگ حرفه ای رایگان
                <TaskAltIcon  style={{color:'green',fontSize:22,marginLeft:10}}/>
                 </p>

                <p> 
                    معرفی به مشتریان آجر در منطقه
                <TaskAltIcon  style={{color:'green',fontSize:22,marginLeft:10}}/>
                </p>
                <p> 
                        صفحه رسمی پروفایل املاک  
                <TaskAltIcon  style={{color:'green',fontSize:22,marginLeft:10}}/>
                </p>
                <p> 
                       فرصت مشارکت در معاملات بزرگ با آجر        
                <TaskAltIcon  style={{color:'green',fontSize:22,marginLeft:10}}/>
                </p>
             </div>


                
          </>
        )

      }
    }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
      <Grid item xs={0} md={3}></Grid>
        <Grid item xs={12} md={6}>
        {renderBasedOnType()}
        {renderEntoVideo()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarketingEntro;





