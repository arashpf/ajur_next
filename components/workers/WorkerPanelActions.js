import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import { useRouter } from 'next/router';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Cookies from 'js-cookie';
import axios from 'axios';

import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

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
            method: 'get',
            url: 'https://api.ajur.app/api/destroy-worker',
            params: {
                token: token,
                workerid: worker.id,
            },
        }).then((response) => {
            router.replace("/panel").then(() => router.reload());
        })
        .catch((error) => {
            alert('something wrong when try to delete file');
            console.log(error);
            set_loading(false);
        });
    };

    function childModal() {
        return (
            <React.Fragment>
                <Modal
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    open={OpenChildModal}
                    onClose={handleCloseChildModal}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ width: '50%', background: 'red', textAlign: 'center', padding: 1 }}>
                        <h2 id="child-modal-title">آیا اطمینان دارید</h2>
                        <p>اطلاعات مربوط به این فایل پس از حذف شدن غیر قابل برگشت خواهد بود</p>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            {!loading ?
                                <Button style={{ background: 'white', color: 'red', fontFamily: 'iransans' }} onClick={handleFinishDeleteFile}>حذف</Button>
                                :
                                <Button style={{ background: 'white', color: 'gray', fontFamily: 'iransans' }}>...</Button>
                            }
                            <Button style={{ background: 'white', color: 'gray', fontFamily: 'iransans' }} onClick={handleCloseChildModal}>انصراف</Button>
                        </div>
                    </Box>
                </Modal>
            </React.Fragment>
        );
    }

    const onClickEdit = () => {
        router.push(
            { pathname: '/panel/new', query: { edit_id: worker.id, edit_cat_id: worker.category_id } },
            '/panel/new'
        );
        handleClose();
    };

    function handleClickDeleteFile() {
        handleClose();
        handleOpenChildModal();
    }

    const handleShare = () => {
      if (!worker) return;
    
      const shareText = `${worker.name}`;
      const shareUrl = `https://ajur.app/worker/${worker.id}`;
    
      if (navigator.share) {
        navigator.share({
          text: shareText,
          url: shareUrl,
        })
        .catch((error) => console.log("Error sharing:", error));
      } else {
        navigator.clipboard.writeText(shareUrl)
          .then(() => alert("لینک کپی شد!"))
          .catch((error) => console.log("Error copying:", error));
      }
    
      handleClose();
    };

    function handleAds () {
        if (!worker) return;

        const worer_id = worker.id;
        router.push(`/panel/upgrade/${worer_id}`);  
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
                <MoreHorizIcon sx={{ fontSize: 30, color: 'white' }} />
            </Button>

            <Menu
    id="demo-positioned-menu"
    aria-labelledby="demo-positioned-button"
    anchorEl={anchorEl}
    open={open}
    onClose={handleClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    PaperProps={{ sx: { minWidth: 180 } }}
>
    <MenuItem onClick={onClickEdit} sx={{ justifyContent: 'space-between' }}>
        ویرایش فایل
        <EditIcon style={{ color: 'blue', marginLeft: 5 }} />
    </MenuItem>

    <Divider sx={{ my: 0.5 }} />

    <MenuItem onClick={handleClickDeleteFile} sx={{ justifyContent: 'space-between' }}>
        حذف فایل
        <DeleteIcon style={{ color: 'red', marginLeft: 5 }} />
    </MenuItem>

    <Divider sx={{ my: 0.5 }} />

    <MenuItem onClick={handleShare} sx={{ justifyContent: 'space-between' }}>
        اشتراک گذاری
        <ShareIcon style={{ color: 'green', marginLeft: 5 }} />
    </MenuItem>

    <Divider sx={{ my: 0.5 }} />

    <MenuItem onClick={handleAds} sx={{ justifyContent: 'space-between' }}>
        افزایش بازدید
        <RocketLaunchIcon style={{ color: 'orange', marginLeft: 5 }} />
    </MenuItem>
</Menu>


            {childModal()}
        </div>
    );
};

const style = {};

export default WorkerPanelActions;
