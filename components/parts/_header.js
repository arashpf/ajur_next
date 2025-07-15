import React, { useState , useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';



import styles from '../styles/Header.module.css';

import axios from 'axios';
import 'animate.css';


function Header() {

  const router = useRouter()
  const expand = 'md';
  const  [nav_kind ,set_nav_kind] = useState('main');


  const[location_li , set_location_li] = useState(false);
  const[search , set_search] = useState('');
  const[search_places , set_search_places] = useState([]);
  const [user_initial_lat, set_user_initial_lat] = useState(35.7074612);
  const [user_initial_long, set_user_initial_long] = useState(51.3005805);

  const [selected_city, set_selected_city] = useState('کلکو');


  useEffect(() => {
    var city = Cookies.get('selected_city');
    set_selected_city(city);
    
  },[])

  /* navbar scroll changeBackground function */
  const changeBackground = () => {

    if (window.scrollY >= 200) {


    } else {

    }
  }

  useEffect(() => {
    changeBackground()

    window.addEventListener("scroll", changeBackground)
  },[])


  const changeLogo = () => {
    if (window.scrollY >= 300) {

      set_nav_kind('secondary');


    }else if (window.scrollY <= 270) {
      set_nav_kind('main');



    }
  }

  useEffect(() => {
    changeLogo()

    window.addEventListener("scroll", changeLogo)
  },[])

  const handleOnclickInput = () => {
    console.log('form clicked');
    set_location_li(true)

  }

  const handleSingleLocationClicked = ({place}) => {
    set_search('');
    console.log('the place is :');
    console.log(place.location);

  }

  const renderSearchPlaces = () => {
    return search_places.map( place =>
      <Link
            href={`/search/${place.title}`}
            key={place.id}

          >
      <div className={styles.singleSearchResault} onClick = {()=>handleSingleLocationClicked({place})} >
          <p>{place.title} ({place.region})</p>
          <p></p>
      </div>
    </Link>

    );
  }


  const handleChangeInput = (e) => {
    console.log('form changed');
    console.log(e.target.value);
    if(e.target.value){
      var title = e.target.value;

      set_search(title);
      set_location_li(false)



      axios({
              method:'get',
              url:'https://api.neshan.org/v1/search',
              headers: {
              'api-key': 'service.UylIa21mMdoxUKtQ9nnS7b3dE5sJfgKWPpRVoyPV'
            },
              params: {
                term: title,
                lat:35,
                lng:52
              },
            })

          .then(function (response) {

              set_search_places(response.data.items);
              console.log(response.data);


            })



    }else{

      set_search('');
    }
  }

  const onclickPlacesCloseButton = () => {
    set_search_places([]);
  }

  const searchResults = () => {
    if(search){
      return(
        <div className="search_location_li" >
          <div onClick = { onclickPlacesCloseButton } className="search_location_li_close_icon"   >X</div>
          <div className={styles.search_location_text_in_header}  >
              {renderSearchPlaces()}
          </div>
        </div>
      )
    }
  }

  const onclickCloseButton = () => {
    set_location_li(false);

  }

  function handleCurrentLocationClicked () {
    console.log('current location clicked');
    set_location_li(false);


    console.log('the location lat is ');

    navigator.geolocation.getCurrentPosition(function(position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);

       set_user_initial_lat(position.coords.latitude);
       set_user_initial_long(position.coords.longitude);




       axios({
               method:'get',
               url:'https://api.neshan.org/v5/reverse',
               headers: {
               'api-key': 'service.UylIa21mMdoxUKtQ9nnS7b3dE5sJfgKWPpRVoyPV'
             },
               params: {
                 lat:position.coords.latitude,
                 lng:position.coords.longitude
               },
             })

           .then(function (response) {

               set_search_places(response.data.items);
               console.log(response.data);
               var formatted_address = response.data.formatted_address;
               var county = response.data.county;
               var city = response.data.city;

                 if(!county){
                   var title = city;
                 }else{
                   var title = county;
                 }




             })





    });




  }

  const locationLi = () => {
    if(location_li){
      return(


        <div className={styles['search-location-li']} style={{background:'#f7f7f7'}}>
          <div onClick = { onclickCloseButton }  className={styles['search-location-li-close-icon']} >X</div>
          <div onClick = {handleCurrentLocationClicked}  className={styles['search-my-location-text']} >

              <p>مکان فعلی من</p>
                <i className="fa fa-map-marker"></i>
          </div>

        </div>

      )
    }
  }



  const onClickHome = () => {
    router.push("/");
  }

  const onClickAboutUs = () => {
    router.push("/about");
  }

  const onClickSupport = () => {
    router.push("/support");
  }

  const onClickCounseling = () => {
    router.push("/Counseling");
  }

  const onClickMarketing = () => {

    var token = Cookies.get('id_token');
    if(!token){
      console.log('you have to login');
      Cookies.set('destination_before_auth', '/marketing', { expires: 14 });
      router.push("/panel/auth/login");
    }else{
      console.log('you are currently loged in and enjoy');
      console.log(token);
      router.push("/marketing");
    }

  }

  const onClickLogin = () => {
    console.log('login clicked');

    var token = Cookies.get('id_token');
    if(!token){
      console.log('you have to login');
      router.push("/panel/auth/login");
    }else{
      console.log('you are currently loged in and enjoy');
      console.log(token);
      router.push("/panel");
    }
  }

  const onClickHire = () => {
    router.push("/marketing");
  }

  const onClickLogout = () => {
    console.log('you press logout');


    // remove all cookies before logout and im the god guy respect others privacy !!!
    Cookies.remove('id_token');
    Cookies.remove('destination_before_auth');
    Cookies.remove('ref');
    Cookies.remove('phone');
    Cookies.remove('star');
    Cookies.remove('user_phone');
    Cookies.remove('user_city');
    Cookies.remove('user_realstate');
    Cookies.remove('user_city');
    Cookies.remove('user_description');
    Cookies.remove('user_profile_url');
    Cookies.remove('user_realstate_url');
    Cookies.remove('selected_city');


    router.push("/panel/auth/login");
  }

  const onClickSelectCity = () => {
    
    router.push("/city-selection");
  }

  const renderLogoutButton = () => {

    var token = Cookies.get('id_token');

    if(token){
      return(
        <NavDropdown.Item
          onClick={onClickLogout}
          href="#"
           className={styles['nav-dropdown-item']}>
          خروج از حساب
        </NavDropdown.Item>
      )
    }
  }

  const navabrOrSearch = () => {
    if(nav_kind == 'main'){

      return(
        <Container fluid className={styles.navbar}  >
          <Navbar.Brand className={styles.navar_brand_center}   href="/">

            <Link
                  href={`/`}


                >
            <img className={styles.image_logo_small}   src='/logo/web-logo-text.png' alt="لوگوی آجر" />
            </Link>
            
          </Navbar.Brand>
          <Nav.Link style={{background:'#ea5831',color:'#f9f9f9',padding: '5px 12px', boxShadow : '0 3px 14px rgba(0, 0, 0, 0.4)' }} onClick={onClickSelectCity} >شهر  : {selected_city}</Nav.Link>

          {/* <NavDropdown
                  title={selected_city}
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                >
                    <NavDropdown.Item
                      onClick={onClickSelectCity}
                      href="#action3" className={styles['nav-dropdown-item']}>
                       انتخاب شهر جدید
                    </NavDropdown.Item>
                   
                   

                    {renderLogoutButton()}

                

          </NavDropdown> */}

          
          


          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
               <p style={{background:'#f9f9f9',margin:20,padding:10,fontSize:16,textAlign:'center'}}>
                مشاور املاک هوشمند آجر
              </p>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className={`flex-grow-1 pe-3 ${styles['nav-link-wrapper-end']}  `}>
                <Nav.Link href="/"   onClick={onClickHome}>خانه</Nav.Link>
                <Nav.Link  href="/about"  onClick={onClickAboutUs}>درباره آجر</Nav.Link>
                <Nav.Link href="/support"   onClick={onClickSupport}>پشتیبانی</Nav.Link>

                <NavDropdown
                  title="ورود به آجر"
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                 
                >
                    <NavDropdown.Item
                      onClick={onClickLogin}
                      href="#"
                       className={styles['nav-dropdown-item']}>
                        
                       ورود به پنل 
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                     onClick={onClickHire}
                     href="/markrting"
                     className={styles['nav-dropdown-item']}>
                      استخدام مشاورین
                    </NavDropdown.Item>

                    {renderLogoutButton()}

                

                </NavDropdown>
              </Nav>


              <Nav className={` ${styles['nav-link-wrapper-start']} pe-3 `}>
               
                <Nav.Link  href="#"  onClick={onClickCounseling}>درخواست فایل</Nav.Link>

                <Nav.Link href="#"  onClick={onClickMarketing}>بازاریابی</Nav.Link>


              </Nav>

                <div className={styles['logo-just-mobile']}>

                <img className={styles['logo-just-mobile-image']} src="/img/big-logo-180.png" alt="لوگوی مشاور املاک آجر" width={180} height={180} />
                </div>
            </Offcanvas.Body>

          </Navbar.Offcanvas>


        </Container>




      )

    }else{

        return(

          <Container className={styles.navbar_second} >

            <Form className={`${styles.d_flex} ${styles.navar_brand_center} ${styles.navbar_serach}`}>
              <Form.Control
                type="search"
                placeholder="جستجوی منطقه و یا شهر"

                className={`${styles.me_2} ${styles.animate__animated} ${styles.animate__bounceIn}`}

                aria-label="Search"
                onChange={handleChangeInput}
                onClick={handleOnclickInput}
              />
            </Form>

            {locationLi()}
            {searchResults()}

          </Container>



        )

    }
  }
  return (
    <>
    <Navbar key={expand} collapseOnSelect  bg="light" expand={expand} className={styles.mb_1}   sticky="top">
        {navabrOrSearch()}
    </Navbar>
    </>
  );
}

export default Header;
