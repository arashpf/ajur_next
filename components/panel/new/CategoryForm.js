import React, { useState, useEffect} from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PersonIcon from '@mui/icons-material/Person';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import Styles from '../../styles/panel/CategoryForm.module.css';
import axios from 'axios';


export default function CategoryForm(props) {
  const edit_id = props.edit_id;
  const edit_cat_id = props.edit_cat_id;
  const [loading, set_loading] = useState(true);
const [basecategories, set_basecategories] = useState([]);



  useEffect(() => {

  axios({
          method:'get',
          url:'https://api.ajur.app/api/sub-category',
    })
  .then(function (response) {
    console.log('the response data in CategoryForm');
    console.log(response.data);
    set_basecategories(response.data)
    set_loading(false)
  });





  },[])



  const rendCategries = () => {
    if(0){



    }else{


      return basecategories.map(cat =>

        cat.id  !=  edit_cat_id ?
          <Grid item xs={12} sm={4} onClick={() => props.onClickSingleCategory(cat)}>
          
            <div  className={Styles.new_single_type_wrapper}>
              <div className={Styles.single_icon}>
                <p><ArrowBackIosNewIcon/></p>
                </div>
              <div   className={Styles.single_info} >
                <p>{cat.name}</p>
                {/* <p><PersonIcon/></p> */}
              </div>
            </div>
        </Grid>
        :
        <Grid item xs={12} sm={4} onClick={() => props.onClickSingleCategory(cat)}>
          
          <div style={{background:'orange'}}  className={Styles.new_single_type_wrapper}>
              <div className={Styles.single_icon}>
                <p><ArrowBackIosNewIcon/></p>
                </div>
                
              <div   className={Styles.single_info} >
                <p>{cat.name}</p>
                
              </div>
             
          </div>
         
          <p style={{background:'orange',textAlign:'center',fontSize:12}}>(دسته بندی کنونی)</p>
          
            
           
        </Grid>

        

        
       );


    }
  }
  return (
    <React.Fragment>
      <div dir="rtl">
        <h5 className={Styles['head-title']}>انتخاب دسته بندی</h5>
        <Grid container spacing={3} dir="rtl">
          {rendCategries()}
        </Grid>
      </div>
    </React.Fragment>
  );}
