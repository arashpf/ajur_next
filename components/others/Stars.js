import React from 'react'
import PropTypes from 'prop-types'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';

const Stars = (props) => {
  const amount = props.amount;

  const starType = (index) => {
    if(index < amount){
      return(
        <StarOutlinedIcon sx={{ color: 'gold' }}/>
      )
    }else{
      return(
        <StarOutlineOutlinedIcon sx={{ color: 'gray' }} />
      )
    }

  }
  const starGenerator = () => {
    const numbers = [1, 2, 3, 4, 5];

    return numbers.map((num,index )=>
            <a key={index}>{starType(index)}</a>
    );


    }

  return (
    <div>

      {starGenerator()}
    </div>
  )
}

export default Stars
