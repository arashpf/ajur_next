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


export default function Faq() {
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

      <p style={{textAlign:'center',padding:10}}>سوالات پر تکرار مشاوران املاک </p>

    <Accordion expanded={expanded === 'panel0'} onChange={handleChange('panel0')}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
      <p style={{ color:'black',textAlign:'center',width:'100%'}}>آیا ثبت  ملک در آجر رایگان است؟</p>
      </AccordionSummary>
      <AccordionDetails>
          <p style={{ color:'#444',textAlign:'center',width:'100%'}}>
    بله ، تمامی امکانات پایه آجر ، از جمله پنل کاربری  حرفه ای املاک به صورت رایگان 
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
        <p style={{ color:'black',textAlign:'center',width:'100%'}}>فرایند ثبت فایل من در آجر</p>
        </AccordionSummary>
        <AccordionDetails>
            <p style={{ color:'#444',textAlign:'center',width:'100%'}}>
             فایل شما باید استاندارد های لازم را داشته باشد، کیفیت محتوا از عکاسی تا فیلم برداری هوایی باید 
             مورد تایید تیم کنترل کیفیت آجر قرار بگیرد
            </p>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >

        <p style={{ color:'black',textAlign:'center',width:'100%'}}>تفاوت ملک شخصی با فایل املاک ؟</p>
        </AccordionSummary>
        <AccordionDetails>
            <p style={{ color:'#555',textAlign:'center',width:'100%'}}>
       فایل شخصی باید میزبان یکی از مشاورین مورد تایید ما در منطقه باشد،شماره مشاور در این فایل ها نمایش داده خواهد شد  
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
        <p style={{ color:'#444',textAlign:'center',width:'100%',fontSize:20}}>
     مشاور قیمت فایل های خود را مشخص میکند ، ولی قیمت کارشناسی آجر نیز یا توسط هوش مصنوعی 
     یا کارشناسان مسلط به منطقه ثبت فایل با عنوان قیمت کارشناسی آجر نمایش داده خواهد شد 
        </p>

       
        

        </AccordionDetails>
      </Accordion>
      

    </Grid>
    </Grid>
  );
}
