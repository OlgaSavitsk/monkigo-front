import React, { useState, useEffect, useRef } from 'react';
import './details.scss';

///IMPORT AUTO ANIMATE
import autoAnimate from '@formkit/auto-animate';

import $ from 'jquery';
import { formatDate } from '../../../utils';
import { config } from '../../../config';
import { refreshToken } from '../../Security/authService';

const baseURL = config.baseURL;

const Details = ({ tourCheckOutData }) => {
   const [email, setEmail] = useState('');
   const [surname, setSurname] = useState('');

   ///AUTO ANIMATE
   const parent = useRef(null);

   useEffect(() => {
      parent.current && autoAnimate(parent.current)

         const user = JSON.parse(localStorage.getItem("user"));
         if (user) {
            setEmail(user.email || '');
            setSurname(user.lastName || ''); 
         }
   }, []);

   function PostData(type) {
      var user = JSON.parse(localStorage.getItem("user"));
      var orderData = {};
      var emailElement = document.getElementById('email');
      var nameElement = document.getElementById('name');
      var lastNameElement = document.getElementById('surname');
     
      if(nameElement.value.trim()){
         nameElement.style.border = '1px solid #E5E5E5';         
      }
      else{
         nameElement.style.border = '1px solid red';    
         return;
      }

      if(lastNameElement.value.trim()){
         lastNameElement.style.border = '1px solid #E5E5E5';         
      }
      else{
         lastNameElement.style.border = '1px solid red';    
         return;
      }

      if(emailElement.value.trim()){
         emailElement.style.border = '1px solid #E5E5E5';         
      }
      else{
         emailElement.style.border = '1px solid red';    
         return;
      }
      orderData = {
         book_type: "TOUR",
         book_entity_ids: [tourCheckOutData.id],
         currency: "USD",
         amount: tourCheckOutData.price
     }

      if (type === 'T') {
         sendOrderRequest(orderData, user?.token);
      }
   }

   function sendOrderRequest(orderData, token) {
      $.ajax({
         method: 'POST',
         url: `${baseURL}/app/v1/payment/iac`,
         data: JSON.stringify(orderData),
         dataType: 'json',
         contentType: 'application/json',
         headers: {
            'x-auth-key': token
         },
         success: function ({ data }) {
            window.location.href = `${data}`;
         },
         error: function (xhr) {
            console.error(xhr);
            if (xhr.status === 401) {
               refreshToken(
                     (newToken) => {
                        sendOrderRequest(orderData, newToken);
                     },
                     (errorMessage) => {
                        console.error(errorMessage);
                     }
               );
            } else {
               window.location.href = '/auth';
            }
         }
      });
  }

   return (
      <div className="tour-checkout-details-wrapper">

         <div className="tour-info-wrapper">
            <div className="tour-header-name">
               <h3>Social Tour</h3>
            </div>

            <div className="date-wrapper">
               <div className="check-in">
                  <span>Date</span>

                  <h3>{tourCheckOutData?.eventDa && formatDate(tourCheckOutData?.eventDa)}</h3>
               </div>
               <div className="check-out">
                  <span>Time</span>

                  <h3>{tourCheckOutData?.time}</h3>
               </div>
            </div>
         </div>

         <div className="contact-details-wrapper">
            <h3>Contact details</h3>

            <div className="email-wrapper">
               <label htmlFor="email">E-mail adress</label>

               <input type="email" defaultValue={email} id="email" />
            </div>
         </div>

         <div className="primary-passenger-wrapper">
            <div className="form-area">
               <div className="form-header-text">
                  <h3>Primary Attendant</h3>
               </div>
               <div className="name-surname-wrapper">
                  <div className="name-wrapper">
                     <label htmlFor="name">Given name</label>
                     <input type="text" defaultValue={tourCheckOutData?.name} id="name" />
                  </div>

                  <div className="surname-wrapper">
                     <label htmlFor="surname">Surname</label>
                     <input type="text" defaultValue={surname} id="surname" />
                  </div>
               </div>
            </div>
         </div>

         <div className="reverse-button-wrapper">
            <button onClick={()=>{PostData('T')}} type='button'>Reserve ${tourCheckOutData?.price}</button>
         </div>
      </div>
   )
}

export default Details