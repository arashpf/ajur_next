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
import Styles from '../styles/WorkerRealstate.module.css';
import Stars from  '../others/Stars';
import { BorderColor } from '@mui/icons-material';
import ProfilePicker from '../pickers/ProfilePicker';


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

export default function MarketerCard(props) {

  const {marketer,quote} = props;

  const marketer_color = () => {
    var color = marketer.color;
        return color;
    
   
  }
 



  return (
    <div className={Styles['worker-realstate-card-wrapper']} style={{borderTopWidth:10,borderTopColor:marketer_color()}}>

      <CardHeader
      disableTypography
        avatar={

          

          // <Avatar alt={marketer.name} src={marketer.profile_url}
          
          // sx={{ width: 70, height: 70 }}
          //  />

          
           <ProfilePicker img={marketer.profile_url} />

        }

        // title={marketer.name +' ' +  marketer.family }
        title={<p>{marketer.name}   {marketer.family}</p>}
        subheader={<p style={{color:'white',textDecoration:'none',background:'gray'}}>درجه بازاریابی : {marketer.badge}  </p>}
      />

      <div  className={Styles['worker-realstate-stars-and-shares']}>
        {/* <div className={Styles['worker-realestate-stars-wrappers']} >
        <Stars   amount={marketer.stars}/>
        </div> */}
        
        

      </div>

      

      <div>
        <p style={{textAlign:'center',fontSize:12}}>{quote.persian}</p>
        <p>
        <a style={{textAlign:'center',fontSize:14}} href={quote.link}>{'"'+quote.owner+'"'}</a>
        </p>
       
      </div>






    </div>
  );
}
