import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import axios from "axios";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
    convertToPixelCrop,
  } from 'react-image-crop';
  import 'react-image-crop/dist/ReactCrop.css'; 
  import Tooltip from '@mui/material/Tooltip';
  import IconButton from '@mui/material/IconButton';
  import Avatar from '@mui/material/Avatar';
  import {useDropzone} from 'react-dropzone';
  const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };
  
  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  };
  
  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };
  
  const img = {
    display: 'block',
    width: 'auto',
    height: '10%'
  };
    import Snackbar from '@mui/material/Snackbar';
    import MuiAlert from '@mui/material/Alert';
    import { useRouter } from 'next/router';
    const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
    });
  
    const ProfilePicker = (props) => {
    
    const [files, setFiles] = useState([]);
    const [images, set_images] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [problem, setProblem] = useState('username_test_problem');
    const [vertical, set_vertical] = useState('top');
    const [horizontal, set_horizontal] = useState('center');
    const [alert_type, set_alert_type] = useState('success');
    const [size, set_size] = useState(props.size ? props.size : 70);

    
    const {getRootProps, getInputProps} = useDropzone({
      accept: {
        // 'image/*': [],
        'image/png': [],
        'image/jpg': [],
        'image/jpeg': [],
        'image/gif': [],
        'image/webp': [],
      },
      onDrop: acceptedFiles => {
         setFiles(acceptedFiles.map(
          file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        }))

      );
  
  
  
  
    //   props.onGrabImages(acceptedFiles.map(
    //    file => Object.assign(file, {
    //    preview: URL.createObjectURL(file)

    //  }))
    //     );

     console.log('start uploading image');

        console.log('the returned file is ');
        
        console.log(acceptedFiles[0]);

        var element = acceptedFiles[0];
        
    
        const formData = new FormData();
        console.log('form data before append');
        console.log(formData);

        
        formData.append("upload[]", element);

        console.log('------------form data----------------');
        console.log(formData);


    
     


     var token = Cookies.get('id_token');
     

     axios({
        method: 'post',
        url: 'https://api.ajur.app/api/post-profile-images',
        data: formData,
        // timeout: 1000 * 20, // Wait for 20 seconds
        params: {
          token: token,
        },
      })
        .then(function (response) {
          

          console.log('response from axios for updloading profile photo is :');
          console.log(response.data);

          if(response.data.status = 200) {

            
            setProblem('عکس پروفایل با موفقیت بروز شد');
            set_alert_type('success');
            setOpen('true');
           
        
        }else{
            setProblem('متاسفانه عکس آپلود نشد');
            setOpen('true');
            setFiles([]);
        }

          
        })
        .catch((e) => {
          
            console.log('axios error on post-profile-images on web');
            setProblem('خطا در ارسال عکس');
            set_alert_type('warning');
            setOpen('true');
            setFiles([]);
        });

    //end of uploading image
  
      }
    });

    var imgage = props.img;
    




    function handleClose(){
        setOpen(false);
        console.log('close snack is cliked'); 
      }


    const changePicture = () => {
        
    }

  

  return (
    <>
    <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
         <Tooltip title="انتخاب عکس پروفایل">
                  <IconButton onClick={changePicture} sx={{ p: 0 }}>
                    { 
                        files.length < 1 ? 
                        <Avatar style={{background:'#eee'}} alt="pr-pic" src={imgage}  sx={{ width: size, height: size }}/>
                        :
                        <Avatar style={{background:'#eee'}} alt="pr-pic" src={files[0].preview} sx={{ width: size, height: size }}/>
                    }
                   
                  </IconButton>
        </Tooltip> 
        </div>
        <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} autoHideDuration={10000} onClose={handleClose}>
            <Alert onClose={handleClose} 
            severity= {alert_type}
            sx={{ width: '100%' }}>
            {problem}
            </Alert>
        </Snackbar>
    </>
  )
};

export default ProfilePicker;
