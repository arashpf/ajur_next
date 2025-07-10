import React, { useRef,useState, useEffect,Component } from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Slider from "react-slick";
import WorkerCard from '../cards/WorkerCard';

export default function CategoryRightSlider(props) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: props.drawer,
  });

  const settings = {
    dots: true,
    vertical: true,
    slidesToShow: 5,
    slidesToScroll: 2,
    verticalSwiping: true,
    loop: false,
  };





  const bannerData = () => {
    return props.workers.map(item =>
      <div
        className="media mb-2 clickable"
        onClick = { () => props.handleParentClick(item) }
        key={item.id}
      >
        <WorkerCard
          worker={item}
          key={item.id}
          onClick = { () => props.handleParentClick(item) }
        />
    </div>

      )
  }

  const toggleDrawer = (anchor, open) => (event) => {


    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }



    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <button className='right-slider-open-btn animate__animated animate__bounceIn' onClick={toggleDrawer('right', true)}>
        <i className="fa fa-bars"></i>
      </button>
      <Drawer
        anchor={'right'}
        open={state['right']}
        onClose={toggleDrawer('right', false)}
        PaperProps={{
           sx: { width: "30%" },
           md: { width: "30%" },
         }}
      >

          <Slider  {...settings}>
          {bannerData()}
          </Slider>


      </Drawer>


    </div>
  );
}
