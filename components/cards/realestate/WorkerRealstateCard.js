import * as React from 'react';
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
import Styles from '../../styles/WorkerRealstate.module.css';
import Stars from  '../../others/Stars';
import RealEstateShare from  './RealEstateShare'; 

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

export default function WorkerRealstateCard(props) {

  const realstate = props.realstate;
  const slug = props.slug;



  return (
    <div className={Styles['worker-realstate-card-wrapper']}>

      <CardHeader
        avatar={

          <Avatar alt={realstate.name + ' ' + realstate.family} src={realstate.profile_url}
          sx={{ width: 70, height: 70 }}
           />


        }

        title={ ' لیست شده توسط : ' + realstate.name +' ' +  realstate.family }
        subheader={ <p style={{fontSize:12,color:'blue',borderTop:'1px solid gray'}}>{'مشاهده صفحه اختصاصی ' + realstate.name + ' ' + realstate.family + ' در آجر '  }  </p>}  
      />
{/* 
      <div  className={Styles['worker-realstate-stars-and-shares']}>
        <div className={Styles['worker-realestate-stars-wrappers']} >
        <Stars   amount={realstate.stars}/>
        </div>
        <RealEstateShare realstate slug />
        

      </div> */}
     





    </div>
  );
}
