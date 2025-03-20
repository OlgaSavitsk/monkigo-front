import React, { useEffect, useState } from 'react';
import './paymentstatustour.scss';
import $ from 'jquery';

////IMPORT COMPONENT
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';

////IMPORT MUI
import Skeleton from '@mui/material/Skeleton';

////IMPORT IMAGES
import MonkeySuccessful from '../../assets/payment-status/monkey.png';
import MonkeyUnSuccessful from '../../assets/payment-status/monkey-unsuccessful.png';


const PaymentStatus = () => {
   const { userData } = useAuth()

   const [orderData, setOrderData] = useState(null);

   useEffect(() => {
      const bookingCode = new URLSearchParams(window.location.search).get('bookingCode');
      setOrderData(bookingCode)
   }, []);

   function SendConfirmEmail() {
      $.ajax({
         method: 'POST',
         url: 'https://monkigo.com/app/v1/iac2023/social/tour/booking/confirm',
         data: {
            token: localStorage.getItem('token'),
            o: new URLSearchParams(window.location.search).get('o')
         },
         dataType: 'json'
      });
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
                           orderData ?
                              <img src={MonkeySuccessful} alt="" />
                              :
                              <img src={MonkeyUnSuccessful} alt="" />
                           :
                           <Skeleton variant="rounded" width={'100%'} height={'200px'} style={{ marginBottom: '20px' }} />

                     }
                     <div className="text-area-inner">
                        {
                           orderData !== null & orderData !== undefined ?
                              <h3>{orderData ? 'Your reservation is confirmed.' : 'Your payment is unsuccessful'}</h3>
                              :
                              <Skeleton variant="rounded" width={'100%'} height={'20px'} style={{ marginBottom: '20px' }} />
                        }
                        {
                           orderData !== null & orderData !== undefined ?
                              <span>{orderData  ? `You will get a confirmation e-mail and all the details to the given address: ${userData?.email}` : 
                               'Please ensure you have sufficient funds in your account and you do not exceed your credit limit.'                   
                              }</span>
                              :
                              <Skeleton variant="rounded" width={'100%'} height={'20px'} style={{ marginBottom: '20px' }} />
                        }


                        {/* {

                           orderData?.payStatus === true  ?
                              <a href="#">{orderData?.email}</a>                 
                              :
                              null        
                        } */}
                     </div>
                     {
                        orderData !== null && orderData !== undefined ?
                           <button type='button' onClick={() => {
                              window.location.href = `/chat`
                           }}>Get back to the Concierge</button>
                           :
                           <Skeleton variant="rounded" width={'100%'} height={'40px'} style={{ marginBottom: '20px' }} />
                     }

                  </div>
               }

               <div className="payment-info-area">

                  {
                     orderData !== null && orderData !== undefined ?
                        <div className="tour-image" style={{ background: `url('https://cdn.monkigo.com/tours/${orderData.imgID}/1.jpg')` }}></div>
                        :
                        <Skeleton variant="rounded" width={'100%'} height={'200px'} style={{ marginBottom: '20px' }} />
                  }

                  <div className="tour-header-name">
                     {
                        orderData !== null && orderData !== undefined ?
                           <h3>{orderData?.name}</h3>
                           :
                           <Skeleton variant="rounded" width={'100%'} height={'24px'} style={{ marginBottom: '6px' }} />
                     }                              
                  </div>

                  {/* <div className="date-wrapper">
                     <div className="check-in">
                        {
                           orderData !== null && orderData !== undefined ?
                              <span>Date</span>
                              :
                              <Skeleton variant="rounded" width={'58px'} height={'18px'} />
                        }
                        {
                           orderData !== null && orderData !== undefined ?
                              <h3>{orderData.date}</h3>
                              :
                              <Skeleton variant="rounded" width={'117px'} height={'18px'} />
                        }
                     </div>
                     <div className="check-out">
                        {
                           orderData !== null && orderData !== undefined ?
                              <span>Time</span>
                              :
                              <Skeleton variant="rounded" width={'58px'} height={'18px'} />
                        }
                        {
                           orderData !== null && orderData !== undefined ?
                           <h3>{orderData.time}</h3>
                              :
                              <Skeleton variant="rounded" width={'117px'} height={'18px'} />
                        }

                     </div>
                  </div> */}
                  {
                     orderData !== null && orderData !== undefined ?
                        <div className="reservation-code-area">
                           <span>Reservation code</span>
                           <span>{orderData?.toUpperCase()}</span>
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