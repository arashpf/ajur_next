import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

import Index from '../index';

const name = (props) => {
  const router = useRouter();
  const { categories} = router.query;
  const [loading, set_loading] = useState(true);
  

  useEffect(() => {
    if(categories){
      // alert(categories);
      Cookies.set('selected_category', categories, { expires: 365 });
      set_loading(false)
    }
  

  }, [categories]);

  return (
    <div>

     {!loading && 
      <Index trigeredcity={categories}/>
      

     }
     

      
    </div>
  )
};

export default name;
