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
          onClick={(e) => {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            onClose(e);
          }}
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
  const preservedData = props.preservedData || {};
  const onSaveFormState = props.onSaveFormState;
  const router = useRouter();

  const [showAlertForNoPic, set_showAlertForNoPic] = useState(false);
  const [loading, set_loading] = useState(true);
  const [loading1, set_loading1] = useState(true);
  const [cellphone, set_cellphone] = useState(preservedData.cellphone || "000");
  const [description, set_description] = useState(preservedData.description || "");
  const [note, set_note] = useState(preservedData.note || "");
  const [normal_fields, set_normal_fields] = useState(preservedData.normal_fields || []);
  const [predefine_fields, set_predefine_fields] = useState(preservedData.predefine_fields || []);
  const [tick_fields, set_tick_fields] = useState(preservedData.tick_fields || []);
  const [selected, set_selected] = useState(preservedData.selected || undefined);
  const [isModalVisible, set_isModalVisible] = useState(false);
  const [selectedNormalField, set_selectedNormalField] = useState(null);
  const [selectedNormalFieldSlug, set_selectedNormalFieldSlug] = useState(null);
  const [predefine_fields_data, set_predefine_fields_data] = useState(preservedData.predefine_fields_data || "");
  const [images, set_images] = useState(preservedData.images || []);
  const [videos, set_videos] = useState(preservedData.videos || []);
  const [old_images, set_old_images] = useState(preservedData.old_images || []);
  const [old_videos, set_old_videos] = useState(preservedData.old_videos || []);

  const [cuted_images, set_cuted_images] = useState(preservedData.cuted_images || []);

  const [imagesPicked, set_imagesPicked] = useState(preservedData.imagesPicked || "no");
  const [properties, set_properties] = useState(preservedData.properties || []);
  const [normalField, set_normalField] = useState(preservedData.normalField || []);
  const [title, set_title] = useState(preservedData.title || "");
  const [worker_id, set_worker_id] = useState(preservedData.worker_id || null);
  const [worker, set_worker] = useState(preservedData.worker || null);
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

    const newProps = prefilledFields.map((fl) => ({
      name: fl.key,
      value:
        fl.type == 1 ? Number(fl.value.replace(/[^0-9.-]+/g, "")) : fl.value,
      kind: fl.type,
      special: fl.special,
      order: fl.order,
    }));

    set_properties(newProps);
  };

  const fetchworker = (worker) => {
    axios({
      method: "get",
      url: `https://api.ajur.app/api/posts/${edit_id}`,
    }).then(function (response) {
      set_old_images(response.data.images);
      set_old_videos(response.data.videos);
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
    setOpen(true);
    set_dialog_value("");
  };

  const handleCloseDialog = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (dialog_value && dialog_value !== "0" && dialog_value !== "") {
      handleSubmitDialog(e);
    } else {
      setOpen(false);
    }
  };

  function calculateAutomatic(title, value) {
    if (title == "قیمت") {
      const pilot = properties.filter((item) => item.name == "متراژ کل");
      if (pilot[0]) {
        const calculatedPricePerM2 = value / pilot[0].value;
        let prop = {
          name: "قیمت هر متر",
          value: calculatedPricePerM2.toFixed(0),
          kind: 1,
          special: "1",
          order: "3",
        };
        upsertProperty(prop);
      }
    }
    if (title == "متراژ کل") {
      console.log("metraj is focused");
      const price = properties.filter((item) => item.name == "قیمت");
      if (price[0]) {
        const calculatedPricePerM2 = price[0].value / value;
        let prop = {
          name: "قیمت هر متر",
          value: calculatedPricePerM2.toFixed(0),
          kind: 1,
          special: "1",
          order: "3",
        };
        upsertProperty(prop);
      }
    }

    if (title == "قیمت هر متر") {
      const pilot = properties.filter((item) => item.name == "متراژ کل");
      if (pilot[0]) {
        const price = pilot[0].value * value;
        let prop = {
          name: "قیمت",
          value: price.toFixed(0),
          kind: 1,
          special: "1",
          order: "3",
        };
        upsertProperty(prop);
      }
    }
  }
  
  const handleSubmitDialog = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }

    var title = dialog_title;
    var value = dialog_value;
    var special = dialog_special;
    var order = dialog_order;

    console.log("the dialog title is -----------", title);
    console.log("the properties right now is:", properties);

    calculateAutomatic(title, value);

    let prop = {
      name: title,
      value: value,
      kind: 1,
      special: special,
      order: order,
    };
    upsertProperty(prop);
    
    setOpen(false);
    
    return false;
  };

  const [selectedFile, setSelectedFile] = React.useState(null);

  useEffect(() => {
    axios({
      method: "get",
      url: "https://api.ajur.app/api/category-fields",
      params: {
        cat: cat.id,
      },
    }).then(function (response) {
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

  const upsertProperty = (newProp) => {
    set_properties((pr) =>
      [...pr.filter((item) => item.name !== newProp.name), newProp]
    );
  };

  const deleteredundance = (amount, fl) => {
    set_properties((pr) => pr.filter((item) => item.name !== fl.value));
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
    upsertProperty(prop);

    if (fl.value === "قیمت") {
      set_properties((pr) => pr.filter((item) => item.name !== "قیمت هر متر"));
    } else if (fl.value === "متراژ کل") {
      set_properties((pr) => pr.filter((item) => item.name !== "قیمت هر متر"));
    }
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
      return String(valueSelected[0].value).replace(/(.)(?=(\d{3})+$)/g, "$1,");
    } else {
      return "-";
    }
  };

  const render_normal_fields = () => {
    if (loading1 == true) {
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
          <div
            className={Styles.normal_filed_wrapper}
            onClick={(focus) => onNormalFieldsFocus(focus, fl)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
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
    upsertProperty(prop);
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
    upsertProperty(prop);
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

  const onClickNextLevel = () => {
    if (onSaveFormState) {
      onSaveFormState({
        cellphone,
        description,
        note,
        normal_fields,
        predefine_fields,
        tick_fields,
        selected,
        predefine_fields_data,
        images,
        videos,
        old_images,
        old_videos,
        cuted_images,
        imagesPicked,
        properties,
        normalField,
        title,
        worker_id,
        worker,
      });
    }

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
        var token = Cookies.get("id_token");
        if (!token) {
          router.push("/panel/auth/login");
        }

        var phone = Cookies.get("user_phone");

        set_beginUpload(true);

        const formData = new FormData();

        if (images.length > 0 && isImageChangedFlag != null) {
          images.forEach((element) => {
            console.log(element);
            console.log("the element is   " + element);
            var converted = dataURLtoFile(element, "proimage.jpg");
            formData.append("upload[]", converted);
          });
        } else {
          formData.append("upload[]", null);
        }

        if (videos.length > 0) {
          videos.forEach((vd) => {
            formData.append("videos[]", vd);
          });
        } else {
          formData.append("videos[]", null);
        }

        axios({
          headers: { "Content-Type": "multipart/form-data" },
          method: "post",
          url: "https://api.ajur.app/api/post-model-with-images",
          timeout: 1000 * 100,
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
      }
    });
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const renderDialogPersianAmount = () => {
    if (dialog_value > 0) {
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
    set_images(images.filter((item) => item !== value));
  }

  function downscaleImage(value) {
    console.log("Image received from cropper:", value);
    // Just add the image directly - the cropper already handles the correct dimensions
    set_images((images) => [...images, value]);
  }

  const renderOrLoder = () => {
    if (percent > 0) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: 0,
            left: 0,
            backgroundColor: "white",
            zIndex: 9999
          }}
        >
          <img
            className="spinner-image"
            src="/logo/ajour-gif.gif"
            alt="ajour logo"
          />
          <p style={{ textAlign: "center", margin: "20px 0 10px 0" }}>
            فقط یک مرحله دیگر تا ثبت نهایی ملک با ثبت موقعیت در نقشه
          </p>
          <p style={{ textAlign: "center", margin: "20px 0 10px 0" }}>
            {percent}%
          </p>
          <div style={{ width: "300px" }}>
            <LinearProgress variant="determinate" value={percent} />
          </div>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                InputProps={{
                  style: {
                    textAlign: "right",
                    direction: "rtl",
                    padding: "12px 0",
                  }
                }}
                InputLabelProps={{
                  style: {
                    textAlign: "right",
                    direction: "rtl",
                    width: "100%",
                  }
                }}
                sx={{
                  backgroundColor: "#f8f8f8",
                  width: "100% !important",
                  '& .MuiInputBase-input': {
                    textAlign: "right",
                    direction: "rtl",
                    padding: "12px 0",
                  },
                  '& .MuiInputLabel-root': {
                    textAlign: "right",
                    direction: "rtl",
                    width: "100%",
                  }
                }}
              />
            </Grid>

            <TextField
              id="Name"
              label={<p>توضیحات</p>}
              fullWidth
              multiline={true}
              minRows={8}
              maxRows={40}
              inputProps={{ maxLength: 3000 }}
              placeholder="توضیحات ملک را اینجا بنویسید "
              autoComplete="cc-name"
              variant="outlined"
              value={description}
              onChange={(description) =>
                set_description(description.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  // e.preventDefault();
                  e.stopPropagation();
                }
              }}
              InputLabelProps={{
                shrink: true
              }}
              style={{ textAlign: "right", direction: "rtl", paddingTop: 10, marginTop: 20, marginLeft: 20 }}
            />
            
            {render_normal_fields()}
            {render_tick_fields()}
            {render_predefine_fields()}

            <TextField
              required={false}
              id="note"
              label={<p>یادداشت خصوصی</p>}
              fullWidth
              multiline={true}
              minRows={5}
              maxRows={10}
              inputProps={{ maxLength: 3000 }}
              placeholder="این یادداشت خصوصی است و به هیچ کس جز شما نمایش داده نخواهد شد "
              autoComplete="cc-name"
              variant="outlined"
              value={note}
              onChange={(note) => set_note(note.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  // e.preventDefault();
                  e.stopPropagation();
                }
              }}
              InputLabelProps={{
                shrink: true
              }}
              style={{ textAlign: "right", direction: "rtl", paddingTop: 20, marginTop: 20, marginLeft: 20 }}
            />

            <ImageGraber
              old_images={old_images}
              onImageChangeFlag={(value) => {
                set_isImageChangedFlag(value);
              }}
              onGrabImages={(value) => {

               
                console.log("Cropped image received:", value);
                downscaleImage(value);
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
                sx={{
                  margin: 2,
                  padding: '14px 20px',
                  fontSize: '16px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5252 0%, #ff3838 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
                  },
                }}
              >
                مرحله بعدی
              </Button>
            ) : (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => onClickNextLevel()}
                  sx={{
                    margin: 2,
                    padding: '14px 20px',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    textTransform: 'none',
                    color: '#ff6b6b',
                    borderColor: '#ff6b6b',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 107, 107, 0.05)',
                      borderColor: '#ff5252',
                      color: '#ff5252',
                    },
                  }}
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
            onClose={(e) => {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
              }
              handleCloseDialog(e);
              return false;
            }}
            aria-labelledby="customized-dialog-title"
            fullWidth={true}
            maxWidth="sm"
            open={open}
            PaperProps={{
              style: {
                borderRadius: "24px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.08), 0 6px 12px rgba(0,0,0,0.05)",
                backgroundColor: "#ffffff",
                overflow: "hidden",
                margin: "16px",
                maxHeight: "calc(100% - 32px)",
                position: 'relative',
                top: 'auto',
                bottom: 'auto',
              }
            }}
            disableEnforceFocus={false}
            hideBackdrop={false}
            disableScrollLock={true}
            keepMounted={false}
            disablePortal={false}
            sx={{
              '& .MuiDialog-container': {
                alignItems: 'flex-start',
                paddingTop: { xs: '20px', sm: '64px' },
              },
              '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }
            }}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={(e) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                handleCloseDialog(e);
                return false;
              }}
            >
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                padding: "1px 4px"
              }}>
                <div style={{ width: "68px" }} />
                <p style={{ 
                  textAlign: "center", 
                  margin: 0,
                  marginRight:"40px",
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "#1a1a1a",
                  letterSpacing: "-0.01em"
                }}>
                  {dialog_title} {dialog_unit && `(${dialog_unit})`}
                </p>
              </div>
            </BootstrapDialogTitle>
            
            <DialogContent dividers sx={{ 
              borderTop: "1px solid #f0f0f0",
              borderBottom: "none",
              padding: "15px !important",
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}>
              <div style={{
                textAlign: "center",
                direction: "rtl",
                marginBottom: "15px",
                padding: "8px 0"
              }}>
                <p style={{ 
                  margin: 0,
                  fontSize: "23px",
                  fontWeight: "600",
                  color: "#1976d2",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                  lineHeight: 1.2,
                  fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
                }}>
                  {renderDialogPersianAmount()}
                </p>
                <p style={{
                  margin: "8px 0 0 0",
                  fontSize: "14px",
                  color: "#888",
                  fontWeight: 400
                }}>
                  مبلغ به حروف
                </p>
              </div>

              <div style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}>
                <NumericFormat
                  autoFocus={true}
                  allowNegative={false}
                  decimalScale={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent?.stopImmediatePropagation?.();
                      handleSubmitDialog(e);
                      return false;
                    }
                  }}
                  onInput={(e) => {
                    let value = e.target.value;
                    
                    const persianToEnglish = {
                      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
                      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
                      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
                      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
                    };
                    
                    let converted = value.replace(/[۰-۹٠-٩]/g, match => persianToEnglish[match]);
                    converted = converted.replace(/[^0-9]/g, '');
                    
                    if (converted !== value) {
                      e.target.value = converted;
                    }
                  }}
                  onChange={(am) => {
                    if (am && am.target) {
                      let value = am.target.value;
                      const persianToEnglish = {
                        '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
                        '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
                        '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
                        '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
                      };
                      
                      value = value.replace(/[۰-۹٠-٩]/g, match => persianToEnglish[match]);
                      value = value.replace(/[^0-9]/g, '');
                      
                      const convertedEvent = {
                        ...am,
                        target: {
                          ...am.target,
                          value: value
                        }
                      };
                      
                      onChangeDialogField(convertedEvent, dialog_title);
                    } else {
                      onChangeDialogField(am, dialog_title);
                    }
                  }}
                  placeholder="مقدار را وارد کنید"
                  style={{ 
                    width: '100%',
                    backgroundColor: "#ffffff",
                    padding: "16px 20px",
                    borderRadius: "20px",
                    border: "1.5px solid #e0e0e0",
                    fontSize: "20px",
                    color: '#1a1a1a',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                    fontWeight: 500
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1976d2";
                    e.target.style.boxShadow = "0 0 0 4px rgba(25, 118, 210, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e0e0e0";
                    e.target.style.boxShadow = "none";
                  }}
                  enterKeyHint="done"
                  inputMode="decimal"
                />
                
                <p style={{
                  textAlign: "center",
                  margin: "12px 0 16px 0",
                  fontSize: "13px",
                  color: "#888",
                  direction: "rtl"
                }}>
                  برای تأیید، دکمه ثبت را بزنید
                </p>
                
                <Button 
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent?.stopImmediatePropagation?.();
                    handleSubmitDialog(e);
                    return false;
                  }}
                  fullWidth
                  style={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "16px",
                    textTransform: "none",
                    padding: "14px 16px",
                    borderRadius: "20px",
                    backgroundColor: "#4CAF50",
                    marginTop: "8px",
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                    cursor: "pointer",
                    border: "none",
                    outline: "none",
                  }}
                  type="button"
                >
                  ثبت
                </Button>
              </div>
            </DialogContent>
          </BootstrapDialog>
        </>
      );
    }
  };

  return <React.Fragment>{renderOrLoder()}</React.Fragment>;
}