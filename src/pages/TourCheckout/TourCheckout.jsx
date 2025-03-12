import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import './tourcheckout.scss';

///IMPORT AUTO ANIMATE
import autoAnimate from '@formkit/auto-animate';

///IMPORT COMPONENTS
import ProgressBar from '../../components/TourCheckout/ProgressBar/ProgressBar'
import Navbar from '../../components/Navbar/Navbar'
import Details from '../../components/TourCheckout/Details/Details';
import Reservation from '../../components/TourCheckout/Reservation/Reservation';
import ArrowBackBlack from '../../assets/hotel-checkout/arrow-back-black.svg';
import { config } from '../../config';

///IMPORT IMAGES
import ArrowTopWhite from '../../assets/hotel-checkout/arrow-top-white.svg';

const baseURL = config.baseURL;

const TourCheckout = () => {

   const [resultsResponsive, setResultsResponsive] = useState(false);
   const [tourCheckOutData, setTourCheckOutData] = useState(null);
   const tourID = useRef(null);

   ///AUTO ANIMATE
   const parent = useRef(null);

   useEffect(() => {
      parent.current && autoAnimate(parent.current)
   }, [parent]);

   function GetTourCheckout() {
      ////ZEROED ALL HOTELS FOR SHOWING SKELETON 
      tourID.current= localStorage.getItem('tourID');

      $.ajax({
         method: 'GET',
         url: `${baseURL}/app/v1/tours`,
         data: { token: localStorage.getItem('token'), id: tourID.current },
         dataType: "json",
         success: function (content) {            
            if (content.result.status) {
              
               if (content.data.length > 0) {
                  
                  setTourCheckOutData(content.data);
               }
               else {
                  setTourCheckOutData(null);
               }
            }
         }
      });
   }

   useEffect(() => {
      GetTourCheckout();
   }, []);

   const tour = tourCheckOutData?.find(t => t.info[0].id === localStorage.getItem('tourID') );
   const tourInfo = tour ? tour.info[0] : null;
   
   return (
      <div className="tour-checkout-section">
         <Navbar />
         <div className="tour-checkout-section-inner">
            <div className="back-button-wrapper">
               <a href={`/tour?id=${localStorage.getItem('tourID')}`}><button type='button' className='back-button'><img src={ArrowBackBlack} alt="" />Back</button></a>
            </div>

            <ProgressBar tourCheckOutData={tourCheckOutData} />
            <div className="tour-checkout-main-details-section">
               <div className="main-details-section-inner">
                  <Details tourCheckOutData={tourInfo} />
                  <Reservation tourCheckOutData={tourInfo} />
               </div>
            </div>

            <div className="price-info-wrapper-responsive">
               <div className="price-info-wrapper-inner">
                  <div className="toggle-arrow" onClick={() => { resultsResponsive === false ? setResultsResponsive(true) : setResultsResponsive(false) }}>
                     <img src={ArrowTopWhite} style={{ transform: resultsResponsive === false ? 'rotate(0)' : 'rotate(180deg)' }} alt="" />
                  </div>
                  {
                     resultsResponsive === true ?
                        <ul>
                           <li>
                              <span>{tourInfo.name}</span>
                              <span>${tourInfo.price}</span>
                           </li>
   
                        </ul>
                        :
                        null
                  }
                  <div className="total-area">
                     <span>Total</span>
                     <h3>${tourInfo?.price}</h3>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default TourCheckout