import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import Styles from '../styles/CatCard2.module.css'

const CatCard2 = (props) => {
  let { cat,selectedcat } = props;
  
  const [is_all_selected, set_is_all_selected] = useState(true);


  const iconsImages = {
      gps: require('../assets/icons/touch-in.png'),
      home: require('../assets/icons/home.png'),
      office: require('../assets/icons/office.png'),
      inductry: require('../assets/icons/inductry.png'),
      land: require('../assets/icons/land.png'),
      sport: require('../assets/icons/sport.png'),
      vacations: require('../assets/icons/vacations.png'),
      wedding: require('../assets/icons/wedding.png'),
  }

  const onClickCat = ({cat}) => {
    console.log('single cat clicked');
    console.log(cat);
    console.log('selected cat in CatCard2 is ');
    console.log(selectedcat);

    set_is_all_selected(false);



     props.handleParentClick(cat)

  }

  const onClickAllCat = ({cat}) => {
    console.log('single cat clicked');
    console.log(cat);
    console.log('selected cat in CatCard2 is ');
    console.log(selectedcat);
    set_is_all_selected(true);



     props.handleParentClick(cat)

  }

  

  return (
    cat=='all' ?

    <div className={1  ? 'cat-all-card-2-active card-2-active' : 'cat-card-2-disactive'}>
      <div onClick={()=>onClickAllCat({cat})} className={Styles['cat-card-2-title']}>همه {parseInt(cat.counts)  > 0 ? "(" +cat.counts+ ")" : ''}</div>
      <div></div>
      </div>
      :
      <div className={cat.id == selectedcat ? 'cat-card-2-active' : 'cat-card-2-disactive'}>
      <div onClick={()=>onClickCat({cat})} className={Styles['cat-card-2-title']}>{cat.name} {parseInt(cat.counts)  > 0 ? "(" +cat.counts+ ")" : ''}</div>
      <div></div>
      </div>
    
   
  )
}

export default CatCard2
