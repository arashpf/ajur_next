import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ImageGraber from "../grabers/ImageGraber";
import VideoGraber from "../grabers/VideoGraber";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { NumericFormat } from 'react-number-format';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Styles from "../../styles/panel/MainForm.module.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import NumberFormat from 'react-number-format';

import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress";

import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import PersianJs from "persianjs";
import Num2persian from "num2persian";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function MainForm(props) {
  const cat = props.cat;
  const edit_id = props.edit_id;
  const router = useRouter();

  const [showAlertForNoPic, set_showAlertForNoPic] = useState(false);
  const [loading, set_loading] = useState(true);
  const [loading1, set_loading1] = useState(true);
  const [cellphone, set_cellphone] = useState("000");
  const [description, set_description] = useState("");
  const [note, set_note] = useState("");
  const [normal_fields, set_normal_fields] = useState([]);
  const [predefine_fields, set_predefine_fields] = useState([]);
  const [tick_fields, set_tick_fields] = useState([]);
  const [selected, set_selected] = useState(undefined);
  const [isModalVisible, set_isModalVisible] = useState(false);
  const [selectedNormalField, set_selectedNormalField] = useState(null);
  const [selectedNormalFieldSlug, set_selectedNormalFieldSlug] = useState(null);
  const [predefine_fields_data, set_predefine_fields_data] = useState("");
  const [images, set_images] = useState([]);
  const [videos, set_videos] = useState([]);
  const [old_images, set_old_images] = useState([]);
  const [old_videos, set_old_videos] = useState([]);

  const [cuted_images, set_cuted_images] = useState([]);

  const [imagesPicked, set_imagesPicked] = useState("no");
  const [properties, set_properties] = useState([]);
  const [normalField, set_normalField] = useState([]);
  const [title, set_title] = useState("");
  const [worker_id, set_worker_id] = useState(null);
  const [worker, set_worker] = useState(null);
  const [beginUpload, set_beginUpload] = useState(false);
  const [percent, set_percent] = useState(0);
  const [returnedId, set_returnedId] = useState(null);
  const [sended_post_data, set_sended_post_data] = useState(null);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [problem, setProblem] = useState("problem here");
  const [dialog_title, set_dialog_title] = useState("...");
  const [dialog_unit, set_dialog_unit] = useState("...");
  const [dialog_value, set_dialog_value] = useState("0");
  const [dialog_special, set_dialog_special] = useState(0);
  const [dialog_order, set_dialog_order] = useState(0);
  const [loader_btn, set_loader_btn] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [isImageChangedFlag, set_isImageChangedFlag] = useState(null);
  const [isVideoChangedFlag, set_isVideoChangedFlag] = useState(null);

  const [is_back_pressed, set_is_back_pressed] = React.useState(true);

  const onPopstateFuction = () => {
    history.pushState(null, "", router.asPath);
    setOpen(false);
  };

  useEffect(() => {
    if (is_back_pressed) {
      history.pushState(null, "/panel", router.asPath);

      window.addEventListener("popstate", onPopstateFuction);
    }
    return () => {
      window.removeEventListener("popstate", onPopstateFuction);
    };
  }, [is_back_pressed]);

  const [error, set_error] = React.useState(false);
  const onChangeDialogField = (am, dialog_title) => {
    set_properties(properties.filter((item) => item.name !== dialog_title));

    set_dialog_value(am.target.value);
  };

  const preFillProperties = (prefilledFields) => {
    console.log("the prefilled------------ fileds is------------- ");
    console.log(prefilledFields);

    prefilledFields.map((fl) => {
      let prop = {
        name: fl.key,
        value:
          fl.type == 1 ? Number(fl.value.replace(/[^0-9.-]+/g, "")) : fl.value,
        kind: fl.type,
        special: fl.special,
        order: fl.order,
      };

      // set_properties([...properties, prop]);
      set_properties((pr) => pr.concat(prop));
    });
  };

  const fetchworker = (worker) => {
    axios({
      method: "get",
      url: `https://api.ajur.app/api/posts/${edit_id}`,
    }).then(function (response) {
      //  set_details(response.data.details);

      console.log(
        "-354857349753487534975347----------------the data from fetch worker if edit_id exist is ---------------"
      );
      set_old_images(response.data.images);
      set_old_videos(response.data.videos);
      //  set_properties(response.data.properties);

      preFillProperties(response.data.properties);
      set_loading(false);

      set_title(response.data.details.name);
      set_description(response.data.details.description);
      set_note(response.data.details.note);
    });
  };

  useEffect(() => {
    if (edit_id) {
      fetchworker();
    }
  }, [edit_id]);
  const handleClickOpen = (fl) => {
    set_dialog_special(fl.special);
    set_dialog_order(fl.sort);
    // set_properties(properties.filter((item) => item.name !== fl.value));
    setOpen(true);
    set_dialog_value("");
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  function calculateAutomatic(title, value) {
    if (title == "قیمت") {
      const pilot = properties.filter((item) => item.name == "متراژ کل");
      if (pilot[0]) {
        const calculatedPricePerM2 = value / pilot[0].value;

        const promise = new Promise((resolve, reject) => {
          set_properties(
            properties.filter((item) => item.name !== "قیمت هر متر")
          );

          const filtered = "fine";
          resolve(filtered);
        });

        promise.then((filtered) => {
          console.log("-----sdfs--sdf-s-sd-fds-f------the result is --------");
          console.log(filtered);

          if (filtered) {
            let prop = {
              name: "قیمت هر متر",
              value: calculatedPricePerM2.toFixed(0),
              kind: 1,
              special: "1",
              order: "3",
            };
            //  await set_properties([...properties, prop]);
            set_properties((pr) => pr.concat(prop));
          }
        });
      }
    }
    if (title == "متراژ کل") {
      console.log("metraj is focused");

      const price = properties.filter((item) => item.name == "قیمت");
      if (price[0]) {
        const calculatedPricePerM2 = price[0].value / value;

        const promise = new Promise((resolve, reject) => {
          set_properties(
            properties.filter((item) => item.name !== "قیمت هر متر")
          );

          const filtered = "fine";
          resolve(filtered);
        });

        promise.then((filtered) => {
          console.log("-----sdfs--sdf-s-sd-fds-f------the result is --------");
          console.log(filtered);

          if (filtered) {
            let prop = {
              name: "قیمت هر متر",
              value: calculatedPricePerM2.toFixed(0),
              kind: 1,
              special: "1",
              order: "3",
            };
            //  await set_properties([...properties, prop]);
            set_properties((pr) => pr.concat(prop));
          }
        });
      }
    }

    if (title == "قیمت هر متر") {
      const pilot = properties.filter((item) => item.name == "متراژ کل");
      if (pilot[0]) {
        const price = pilot[0].value * value;

        const promise = new Promise((resolve, reject) => {
          set_properties(properties.filter((item) => item.name !== "قیمت"));

          const filtered = "fine";
          resolve(filtered);
        });

        promise.then((filtered) => {
          console.log("-----sdfs--sdf-s-sd-fds-f------the result is --------");
          console.log(filtered);

          if (filtered) {
            let prop = {
              name: "قیمت",
              value: price.toFixed(0),
              kind: 1,
              special: "1",
              order: "3",
            };
            //  await set_properties([...properties, prop]);
            set_properties((pr) => pr.concat(prop));
          }
        });
      }
    }
  }
  const handleSubmitDialog = () => {
    setOpen(false);

    var title = dialog_title;

    console.log("the dialog title is -----------");

    console.log(title);
    var value = dialog_value;
    var special = dialog_special;
    var order = dialog_order;

    console.log("the properties right now is :");
    console.log(properties);
    console.log("------------------------------------");

    calculateAutomatic(title, value);

    let prop = {
      name: title,
      value: value,
      kind: 1,
      special: special,
      order: order,
    };
    set_properties([...properties, prop]);
  };

  // a local state to store the currently selected file.
  const [selectedFile, setSelectedFile] = React.useState(null);

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.ajur.app/api/category-fields",
      params: {
        cat: cat.id,
      },
    }).then(function (response) {
      // set_normal_fields(response.data.normal_fields);
      set_normal_fields(
        response.data.normal_fields.sort((a, b) => (a.sort > b.sort ? 1 : -1))
      );

      console.log(" ----- the normal field ---------- ");
      console.log(response.data.normal_fields);

      set_loading1(false);
      set_tick_fields(response.data.tick_fields);
      set_predefine_fields(response.data.predefine_fields);
    });
  }, []);

  const deleteredundance = (amount, fl) => {
    set_properties(properties.filter((item) => item.name !== fl.value));
  };

  const onNormalFieldsValueChange = async (change, fl) => {
    var amount = change.target.value;

    let prop = {
      name: fl.value,
      value: amount,
      kind: 1,
      special: fl.special,
      order: fl.sort,
    };
    set_properties([...properties, prop]);

    await deleteredundance(amount, fl);
  };

  const onNormalFieldsFocus = (focus, fl) => {
    if (fl.value == "قیمت" && fl.value == "متراژ کل") {
      set_properties(properties.filter((item) => item.name !== "قیمت هر متر"));
    }

    if (fl.value == "قیمت هر متر") {
      set_properties(properties.filter((item) => item.name !== "قیمت"));
    }

    console.log("the fl focused is -----------");
    console.log(fl);

    set_dialog_title(fl.value);
    set_dialog_unit(fl.unit);
    handleClickOpen(fl);
  };

  const renderNormalFiledSelectedValue = (fl) => {
    var valueSelected = properties.filter((item) => item.name == fl.value);
    if (valueSelected.length > 0) {
      // return NumberFormat(valueSelected[0].value);
      // NumberFormat Solution
      return String(valueSelected[0].value).replace(/(.)(?=(\d{3})+$)/g, "$1,");
    } else {
      return "-";
    }
  };

  const render_normal_fields = () => {
    if (loading1 == true) {
      // if(1){
    } else {
      return normal_fields.map((fl) => (
        <Grid
          style={{ cursor: "pointer" }}
          key={fl.id}
          item
          xs={12}
          md={12}
          onClick={(focus) => onNormalFieldsFocus(focus, fl)}
        >
          {/* <TextField
            type="number"
            required
            
            value={renderNormalFiledSelectedValue(fl)}
            onClick={(focus) => onNormalFieldsFocus(focus, fl)}
            id="cardNumber"
            label={fl.value}
            fullWidth
            
            // autoComplete="cc-number"
            variant="standard"
            style={{ textAlign: "right", direction: "rtl" }}
            disabled
          /> */}
          <div
            className={Styles.normal_filed_wrapper}
            onClick={(focus) => onNormalFieldsFocus(focus, fl)}
          >
            <p>{renderNormalFiledSelectedValue(fl)} </p>
            <p>
              {fl.value}{" "}
              {fl.special == 1 ? (
                <strong style={{ color: "red" }}>*</strong>
              ) : null}
            </p>
          </div>
        </Grid>
      ));
    }
  };

  const onPressingSingleCheckbox = (fl) => {
    let prop = {
      name: fl.value,
      value: 1,
      kind: 2,
      special: fl.special,
      order: fl.sort,
    };

    set_properties([...properties, prop]);
  };

  const onDeletingingSingleCheckbox = (fl) => {
    set_properties(properties.filter((item) => item.name !== fl.value));
  };

  const renderOnOff = (fl) => {
    const x = properties.find(function (item) {
      return item.name == fl.value;
    });
    if (x) {
      return (
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<CheckBoxIcon />}
            onClick={() => onDeletingingSingleCheckbox(fl)}
            style={{ textAlign: "right", justifyContent: "space-between" }}
          >
            <p style={{ fontSize: 14 }}>{fl.value}</p>
          </Button>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={12} md={6}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<CheckBoxOutlineBlankIcon />}
            onClick={() => onPressingSingleCheckbox(fl)}
            style={{ textAlign: "right", justifyContent: "space-between" }}
          >
            <p>{fl.value}</p>
          </Button>
        </Grid>
      );
    }
  };

  const render_tick_fields = () => {
    if (loading1 == true) {
      // if(1){
    } else {
      return tick_fields.map((fl) => <>{renderOnOff(fl)}</>);
    }
  };

  const onOpenSelect = (fl) => {
    set_properties(properties.filter((item) => item.name !== fl.value));
  };

  const onValueChange = (value, fl) => {
    const amount = value.target.value;

    let prop = {
      name: fl.value,
      value: amount,
      kind: 3,
      special: fl.special,
      order: fl.sort,
    };
    set_properties([...properties, prop]);
  };

  const renderVarchars = (fl) => {
    return fl.varchars.map((vr) => (
      <MenuItem key={vr.id} value={vr.value}>
        {vr.value}
      </MenuItem>
    ));
  };

  const render_predefine_fields_selected_value = (fl) => {
    const x = properties.find(function (item) {
      return item.name == fl.value;
    });

    if (x) {
      var am = x.value;
      return am;
    }

    return "-";
  };

  const render_predefine_fields = () => {
    if (loading1 == true) {
    } else {
      return predefine_fields.map((fl) => (
        <Grid item xs={12} md={6} key={fl.id}>
          <FormControl fullWidth>
            <InputLabel id={fl.value}>{fl.value} </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id={fl.value}
              value={render_predefine_fields_selected_value(fl)}
              label={fl.value}
              onChange={(value) => onValueChange(value, fl)}
              onOpen={() => onOpenSelect(fl)}
            >
              <MenuItem value="-">-</MenuItem>
              {renderVarchars(fl)}
            </Select>
          </FormControl>
        </Grid>
      ));
    }
  };

  function dataURLtoFile(dataurl, filename) {
    if (dataurl) {
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
  }
  //go to next level after uploading files

  const onClickNextLevel = () => {
    set_loader_btn(true);

    const promise = new Promise((resolve, reject) => {
      var erro_count = 0;
      normal_fields.map((fl) => {
        if (fl.special == 1) {
          var valueSelected = properties.filter(
            (item) => item.name == fl.value
          );

          if (valueSelected.length > 0) {
            console.log(valueSelected[0].value);
          } else {
            erro_count = erro_count + 1;
            console.log("dude this fild is must be filled");
            console.log(fl);
            setProblem("فیلد های ستاره دار را باید پر کنید");

            set_error(true);

            setOpenSnackBar(true);

            set_loader_btn(false);
          }
        }

        // var valueSelected = properties.filter((item) => item.name == fl.value);

        // if(valueSelected.length > 0 ){
        //   console.log(valueSelected[0]);
        // }else{

        // }
      });

      resolve(erro_count);
    });

    promise.then((result) => {
      console.log("the result fetch in promise.then is -----------");
      console.log(result);

      if (result > 0) {
        return null;
      } else if (title === null) {
        setProblem("عنوان را وارد کنید");

        setOpenSnackBar(true);
        set_loader_btn(false);
        return null;
      } else if (title.length < 3) {
        setProblem("  عنوان باید حد اقل سه حرف باشد");

        setOpenSnackBar(true);

        set_loader_btn(false);
        return null;
      } else {
        if (0) {
        } else {
          // begin of uploading post

          var token = Cookies.get("id_token");
          if (!token) {
            router.push("/panel/auth/login");
          }

          var phone = Cookies.get("user_phone");

          set_beginUpload(true);

          const formData = new FormData();

          // if (images.length > 0 && isImageChangedFlag != null  ) {
          if (images.length > 0 && isImageChangedFlag != null) {
            images.forEach((element) => {
              console.log(element);

              console.log("the element is   " + element);

              // formData.append("upload[]", element);
              var converted = dataURLtoFile(element, "proimage.jpg");

              formData.append("upload[]", converted);
              // set_cuted_images(cuted_images => cuted_images.concat(converted));

              // console.log('the uncuted image in the loop is ----------------');
              // console.log(element);
            });
          } else {
            formData.append("upload[]", null);
          }

          // console.log('the images length is ');
          // console.log(images.length);
          // return;

          // return null;

          // get and process video after image

          if (videos.length > 0) {
            videos.forEach((vd) => {
              formData.append("videos[]", vd);
            });
          } else {
            formData.append("videos[]", null);
          }

          // end of get and procees video

          // alert(isVideoChangedFlag+'is the value');
          // return;

          axios({
            headers: { "Content-Type": "multipart/form-data" },
            method: "post",
            url: "https://api.ajur.app/api/post-model-with-images",
            timeout: 1000 * 100, // Wait for 35 seconds
            params: {
              token: token,
              address: "testing",
              category_id: cat.id,
              phone: phone,
              title: title,
              description: description,
              note: note,
              properties: JSON.stringify(properties),
              exid: edit_id,
              isImageChangedFlag: isImageChangedFlag,
              isVideoChangedFlag: isVideoChangedFlag,
            },

            data: formData,
            onUploadProgress: function (progressEvent) {
              console.log(
                Math.floor((progressEvent.loaded * 100) / progressEvent.total)
              );
              let progresss = Math.floor(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              set_percent(progresss);
            },
          })
            .then(function (response) {
              set_beginUpload(false);

              console.log("response from axios in new ads of MainForm");
              console.log(response.data);

              set_sended_post_data(response.data);
              set_loader_btn(false);
              props.grabSavedPostData({ value: response.data });
            })
            .catch((e) => {
              setProblem("  axios error !!!");
              set_loader_btn(false);
              set_percent(0);
              console.log("  axios error !!!");
              setProblem("متاسفانه ملک ثبت نشد ، لطفا مجددا اقدام کنید");

              setOpenSnackBar(true);

              set_beginUpload(false);
            });

          //end of uploading post
        }
      }
    });
  };

  //end of go to next level

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const renderDialogPersianAmount = () => {
    if (dialog_value > 0) {
      // let final = persianJs(dialog_value).digitsToWords().toString();
      let final = Num2persian(dialog_value);
      return final;
    } else {
      return "_";
    }
  };

  const getBase64StringFromDataURL = (dataURL) =>
    dataURL.replace("data:", "").replace(/^.+,/, "");

  function deleteVideo(value) {
    set_videos(videos.filter((item) => item !== value));
  }
  function deleteImage(value) {
    const promise = new Promise((resolve, reject) => {
      const maxSizeInMB = 7;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      const img = new Image();
      img.src = value;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        // const newWidth = 1200;
        // const newHeight = 900;
        const newWidth = img.width;
        const newHeight = img.height;
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        let quality = 0.8;
        let NewdataURL = canvas.toDataURL("image/jpeg", quality);
        resolve(NewdataURL);
      };
    });

    promise.then((result) => {
      set_images(images.filter((item) => item !== result));
    });
  }

  function downscaleImage(value) {
    console.log(
      " ########################### the value in downscaleImage is  "
    );
    console.log(value);

    // const base64 = getBase64StringFromDataURL(value);
    // console.log('the pure base 64 image is '+base64);
    const promise = new Promise((resolve, reject) => {
      const maxSizeInMB = 7;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      const img = new Image();
      img.src = value;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const newWidth = 1200;
        const newHeight = 900;

        if (img.width < img.height) {
          newWidth = 900;
          newHeight = 1200;
        }

        // const newWidth = img.width;
        // const newHeight = img.height;
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        let quality = 0.8;
        let NewdataURL = canvas.toDataURL("image/jpeg", quality);
        resolve(NewdataURL);
      };
    });

    promise.then((result) => {
      set_images((images) => images.concat(result));
    });
  }

  const renderOrLoder = () => {
    if (percent > 0) {
      return (
        <div className="spinnerImageView">
          <img
            className="spinner-image"
            src="/logo/ajour-gif.gif"
            alt="ajour logo"
          />
          <p style={{ textAlign: "center", paddingTop: 30 }}>{percent} %</p>

          <LinearProgress variant="determinate" value={percent} />
        </div>
      );
    } else {
      return (
        <>
          <p className={Styles["head-title"]}>
            ثبت مشخصات ملک در دسته {cat.name}{" "}
          </p>
          <Grid container spacing={3}>
            <Grid item fullWidth xs={12} md={12}>
              <TextField
                required
                id="Name"
                label="عنوان"
                placeholder="عنوان ملک را وارد کنید "
                fullWidth
                autoFocus={edit_id ? false : true}
                variant="standard"
                value={title}
                onChange={(title) => set_title(title.target.value)}
                style={{
                  textAlign: "right",
                  direction: "rtl",
                  backgroundColor: "#f8f8f8",
                  width: "100% !important",
                }}
                sx={{
                  textAlign: "right",
                  direction: "rtl",
                  backgroundColor: "#f8f8f8",
                  width: "100% !important",
                }}
              />
            </Grid>

            {render_normal_fields()}

            {render_tick_fields()}

            {render_predefine_fields()}

            <TextField
              id="Name"
              label={<p>توضیحات</p>}
              fullWidth
              multiline={true}
              minRows={3}
              maxRows={10}
              inputProps={{ maxLength: 3000 }}
              placeholder="توضیحات تکمیلی ملک "
              autoComplete="cc-name"
              variant="outlined"
              value={description}
              onChange={(description) =>
                set_description(description.target.value)
              }
              style={{ textAlign: "right", direction: "rtl", paddingTop: 20 }}
            />

            <TextField
              required={false}
              id="note"
              label={<p>یادداشت خصوصی</p>}
              fullWidth
              multiline={true}
              minRows={3}
              maxRows={10}
              inputProps={{ maxLength: 3000 }}
              placeholder="این یادداشت خصوصی است و به هیچ کس جز شما نمایش داده نخواهد شد "
              autoComplete="cc-name"
              variant="outlined"
              value={note}
              onChange={(note) => set_note(note.target.value)}
              style={{ textAlign: "right", direction: "rtl", paddingTop: 20 }}
            />

            <ImageGraber
              old_images={old_images}
              onImageChangeFlag={(value) => {
                set_isImageChangedFlag(value);
              }}
              onGrabImages={(value) => {
                console.log(
                  "------------------------- log from onGrabImages value"
                );
                console.log(value);

                var resized_images = downscaleImage(value);
              }}
              onDeleteImage={(value) => {
                set_isImageChangedFlag(true);

                console.log(value);
                deleteImage(value);
              }}
              onChaneImagesOrders={(imager, images) => {
                set_isImageChangedFlag(true);

                const allImagesExceptThisOne = images.filter(
                  (item) => item !== imager
                );

                set_images([]);

                set_images((images) =>
                  images.concat(imager, allImagesExceptThisOne)
                );
              }}
            />

            <VideoGraber
              old_videos={old_videos}
              onVideosChangeFlag={(value) => {
                set_isVideoChangedFlag(value);
              }}
              onGrabVideos={(value) => {
                console.log(
                  "---------------------    your value come from VideoGraber shown in main form (parent component) -->",
                  value
                );
                set_videos(value);
              }}
              onDeleteVideo={(value) => {
                alert("delete called");
                set_isVideoChangedFlag(true);
                console.log(
                  "------------------need to delete this video form videos------------"
                );
                console.log(value);
                deleteVideo(value);
              }}
            />

            {!loader_btn ? (
              <Button
                variant="contained"
                fullWidth
                onClick={() => onClickNextLevel()}
                style={{ margin: 20, padding: 10, fontSize: 20 }}
              >
                مرحله بعدی
              </Button>
            ) : (
              <Button
                variant="outlined"
                fullWidth
                onClick={() => onClickNextLevel()}
                style={{ margin: 20, padding: 10, fontSize: 20 }}
              >
                ...
              </Button>
            )}
          </Grid>
          <Snackbar
            open={openSnackBar}
            autoHideDuration={6000}
            onClose={handleCloseSnackBar}
          >
            <Alert
              onClose={handleCloseSnackBar}
              severity="warning"
              sx={{ width: "100%" }}
            >
              {problem}
            </Alert>
          </Snackbar>

          <BootstrapDialog
            onClose={handleCloseDialog}
            aria-labelledby="customized-dialog-title"
            fullWidth={true}
            maxWidth="md"
            open={open}
            style={{ background: "#f9f9f911", top: 5 }}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleCloseDialog}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" onClick={handleSubmitDialog}>
                  ثبت
                </Button>
                <p style={{ textAlign: "center" }}>
                  {" "}
                  {dialog_title} - {dialog_unit}
                </p>
              </div>
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {/* <p style={{textAlign:'center',fontSize:14,color:'#888'}}>
              پر کردن فیلدهای ملک کمک زیادی به ببینده خواهد کرد
            </p> */}
              <p style={{ textAlign: "center", fontSize: 16 }}>
                {" "}
                {renderDialogPersianAmount()}
              </p>

              <Typography gutterBottom>
                <Grid container spacing={3}>
                  <Grid item xs={1} md={1}></Grid>
                  <Grid item xs={10} md={10} sx={{ display: 'flex', justifyContent: 'center' }}>
                    {/* <TextField
                      autoFocus={true}
                      required
                      type="number"
                      inputMode="numeric" // This will show numeric keyboard on mobile
                      id="Name"
                      fullWidth
                      autoComplete="cc-name"
                      variant="standard"
                      onChange={(am) => onChangeDialogField(am, dialog_title)}
                      style={{ textAlign: "left", direction: "rtl" }}
                    /> */}

<form onSubmit={(e) => {
      e.preventDefault();
      handleSubmitDialog();
    }}>

                    <NumericFormat
                     
                     autoFocus={true}
                     allowNegative={false}
                     decimalScale={0} 
                     onKeyDown={(e) => {
                      if (e.key === "Enter") {
                       
                        e.preventDefault(); 
                        handleSubmitDialog();// Prevent form submission (we'll handle it via form)
                      }
                    }}
                      
                      onChange={(am) => onChangeDialogField(am, dialog_title)}
                      style={{ 
                        // textAlign: "left",
                        // direction: "rtl",
                        backgroundColor: "#f5f5f5",
                        padding: "12px 16px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        fontSize: "16px",
                        color:'black'
                        
                      }}

                      inputProps={{
                        enterKeyHint: "done",
                        inputMode: "decimal",
                      }}
                       />

<button type="submit" hidden />
</form>
                    {/* <NumberFormat
                      customInput={TextField}
                      autoFocus={true}
                      required
                      id="Name"
                      fullWidth
                      autoComplete="cc-name"
                      variant="standard"
                      onChange={(am) => onChangeDialogField(am, dialog_title)}
                      style={{ textAlign: "left", direction: "rtl" }}
                      isNumericString={true}
                    /> */}

{/* <NumberFormat 
  value={1234.56} 
  displayType={'text'} 
  thousandSeparator={true} 
  prefix={'$'} 
/> */}
                  </Grid>
                </Grid>
              </Typography>
            </DialogContent>
            {/* <DialogActions>
            <Button variant="contained"  onClick={handleSubmitDialog}>
              ثبت
            </Button>
          </DialogActions> */}
          </BootstrapDialog>
        </>
      );
    }
  };

  return <React.Fragment>{renderOrLoder()}</React.Fragment>;
}
