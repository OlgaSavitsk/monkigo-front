import React, { useState, useEffect, useRef } from 'react';
import './details.scss';

///IMPORT AUTO ANIMATE
import autoAnimate from '@formkit/auto-animate';

import $ from 'jquery';


const Details = ({ tourCheckOutData }) => {

   ///AUTO ANIMATE
   const parent = useRef(null);

   useEffect(() => {
      parent.current && autoAnimate(parent.current)
   }, [parent]);



   function PostData(type) {
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
         tourID:new URLSearchParams(window.location.search).get('id'),
         name:nameElement.value,
         lastName:lastNameElement.value,
         email:emailElement.value
      };

      if (type === 'T') {
         $.ajax({
            method: 'POST',
            url: `https://monkigo.com/app/v1/iac2023/social/tour/booking?token=${localStorage.getItem('token')}`,
            data: orderData,
            dataType: 'json',
            success: function (data) {
              
               window.location.href = `https://monkigo.com/app/v1/payments/v2/pay?token=${localStorage.getItem('token')}&source=iac&target=card&type=2&data=${data.data.id}`
            }
         });
      }
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

                  <h3>{tourCheckOutData?.eventDate}</h3>
               </div>
               <div className="check-out">
                  <span>Time</span>

                  <h3>{tourCheckOutData?.info[0].time}</h3>
               </div>
            </div>
         </div>

         <div className="contact-details-wrapper">
            <h3>Contact details</h3>

            <div className="email-wrapper">
               <label htmlFor="email">E-mail adress</label>

               <input type="email" defaultValue={tourCheckOutData?.info[0].user[0].email} id="email" />
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
                     <input type="text" defaultValue={tourCheckOutData?.info[0].user[0].name} id="name" />
                  </div>

                  <div className="surname-wrapper">
                     <label htmlFor="surname">Surname</label>
                     <input type="text" defaultValue={tourCheckOutData?.info[0].user[0].lastName} id="surname" />
                  </div>
               </div>
            </div>
         </div>

         <div className="reverse-button-wrapper">
            <button onClick={()=>{PostData('T')}} type='button'>Reserve ${tourCheckOutData?.info[0].price}</button>
         </div>
      </div>
   )
}

export default Details