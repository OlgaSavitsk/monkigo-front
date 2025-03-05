import { React, useEffect } from 'react';
import './rooms.scss';

////IMPORT MUI
import Skeleton from '@mui/material/Skeleton';

///IMPORT IMAGES
import Bed from '../../../assets/hotel-page/bed.svg';
import People from '../../../assets/hotel-page/people.svg';
import Info from '../../../assets/hotel-page/info.svg';

const Rooms = ({ hotel }) => {

   function CalculateNights() {
      var dateArray1 = localStorage.getItem('cin').split('-');
      var dateArray2 = localStorage.getItem('cout').split('-');

      var date1 = new Date(parseInt(dateArray1[2]), parseInt(dateArray1[0] - 1), parseInt(dateArray1[1]));
      var date2 = new Date(parseInt(dateArray2[2]), parseInt(dateArray2[0] - 1), parseInt(dateArray2[1]));

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
      <div className="rooms-wrapper">
         <div className="rooms-wrapper-inner" id='roomsView'>
            {
               hotel ?
                  <h3 className='section-header'>Rooms</h3>
                  :
                  <Skeleton variant="rounded" width={'61px'} height={'24px'} style={{ marginBottom: '16px' }} />
            }

            <div className="all-rooms-layer">
               {
                  hotel?.rooms.map((r, i) => (
                     <div className="single-room-wrapper" key={i}>
                        <div className="header-text">
                           <h3>{r.name}</h3>
                           {/* <Skeleton variant="rounded" width={'133px'} height={'24px'} style={{ marginBottom: '20px' }} /> */}
                        </div>

                        <div className="info-wrapper-1">
                           <ul>
                              <li><img src={Bed} alt="" /><span>{r.bedType}</span></li>
                              {/* <Skeleton variant="rounded" width={'137px'} height={'15px'} style={{ marginBottom: '12px' }} /> */}

                              <li>
                                 {
                                    r.capacity === 1 ?
                                       <div className="image-wrapper">
                                          <img src={People} alt="" />
                                       </div> :
                                       r.capacity === 2 ?
                                          <div className="image-wrapper">
                                             <img src={People} alt="" />
                                             <img src={People} alt="" />
                                          </div>
                                          :
                                          r.capacity === 3 ?
                                             <div className="image-wrapper">
                                                <img src={People} alt="" />
                                                <img src={People} alt="" />
                                                <img src={People} alt="" />
                                             </div>
                                             :
                                             null

                                 }
                                 <span>Suitable for {r.capacity} people</span>
                              </li>
                              {/* <Skeleton variant="rounded" width={'169px'} height={'15px'} /> */}
                              {
                                 r.isBadNot ?
                                    <li><span style={{ color: 'red' }}>Bed type not guaranteed</span></li> :
                                    null
                              }

                           </ul>
                        </div>

                        <div className="info-wrapper-2">
                           <ul>
                              <li>• Breakfast included</li>
                              {/* <Skeleton variant="rounded" width={'93px'} height={'15px'} style={{ marginBottom: '6px' }} /> */}

                              <li>
                                 {
                                    hotel.cancel0 !== null && hotel.cancel50 !== null && hotel.cancel100 !== null ?
                                       <span>• Free cancellation available</span>
                                       :
                                       <span>• Non refundable</span>
                                 }

                                 {
                                    hotel.cancel0 !== null ?
                                       <div className="cancelation-tooltip">
                                          <h3 className='tooltip-header-text'>Cancellation policy</h3>
                                          <ul className='tooltip-body'>
                                             {
                                                hotel.cancel0 !== null && hotel.cancel0 !== undefined ?
                                                   <li>
                                                      <div className="line green"></div>
                                                      <span>{hotel.cancel0}</span>
                                                   </li>
                                                   :
                                                   null
                                             }
                                             {
                                                hotel.cancel50 !== null && hotel.cancel50 !== undefined ?
                                                   <li>
                                                      <div className="line orange"></div>
                                                      <span>{hotel.cancel50}</span>
                                                   </li>
                                                   :
                                                   null
                                             }
                                             {
                                                hotel.cancel100 !== null && hotel.cancel100 !== undefined ?
                                                   <li>
                                                      <div className="line red"></div>
                                                      <span>{hotel.cancel100}</span>
                                                   </li>
                                                   :
                                                   null
                                             }
                                          </ul>
                                       </div>
                                       :
                                       null
                                 }
                                 <img src={Info} alt="" />
                              </li>
                              {/* <Skeleton variant="rounded" width={'161px'} height={'15px'} style={{ marginBottom: '6px' }} /> */}
                           </ul>
                        </div>

                        <div className="footer-area">
                           <div className="price-layer">
                              {
                                 r.totalCount !== 0 ?
                                    <div style={
                                       {
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center'
                                       }}>
                                       <h2>${CalculateRooms() > 1 ? CalculateRooms() * r.price : r.price}</h2>
                                       {
                                          r.totalCount < 10 ?
                                             <span style={{ marginLeft: '5px', fontSize: '14px', color: 'red' }}>{`only ${r.totalCount} left`}</span>
                                             :
                                             null
                                       }

                                    </div>
                                    :
                                    <h2 style={{ fontSize: '16px', color: "red" }}>sold out</h2>
                              }
                              {/* <Skeleton variant="rounded" width={'35px'} height={'24px'} style={{ marginRight: '4px' }} /> */}
                              {
                                 r.totalCount !== 0 ?
                                    <span>{CalculateNights()} {CalculateNights() > 1 ? 'nights' : 'night'}, {CalculateRooms()} {CalculateRooms() > 1 ? 'rooms' : 'room'}</span>
                                    :
                                    null
                              }
                              {/* <Skeleton variant="rounded" width={'39px'} height={'15px'} /> */}

                           </div>
                           {
                              r.totalCount !== 0 ?
                                 <button
                                    type='button'
                                    onClick={() => {
                                       localStorage.setItem('hid', hotel.hid);
                                       window.location.href = '/checkout?rid=' + r.rid
                                    }}
                                 >Reserve</button>
                                 :
                                 null

                           }

                           {/* <Skeleton variant="rounded" width={'117px'} height={'46px'} /> */}

                        </div>
                     </div>
                  ))
               }
            </div>
         </div>
      </div>
   )
}

export default Rooms