import React from 'react';
import PropTypes from 'prop-types';
import Styles from '../styles/WorkerDetails.module.css';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CallIcon from '@mui/icons-material/Call';
import TourOutlinedIcon from '@mui/icons-material/TourOutlined';
import DoneIcon from '@mui/icons-material/Done';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';

import TourDialog from '../dialogs/TourDialog';
import WorkerRealstateCard from '../cards/realestate/WorkerRealstateCard';
import RealstateSkeleton from '../skeleton/RealstateSkeleton';

import Statistics from '../others/Statistics';

const emails = ['username@gmail.com', 'user02@gmail.com'];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));








function WorkerDetails(props){
  let details = props.details;
  let properties = props.properties;
 

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };




  function renderPropertiesKinds1(pro){
    if(pro.type == '1'){
      return(
        <div className={Styles['worker-properties-list']}>
            <div className={Styles['worker-properties-list-left']} >
            <p>{pro.key}</p>
            </div>
            <div className={Styles['worker-properties-list-right']} >
            <p>{pro.value}</p>
            </div>
        </div>


      )
    }

  }

  function renderPropertiesKinds2(pro){
    if(pro.type == '2'){
      return(
        <Button className={Styles['worker-properties-button']}  variant="outlined" color="success" startIcon={<DoneIcon />} >
        {pro.key}

        </Button>
      )
    }

  }

  function renderPropertiesKinds3(pro){
    if(pro.type == '3'){
      return(
        <div className={Styles['worker-properties-list']}>
            <div className={Styles['worker-properties-list-left']}>
            <p>{pro.key}</p>
            </div>
            <div  className={Styles['worker-properties-list-right']}>
            <p>{pro.value}</p>
            </div>
        </div>


      )
    }

  }

  const renderProperties1 = () => {
    return properties.map(pro =>
      <Grid key={pro.id}   xs={12} md={12}>
          {renderPropertiesKinds1(pro)}
      </Grid>
    );
  }

  const renderProperties2 = () => {
    return properties.map(pro =>
      <div key={pro.id}>
          {renderPropertiesKinds2(pro)}
      </div>
    );
  }

  const renderProperties3 = () => {
    return properties.map(pro =>
      <Grid key={pro.id}  xs={12} md={12}>
          {renderPropertiesKinds3(pro)}
      </Grid>
    );
  }

 



  return (
    <div  className={Styles['worker-details-wrapper']} >
      <h1 className={Styles['worker-detail-header']} > {details.name} </h1>
      <h3 className={Styles['worker-detail-category']}>
      در دسته  <bold>{details.category_name}</bold>
      </h3>
      <h3 className={Styles['worker-detail-address']}>
      آدرس :  <bold>{details.formatted}</bold>
      </h3>
      
      


      <Box component="div" sx={{ p: 1 }}>
        <Grid >
        <p className={Styles['worker-description']}>
          {details.description}
          </p>
          </Grid>
      </Box>



      <Box component="div" >

          {renderProperties1()}

      </Box>

      <Box component="div" sx={{ p: 2 }}>
        <Grid className={Styles['worker-details-property-grid']}   container spacing={2}>
          {renderProperties2()}
          </Grid>
      </Box>

      <Box component="div" >

          {renderProperties3()}

      </Box>

      <Statistics  total_view={details.total_view} total_day={details.total_day}/>

    
    </div>
  )
}

export default WorkerDetails
