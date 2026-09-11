import React, { useState ,useEffect} from "react";
import ReactDOM from "react-dom";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { withStyles } from '@mui/styles';

import ImgDialog from "./easy_croper/ImgDialog";
import getCroppedImg from "./easy_croper/CropImage";
import { styles } from "./easy_croper/easy_style";
import Paper from '@mui/material/Paper';



const ImageCropper = ({
  classes,
  selected_file,
  closeModal,
  updateAvatar,
  current_selection,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [imgSrc, setImgSrc] = useState();
  const [loading, set_loading] = useState(false);
  const [selected_file_width_ratio, set_selected_file_width_ratio] = useState(9);
  const [selected_file_height_ratio, set_selected_file_height_ratio] = useState(16);

  useEffect(() => {
    if (selected_file) {
      setZoom(1);
      setRotation(0);

      console.log('the selected-------- file is --------');
      console.log(selected_file); 


      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
         
          const result = true;
          resolve(result);
        }, 200);
      });
  
      promise.then((result) => {
        if (result) {
          // router.push("/city-selection");
         
          

          if(selected_file.width > selected_file.height){
            set_selected_file_width_ratio(4);
            set_selected_file_height_ratio(3);
          }else{
            
           
          }
        
        
        setImgSrc(selected_file.preview);
        set_loading(false);
          //  set_loading(false);
        }

      });






      

      
    } else {
      closeModal();
    }
  }, [current_selection || selected_file]);



  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    
  };

  const showCroppedImage = async () => {
    try {
      set_loading(true);
      const croppedImage = await getCroppedImg(
        imgSrc,
        croppedAreaPixels,
        rotation
      );
      console.log("donee", { croppedImage });
      updateAvatar(croppedImage, current_selection);
      
      // setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  const onClose = () => {
    setCroppedImage(null);
  };

  return (
    <div>
      <div className={classes.cropContainer}>
        <Cropper
          image={imgSrc}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          // aspect={4 / 3}
          // aspect={9 / 16}
          aspect={ selected_file_width_ratio/ selected_file_height_ratio}
          onCropChange={setCrop}
          // onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          
        />
      </div>
      <div className={classes.controls}>
        <div className={classes.sliderContainer}>
          <Typography
            variant="overline"
            classes={{ root: classes.sliderLabel }}
          >
            Zoom
          </Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            classes={{ root: classes.slider }}
            onChange={(e, zoom) => setZoom(zoom)}
          />
        </div>
        <div className={classes.sliderContainer}>
          <Typography
            variant="overline"
            classes={{ root: classes.sliderLabel }}
          >
            Rotations
          </Typography>
          <Slider
            value={rotation}
            min={0}
            max={360}
            step={90}
            aria-labelledby="Rotation"
            classes={{ root: classes.slider }}
            onChange={(e, rotation) => setRotation(rotation)}
          />
        </div>
        {
          !loading ? 

          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0,zIndex:11,background:'blue',color:'white' }} elevation={9}>
				 <Button
          onClick={showCroppedImage}
          variant="text"
          color="primary"
          classes={{ root: classes.cropButton }}
          fullWidth
          size="large"
        >
          <p style={{color:'white', fontSize:20}}>
          انتخاب
          </p>
           
        </Button>
			    </Paper>
          
        :

        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0,zIndex:11,background:'black',color:'white' }} elevation={9}>
        <Button
        
         variant="text"
         color="primary"
         classes={{ root: classes.cropButton }}
         fullWidth
         size="large"
       >
         <p style={{color:'white', fontSize:20}}>
         ... 
         </p>
          
       </Button>
         </Paper>



       
        }
      </div>
      <ImgDialog img={croppedImage} onClose={onClose} />
    </div>
  );
};

export default withStyles(styles)(ImageCropper);
