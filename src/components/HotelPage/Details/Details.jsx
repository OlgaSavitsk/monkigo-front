import React, { useState, useEffect, useRef } from 'react';
import './details.scss';


////IMPORT MUI
import Skeleton from '@mui/material/Skeleton';

///IMPORT IMAGES
import Star from '../../../assets/hotel-page/star.svg';
import Location from '../../../assets/hotel-page/location.svg';
import Breakfast from '../../../assets/hotel-page/breakfast.svg';
import Service from '../../../assets/hotel-page/service.svg';
import Parking from '../../../assets/hotel-page/parking.svg';
import Wifi from '../../../assets/hotel-page/wifi.svg';
import Close from '../../../assets/hotel-page/modal-close.svg';
import AmenitiesBird from '../../../assets/hotel-page/amenities-bird.svg';

///IMPORT COMPONENTS
///IMPORT AUTO ANIMATE
import autoAnimate from '@formkit/auto-animate';

import $ from 'jquery';

const Details = ({ hotel }) => {

   const [amenitiesModal, setAmenitiesModal] = useState(false);
   const [descriptionMore, setDescriptionMore] = useState(false);

   ///AUTO ANIMATE
   const parent = useRef(null);

   useEffect(() => {
      parent.current && autoAnimate(parent.current)
   }, [parent]);

   useEffect(() => {
      if (amenitiesModal !== false) {
         $('body, html').css('overflow', 'hidden')
      } else {
         $('body, html').css('overflow', '')
      }
   }, [amenitiesModal])

   useEffect(() => {

      function appendMap() {
         var style = document.createElement('link');
         var style2 = document.createElement('link');
         var script1 = document.createElement('script');
         var script2 = document.createElement('script');
         var script3 = document.createElement('script');
         var mapjs = document.createElement('script');

         script1.src = '/leaflet.js';
         script2.src = '/maplibre-gl.js';
         script3.src = '/leaflet-maplibre-gl.js';
         mapjs.src = '/map.js';
         style.href = '/leaflet.css';
         style2.href = '/maplibre-gl.css';
         style.rel = 'stylesheet';
         style2.rel = 'stylesheet';

         setTimeout(() => {
            document.head.appendChild(script1);
            document.head.appendChild(style);
            document.head.appendChild(style2);
         }, 1000);
         setTimeout(() => {
            document.head.appendChild(script2);
         }, 1100);
         setTimeout(() => {
            document.head.appendChild(script3);
         }, 1200);

         setTimeout(() => {
            document.body.appendChild(mapjs);
         }, 1300);

      }
      appendMap();

   }, []);

   ////STARS LOOP
   function starLoop(length) {
      let count = [];
      for (let i = 0; i < length; i++) {
         count.push(i);
      }
      return count;
   }
   function CalculateNights() {
      var dateArray1 = localStorage.getItem('cin').split('-');
      var dateArray2 = localStorage.getItem('cout').split('-');
      
      var date1 = new Date(parseInt(dateArray1[2]),parseInt(dateArray1[0]-1),parseInt(dateArray1[1]));
      var date2 = new Date(parseInt(dateArray2[2]),parseInt(dateArray2[0]-1),parseInt(dateArray2[1]));

      var diff = date2 - date1;
      return Math.abs(Math.ceil(diff / (1000 * 3600 * 24)));
   }

   function CalculateGuests(){
      if(localStorage.getItem('guestInfo')!==null && localStorage.getItem('guestInfo')!==undefined){
         var guest = JSON.parse(localStorage.getItem('guestInfo'));
         var count = guest.adults+guest.childrens
         return count;
      }
      else{
         return 1;
      }
   }

   function CalculateRooms(){
      if(localStorage.getItem('guestInfo')!==null && localStorage.getItem('guestInfo')!==undefined){
         var guest = JSON.parse(localStorage.getItem('guestInfo'));
         var count = guest.rooms
         return count;
      }
      else{
         return 1;
      }
   }

   function CalculateDetailTotal(hotelPrice){
      return CalculateNights() * CalculateRooms() * hotelPrice;
   }

   return (
      <div className="details-wrapper">


         {
            amenitiesModal === true ?

               window.innerWidth <= 504 ?
                  <div className='mobile-amenities-modal'>
                     <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
                        <div className="inner-content-area">
                           <div className="content-header">
                              <h3>Hotel amenities</h3>
                              <img src={Close} alt="" onClick={() => setAmenitiesModal(false)} />
                           </div>

                           <div className="content-body">
                              <h3>General</h3>

                              <div className="all-amenities">
                                 {
                                    hotel.amenities.map((a, i) => (
                                       <div className="single-amenities" key={i}>
                                          <img src={AmenitiesBird} alt="" />
                                          <span>{a}</span>
                                       </div>
                                    ))
                                 }
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  :
                  <div className='amenities-modal' onClick={() => setAmenitiesModal(false)}>
                     <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
                        <div className="inner-content-area">
                           <div className="content-header">
                              <h3>Hotel amenities</h3>
                              <img src={Close} alt="" onClick={() => setAmenitiesModal(false)} />
                           </div>

                           <div className="content-body">
                              <h3>General</h3>

                              <div className="all-amenities">
                                 {
                                    hotel.amenities.map((a, i) => (
                                       <div className="single-amenities" key={i}>
                                          <img src={AmenitiesBird} alt="" />
                                          <span>{a}</span>
                                       </div>
                                    ))
                                 }
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               :
               null
         }

         <div className="hotel-info-section">
            <div className="info-header">
               {
                  hotel ?
                     <h2>{hotel.name}</h2>
                     :
                     <Skeleton variant="rounded" width={'100%'} height={'35px'} />
               }

            </div>
            <div className="info-category-rating">
               <div className="category">
                  {
                     hotel ?
                        <div className="single-category">
                           <span>{hotel.type}</span>
                        </div>
                        :
                        <Skeleton variant="rounded" width={'71px'} height={'25px'} style={{ marginRight: '16px' }} />
                  }

               </div>

               {
                  hotel ?
                     <div className="star-list">
                        {
                           starLoop(hotel.star).map((i) => {
                              return <img key={i} src={Star} alt="" />
                           })
                        }
                     </div>
                     :
                     <Skeleton variant="rounded" width={'70px'} height={'14px'} />
               }


            </div>

            {
               hotel ?
                  <div className="info-location">
                     <img src={Location} alt="" />
                     <h3>{hotel.address}</h3>
                  </div>
                  :
                  <Skeleton variant="rounded" width={'200px'} height={'20px'} />

            }


         </div>

         <div className="reservation-section">
            <div className="section-inner">
               <div className="reservation-section-inner">
                  <div className="info-text">

                     {
                        hotel ?
                           <h3>Total</h3>
                           :
                           <Skeleton variant="rounded" width={'116px'} height={'20px'} style={{ marginBottom: '6px' }} />
                     }

                     {
                        hotel ?
                           <span>{CalculateNights()} {CalculateNights()>1 ? 'nights' : 'night'} x {CalculateRooms()} {CalculateRooms()>1 ? 'rooms' : 'room'}</span>
                           :
                           <Skeleton variant="rounded" width={'107px'} height={'15px'} />
                     }

                  </div>
                  <div className="price-text">
                     {
                        hotel ?
                           <h3>${CalculateDetailTotal(hotel.price)}</h3>
                           :
                           <Skeleton variant="rounded" width={'43px'} height={'24px'} />
                     }

                  </div>
               </div>
               {
                  hotel ?
                     <button type='button'
                        onClick={() => {
                           window.scrollTo(document.getElementById('roomsView').offsetLeft, document.getElementById('roomsView').offsetTop);
                        }}
                     >Select Rooms</button>
                     :
                     <Skeleton variant="rounded" width={'100%'} height={'52px'} />
               }

            </div>
         </div>

         <div className="hotel-description-section">
            {
               hotel ?
                  <h3 className='section-header-text'>Description</h3>
                  :
                  <Skeleton variant="rounded" width={'105px'} height={'24px'} style={{ marginBottom: '16px' }} />
            }


            <div className="description-inner">
               {
                  descriptionMore === false ?
                     <div className="description">
                        <h3>{hotel?.description[0].title}</h3>
                        <p>{hotel?.description[0].paragraphs}
                           <span onClick={() => descriptionMore === false ? setDescriptionMore(true) : setDescriptionMore(false)}>{descriptionMore === false ? 'Show more' : 'Show less'}</span>
                        </p>
                     </div>
                     :
                     hotel?.description.map((d, i) => (
                        <div className="description" key={i}>
                           <h3>{d?.title}</h3>
                           <p>{d?.paragraphs}
                              <span onClick={() => descriptionMore === false ? setDescriptionMore(true) : setDescriptionMore(false)}>{descriptionMore === false ? 'Show more' : 'Show less'}</span>
                           </p>
                        </div>
                     ))
               }
            </div>
         </div>

         <div className="hotel-amenities-section">
            <div className="section-header-wrapper">
               {
                  hotel ?
                     <h3 className='section-header-text'>Amenities</h3>
                     :
                     <Skeleton variant="rounded" width={'76px'} height={'20px'} />
               }

               {
                  hotel ?
                     <span className='see-all-amenities' onClick={() => setAmenitiesModal(amenitiesModal === false && true)}>See all</span>
                     :
                     <Skeleton variant="rounded" width={'50px'} height={'20px'} />
               }

            </div>

            <div className="list-area">
               {
                  hotel ?
                     <div className="single-list-item">
                        <img src={Parking} alt="" />
                        <span>Parking</span>
                     </div>
                     :
                     <Skeleton variant="rounded" style={{ flex: '1' }} height={'96px'} />
               }

               {
                  hotel ?
                     <div className="single-list-item">
                        <img src={Service} alt="" />
                        <span>Room Service</span>
                     </div>
                     :
                     <Skeleton variant="rounded" style={{ flex: '1' }} height={'96px'} />
               }

               {
                  hotel ?
                     <div className="single-list-item">
                        <img src={Breakfast} alt="" />
                        <span>Breakfast</span>
                     </div>
                     :
                     <Skeleton variant="rounded" style={{ flex: '1' }} height={'96px'} />
               }

               {
                  hotel ?
                     <div className="single-list-item">
                        <img src={Wifi} alt="" />
                        <span>Free Wi-Fi</span>
                     </div>
                     :
                     <Skeleton variant="rounded" style={{ flex: '1' }} height={'96px'} />
               }
            </div>
         </div>

         <div className="hotel-map-area">
            {
               hotel ?
                  <h3 className='section-header-text'>Location</h3>
                  :
                  <Skeleton variant="rounded" width={'80px'} height={'24px'} style={{ marginBottom: '16px' }} />
            }


            <div className="map-inner">

               {
                  hotel ?
                     <div id='map'></div>
                     :
                     <Skeleton variant="rounded" width={'100%'} height={'100%'} />
               }

            </div>
         </div>

      </div>
   )
}

export default Details