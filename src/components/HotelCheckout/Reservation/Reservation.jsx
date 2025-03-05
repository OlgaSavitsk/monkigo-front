import React from 'react';
import './reservation.scss';

////IMPORT MUI
import Skeleton from '@mui/material/Skeleton';

///IMPORT IMAGES

const Reservation = ({ checkOutData }) => {


   function DateNormalize(date) {
      if (date !== undefined) {

         var dateArray = date.split('-');

         var normalizeDate = new Date(parseInt(dateArray[2]),parseInt(dateArray[0])-1,parseInt(dateArray[1]));

         return Intl.DateTimeFormat('en-US',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).format(normalizeDate);
      }
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

   function CalculateNights() {
      var dateArray1 = localStorage.getItem('cin').split('-');
      var dateArray2 = localStorage.getItem('cout').split('-');
      
      var date1 = new Date(parseInt(dateArray1[2]),parseInt(dateArray1[0]-1),parseInt(dateArray1[1]));
      var date2 = new Date(parseInt(dateArray2[2]),parseInt(dateArray2[0]-1),parseInt(dateArray2[1]));

      var diff = date2 - date1;
      return Math.abs(Math.ceil(diff / (1000 * 3600 * 24)));
   }
   
   function CalculateTotal() {
      return   CalculateRooms() * checkOutData.hotel.rooms[0].price;
   }

   return (
      <div className="hotel-checkout-reservation-wrapper">
         <div className="hotel-info-wrapper">
            {
               checkOutData !== null && checkOutData !== undefined ?
                  <div className="hotel-image" style={{ background: `url(${checkOutData.hotel.img[0].replace('{size}', 'x500')})` }}></div>
                  :
                  <Skeleton variant="rounded" width={'100%'} height={'200px'} style={{ marginBottom: '20px' }} />
            }


            <div className="hotel-header-name">
               {
                  checkOutData !== null && checkOutData !== undefined ?
                     <h3>{checkOutData.hotel.name}</h3>
                     :
                     <Skeleton variant="rounded" width={'100%'} height={'24px'} style={{ marginBottom: '6px' }} />
               }
               {
                  checkOutData !== null && checkOutData !== undefined ?
                     <span>{checkOutData.hotel.address}</span>
                     :
                     <Skeleton variant="rounded" width={'100%'} height={'18px'} />
               }

            </div>
            <div className="date-wrapper">
               <div className="check-in">
                  {
                     checkOutData !== null && checkOutData !== undefined ?
                        <span>Check in</span>
                        :
                        <Skeleton variant="rounded" width={'58px'} height={'18px'} />
                  }
                  {
                     checkOutData !== null && checkOutData !== undefined ?
                        <h3>{DateNormalize(localStorage.getItem('cin'))}</h3>
                        :
                        <Skeleton variant="rounded" width={'117px'} height={'18px'} />
                  }

               </div>
               <div className="check-out">

                  {
                     checkOutData !== null && checkOutData !== undefined ?
                        <span>Check out</span>
                        :
                        <Skeleton variant="rounded" width={'58px'} height={'18px'} />
                  }

                  {
                     checkOutData !== null && checkOutData !== undefined ?
                        <h3>{DateNormalize(localStorage.getItem('cout'))}</h3>
                        :
                        <Skeleton variant="rounded" width={'117px'} height={'18px'} />
                  }

               </div>
            </div>
         </div>

         <div className="price-info-wrapper">
            <ul>
               <li>
                  {
                     checkOutData !== null && checkOutData !== undefined ?
                              localStorage.getItem('guestInfo') ? 
                        <span>{CalculateRooms()} {CalculateRooms()>1? 'rooms':'room'} x {CalculateNights()} {CalculateNights()>1? 'nights':'night'}</span>
                        :
                        <span>1 room x {CalculateNights()} nights</span>
                        :
                        <Skeleton variant="rounded" width={'108px'} height={'18px'} />
                  }
               </li>
            </ul>
            <div className="total-area">

               {
                  checkOutData !== null && checkOutData !== undefined ?
                     <span>Total <span style={{fontSize:'12px',color:'#B1B1B1'}}>(Tax included)</span></span> :
                     <Skeleton variant="rounded" width={'33px'} height={'18px'} />
               }
               {
                  checkOutData !== null && checkOutData !== undefined ?
                  <h3>${CalculateTotal()}</h3> :
                  <Skeleton variant="rounded" width={'58px'} height={'18px'} />
               }

            </div>
         </div>
      </div>
   )
}

export default Reservation