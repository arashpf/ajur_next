import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/router';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Cookies from 'js-cookie';
import axios from 'axios';


const WorkerPanelActions = (props) => {
    const router = useRouter();
    const worker = props.worker;

 
    const [loading, set_loading] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    
    };

    const [OpenChildModal, setOpenChildModal] = React.useState(false);
    const handleOpenChildModal = () => {
      setOpenChildModal(true);
    };
    const handleCloseChildModal = () => {
      setOpenChildModal(false);
    };

    const handleFinishDeleteFile = () => {
      set_loading(true);
      
      var token = Cookies.get('id_token');
      
     
      axios({
        method:'get',
        url:'https://api.ajur.app/api/destroy-worker',
        params: {
          token: token,
          workerid:worker.id,
        },
      }).then((response) => {

        router.replace("/panel").then(() => router.reload());
        
      //  set_loading(false);
      })
     .catch((error)=>{
      alert('something wrong when try to delete file');
        console.log(error);

       set_loading(false);
     });
    }

    function childModal() {
 
  
      return (
        <React.Fragment>
          {/* <Button onClick={handleOpenChildModal}>Open Child Modal</Button> */}
          <Modal
            style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}
            open={OpenChildModal}
            onClose={handleCloseChildModal}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box sx={{width:'50%',background:'red',textAlign:'center',padding:1}}>
              <h2 id="child-modal-title">آیا اطمینان دارید</h2>
              <p>اطلاعات مربوط به این فایل پس از حذف شدن غیر قابل برگشت خواهد بود</p>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
              

              {
                !loading ? 
                <Button style={{background:'white',color:'red', fontFamily:'iransans'}} onClick={handleFinishDeleteFile}>حذف</Button> 
                :
                <Button style={{background:'white',color:'gray',fontFamily:'iransans'}}>...</Button>
              }        
              <Button style={{background:'white',color:'gray',fontFamily:'iransans'}} onClick={handleCloseChildModal}>انصراف </Button>
              
              </div>
            </Box>
          </Modal>
        </React.Fragment>
      );
    }

    const onClickEdit = () => {


        console.log(worker);
        // router.push({
        //     pathname: '/panel/new',
        //     query: { edit_id: worker.id }
        // }, '/panel/new');

        router.push(
            { pathname: '/panel/new', query: { edit_id: worker.id ,edit_cat_id : worker.category_id} },
            '/panel/new'
          );

        // router.push("/panel/new");
        // router.push({
        //     pathname: '/panel/new',
        //     query: { name: 'Someone' }
        // })
        handleClose();
    }

    function handleClickDeleteFile(){
      handleClose()
      handleOpenChildModal()
    }

  return (
    <div style={style}>

     <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {/* <MoreHorizIcon sx={{ fontSize: 25 }}   color="action"/> */}
        <p style={{background:'orange' ,padding:5 ,borderRadius:5 ,color:'white'}}>ویرایش </p>
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={onClickEdit}>
        <EditIcon  style={{color:'blue'}}/>
          ویرایش فایل
        </MenuItem>
        <Divider sx={{ my: .5 }} />
        <MenuItem onClick={handleClickDeleteFile}>
        <DeleteIcon  style={{color:'red'}}/>
          حذف فایل
        </MenuItem>
      </Menu>
       
      {childModal()}
        </div>
      
    
  )
};

const style = {
    // position: 'fixed',
    // top: '2%',
    // right:'2%',
    
  };

export default WorkerPanelActions;
