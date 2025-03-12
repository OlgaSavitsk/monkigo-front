import React from 'react';
import { formatDate } from '../../../utils';
import './reservation.scss';


const Reservation = ({ tourCheckOutData }) => {

   return (
      <div className="hotel-checkout-reservation-wrapper">
         <div className="hotel-info-wrapper">
            <div className="hotel-image"
             style={{ background: `url('https://cdn.monkigo.com/tours/${tourCheckOutData?.id}/1.jpg')` }}
            ></div>

            <div className="hotel-header-name">
               <h3>{tourCheckOutData?.name}</h3>

            </div>
            <div className="date-wrapper">
               <div className="check-in">
                  <span>Date</span>
                  <h3>{tourCheckOutData?.eventDate && formatDate(tourCheckOutData?.eventDate)}</h3>
               </div>
               <div className="check-out">

                  <span>Time</span>

                  <h3>{tourCheckOutData?.time}</h3>

               </div>
            </div>
         </div>

         <div className="price-info-wrapper">
            <ul>
               <li>
                  <span>{tourCheckOutData?.name}</span>
                  <span>${tourCheckOutData?.price}</span>
               </li>
            </ul>
            <div className="total-area">
               <span>Total</span>
               <h3>${tourCheckOutData?.price}</h3>
            </div>
         </div>
      </div>
   )
}

export default Reservation