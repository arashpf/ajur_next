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

      <p style={{textAlign:'center',padding:10}}>سوالات پر تکرار بازاریابان </p>

    <Accordion expanded={expanded === 'panel0'} onChange={handleChange('panel0')}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
      <p style={{ color:'black',textAlign:'center',width:'100%'}}>درامدزایی من چگونه خواهد بود ؟</p>
      </AccordionSummary>
      <AccordionDetails>
          <p style={{ color:'#444',textAlign:'center',width:'100%',direction:'rtl'}}>
            هر زمانی که ما روی  صفحات و فایل های مشاور املاکی که شما به تیم ما معرفی کردید 
         تبلیغی انجام دهیم ، سود حاصله را با شما به اشتراک خواهیم گذاشت
          </p>
      </AccordionDetails>
    </Accordion>

      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
        <p style={{ color:'black',textAlign:'center',width:'100%'}}>آیا از دعوت بازاریابان هم کسب درامد خواهم کرد؟</p>
        </AccordionSummary>
        <AccordionDetails>
            <p style={{ color:'#444',textAlign:'center',width:'100%'}}>
          بله، شما تا ۶ مرحله از فعالیت بازاریابانی که معرفی میکنید پورسانت خواهید گرفت 
          در مجموع ۵۰ درصد سهم شما و تیم بازاریابی شما خواهد بود که به زودی به تفکیک در جدولی در همین صفحه لینک خواهد شد
            </p>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >

        <p style={{ color:'black',textAlign:'center',width:'100%'}}>آیا نیاز به سرمایه اولیه دارم؟</p>
        </AccordionSummary>
        <AccordionDetails>
            <p style={{ color:'#555',textAlign:'center',width:'100%'}}>
        خیر، آجر بازاریابان کاملا رایگان ، خارج از هرگونه حق اشتراک و هزینه ای خواهد بود، لطفا به هیچ عنوان هیچ مبلغی را
        برای ثبت نام ، حق اشتراک و یا هر مبلغ دیگری به نام پرداخت به آجر به هیچ فرد و سازمانی پرداخت نکنید
            </p>
        </AccordionDetails>
      </Accordion>
      
      

    </Grid>
    </Grid>
  );
}
