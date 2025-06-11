import React from 'react'
import PropTypes from 'prop-types'
import Stars from  '../others/Stars'
import Styles from '../styles/MarketingCard.module.css'
import Link from 'next/link';

const MarketingCard = (props)=>  {

  const marketer = props.marketer;

  const onClickCall = () => {
    console.log('call button clicked');
  }

  const renderMarketerUsername = () => {
    if(marketer.username){
      return(
        <p>{marketer.username}</p>
      )
    }else{
      return(
        <p style={{fontSize:14}}>بازاریاب ناشناس</p>
      )
    }
  }


  
    return(

  
              <div className={` ${Styles['profile-card']} 'pe-2' `} >


                <div className={Styles['profile-info']}>
                  

                  <img className={Styles['profile-pic']}  src={marketer.profile_url} />
                  
                  <h2 className={Styles['hvr-underline-from-center']} >
                    {renderMarketerUsername()}
                    <p  style={{fontSize:12}}>زیر شاخه ({marketer.marketers_count} نفر)</p>
                  </h2>
                  
                  <div className={Styles['profile-description']} >
                  <p className={Styles['show-on-hover']} >
                  {marketer.description}
                  </p>
                  </div>
                  
                </div>
                </div>
    

    )

  
}

export default MarketingCard;
