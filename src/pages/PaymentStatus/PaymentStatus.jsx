import React, { useEffect, useState } from 'react';
import './paymentstatus.scss';
import $ from 'jquery';

////IMPORT COMPONENT
import Navbar from '../../components/Navbar/Navbar';

////IMPORT MUI
import Skeleton from '@mui/material/Skeleton';

////IMPORT IMAGES
import MonkeySuccessful from '../../assets/payment-status/monkey.png';
import MonkeyUnSuccessful from '../../assets/payment-status/monkey-unsuccessful.png';


const PaymentStatus = () => {

   const [orderData, setOrderData] = useState(null);

   useEffect(() => {
      $.ajax({
         method: 'GET',
         url: 'https://monkigo.com/app/v1/iac2023/hotels/booking/info',
         data: {
            token: localStorage.getItem('token'),
            o: new URLSearchParams(window.location.search).get('o')
         },
         dataType: 'json',
         success: (content) => {         
            if (content?.data?.status){
               SendConfirmEmail();
             }
             if(content?.data?.type ==='resr'){
               SendConfirmReserveEmail();
             }
               
            setOrderData(content.data);
         },
         error: (jqXHR) => {
            if (jqXHR !== null || jqXHR !== undefined) {
               var response = JSON.parse(jqXHR.responseText);
               window.location.href ='/auth';
            }
         }
      });
   }, []);

   function SendConfirmEmail() {
      $.ajax({
         method: 'POST',
         url: 'https://monkigo.com/app/v1/iac2023/hotels/booking/confirm',
         data: {
            token: localStorage.getItem('token'),
            o: new URLSearchParams(window.location.search).get('o')
         },
         dataType: 'json'
      });
   }

   function SendConfirmReserveEmail() {
      $.ajax({
         method: 'POST',
         url: 'https://monkigo.com/app/v1/iac2023/hotels/booking/confirm/reserve',
         data: {
            token: localStorage.getItem('token'),
            o: new URLSearchParams(window.location.search).get('o')
         },
         dataType: 'json'
      });
   }

   function DateNormalize(date) {
      if (date !== undefined) {

         var dateArray = date.split('-');

         var normalizeDate = new Date(parseInt(dateArray[2]),parseInt(dateArray[0])-1,parseInt(dateArray[1]));

         return Intl.DateTimeFormat('en-US',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).format(normalizeDate);
      }
   }

   return (
      <div className="payment-status-section">
         <Navbar />

         <div className="payment-status-body-wrapper">
            <div className="body-wrapper-inner">
               {

                  <div className="payment-text-area">
                     {
                        orderData !== null && orderData !== undefined ?
                           orderData.status === true || orderData.type ==='resr' ?
                              <img src={MonkeySuccessful} alt="" />
                              :
                              <img src={MonkeyUnSuccessful} alt="" />
                           :
                           <Skeleton variant="rounded" width={'100%'} height={'200px'} style={{ marginBottom: '20px' }} />

                     }
                     <div className="text-area-inner">
                        {
                           orderData !== null & orderData !== undefined ?
                              <h3>{orderData.status === true || orderData.type ==='resr' ? 'Your reservation is confirmed.' : 'Your payment is unsuccessful'}</h3>
                              :
                              <Skeleton variant="rounded" width={'100%'} height={'20px'} style={{ marginBottom: '20px' }} />
                        }
                        {
                           orderData !== null & orderData !== undefined ?
                              <span>{orderData.status === true || orderData?.type ==='resr' ? 'You will get a confirmation e-mail and all the details to the given address:' : 
                               'Please ensure you have sufficient funds in your account and you do not exceed your credit limit.'                   
                              }</span>
                              :
                              <Skeleton variant="rounded" width={'100%'} height={'20px'} style={{ marginBottom: '20px' }} />
                        }


                        {

                           orderData?.status === true  ?
                              <a href="#">{orderData?.email}</a>
                              :
                              orderData?.type ==='resr' ?
                              <a href="#">{orderData?.email}</a>
                              :
                              null
                        }
                     </div>
                     {
                        orderData !== null && orderData !== undefined ?
                           <button type='button' onClick={() => {
                              window.location.href = `https://iac.monkigo.com/chat`
                           }}>Get back to the Concierge</button>
                           :
                           <Skeleton variant="rounded" width={'100%'} height={'40px'} style={{ marginBottom: '20px' }} />
                     }

                  </div>
               }

               <div className="payment-info-area">

                  {
                     orderData !== null && orderData !== undefined ?
                        <div className="hotel-image" style={{ background: `url(${orderData?.img.replace('{size}', 'x220')})` }}></div>
                        :
                        <Skeleton variant="rounded" width={'100%'} height={'200px'} style={{ marginBottom: '20px' }} />
                  }

                  <div className="hotel-header-name">
                     {
                        orderData !== null && orderData !== undefined ?
                           <h3>{orderData?.hotelName}</h3>
                           :
                           <Skeleton variant="rounded" width={'100%'} height={'24px'} style={{ marginBottom: '6px' }} />
                     }

                     {
                        orderData !== null && orderData !== undefined ?
                           <span>{orderData?.address}</span>
                           :
                           <Skeleton variant="rounded" width={'100%'} height={'18px'} />
                     }
                  </div>

                  <div className="date-wrapper">
                     <div className="check-in">
                        {
                           orderData !== null && orderData !== undefined ?
                              <span>Check in</span>
                              :
                              <Skeleton variant="rounded" width={'58px'} height={'18px'} />
                        }
                        {
                           orderData !== null && orderData !== undefined ?
                              <h3>{DateNormalize(orderData?.cin)}</h3>
                              :
                              <Skeleton variant="rounded" width={'117px'} height={'18px'} />
                        }
                     </div>
                     <div className="check-out">
                        {
                           orderData !== null && orderData !== undefined ?
                              <span>Check out</span>
                              :
                              <Skeleton variant="rounded" width={'58px'} height={'18px'} />
                        }
                        {
                           orderData !== null && orderData !== undefined ?
                              <h3>{DateNormalize(orderData?.cout)}</h3>
                              :
                              <Skeleton variant="rounded" width={'117px'} height={'18px'} />
                        }

                     </div>
                  </div>
                  {
                     orderData !== null && orderData !== undefined && orderData.status ?
                        <div className="reservation-code-area">
                           <span>Reservation code</span>
                           <span>{orderData?.id.toUpperCase()}</span>
                        </div>
                        : null
                  }
               </div>
            </div>
         </div>
      </div>
   )
}

export default PaymentStatus