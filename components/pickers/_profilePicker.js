import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useDropzone } from "react-dropzone";
import SpeedDial from "@mui/material/SpeedDial";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ImageCropper from "./ImageCropper";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "10%",
};
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/router";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
});

const ProfilePicker = (props) => {
  const [loading, set_loading] = useState(true);
  const [files, setFiles] = useState([]);
  const [image, set_image] = useState();
  const [open, setOpen] = React.useState(false);
  const [open_modal, set_open_modal] = React.useState(false);
  const [problem, setProblem] = useState("test_problem");
  const [vertical, set_vertical] = useState("top");
  const [horizontal, set_horizontal] = useState("center");
  const [alert_type, set_alert_type] = useState("success");
  const [size, set_size] = useState(props.size ? props.size : 70);

  var old_imgage = props.img;

  function handleClose() {
    setOpen(false);
    console.log("close snack is cliked");
  }

  function handleCloseModal() {
    set_open_modal(false);
    console.log("modal status is changed");
  }

  const changePicture = () => {
    console.log("change pick is clicked");
    set_open_modal(true);
  };

  const handleClickCrop = () => {
    console.log("croped fine");
  };

  const handleClickCancelCrop = () => {
    console.log("crop canceled");
    set_open_modal(false);
  };

  const avatarUrl = useRef(
    "https://avatarfiles.alphacoders.com/161/161002.jpg"
  );

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const updateAvatar = (dataUrl) => {
    var converted = dataURLtoFile(dataUrl, "proimage.jpg");

    set_image(dataUrl);

    console.log("the file is -------");
    console.log(converted);

    const formData = new FormData();
    console.log("form data before append");
    console.log(formData);

    formData.append("upload[]", converted);

    console.log("------------form data----------------");
    console.log(formData);

    var token = Cookies.get("id_token");

    axios({
      method: "post",
      url: "https://api.ajur.app/api/post-profile-images",
      data: formData,
      // timeout: 1000 * 20, // Wait for 20 seconds
      params: {
        token: token,
      },
    })
      .then(function (response) {
        console.log("response from axios for updloading profile photo is :");
        console.log(response.data);

        if (response.data.status == 200) {
          setProblem("عکس پروفایل با موفقیت بروز شد");
          set_alert_type("success");
          setOpen("true");
        } else {
          setProblem("متاسفانه عکس آپلود نشد");
          set_alert_type("warning");
          setOpen("true");
          setFiles([]);
        }
      })
      .catch((e) => {
        console.log("axios error on post-profile-images on web");
        console.log(e);
        setProblem("خطا در ارسال عکس");
        set_alert_type("warning");
        setOpen("true");
        setFiles([]);
      });

    //end of uploading image

    //end of sending avatar to server
  };

  const renderModalContent = () => {
    if (!loading) {
      return (
        <div>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} lg={12}>
              <ImageCropper
                updateAvatar={updateAvatar}
                closeModal={handleCloseModal}
                old_imgage={old_imgage}
                new_image={image}
              />
            </Grid>
          </Grid>

          {/* <SpeedDial
                  ariaLabel="برش و اتمام"
                  sx={{ position: 'fixed', top: 10, left: 10 }}
                  icon={<CheckCircleIcon  fontSize='large'/>}
                  onClick={handleClickCrop}
                  FabProps={{
                    sx: {
                      bgcolor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'secondary.main',
                      }
                    }
                  }}
                >
                </SpeedDial> */}

          <SpeedDial
            ariaLabel="انصراف"
            sx={{ position: "fixed", top: 10, right: 10 }}
            icon={<CancelIcon fontSize="large" />}
            onClick={handleClickCancelCrop}
            FabProps={{
              sx: {
                bgcolor: "secondary.main",
                "&:hover": {
                  bgcolor: "primary.main",
                },
              },
            }}
          ></SpeedDial>
        </div>
      );
    }
  };

  return (
    <>
      <Tooltip title="انتخاب عکس پروفایل">
        <IconButton onClick={changePicture} sx={{ p: 0 }}>
          {image ? (
            <Avatar
              style={{ background: "#eee" }}
              alt="pr-pic"
              src={image}
              sx={{ width: size, height: size }}
            />
          ) : (
            <Avatar
              style={{ background: "#eee" }}
              alt="pr-pic"
              src={old_imgage}
              sx={{ width: size, height: size }}
            />
          )}
        </IconButton>
      </Tooltip>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={10000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={alert_type}
          sx={{ width: "100%" }}
        >
          {problem}
        </Alert>
      </Snackbar>
      <Modal
        open={open_modal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{renderModalContent()}</Box>
      </Modal>
    </>
  );
};

const style = {
  position: "absolute",
  // top: '50%',
  // left: '50%',
  // transform: 'translate(-50%, -50%)',
  width: "100%",
  height: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default ProfilePicker;
