import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import './hotelcheckout.scss';

///IMPORT AUTO ANIMATE
import autoAnimate from '@formkit/auto-animate';

///IMPORT COMPONENTS
import ProgressBar from '../../components/HotelCheckout/ProgressBar/ProgressBar'
import Navbar from '../../components/Navbar/Navbar'
import Details from '../../components/HotelCheckout/Details/Details';
import Reservation from '../../components/HotelCheckout/Reservation/Reservation';
import ArrowBackBlack from '../../assets/hotel-checkout/arrow-back-black.svg';

///IMPORT IMAGES
import ArrowTopWhite from '../../assets/hotel-checkout/arrow-top-white.svg';

const HotelCheckout = () => {

   const [resultsResponsive, setResultsResponsive] = useState(false);
   const [checkOutData, setCheckOutData] = useState(null);

   ///AUTO ANIMATE
   const parent = useRef(null);

   useEffect(() => {
      parent.current && autoAnimate(parent.current)
   }, [parent]);


   function GetHotelCheckout() {
      ////ZEROED ALL HOTELS FOR SHOWING SKELETON 
      var rid = new URLSearchParams(window.location.search).get('rid');
      $.ajax({
         method: 'POST',
         url: `https://monkigo.com/app/v1/iac2023/hotels/checkout?token=${localStorage.getItem('token')}&cin=${localStorage.getItem('cin')}&cout=${localStorage.getItem('cout')}`,
         data: { hid: localStorage.getItem('hid'), rid: rid },
         dataType: "json",
         success: function (data) {
            if (data.data !== undefined) {
               setCheckOutData(data.data);
            }
            else {
               setCheckOutData(null);
            }
         },
         error: function (jqXHR, textStatus, errorThrown) {
            var responseText = JSON.parse(jqXHR.responseText);

            if (responseText.result.code === 403) {
               // open sign in pop-up
            }
         }
      });
   }

   useEffect(() => {
      GetHotelCheckout();
   }, []);

   function CalculateRooms() {
      if (localStorage.getItem('guestInfo') !== null && localStorage.getItem('guestInfo') !== undefined) {
         var guest = JSON.parse(localStorage.getItem('guestInfo'));
         var count = guest.rooms
         return count;
      }
      else {
         return 1;
      }
   }

   function CalculateNights() {
      var dateArray1 = localStorage.getItem('cin').split('-');
      var dateArray2 = localStorage.getItem('cout').split('-');
      
      var date1 = new Date(parseInt(dateArray1[2]),parseInt(dateArray1[0]-1),parseInt(dateArray1[1]));
      var date2 = new Date(parseInt(dateArray2[2]),parseInt(dateArray2[0]-1),parseInt(dateArray2[1]));

      var diff = date2 - date1;
      return Math.abs(Math.ceil(diff / (1000 * 3600 * 24)));
   }

   function CalculateTotal() {
      return Math.round((CalculateNights() * CalculateRooms() * checkOutData?.hotel.rooms[0].price));
   }

   return (
      <div className="hotel-checkout-section">
         <Navbar />
         <div className="hotel-checkout-section-inner">
            <div className="back-button-wrapper">
               <a href={`/hotel?hid=${localStorage.getItem('hid')}`}><button type='button' className='back-button'><img src={ArrowBackBlack} alt="" />Back</button></a>
            </div>

            <ProgressBar checkOutData={checkOutData} />
            <div className="hotel-checkout-main-details-section">
               <div className="main-details-section-inner">
                  <Details checkOutData={checkOutData} />
                  <Reservation checkOutData={checkOutData} />
               </div>
            </div>

            <div className="price-info-wrapper-responsive">
               <div className="price-info-wrapper-inner">
                  <div className="toggle-arrow" onClick={() => { resultsResponsive === false ? setResultsResponsive(true) : setResultsResponsive(false) }}> {/*setTimeout(() => { window.scrollTo(0, document.body.scrollHeight) }, 50)*/}
                     <img src={ArrowTopWhite} style={{ transform: resultsResponsive === false ? 'rotate(0)' : 'rotate(180deg)' }} alt="" />
                  </div>
                  {
                     resultsResponsive === true ?
                        <ul>
                           <li>
                              <span>{CalculateRooms()} {CalculateRooms() > 1 ? 'rooms' : 'room'} x {CalculateNights()} {CalculateNights() > 1 ? 'nights' : 'night'}</span>
                              <span>${CalculateTotal()}</span>
                           </li>
                           {/* <li>
                              <span>Taxes</span>
                              <span>$52.41</span>
                           </li> */}
                        </ul>
                        :
                        null
                  }
                  <div className="total-area">
                     <span>Total <span style={{ fontSize: '12px', color: '#DBE2FF' }}>(Tax included)</span></span>
                     <h3>${CalculateTotal()}</h3>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default HotelCheckout