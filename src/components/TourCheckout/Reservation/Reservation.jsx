import React from 'react';
import './reservation.scss';


const Reservation = ({ tourCheckOutData }) => {

   return (
      <div className="hotel-checkout-reservation-wrapper">
         <div className="hotel-info-wrapper">
            <div className="hotel-image"
             style={{ background: `url('https://cdn.monkigo.com/tours/${tourCheckOutData?.info[0].id}/1.jpg')` }}
            ></div>

            <div className="hotel-header-name">
               <h3>{tourCheckOutData?.info[0].name}</h3>

            </div>
            <div className="date-wrapper">
               <div className="check-in">
                  <span>Date</span>
                  <h3>{tourCheckOutData?.eventDate}</h3>
               </div>
               <div className="check-out">

                  <span>Time</span>

                  <h3>{tourCheckOutData?.info[0].time}</h3>

               </div>
            </div>
         </div>

         <div className="price-info-wrapper">
            <ul>
               <li>
                  <span>{tourCheckOutData?.info[0].name}</span>
                  <span>${tourCheckOutData?.info[0].price}</span>
               </li>
            </ul>
            <div className="total-area">
               <span>Total</span>
               <h3>${tourCheckOutData?.info[0].price}</h3>
            </div>
         </div>
      </div>
   )
}

export default Reservation