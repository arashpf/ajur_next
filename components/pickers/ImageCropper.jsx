import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "./setCanvasPreview";
import SpeedDial from '@mui/material/SpeedDial';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check';
import Avatar from '@mui/material/Avatar';
import {useDropzone} from 'react-dropzone';
import Badge from '@mui/material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import SpinnerLoader from "../panel/SpinnerLoader";


const ASPECT_RATIO = 1;
const MIN_DIMENSION = 250;

const ImageCropper = (props) => {
  
  const old_imgage = props.old_imgage;
  const new_image = props.new_image;
  const closeModal = props.closeModal;
  const updateAvatar = props.updateAvatar;
  
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [error, setError] = useState("");
  const [loading, set_loading] = useState(false);

  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: acceptedFiles => {
        const file = acceptedFiles?.[0];
        if (!file) return;

        props.handleParentLoading(true);
    
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          const imageElement = new Image();
          const imageUrl = reader.result?.toString() || "";
          imageElement.src = imageUrl;
    
          imageElement.addEventListener("load", (e) => {
            if (error) setError("");
            const { naturalWidth, naturalHeight } = e.currentTarget;
            if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
              setError("ابعاد عکس شما کوچک است");
              return setImgSrc("");
              
            }
          });
          
          setImgSrc(imageUrl);
          
        });
        reader.readAsDataURL(file);

        props.handleParentLoading(false);

    }
  });

  

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      

      imageElement.addEventListener("load", (e) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("ابعاد عکس شما کوچک است");
          props.handleParentLoading(false);
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
      props.handleParentLoading(false);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
    props.handleParentLoading(false);
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
    
   
    
    
  };

  const renderAvatarOrCroper = () => {
    if(imgSrc){
        return(
            <div className="flex flex-col items-center">
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Upload"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        
          
          
          <SpeedDial
                  ariaLabel="برش و اتمام"
                  sx={{ position: 'fixed', top: 10, left: 10 }}
                  
                  icon={
                    !loading ?
                  <CheckIcon  fontSize='large'/>
                  :
                 
                    <SpinnerLoader />
                  
                  
                  

                  
                    
                }
                  onClick={() => {

                    if(loading){
                      return;
                    }

                    set_loading(true);





                    const promise = new Promise((resolve, reject) => {
                      setTimeout(() => {
                       
                        const result = true;
                        resolve(result);
                      }, 3000);
                    });
                
                    promise.then((result) => {
                      if (result) {
                       
                      
                        
                        setCanvasPreview(
                          imgRef.current, // HTMLImageElement
                          previewCanvasRef.current, // HTMLCanvasElement
                          convertToPixelCrop(
                            crop,
                            imgRef.current.width,
                            imgRef.current.height
                          )
                        );
                        // const dataUrl = previewCanvasRef.current;
                        const dataUrl = previewCanvasRef.current.toDataURL();
                       
                        updateAvatar(dataUrl);
                        setImgSrc(null);
                        props.handleParentLoading(false);
                        
                        set_loading(false);
                        closeModal();

                        set_loading(false);
                        //  set_loading(false);
                      }
                    });
                   
               
                
                  











                   
                  }}
                  FabProps={{
                    sx: {
                      bgcolor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'secondary.main',
                      }
                    }
                  }}
                ></SpeedDial>
        </div>
        )
    }else{
        return(
            
            <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />



        <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <EditIcon style={{fontSize:50, borderRadius:50,background:'gray',padding:5,cursor:'pointer'}} />
        }
      >
        {
            new_image ? 
            <Avatar style={{background:'#eee'}} alt="pr-pic" src={new_image} sx={{ width: 300, height: 300 }}/>
            :
            <Avatar style={{background:'#eee'}} alt="pr-pic" src={old_imgage} sx={{ width: 300, height: 300 }}/>

        }
        

        </Badge>
        </div>
            //  <Avatar style={{background:'#eee'}} alt="pr-pic" src={old_imgage} sx={{ width: 300, height: 300 }}/>
        )
      
    }
  }

  return (
    <>
      

      
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div style={{justifyContent:'center',textAlign:'center',display:'flex'}}>
      
       
      { renderAvatarOrCroper() }
     
      </div>
      {/* {imgSrc && (

      )} */}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}
    </>
  );
};
export default ImageCropper;