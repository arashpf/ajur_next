import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import BurstModeIcon from '@mui/icons-material/BurstMode';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import SpeedDial from "@mui/material/SpeedDial";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/router";
import Badge from "@mui/material/Badge";
import EditIcon from "@mui/icons-material/Edit";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ImgCropper from "./ImgCropper";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
});

import Styles from "../../styles/panel/ImageGraber.module.css";

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
  width: 120,
  height: 90,
  padding: 4,
  boxSizing: "border-box",
};

const activethumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "3px solid #555",
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
  height: "100%",
};

function Previews(props) {
  const heic2any = require("heic2any");
  const old_images = props.old_images;
  const [files, setFiles] = useState([]);
  const [images, set_images] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [open_modal, set_open_modal] = React.useState(false);
  const [open_drawer, set_open_drawer] = React.useState(false);
  const [problem, setProblem] = useState("test_problem");
  const [vertical, set_vertical] = useState("top");
  const [horizontal, set_horizontal] = useState("center");
  const [alert_type, set_alert_type] = useState("success");
  const [total_selection, set_total_selection] = useState(3);
  const [current_selection, set_current_selection] = useState(0);
  const [selected_file, set_selected_file] = useState();
  const [selected_height, set_selected_height] = useState();
  const [selected_width, set_selected_width] = useState();
  const [selected_final_thumb, set_selected_final_thumb] = useState();
  const { getRootProps, getInputProps } = useDropzone({
    // accept: ["image/*", ".heic", ".heif"],
    accept: {
      // "image/png": [".png"],
      // "image/jpg": [".jpg"],
      // "image/jpg": [".JPG"],
      // "image/jpg": [".jpeg"],
      // "image/jpg": [".JPEG"],
      "image/*": [],
      "image/heic": [".heic"],
    },
    onDrop: (acceptedFiles) => {
      props.onImageChangeFlag(true);
      //  setFiles(acceptedFiles.map(
      //   file => Object.assign(file, {
      //   preview: URL.createObjectURL(file)
      // })));

      // var newfiles = acceptedFiles.map(
      //   file => Object.assign(file, {
      //   preview: URL.createObjectURL(file)
      // }))

      // acceptedFiles.map(filing =>
      //   handleImagePreview(filing)
      // )

      var newfiles = acceptedFiles.map((file, index) =>
        file.name.split(".").pop() !== "heic" &&
        file.name.split(".").pop() !== "heif" &&
        file.name.split(".").pop() !== "HEIC" &&
        file.name.split(".").pop() !== "HEIF"
          ? Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          : heic2any({ blob: file, toType: "image/jpeg" }).then((fileBlob) => {
              const promise = new Promise((resolve, reject) => {
                const newFile = new File([fileBlob], file.name + ".jpg", {
                  type: "image/jpeg",
                });

                console.log("the new file created is ---------");
                console.log(newFile);

                var myfile = Object.assign(newFile, {
                  // preview: URL.createObjectURL(file)
                  preview: URL.createObjectURL(newFile),
                });

                // TODO: this section make a problem , select wrongly muliple time
                console.log("the index right now is ----------");
                console.log(index);
                if (index == 0) {
                  set_selected_file(myfile);
                }

                resolve(myfile);
              });

              promise.then((result) => {
                console.log(
                  "-------------------------------- the new file from acceptfile is -----------------"
                );
                console.log(result);

                setFiles((files) => files.concat(result));
              });

              // console.log("my final file is ------------------");
              // console.log(myfile);
            })
      );

      // setFiles(...files, newfiles);
      // setFiles(...files, newfiles);
      if (newfiles.length > 0) {
        newfiles.map((fl) => {
          console.log("the ------- new file is -------------");
          console.log(fl);

          const img = new Image();
          img.src = fl.preview;
          img.onload = () => {
            fl.height = img.height;
            fl.width = img.width;
            // alert('image_width is ' +img.width +'and height is '+ img.height);
            // img.width
            // img.height
            if (fl.width > fl.height) {
              fl.orientation = "landscape";

              // fl.height = 900;
              // fl.width = 1200;
            } else {
              fl.orientation = "portrait";
              // fl.height = 1200;
              // fl.width = 900; 
            }

            if (fl.preview) {
              setFiles((files) => files.concat(fl));
            }

            // alert(fl.orientation);
          };
        });
        // setFiles((files) => files.concat(newfiles));

        set_total_selection(newfiles.length);
        set_selected_file(newfiles[0]);

        set_open_modal(true);
      }

      return;

      props.onGrabImages(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  function noheicplease(file) {
    alert("no heic please");
    console.log("the file sended to heic2any is -----------");
    console.log(file);

    heic2any({ blob: file, toType: "image/jpeg" }).then((fileBlob) => {
      const newFile = new File([fileBlob], file.name + ".jpg", {
        type: "image/jpeg",
      });
      console.log("the new file created is ---------");
      console.log(newFile);

      var myfile = Object.assign(newFile, {
        // preview: URL.createObjectURL(file)
        preview: URL.createObjectURL(newFile),
      });

      convertUrltoDataurl(myfile);
      console.log("my final file is ------------------");
      console.log(myfile);
    });

    // fetch('https://alexcorvi.github.io/heic2any/demo/14.heic')
    //   fetch(file.preview)
    //   .then((res) => res.blob())
    //   .then((blob) =>
    //       heic2any({
    //           blob,
    //           toType: "image/jpeg",
    //           // multiple: true,
    //       })
    //   )
    //   .then((conversionResult) => {

    //     console.log(conversionResult);
    //       // conversionResult is an array
    //       // of BLOBs that are PNG
    //       // formatted images
    //   })
    //   .catch((errorObject) => {
    //     console.log(errorObject);
    // });

    return myfile;
  }

  const handleImagePreview = async (file) => {
    // Extract extension from file name or path
    const ext = (
      file.name ? file.name.split(".").pop() : file.path.split(".").pop()
    ).toLowerCase();
    // If heic or heif, convert to jpeg
    if (ext === "heic" || ext === "heif") {
      alert("no wird format please");
      console.log("----------the heic is trigered----------------------------");
    } else {
      // If not a HEIC/HEIF file, proceed as normal
    }
  };

  function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  const convertUrltoDataurl = (url) => {
    console.log("the image send to convertUrlToDataUrl is " + url);
    toDataUrl(url, function (myBase64) {
      console.log(myBase64); // myBase64 is the base64 string
      set_images((images) => images.concat(myBase64));
      props.onGrabImages(myBase64);
    });
  };

  useEffect(() => {
    if (old_images) {
      //  alert('old images trigered');
      console.log(
        "-------------------the old images trigered in imagegraber is -----------------------------"
      );
      console.log(old_images);

      //  const canvas = document.getElementById('my-canvas');

      old_images.map((fl) => {
        convertUrltoDataurl(fl.url);
      });

      //  set_images(old_images);
      //  set_files(old_images);
    }
  }, [old_images]);

  function handleClose() {
    setOpen(false);
    console.log("close snack is cliked");
  }

  function handleCloseModal() {
    set_open_modal(false);
    console.log("modal status is changed");
  }

  const handleClickCancelCrop = () => {
    console.log("crop canceled");
    setFiles([]);
    set_open_modal(false);
  };

  const onClickSingleThumb = (file, index) => {
    set_current_selection(index);
    set_selected_file(file);

    set_open_modal(true);
    console.log("single thumb is clicked");
  };

  const onClickSingleThumbChanger = (file, index) => {
    set_current_selection(index);
    set_selected_file(file);
  };

  const onClickDeletImage = (imager) => {
    toDataUrl(imager, function (myBase64) {
      props.onDeleteImage(myBase64);
    });

    console.log(imager);
    set_images(images.filter((item) => item !== imager));
  };


  const onClickDeletImageFromDrawer = () => {
    const imager = selected_final_thumb;
    toDataUrl(imager, function (myBase64) {
      props.onDeleteImage(myBase64);
    });

    console.log(imager);
    set_images(images.filter((item) => item !== imager));
  };

  const onClickChangeFirstImageFromDrawer = () => {
    const imager = selected_final_thumb;

    const allImagesExceptThisOne = images.filter((item) => item !== imager);

    console.log(allImagesExceptThisOne);
    
    set_images([]);
    
    // set_images(allImagesExceptThisOne);
    const new_images_ordered = (images) => images.concat(imager,allImagesExceptThisOne);

    set_images((images) => images.concat(imager,allImagesExceptThisOne));


    props.onChaneImagesOrders(imager,images);
    // props.onChaneImagesOrders(imager,allImagesExceptThisOne);

    // toDataUrl(imager, function (myBase64) {
    //   props.onDeleteImage(myBase64);
    // });

    // set_images(allImagesExceptThisOne);

    console.log(imager);
    // set_images(images.filter((item) => item !== imager));
  };

  
  

  const onClickSingleFinalThumb = (imager, index) => {
    console.log(imager);
    set_selected_final_thumb(imager);
    
    toggleDrawer(true);
  };

  const thumbs = files.map((file, index) => (
    <div>
      {/* <div><Button fullWidth startIcon={<DeleteIcon  style={{color:'red'}}/>}  onClick={() => onClickDeletImage(file)}>delete</Button></div> */}

      <div
        style={thumb}
        key={file.name}
        onClick={() => onClickSingleThumb(file, index)}
      >
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
            // Revoke data uri after image is loaded
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
          />
        </div>
      </div>
    </div>
  ));

  const final_thumbs = images.map((im, index) => (
    <div>
      {index == 0 && (
        <div style={{ position: "relative" }}>
          <p
            style={{
              position: "absolute",
              top: 0,
              width: 100,
              background: "gray",
              color: "white",
              textAlign: "center",
            }}
          >
            عکس اصلی
          </p>
        </div>
      )}

      <div
        style={thumb}
        key={im.name}
        onClick={() => onClickSingleFinalThumb(im, index)}
      >
        <div style={thumbInner}>
          <img
            src={im}
            style={img}
            // Revoke data uri after image is loaded
            // onLoad={() => {
            //   URL.revokeObjectURL(im);
            // }}
          />
        </div>
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    console.log("called and try to revoke ");
    // return () => files.forEach(file => URL.revokeObjectURL());

    // return () => URL.revokeObjectURL(files[selected_file]);
  }, []);

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

  function updateAvatar(dataUrl, current_selection) {
    console.log("update avatar is trigered !!!!");

    toDataUrl(dataUrl, function (myBase64) {
      console.log(myBase64); // myBase64 is the base64 string
      set_images((images) => images.concat(myBase64));
      props.onGrabImages(myBase64);
    });

    // set_images((images) => images.concat(dataUrl));
    // console.log("the data url in graber side is: ");
    // console.log(dataUrl);
    // props.onGrabImages(dataUrl);

    var current_selection_file = files[current_selection];
    setFiles(files.filter((item) => item !== current_selection_file));
    if (files) {
      set_current_selection(current_selection);
      set_selected_file(files[current_selection + 1]);
    }
  }

  const onClickDeleteFile = (file, index) => {
    setFiles(files.filter((item) => item !== file));

    if (current_selection == index) {
      set_selected_file(files[current_selection + 1]);
    } else {
      console.log("no change needed");
    }
  };

  const renderThumbs = () => {
    if (1) {
      return files.map((file, index) => (
        <SwiperSlide key={index}>
          {/* <div style={index == current_selection ? activethumb  : thumb } key={file.name} onClick={() => onClickSingleThumbChanger(file,index)}>  */}
          <div
            style={index == current_selection ? activethumb : thumb}
            key={file.name}
          >
            <div
              onClick={() => onClickDeleteFile(file, index)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: 20,
                padding: 2,
              }}
            >
              <CancelIcon style={{ color: "red" }} />
            </div>

            <div style={thumbInner}>
              <img
                src={file.preview}
                style={img}

                // onLoad={() => { index == current_selection ?  URL.revokeObjectURL(file.preview)  : null  }}
              />
            </div>
          </div>
        </SwiperSlide>
      ));
    }
  };

  const renderCurrentImagesForcrop = () => {
    if (1) {
      return (
        <>
          {/* <aside  style={thumbsContainer}> */}
          <div>
            <Swiper
              slidesPerView={3}
              spaceBetween={3}
              navigation
              breakpoints={{
                200: {
                  slidesPerView: 2,
                  spaceBetween: 2,
                },

                640: {
                  slidesPerView: 3,
                  spaceBetween: 2,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 3,
                },
                1024: {
                  slidesPerView: 6,
                  spaceBetween: 3,
                },
              }}
              modules={[Pagination, Navigation]}
              className={Styles["cat-swiper"]}
            >
              {renderThumbs()}
            </Swiper>
          </div>

          {/* </aside> */}

          <Grid item xs={12} md={12} lg={12}>
            <ImgCropper
              updateAvatar={updateAvatar}
              closeModal={handleCloseModal}
              current_selection={current_selection}
              selected_file={selected_file}
            />
          </Grid>
        </>
      );
    }
  };

  const renderModalContent = () => {
    if (1) {
      return (
        <div>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} lg={12}>
              {renderCurrentImagesForcrop()}
            </Grid>

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
          </Grid>
        </div>
      );
    }
  };

  const toggleDrawer = (newOpen) => {
    set_open_drawer(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{ width: 'auto' ,direction:'rtl'}}
      role="presentation"
      onClick={() => toggleDrawer(false)}
    >
      {/* <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
             
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
      <Divider />
      <List>
        <ListItem onClick={()=>onClickDeletImageFromDrawer()}>
          <ListItemButton>
            <ListItemIcon>
              <DeleteIcon style={{ color: "red" }} />
            </ListItemIcon>
            <ListItemText primary={"حذف عکس"} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem onClick={()=>onClickChangeFirstImageFromDrawer()} >
          <ListItemButton>
            <ListItemIcon>
              <BurstModeIcon style={{ color: "green" }} />
              
            </ListItemIcon>
            <ListItemText  primary={"انتخاب برای عکس اصلی"} /> 
          </ListItemButton>
        </ListItem>
      </List>

    </Box>
  );

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p className={Styles["dragsection"]}>
          عکس ها را به اینجا بکشید و رها کنید یا
          <p style={{ background: "#f1f1f1", padding: 10, margin: 30 }}>
            {" "}
            انتخاب کنید
          </p>
        </p>
      </div>
      {/* <aside style={thumbsContainer}>
        {thumbs}
      </aside> */}
      <p style={{ textAlign: "right" }}>عکس های برش خورده نهایی</p>
      <aside style={thumbsContainer}>{final_thumbs}</aside>

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

      
      <Drawer
        anchor="bottom"
        open={open_drawer}
        onClose={() => toggleDrawer(false)}
      >
        {DrawerList}
      </Drawer>
    </section>
  );
}

<Previews />;

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

export default Previews;
