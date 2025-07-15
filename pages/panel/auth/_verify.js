import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'

const Verify = (props) => {

  const [number, set_number] = useState(0);

  useEffect(() => {
    console.log('the cookie passed from login section is ');
    var phone = Cookies.get('phone');
    console.log(phone);
    set_number(phone);

    },[])

  return (
    <div>
      <p>
        the phone in the cookie is :
        {number}
      </p>
    </div>
  )
}

export default Verify
