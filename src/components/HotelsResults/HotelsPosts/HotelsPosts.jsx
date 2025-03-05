import React, { useEffect, useState, useRef } from 'react';
import './hotelsposts.scss';

////IMPORT MUI
import Skeleton from '@mui/material/Skeleton';

//IMPORT IMAGES
import Star from '../../../assets/hotels/star.png';
import Location from '../../../assets/hotels/location.png';
import NoResult from '../../../assets/hotels/no-result.png';


const HotelsPosts = ({ filterDetails, allHotels }) => {

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


   return (
      <div className="hotels-results-posts">
         {
            allHotels !== null || allHotels !== undefined || allHotels.length === 0 ?
               <div className="popularity-area">
                  <ul>
                     <li
                        className='most-popular'
                        style={{ color: filterDetails.popularityContent === 1 ? '#274DE0' : '#101010' }}
                        onClick={() => { filterDetails.setPopularityContent(1); filterDetails.setPostState(true); }}
                     >
                        Most popular
                     </li>
                     <div className="line--1 line">
                        <div className="divide-1 divide"></div>
                     </div>
                     <li
                        className='lowest-price'
                        style={{ color: filterDetails.popularityContent === 2 ? '#274DE0' : '#101010' }}
                        onClick={() => { filterDetails.setPopularityContent(2); filterDetails.setPostState(true); }}
                     >
                        Lowest Price
                     </li>
                     <div className="line--2 line">
                        <div className="divide-1 divide"></div>
                     </div>
                     <li
                        className='highest-star'
                        style={{ color: filterDetails.popularityContent === 3 ? '#274DE0' : '#101010' }}
                        onClick={() => { filterDetails.setPopularityContent(3); filterDetails.setPostState(true); }}
                     >
                        Highest star rating
                     </li>
                  </ul>
               </div>
               :
               <Skeleton variant="rounded" width={'100%'} height={'68px'} style={{ marginBottom: '16px' }} />

         }


         <div className="hotels-posts-inner">

            {

               allHotels === null || allHotels === undefined ?

                  <div className="skeleton-wrapper" style={{ width: '100%' }}>

                     <div className="single-hotels-post">

                        <div className="single-post-image-wrapper">
                           <Skeleton variant="rounded" width={'100%'} height={'100%'} style={{ borderRadius: '10px' }} />
                        </div>

                        <div className="single-post-details-wrapper">
                           <div className="details-header-wrapper">
                              <div className="details-header-wrapper-inner">
                                 <div className="title">
                                    <Skeleton variant="text" sx={{ fontSize: '19.2px', marginRight: '32px', width: '100%', height: '24px' }} />
                                 </div>
                                 <div className="level">
                                    <Skeleton variant="text" sx={{ fontSize: '14px', width: '70px', height: '14px' }} />
                                 </div>
                              </div>
                              <div className="details-header-review-wrapper">
                                 <Skeleton variant="circular" width={40} height={40} style={{ marginRight: '10px' }} />
                                 <div className="review-wrapper">
                                    <div className="review-text">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                    <div className="review-number">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="details-body-wrapper">
                              <div className="location-text">
                                 <Skeleton variant="rounded" width={'100%'} height={'35px'} />

                              </div>
                           </div>

                           <div className="details-footer-wrapper">
                              <div className="details-footer-wrapper-inner">
                                 <Skeleton variant="circular" width={40} height={40} style={{ marginRight: '10px' }} />
                                 <div className="review-wrapper">
                                    <div className="review-text">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                    <div className="review-number">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                 </div>
                              </div>

                              <div className="price-text">
                                 <Skeleton variant="text" sx={{ fontSize: '19.2px', width: '100%' }} />
                                 <Skeleton variant="text" sx={{ fontSize: '12px', width: '75px' }} />
                              </div>
                           </div>

                           <div className="details-continue-button">
                              <Skeleton variant="rounded" width={'100%'} height={'100%'} />
                           </div>
                        </div>

                        <div className="single-post-price-wrapper">
                           <div className="price-text">
                              <Skeleton variant="text" sx={{ fontSize: '19.2px', width: '100%', height: '30px', marginBottom: '0 !important' }} />
                              <Skeleton variant="text" sx={{ fontSize: '12px', width: '75px', height: '15px', marginBottom: '3px !important' }} />
                           </div>

                           <div className="continue-button">
                              <Skeleton variant="rounded" width={'100%'} height={'100%'} />
                           </div>
                        </div>
                     </div>

                     <div className="single-hotels-post">

                        <div className="single-post-image-wrapper">
                           <Skeleton variant="rounded" width={'100%'} height={'100%'} style={{ borderRadius: '10px' }} />
                        </div>

                        <div className="single-post-details-wrapper">
                           <div className="details-header-wrapper">
                              <div className="details-header-wrapper-inner">
                                 <div className="title">
                                    <Skeleton variant="text" sx={{ fontSize: '19.2px', marginRight: '32px', width: '100%', height: '24px' }} />
                                 </div>
                                 <div className="level">
                                    <Skeleton variant="text" sx={{ fontSize: '14px', width: '70px', height: '14px' }} />
                                 </div>
                              </div>
                              <div className="details-header-review-wrapper">
                                 <Skeleton variant="circular" width={40} height={40} style={{ marginRight: '10px' }} />
                                 <div className="review-wrapper">
                                    <div className="review-text">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                    <div className="review-number">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="details-body-wrapper">
                              <div className="location-text">
                                 <Skeleton variant="rounded" width={'100%'} height={'35px'} />

                              </div>
                           </div>

                           <div className="details-footer-wrapper">
                              <div className="details-footer-wrapper-inner">
                                 <Skeleton variant="circular" width={40} height={40} style={{ marginRight: '10px' }} />
                                 <div className="review-wrapper">
                                    <div className="review-text">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                    <div className="review-number">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                 </div>
                              </div>
                              <div className="price-text">
                                 <Skeleton variant="text" sx={{ fontSize: '19.2px', width: '100%' }} />
                                 <Skeleton variant="text" sx={{ fontSize: '12px', width: '75px' }} />
                              </div>
                           </div>

                           <div className="details-continue-button">
                              <Skeleton variant="rounded" width={'100%'} height={'100%'} />
                           </div>
                        </div>

                        <div className="single-post-price-wrapper">
                           <div className="price-text">
                              <Skeleton variant="text" sx={{ fontSize: '19.2px', width: '100%', height: '30px', marginBottom: '0 !important' }} />
                              <Skeleton variant="text" sx={{ fontSize: '12px', width: '75px', height: '15px', marginBottom: '3px !important' }} />
                           </div>

                           <div className="continue-button">
                              <Skeleton variant="rounded" width={'100%'} height={'100%'} />
                           </div>
                        </div>
                     </div>

                     <div className="single-hotels-post">

                        <div className="single-post-image-wrapper">
                           <Skeleton variant="rounded" width={'100%'} height={'100%'} style={{ borderRadius: '10px' }} />
                        </div>

                        <div className="single-post-details-wrapper">
                           <div className="details-header-wrapper">
                              <div className="details-header-wrapper-inner">
                                 <div className="title">
                                    <Skeleton variant="text" sx={{ fontSize: '19.2px', marginRight: '32px', width: '100%', height: '24px' }} />
                                 </div>
                                 <div className="level">
                                    <Skeleton variant="text" sx={{ fontSize: '14px', width: '70px', height: '14px' }} />
                                 </div>
                              </div>
                              <div className="details-header-review-wrapper">
                                 <Skeleton variant="circular" width={40} height={40} style={{ marginRight: '10px' }} />
                                 <div className="review-wrapper">
                                    <div className="review-text">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                    <div className="review-number">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="details-body-wrapper">
                              <div className="location-text">
                                 <Skeleton variant="rounded" width={'100%'} height={'35px'} />

                              </div>
                           </div>

                           <div className="details-footer-wrapper">
                              <div className="details-footer-wrapper-inner">
                                 <Skeleton variant="circular" width={40} height={40} style={{ marginRight: '10px' }} />
                                 <div className="review-wrapper">
                                    <div className="review-text">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                    <div className="review-number">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                 </div>
                              </div>
                              <div className="price-text">
                                 <Skeleton variant="text" sx={{ fontSize: '19.2px', width: '100%' }} />
                                 <Skeleton variant="text" sx={{ fontSize: '12px', width: '75px' }} />
                              </div>
                           </div>

                           <div className="details-continue-button">
                              <Skeleton variant="rounded" width={'100%'} height={'100%'} />
                           </div>
                        </div>

                        <div className="single-post-price-wrapper">
                           <div className="price-text">
                              <Skeleton variant="text" sx={{ fontSize: '19.2px', width: '100%', height: '30px', marginBottom: '0 !important' }} />
                              <Skeleton variant="text" sx={{ fontSize: '12px', width: '75px', height: '15px', marginBottom: '3px !important' }} />
                           </div>

                           <div className="continue-button">
                              <Skeleton variant="rounded" width={'100%'} height={'100%'} />
                           </div>
                        </div>
                     </div>

                     <div className="single-hotels-post">

                        <div className="single-post-image-wrapper">
                           <Skeleton variant="rounded" width={'100%'} height={'100%'} style={{ borderRadius: '10px' }} />
                        </div>

                        <div className="single-post-details-wrapper">
                           <div className="details-header-wrapper">
                              <div className="details-header-wrapper-inner">
                                 <div className="title">
                                    <Skeleton variant="text" sx={{ fontSize: '19.2px', marginRight: '32px', width: '100%', height: '24px' }} />
                                 </div>
                                 <div className="level">
                                    <Skeleton variant="text" sx={{ fontSize: '14px', width: '70px', height: '14px' }} />
                                 </div>
                              </div>
                              <div className="details-header-review-wrapper">
                                 <Skeleton variant="circular" width={40} height={40} style={{ marginRight: '10px' }} />
                                 <div className="review-wrapper">
                                    <div className="review-text">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                    <div className="review-number">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="details-body-wrapper">
                              <div className="location-text">
                                 <Skeleton variant="rounded" width={'100%'} height={'35px'} />

                              </div>
                           </div>

                           <div className="details-footer-wrapper">
                              <div className="details-footer-wrapper-inner">
                                 <Skeleton variant="circular" width={40} height={40} style={{ marginRight: '10px' }} />
                                 <div className="review-wrapper">
                                    <div className="review-text">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                    <div className="review-number">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                 </div>
                              </div>
                              <div className="price-text">
                                 <Skeleton variant="text" sx={{ fontSize: '19.2px', width: '100%' }} />
                                 <Skeleton variant="text" sx={{ fontSize: '12px', width: '75px' }} />
                              </div>
                           </div>

                           <div className="details-continue-button">
                              <Skeleton variant="rounded" width={'100%'} height={'100%'} />
                           </div>
                        </div>

                        <div className="single-post-price-wrapper">
                           <div className="price-text">
                              <Skeleton variant="text" sx={{ fontSize: '19.2px', width: '100%', height: '30px', marginBottom: '0 !important' }} />
                              <Skeleton variant="text" sx={{ fontSize: '12px', width: '75px', height: '15px', marginBottom: '3px !important' }} />
                           </div>

                           <div className="continue-button">
                              <Skeleton variant="rounded" width={'100%'} height={'100%'} />
                           </div>
                        </div>
                     </div>

                     <div className="single-hotels-post">

                        <div className="single-post-image-wrapper">
                           <Skeleton variant="rounded" width={'100%'} height={'100%'} style={{ borderRadius: '10px' }} />
                        </div>

                        <div className="single-post-details-wrapper">
                           <div className="details-header-wrapper">
                              <div className="details-header-wrapper-inner">
                                 <div className="title">
                                    <Skeleton variant="text" sx={{ fontSize: '19.2px', marginRight: '32px', width: '100%', height: '24px' }} />
                                 </div>
                                 <div className="level">
                                    <Skeleton variant="text" sx={{ fontSize: '14px', width: '70px', height: '14px' }} />
                                 </div>
                              </div>
                              <div className="details-header-review-wrapper">
                                 <Skeleton variant="circular" width={40} height={40} style={{ marginRight: '10px' }} />
                                 <div className="review-wrapper">
                                    <div className="review-text">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                    <div className="review-number">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="details-body-wrapper">
                              <div className="location-text">
                                 <Skeleton variant="rounded" width={'100%'} height={'35px'} />

                              </div>
                           </div>

                           <div className="details-footer-wrapper">
                              <div className="details-footer-wrapper-inner">
                                 <Skeleton variant="circular" width={40} height={40} style={{ marginRight: '10px' }} />
                                 <div className="review-wrapper">
                                    <div className="review-text">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                    <div className="review-number">
                                       <Skeleton variant="text" sx={{ fontSize: '14px', width: '75px' }} />
                                    </div>
                                 </div>
                              </div>
                              <div className="price-text">
                                 <Skeleton variant="text" sx={{ fontSize: '19.2px', width: '100%' }} />
                                 <Skeleton variant="text" sx={{ fontSize: '12px', width: '75px' }} />
                              </div>
                           </div>

                           <div className="details-continue-button">
                              <Skeleton variant="rounded" width={'100%'} height={'100%'} />
                           </div>
                        </div>

                        <div className="single-post-price-wrapper">
                           <div className="price-text">
                              <Skeleton variant="text" sx={{ fontSize: '19.2px', width: '100%', height: '30px', marginBottom: '0 !important' }} />
                              <Skeleton variant="text" sx={{ fontSize: '12px', width: '75px', height: '15px', marginBottom: '3px !important' }} />
                           </div>

                           <div className="continue-button">
                              <Skeleton variant="rounded" width={'100%'} height={'100%'} />
                           </div>
                        </div>
                     </div>
                  </div>
                  : allHotels.length === 0 ?
                     <div className="no-result-wrapper">
                        <img src={NoResult} alt="" />
                        <h3>No available results found</h3>
                        <span>Please try removing some filters
                           and searching again.</span>
                     </div>
                     : null

            }

            {
               allHotels && allHotels.map((h, i) => (
                  <div className="single-hotels-post" key={i}
                     onClick={(e) => {

                        switch (h.hid) {
                           case '9b77237d8ddf4ad2a170c740274daff8':
                                 window.open(`https://monkigo.com/app/v1/iac2023/hotels/redirect?token=${localStorage.getItem('token')}&hid=${h.hid}&t=${Math.random()}`,'_blank');
                              break;
                           default:
                              window.open(`/hotel?hid=${h.hid}`, '_blank');
                        }
                     }}
                  >

                     <div className="single-post-image-wrapper">
                        <div className="image-inner" style={{ background: `url(${h.img[0].replace('{size}', 'x500')})` }}></div>
                     </div>

                     <div className="single-post-details-wrapper">
                        <div className="details-header-wrapper">
                           <div className="details-header-wrapper-inner">
                              <div className="title">
                                 <h2>{h.name}</h2>
                              </div>
                              <div className="level">
                                 {
                                    starLoop(h.star).map((i) => {
                                       return <img key={i} src={Star} alt="star" />
                                    })
                                 }
                              </div>
                           </div>
                           <div className="details-header-review-wrapper">
                              <div className="hotel-point">
                                 <span>{h.rating.length > 2 ? `${h.rating}` : `${h.rating}.0`}</span>
                              </div>
                              <div className="review-wrapper">
                                 <div className="review-text">
                                    <h3>{
                                       h.rating < 3 ? 'Bad'
                                          : h.rating < 5 ? 'Not Bad'
                                             : h.rating < 8 ? 'Good'
                                                : h.rating <= 10 ? 'Very Good'
                                                   : null
                                    }</h3>
                                 </div>
                                 <div className="review-number">
                                    <p>{h.reviews} reviews</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="details-body-wrapper">
                           <div className="location-img">
                              <img src={Location} alt="" />
                           </div>
                           <div className="location-text">
                              <span>{`${h.district} — ${h.distance} from Congress venue`}</span>
                           </div>
                        </div>

                        <div className="details-footer-wrapper">
                           <div className="details-footer-wrapper-inner">
                              <div className="hotel-point">
                                 <span>{h.rating.length > 1 ? `${h.rating}` : `${h.rating}`}</span>
                              </div>

                              <div className="review-wrapper">
                                 <div className="review-text">
                                    <h3>{
                                       h.rating < 3 ? 'Bad'
                                          : h.rating < 5 ? 'Not Bad'
                                             : h.rating < 8 ? 'Good'
                                                : h.rating <= 10 ? 'Very Good'
                                                   : null
                                    }</h3>
                                 </div>
                                 <div className="review-number">
                                    <p>{h.reviews} reviews</p>
                                 </div>
                              </div>
                           </div>

                           {
                              h.hid === '9b77237d8ddf4ad2a170c740274daff8' ?
                                 <span className='promo-code-area' style={{
                                    display: 'none',
                                    fontSize: '15px',
                                    lineHeight: '17.5px',
                                    color: '#101010',
                                    fontWeight: 500,
                                    textAlign: 'right',
                                    maxWidth: '170px',
                                    width: '100%'
                                 }}>Click the button and use <a href="" style={{ color: '#274de0', fontWeight: 600, textDecoration: 'none' }}>PROMO CODE: 231001AZE</a> for discount</span>
                                 :
                                 null
                           }


                           {
                              h.hid !== '9b77237d8ddf4ad2a170c740274daff8' ?
                                 <div className="price-text">
                                    <h3>${CalculateRooms() > 1 ? CalculateRooms() * h.price : h.price}</h3>
                                    <span>{CalculateNights() === 0 ? '1 night' : CalculateNights() > 1 ? CalculateNights() + ' night' : CalculateNights() + ' nights'}, {CalculateRooms()} {CalculateRooms() > 1 ? 'rooms' : 'room'}</span>
                                 </div>
                                 :
                                 null
                           }
                        </div>

                        <div className="details-continue-button">
                           <a href={`/hotel?hid=${h.hid}`}><button type='button'>Continue</button></a>
                        </div>

                     </div>

                     <div className="single-post-price-wrapper">

                        {
                           h.hid !== '9b77237d8ddf4ad2a170c740274daff8' ?
                              <div className="price-text">
                                 <h3>${CalculateRooms() > 1 ? CalculateRooms() * h.price : h.price}</h3>
                                 <span>{CalculateNights() === 0 ? '1 night' : CalculateNights() > 1 ? CalculateNights() + ' nights' : CalculateNights() + ' night'}, {CalculateRooms()} {CalculateRooms() > 1 ? 'rooms' : 'room'}</span>
                              </div>
                              :
                              null
                        }


                        {
                           h.hid === '9b77237d8ddf4ad2a170c740274daff8' ?
                              <span className='promo-code-area' style={{
                                 fontSize: '15px',
                                 lineHeight: '17.5px',
                                 color: '#101010',
                                 fontWeight: 500,
                                 textAlign: 'center',
                                 marginBottom: '24px'
                                 // position: 'absolute',
                                 // top: '50%',
                                 // transform: 'translateY(-50%)'
                              }}>Click the button and use <a href="" style={{ color: '#274de0', fontWeight: 600, textDecoration: 'none' }}>PROMO CODE: 231001AZE</a> for discount</span>
                              :
                              null
                        }

                        <div className="continue-button">
                           {
                              <button type='button'>Continue</button>
                           }
                        </div>

                     </div>
                  </div>
               ))
            }

         </div>
      </div >
   )
}

export default HotelsPosts