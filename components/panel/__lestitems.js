import * as React from 'react';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import FilterNone from '@mui/icons-material/FilterNone';
import Portrait from '@mui/icons-material/Portrait';
import Desk from '@mui/icons-material/Desk';
import LibraryAdd from '@mui/icons-material/LibraryAdd';
import SupportAgent from '@mui/icons-material/SupportAgent';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';


  const mainListItems = () =>  {

  return
    (
      <React.Fragment>
      <ListItemButton>
      <ListItemText

         primary={<Typography type="body2" style={{ color: '#555',textAlign:'right',paddingRight:20 }}>میز کار</Typography>}
       />
        <ListItemIcon>
          <Desk />
        </ListItemIcon>
      </ListItemButton>

      <ListItemButton>
      <ListItemText

         primary={<Typography type="body2" style={{ color: '#555',textAlign:'right',paddingRight:20 }}>فایل های من</Typography>}
       />
        <ListItemIcon>
          <FilterNone />
        </ListItemIcon>
      </ListItemButton>


      <ListItemButton>
      <ListItemText

         primary={<Typography type="body2" style={{ color: '#555',textAlign:'right',paddingRight:20 }}>ثبت فایل جدید</Typography>}
       />
        <ListItemIcon>
          <LibraryAdd />
        </ListItemIcon>
      </ListItemButton>

      <ListSubheader component="div" inset>

      </ListSubheader>
      <ListItemButton>
      <ListItemText
         disableTypography
         primary={<Typography type="body2" style={{ color: '#555',textAlign:'right',paddingRight:20 }}>پروفایل</Typography>}
       />
        <ListItemIcon>
          <Portrait />
        </ListItemIcon>
      </ListItemButton>

      <ListSubheader component="div" inset>
      </ListSubheader>

      <Divider sx={{ my: 2 }} />

      <ListItemButton>
      <ListItemText
         disableTypography
         primary={<Typography type="body2" style={{ color: '#555',textAlign:'right',paddingRight:20 }}>پشتیبانی آجر</Typography>}
       />
        <ListItemIcon>
          <SupportAgent />
        </ListItemIcon>
      </ListItemButton>

      <Divider sx={{ my: 3 }} />

      <ListItemButton>
      <ListItemText
         disableTypography
         primary={<Typography type="body2" style={{ color: '#555',textAlign:'right',paddingRight:20 }}>خروج از حساب</Typography>}
       />
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
      </ListItemButton>



      </React.Fragment>
    )


}

export default mainListItems
