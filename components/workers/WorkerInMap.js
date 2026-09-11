import React, { useState, useEffect,Component } from "react"
import PropTypes from 'prop-types'
import Styles from '../styles/WorkerInMap.module.css'
import WorkerInMapTabs from './WorkerInMapTabs'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Link from 'next/link';



const WorkerInMap = (props) => {

    const worker = props.worker;
    const details = props.details;
    console.log('the details :::::::::::::::::');
    console.log(details.videos);


  return (
    <div className={Styles['worker-in-map-wrappr']}>
      <Container>
      <Row className={Styles['worker-row-one']} >
        <Col xs={3} md={3} lg={3}>
          <p>{worker.distance} km</p>
        </Col>
      <Col xs={9} md={9} lg={9}>
          <p className={Styles['worker-in-map-title']}>{worker.name} </p>
      </Col>
      </Row>
      <Row className={Styles['worker-row-two']} xs={12} md={12}>
        <Col>
          <WorkerInMapTabs worker ={worker} details= {details} />
        </Col>
      </Row>
      <Row className={Styles['worker-row-three']} xs={12} md={12}>
        <Col>


          <Link
                href={`/worker/${worker.slug}?id=${worker.id}`}
                key={worker.id}
              >
                
                  <div className={Styles['more-info-button']}>

                        <a>مشاهده جزییات</a>


                  </div>
              

         </Link>

        </Col>


      </Row>
    </Container>
    </div>
  )
}

export default WorkerInMap
