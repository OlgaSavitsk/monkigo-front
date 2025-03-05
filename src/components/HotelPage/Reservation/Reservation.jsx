import React from 'react';
import './reservation.scss';

////IMPORT MUI
import Skeleton from '@mui/material/Skeleton';



const Reservation = ({ hotel }) => {

   function CalculateNights() {
      var dateArray1 = localStorage.getItem('cin').split('-');
      var dateArray2 = localStorage.getItem('cout').split('-');
      
      var date1 = new Date(parseInt(dateArray1[2]),parseInt(dateArray1[0]-1),parseInt(dateArray1[1]));
      var date2 = new Date(parseInt(dateArray2[2]),parseInt(dateArray2[0]-1),parseInt(dateArray2[1]));

      var diff = date2 - date1;
      return Math.abs(Math.ceil(diff / (1000 * 3600 * 24)));
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
      <div className="reservation-wrapper">
         <div className="price-details">
            <ul>
               <li>
                  {
                     hotel ?
                        <span className="details-name">{CalculateNights()} {CalculateNights() > 1 ? 'nights' : 'night'} x {CalculateRooms()} {CalculateRooms() > 1 ? 'rooms' : 'room'}</span>
                        :
                        <Skeleton variant="rounded" width={'115px'} height={'18px'} />
                  }

                  {/* {
                     hotel ?
                        <span className="detail-price">${CalculateRooms()>1 ? CalculateRooms()*hotel.price : hotel.price}</span>
                        :
                        <Skeleton variant="rounded" width={'53px'} height={'18px'} />
                  } */}


               </li>
               {/* <li>
                  {
                     hotel ?
                        <span className="details-name">Taxes</span>
                        :
                        <Skeleton variant="rounded" width={'38px'} height={'18px'} />
                  }

                  {
                     hotel ?
                        <span className="detail-price">$52.41</span>
                        :
                        <Skeleton variant="rounded" width={'35px'} height={'18px'} />
                  }


               </li> */}
            </ul>
         </div>
         <div className="total-area">
            {
               hotel ?
                  <span>Total</span>
                  :
                  <Skeleton variant="rounded" width={'33px'} height={'18px'} />
            }

            {
               hotel ?
                  <div className="price-wrapper">
                     <h3>${CalculateDetailTotal(hotel.price)}</h3>
                  </div>
                  :
                  <Skeleton variant="rounded" width={'80px'} height={'20px'} />
            }


         </div>

         <div className="select-rooms-button">
            {
               hotel ?
                  <button type='button' onClick={
                     ()=>{
                        window.scrollTo(document.getElementById('roomsView').offsetLeft, document.getElementById('roomsView').offsetTop);
                     }
                  }>Select Rooms</button>
                  :
                  <Skeleton variant="rounded" width={'100%'} height={'52px'} style={{ borderRadius: '12px' }} />
            }

         </div>
      </div>
   )
}

export default Reservation