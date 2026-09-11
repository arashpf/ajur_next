import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';

import Styles from "../../styles/panel/ImageGraber.module.css";

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
  height: '100%'
};




function Previews(props) {
  const [files, setFiles] = useState([]);
  const [videos, set_videos] = useState([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'video/*': [],
    },
    onDrop: acceptedFiles => {
       setFiles(acceptedFiles.map(
        file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    );




    props.onGrabVideos(acceptedFiles.map(
     file => Object.assign(file, {
     preview: URL.createObjectURL(file)
   })));

    }
  });

  const onClickSingleThumb = (file) => {
    console.log('single thumb is clicked');
    console.log(file);
    setFiles(
  files.filter(item => item !== file)
)
  }

  const thumbs = files.map(file => (

    <div style={thumb} key={file.name} onClick={() => onClickSingleThumb(file)}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p  className={Styles["dragsection"]}  >ویدیو ها را به اینجا بکشید و رها کنید یا
        <bold style={{background:'#f1f1f1' , padding:5, margin:5}}> انتخاب کنید</bold>
         </p>
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
    </section>
  );
}

<Previews />




export default Previews;
