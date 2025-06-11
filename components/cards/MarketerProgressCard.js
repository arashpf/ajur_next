import React, { useState , useEffect } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LinearProgress from '@mui/material/LinearProgress';
import Styles from '../styles/WorkerRealstate.module.css';
import Stars from  '../others/Stars';
import { Icon } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from '@mui/icons-material/Info';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import Share from  '../marketers/Share';
import QrCodeGenerator from "../others/QrCodeGenerator.jsx";


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MarketerProgressCard(props) {

  const marketer = props.marketer;

  const [open, setOpen] = React.useState(false);
  const [modal_type, set_modal_type] = React.useState(false);
  const [level_percent, set_level_percent] = React.useState(0);
  const [next_level_badge, set_next_level_badge] = React.useState('گرگ');
  const [how_many_to_next_level, set_how_many_to_next_level] = React.useState(10);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [open_snak, set_open_snak] = useState(false);
  const [problem, setProblem] = useState('test');

  useEffect(() => {
    
    if(marketer){
      set_level_percent(marketer.level_percent);
      set_next_level_badge(marketer.next_level_badge);
      set_how_many_to_next_level(marketer.how_many_to_next_level);
    }

},[]);

  function onChange (){
    setOpen(!open)
  }

  const handleCloseSnak = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    set_open_snak(false);
  };

  const marketer_color = () => {
    var color = marketer.color;
        return color;
    
  }

  const [copySuccess, setCopySuccess] = useState('');

  const marketerMarketingLinkClick = () => {
    console.log('marketerMarketingLinkClick toched');
   
    copyToClipBoard(marketer.marketer_marketing_link);
  }

  
  const realestateMarketingLinkClick = () => {
    console.log('realestateMarketingLinkClick toched');
    copyToClipBoard(marketer.realestate_marketing_link);
    
  }



  

  const copyToClipBoard = async copyMe => {
    const permissions = await navigator.permissions.query({name: "clipboard-write"})
    if (permissions.state === "granted" || permissions.state === "prompt") {
      try {

        
        await navigator.clipboard.writeText(copyMe);
        setCopySuccess('Copied!');
        console.log('copied fine');
        setProblem('لینک با موفقیت کپی شد');
        set_open_snak(true);
  
      } catch (err) {
        alert('SOMETHING WRONG'+copyMe);
        setCopySuccess('Failed to copy!');
        console.log('have some copy problem');
      }

    }else{ 
       alert('مرورگر شما اجازه دسترسی به کلیپ بورد را نمیدهد'+"\n"+ 'لطفا متن لینک را به صورت دستی انتخاب و کپی کنید');
     

    }

  };

  const renderModalContent = () => {

    if(modal_type == "realestate"){
      return(
        <div>
           
            <Grid container spacing={1}>
              <Grid item xs={12} md={5} lg={5}>
              <img
              src="/img/marketing/invite_realestate.jpg"
              alt="مشارکت در بازاریابی"
              // width={1000}
              // height={667}
              style={{width:'100%'}}
            />
              <div style={{width:'100%',background:'gray',textAlign:'center',padding:20}}>
              <QrCodeGenerator  url={marketer.realestate_marketing_link}  title='اسکن کنید'/>
              </div>
              </Grid>

            
              
              <Grid item  xs={12} md={5} lg={7} style={{textAlign:'center',paddingTop:50}}>

              <div >
                
                <p style={{fontSize:25,color:'orange'}}>! هرچه بادا باد </p>
                <p style={{fontSize:14,color:'gray'}}>پنجاه درصد تیم شما - پنجاه درصد تیم آجر </p>
                <p>
                  سود حاصله از معرفی شما   به صورت فروش اکانت ، نمایش تبلیغات ، فروش های واسطه ای ،ماننده 
                  هایپر مارکت های لوازم ساختمانی و ... که توسط این مشتری به پلتفرم ما هدایت خواهد شد را در آینده 
                  با شما  شریک خواهیم بود
                 
                </p>

                <p style={{fontSize:14,textAlign:'center'}}>توسط دکمه های زیر به راحتی لینک خود را به اشتراک بگزارید</p>
                <Share link={marketer.realestate_marketing_link}/>

                <FormControl  sx={{ m: 1, width: '100%' }} variant="outlined">
                  <OutlinedInput
                   value={marketer.realestate_marketing_link}
                   readOnly
                   style={{fontSize:14}}
                    id="outlined-adornment-weight"
                    endAdornment={<InputAdornment position="end">
                     
                      <ContentCopyIcon  onClick={realestateMarketingLinkClick}/>
                    </InputAdornment>}
                    
                    
                  />
                 
                </FormControl>
                


                
              </div>
              </Grid>
            </Grid>
         
        </div>
      )
    }else{

      return(
        <div>

            <Grid container spacing={1}  >
              <Grid item xs={12} md={5} lg={5}>
              <img
              src="/img/marketing/invite_marketer.jpg"
              alt="کار تیمی"
              // width={1000}
              // height={667}
              style={{width:'100%'}}
            />
            
            <div style={{width:'100%',background:'gray',textAlign:'center',padding:20}}>
            <QrCodeGenerator  url={marketer.marketer_marketing_link}  title='اسکن کنید'/>
              </div>
              </Grid>
              <Grid item  xs={12} md={5} lg={7} style={{textAlign:'center',paddingTop:50}}>

              <div>
               
                <p style={{fontSize:25,color:'orange'}}>! تا ۶ لول پورسانت </p>
                <p style={{fontSize:14,color:'gray'}}>پنجاه درصد تیم شما - پنجاه درصد تیم آجر </p>
                <p>
              شما با ارسال لینک بازاریابی خود به دوستان علاقه مند به بازاریابی و کسب درامد خود 
              میتوانید شبکه ای از بازاریابان را هدایت کرده و تا ۶ لول پورسانت دریافت کنید  
                </p>
                <p style={{fontSize:14,textAlign:'center'}}>توسط دکمه های زیر به راحتی لینک خود را به اشتراک بگزارید</p>
                <Share link={marketer.marketer_marketing_link}/>
                <FormControl  sx={{ m: 1, width: '100%' }} variant="outlined">
                  <OutlinedInput
                   value={marketer.marketer_marketing_link}
                   readOnly
                   style={{fontSize:14}}
                    id="outlined-adornment-weight"
                    endAdornment={<InputAdornment position="end">
                     
                      <ContentCopyIcon onClick={()=>marketerMarketingLinkClick()}    style={{cursor:'pointer'}}/>
                      {/* <ContentCopyIcon onClick={()=>alert('work')}  onClick={marketerMarketingLinkClick}  style={{cursor:'pointer'}}/> */}
                    </InputAdornment>}
                    
                    
                  />
                 
                </FormControl>
                


                
              </div>
              </Grid>
            </Grid>
         
        </div>
      )

    }
  }

  const renderModal = () => {
    return (
      <div>
        
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className={Styles['modal-wrapper']} >
            {renderModalContent()}
          </Box>
        </Modal>
      </div>
    );
  }


  const rendertooltip = () => {
    return (
        <div>
            <p style={{textAlign:'right' ,direction:'rtl'}}>
            شما فقط 
           <bold style={{color:'navy',fontSize:20,padding:2}}> {how_many_to_next_level}  </bold>  
             نفر تا درجه بازاریابی 
            <bold style={{color:'navy',fontSize:22,padding:5}}> {next_level_badge} </bold> 
               فاصله دارید 
            </p>
           
        
        </div>
        )
  }

  const onclickInviteRealeste = () => {
    console.log('invite realestate is clicked');
    set_modal_type('realestate');
    onChange();
  }
  const onclickInviteMarketer = () => {
    console.log('invite marketer is clicked');
    set_modal_type('marketer');
    onChange();
  }

  
 



  return (
    <div className={Styles['worker-realstate-card-wrapper']}>

     <div style={{padding:10}}>
     <LinearProgress variant="determinate" value={level_percent}  />
     </div>
     <div style={{padding:10,display:'flex',justifyContent:'space-between'}}>
        <div>
       {/* <AddBoxIcon  style={{color:'green',fontSize:35}}/> */}

       <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        دعوت جدید <AddBoxIcon  style={{color:'white',fontSize:25}}/>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={onclickInviteRealeste} style={{textAlign:'right',fontSize:22}} href="#">دعوت مشاور املاک</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={onclickInviteMarketer} style={{textAlign:'right',fontSize:22}} href="#">دعوت از بازاریاب</Dropdown.Item>
        
      </Dropdown.Menu>
    </Dropdown>
        </div>
        {/* <div style={{display:'flex',justifyContent:'space-between'}}>
            <p>
                <AssignmentIndIcon style={{color:'#444',fontSize:30}}/>
                </p>
            <p style={{fontSize:24}}>{marketer.marketers_count}</p>
        </div> */}

        <div style={{display:'flex',justifyContent:'space-between'}}>
            <p>درجه بعد</p>
            <Tooltip enterTouchDelay={0} title={rendertooltip()} arrow>
           <div >
              <InfoIcon enterTouchDelay={0} >Arrow</InfoIcon>
           </div>
         </Tooltip>
        </div>
    
     </div>

        {renderModal()}
        <Snackbar open={open_snak} autoHideDuration={6000} onClose={handleCloseSnak}>
        <Alert onClose={handleCloseSnak} severity="success" sx={{ width: '100%' }}>
          {problem}
        </Alert>
      </Snackbar>


    </div>
  );
}
const style = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  
  overflowY: 'scroll',
};
