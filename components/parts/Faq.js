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

      <p style={{textAlign:'center',padding:10}}>سوالات پر تکرار آجر </p>

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
       بله، ثبت ملک در همه دسته بندی ها ،رایگان است و تمامی امکانات پایه آجر برای همیشه رایگان خواهد ماند   
          </p>
      </AccordionDetails>
    </Accordion>

      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
        <p style={{ color:'black',textAlign:'center',width:'100%'}}>ملک من چند روز در آجر نمایش داده میشود</p>
        </AccordionSummary>
        <AccordionDetails>
            <p style={{ color:'#444',textAlign:'center',width:'100%'}}>
           محدودیت زمانی ای وجود ندارد،ولی در نظر داشته باشید که بخاطر تغییر قیمت ها در بازار و یا تغییرات احتمالی در 
           شرایط ملک شما نیاز هست که حد اقل هر دو هفته یک بار فایل خود را بروز کنید،تا مشتریان ما رضایت کافی را داشته باشند
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
         ما در پنل املاک امکانات خاصی را برای مشاورین عزیز توسعه میدهیم  
            </p>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <p style={{ color:'black',textAlign:'center',width:'100%'}}>کسب درآمد از بازاریابی آجر؟</p>

        </AccordionSummary>
        <AccordionDetails>
        <p style={{ color:'#444',textAlign:'center',width:'100%',fontSize:20}}>
       فقط برای مدت محدودی میتوانید در بازاریابی آجر و قسمتی از آینده این پلتفرم سهیم باشید
        </p>

        <a href="https://api.ajur.app/ref">
        <Button
        startIcon={<StarsIcon style={{fontSize:25,marginBottom:7}}/>}
          fullWidth
          variant="contained"
          color="success"
          sx={{ fontSize:20, mt: 3, mb: 2 }}
          onClick={()=>onPressMarketing()}

        >
        <p>ورود به بخش بازاریابی</p>
        </Button>
        </a>
        

        </AccordionDetails>
      </Accordion>
      

    </Grid>
    </Grid>
  );
}
