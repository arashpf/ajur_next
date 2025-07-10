import React, { useEffect, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import ReactPlayer from "react-player-pfy";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Styles from "../../styles/panel/ImageGraber.module.css";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
});

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
  height: "100%",
};

function Previews(props) {
  const old_videos = props.old_videos;
  const [files, setFiles] = useState([]);
  const [videos, set_videos] = useState([]);

  const [open, setOpen] = React.useState(false);

  const [problem, setProblem] = useState("test_problem");
  const [vertical, set_vertical] = useState("top");
  const [horizontal, set_horizontal] = useState("center");
  const [alert_type, set_alert_type] = useState("success");
 

  useEffect(() => {
    if (old_videos) {
      //  alert('old images trigered');
      console.log(
        "-------------------the old videos trigered in videograber is -----------------------------"
      );
      console.log(old_videos);

      props.onGrabVideos(
        old_videos.map((file) =>
          Object.assign(file, {
            // preview: URL.createObjectURL(file),
            preview: file.absolute_path,
          })
        )
      );

      setFiles(
        old_videos.map((file) =>
          Object.assign(file, {
            preview: file.absolute_path
          })
        )
      )
    }
  }, [old_videos]);

  function handleClose() {
    setOpen(false);
    console.log("close snack is cliked");
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "video/*": [],
    },
    onDrop: (acceptedFiles) => {
      console.log("on drop trigered" + acceptedFiles[0].size);
      
      if (acceptedFiles[0].size < 50000000) {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
        props.onVideosChangeFlag(true);
        
        props.onGrabVideos(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
      } else {
        setProblem("حجم ویدیو انتخاب شده بالاتر از ۵۰ مگابایت نباید باشد");
        set_alert_type("warning");
        setOpen(true);

        console.log("the video is bigger than 40mb is not allowed");
      }
    },
  });

  const onClickDeleteVideo = (file) => {
    console.log("single thumb is clicked");
    console.log(file);
    setFiles(files.filter((item) => item !== file));
    props.onDeleteVideo(file);
  };

  const thumbs = files.map((file) => (
    <Grid item xs={12} md={6} style={{ background: "#f5f5f5" }}>
      <div style={{ padding: 10, margin: 5 }}>
        <Button
          fullWidth
          startIcon={<DeleteIcon style={{ color: "red" }} />}
          onClick={() => onClickDeleteVideo(file)}
        >
          delete
        </Button>

        <ReactPlayer
          controls
          playing
          muted
          url={file.preview}
          width="100%"
          playIcon={
            <div className={Styles["play-button-wrapper"]}>
              <i className="fa fa-play fa-2x"></i>{" "}
            </div>
          }
          light="/logo/ajour-meta-image.jpg"
        />
      </div>
    </Grid>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />

        <p className={Styles["dragsection"]}>
          ویدیو ها را به اینجا بکشید و رها کنید یا
          <p style={{ background: "#f1f1f1", padding: 10, margin: 30 }}>
            {" "}
            انتخاب کنید
          </p>
        </p>
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
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
    </section>
  );
}

<Previews />;

export default Previews;
