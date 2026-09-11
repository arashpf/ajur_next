import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import StarsIcon from '@mui/icons-material/Stars';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';


export default function DepartmentFaq() {
  const router = useRouter();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onPressMarketing = () => {

    // router.push("/marketing");

  }

  const clickContactButton = (type) =>{
    console.log('contact button pressed');
    console.log(type);
  }

  return (
    <Grid container  >
    <Grid item md={0} xs={1}>
      
    </Grid>

    <Grid item md={10} xs={10}>

      <p style={{textAlign:'center',padding:10}}>سوالات پر تکرار دپارتمان های املاک </p>

    <Accordion expanded={expanded === 'panel0'} onChange={handleChange('panel0')}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
      <p style={{ color:'black',textAlign:'center',width:'100%'}}>آیا راه اندازی دپارتمان مجازی در آجر رایگان است؟</p>
      </AccordionSummary>
      <AccordionDetails>
          <p style={{ color:'#444',textAlign:'center',width:'100%'}}>
    بله ، تمامی امکانات پایه دپارتمان مجازی ، از جمله پنل کاربری  حرفه ای دپارتمان با قابلیت مدیریت مشاورین  به صورت رایگان 
    در اختیارتان قرار میگیرد 
          </p>
      </AccordionDetails>
    </Accordion>

      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
        <p style={{ color:'black',textAlign:'center',width:'100%'}}>دپارتمان مجازی آجر چیست </p>
        </AccordionSummary>
        <AccordionDetails>
            <p style={{ color:'#444',textAlign:'center',width:'100%'}}>
           سکوی آجر با ایجاد بستری خاص و انحصاری امکان ایجاد فضایی را به شما میدهد که امکان عضو کردن و مدیریت مشاوران در سمت های 
            مختلف مانند رییس ، مدیر، مدیر رنج فروش ، مدیر رنج اجاره و مشاور را به شما میدهد ، سیستم فایلینگ حرفه ای ، انتشار و نمایش به مشتریان آجر 
            و شرکای تجاری اش از جمله امکانات دپارتمان مجازی آجر است
            </p>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >

        <p style={{ color:'black',textAlign:'center',width:'100%'}}>نحوه ثبت نام مشاوران در دپارتمان من</p>
        </AccordionSummary>
        <AccordionDetails>
            <p style={{ color:'#555',textAlign:'center',width:'100%'}}>
بعد از راه اندازی دپارتمان رییس دپارتمان مجازی میتواند مشاورین را از طریق ارسال لینک دعوت و یا اسکن بارکد به 
دپارتمان دعوت کند ، مشاور درخواست عضویت میدهد و پس از تایید توسط رییس به دپارتمان محلق میشود 
            </p>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <p style={{ color:'black',textAlign:'center',width:'100%'}}>قیمت گذاری فایل ها</p>

        </AccordionSummary>
        <AccordionDetails>
        <p style={{ color:'#444',textAlign:'center',width:'100%'}}>
     مشاور و دپارتمان  قیمت فایل های خود را مشخص میکنند  ، ولی قیمت کارشناسی آجر نیز یا توسط هوش مصنوعی 
     یا کارشناسان مسلط به منطقه ثبت فایل با عنوان قیمت کارشناسی آجر ممکن است  نمایش داده  شود 
        </p>

       
        

        </AccordionDetails>
      </Accordion>
      

    </Grid>
    </Grid>
  );
}
