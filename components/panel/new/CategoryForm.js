import React, { useState, useEffect} from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
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

  const showTheCatname = (catname) => {
    // Replace all occurrences of "خرید" with "فروش"
    const modifiedCatname = catname.replace(/خرید/g, 'فروش');
    
    // Return the modified string
    return modifiedCatname;
  }



  const rendCategries = () => {
    if(0){
      // placeholder
    }else{
      return basecategories.map(cat =>
        cat.id  !=  edit_cat_id ?
          <Grid item xs={12} sm={6} md={4} key={cat.id} onClick={() => props.onClickSingleCategory(cat)}>
            <div className={Styles.new_single_type_wrapper}>
              <div className={Styles.single_icon}>
                <p><KeyboardArrowLeftIcon/></p>
              </div>
              <div className={Styles.single_info}>
                <p>
                  {showTheCatname(cat.name)} 
                  </p>
              </div>
            </div>
          </Grid>
        :
        <Grid item xs={12} sm={6} md={4} key={cat.id} onClick={() => props.onClickSingleCategory(cat)}>
          <div style={{background: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)', borderColor: '#ff6b6b'}} className={Styles.new_single_type_wrapper}>
            <div className={Styles.single_icon}>
              <p><KeyboardArrowLeftIcon/></p>
            </div>
            <div className={Styles.single_info}>
              <p style={{color: 'white'}}>
              {showTheCatname(cat.name)}
              </p>
            </div>
          </div>
          <p style={{background: 'linear-gradient(135deg, #b0bec5 0%, #90a4ae 100%)', color: 'white', textAlign:'center', fontSize: 12, padding: '6px', borderRadius: '12px', marginTop: '8px', fontWeight: 600}}>✓ دسته بندی کنونی</p>
        </Grid>
      );
    }
  }
  return (
    <React.Fragment>
      <div dir="rtl">
        {/* <h6 className={Styles['head-title']}>انتخاب دسته بندی</h6> */}
        <Grid container spacing={3} dir="rtl">
          {rendCategries()}
        </Grid>
      </div>
    </React.Fragment>
  );}
