import React, { useState, useEffect, useRef } from 'react';
import './details.scss';

///IMPORT AUTO ANIMATE
import autoAnimate from '@formkit/auto-animate';

////IMPORT MUI
import Skeleton from '@mui/material/Skeleton';

import $ from 'jquery';

//import images
import ArrowBlackBottom from '../../../assets/hotel-checkout/arrow-bottom-black.svg';
import AddVisiter from '../../../assets/hotel-checkout/add-visiter.svg';
import Remove from '../../../assets/hotel-checkout/remove.svg';
import Info from '../../../assets/icons/info.svg';

const Details = ({ checkOutData }) => {
   const [maxGuestNumber, setMaxGuestNumber] = useState(7);
   const [guestNumber, setGuestNumber] = useState(1);
   const [guestInfo, setGuestInfo] = useState([]);
   const [nationality, setNationality] = useState(null);


   ///AUTO ANIMATE
   const parent = useRef(null);

   useEffect(() => {
      parent.current && autoAnimate(parent.current)
   }, [parent]);

   useEffect(() => {

      $.ajax({
         method: 'GET',
         url: '/iac2023/hotels/nationalities',
         data: { token: localStorage.getItem('token') },
         dataType: 'json',
         success: function (data) {
            setNationality(data.data);
         },
         error: function (jqXHR) {
            var responseText = JSON.parse(jqXHR.responseText);
            if (responseText.result.code === 403) {
               // open sign in pop-up
            }
         }
      });
      localStorage.getItem('guestInfo') ?
         setMaxGuestNumber(JSON.parse(localStorage.getItem('guestInfo')).adults)
         :
         setMaxGuestNumber(1);
   }, [])

   function addGuest(e) {
      e.preventDefault();
      if (guestNumber < JSON.parse(localStorage.getItem('guestInfo')).adults) {
         setGuestInfo((prev) => [
            ...prev,
            {
               name: '',
               surname: '',
               citizenship: '',
               id: guestInfo.length
            },
         ]);
      }
   }

   function RemoveGuest(gI) {

      setGuestNumber((prev) => prev - 1);
      setGuestInfo(guest =>
         guest.filter((g, index) => JSON.stringify(g) !== JSON.stringify(gI)),
      );
   }

   function DateNormalize(date) {
      if (date !== undefined) {

         var dateArray = date.split('-');

         var normalizeDate = new Date(parseInt(dateArray[2]),parseInt(dateArray[0])-1,parseInt(dateArray[1]));

         return Intl.DateTimeFormat('en-US',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).format(normalizeDate);
      }
   }

   function PostData(type) {
      var orderData = {};
      var primaryGuest = document.querySelector('.form-area');
      var guests = document.querySelectorAll('.other-guest-area .form-area');
      var guestsData = [];
      var guestsInfoData = localStorage.getItem('guestInfo');


      guestsData.push({
         firstName: $(primaryGuest).find('input')[0].value,
         lastName: $(primaryGuest).find('input')[1].value,
         citizenship: $(primaryGuest).find('select')[0].options[$(primaryGuest).find('select')[0].selectedIndex].text
      });

      guests.forEach(element => {
         if ($(element).find('input')[0].value.trim() && $(element).find('input')[1].value.trim()) {
            guestsData.push({
               firstName: $(element).find('input')[0].value,
               lastName: $(element).find('input')[1].value,
               citizenship: $(element).find('select')[0].options[$(element).find('select')[0].selectedIndex].text
            });
         }
      });

      orderData = {
         hid: localStorage.getItem('hid'),
         rid: new URLSearchParams(window.location.search).get('rid'),
         cin: localStorage.getItem('cin'),
         cout: localStorage.getItem('cout'),
         guests: guestsData,
         email: $(document.querySelector('.email-wrapper input')).val(),
         adults: guestsInfoData ? JSON.parse(guestsInfoData).adults : guestsData.length,
         childrens: guestsInfoData ? JSON.parse(guestsInfoData).childrens : 0,
         rooms: guestsInfoData ? JSON.parse(guestsInfoData).rooms : 1,
      };

      if (type === 'P') {
         $.ajax({
            method: 'POST',
            url: `https://monkigo.com/app/v1/iac2023/hotels/booking?token=${localStorage.getItem('token')}`,
            data: orderData,
            dataType: 'json',
            success: function (data) {
               window.location.href = `https://monkigo.com/app/v1/payments/v2/pay?token=${localStorage.getItem('token')}&source=iac&target=card&type=0&data=${data.data.id}`
            }
         });
      }
   }



   return (
      <div className="hotel-checkout-details-wrapper">

         <div className="hotel-info-wrapper">
            {
               checkOutData ?
                  <div className="hotel-header-name">
                     <h3>{checkOutData.hotel.name}</h3>
                     <span>{checkOutData.hotel.address}</span>
                  </div>
                  :
                  <div className="hotel-header-name" style={{ width: '100%' }}>
                     <Skeleton variant="rounded" width={'100%'} height={'24px'} style={{ marginBottom: '6px' }} />

                     <Skeleton variant="rounded" width={'100%'} height={'18px'} />
                  </div>
            }



            <div className="date-wrapper">
               <div className="check-in">
                  {
                     checkOutData ?
                        <span>Check in</span> :
                        <Skeleton variant="rounded" width={'58px'} height={'18px'} />
                  }


                  {
                     checkOutData ?
                        <h3>{DateNormalize(localStorage.getItem('cin'))}</h3>
                        :
                        <Skeleton variant="rounded" width={'117px'} height={'18px'} />
                  }

               </div>
               <div className="check-out">

                  {
                     checkOutData ?
                        <span>Check out</span> :
                        <Skeleton variant="rounded" width={'68px'} height={'18px'} />
                  }


                  {
                     checkOutData ?
                        <h3>{DateNormalize(localStorage.getItem('cout'))}</h3>
                        :
                        <Skeleton variant="rounded" width={'113px'} height={'18px'} />
                  }
               </div>
            </div>
         </div>

         <div className="contact-details-wrapper">
            {
               checkOutData !== null && checkOutData !== undefined ?
                  <h3>Contact details</h3>
                  :
                  <Skeleton variant="rounded" width={'118px'} height={'20px'} style={{ marginBottom: '24px' }} />
            }

            <div className="email-wrapper">
               {
                  checkOutData !== null && checkOutData !== undefined ?
                     <label htmlFor="email">E-mail adress</label>
                     :
                     <Skeleton variant="rounded" width={'88px'} height={'17.5px'} />
               }
               {
                  checkOutData !== null && checkOutData !== undefined && checkOutData.user !== null ?
                     <input type="email" defaultValue={checkOutData?.user?.email} id="email" />
                     :
                     <Skeleton variant="rounded" width={'290px'} height={'49px'} style={{ marginTop: '8px' }} />
               }
            </div>
         </div>

         <div className="primary-passenger-wrapper">
            <div className="form-area">
               <div className="form-header-text">
                  <h3>Primary guest</h3>
               </div>
               <div className="name-surname-wrapper">
                  <div className="name-wrapper">
                     <label htmlFor="name">Given name</label>
                     {
                        checkOutData !== null && checkOutData !== undefined && checkOutData.user !== null ?
                           <input type="text" value={checkOutData?.user?.firstName} id="name" onChange={(e) => { }} />
                           :
                           <input type="text" defaultValue={'Alex'} id="name" />
                     }
                  </div>

                  <div className="surname-wrapper">
                     <label htmlFor="surname">Surname</label>
                     {
                        checkOutData !== null && checkOutData !== undefined && checkOutData.user !== null ?
                           <input type="text" value={checkOutData?.user?.lastName} id="surname" onChange={(e) => { }} />
                           :
                           <input type="text" defaultValue={'Alex'} id="surname" />
                     }
                  </div>
               </div>
               <div className="citizenship-wrapper">
                  <label htmlFor="citizenship">Citizenship</label>
                  <div className="select-wrapper">
                     <img src={ArrowBlackBottom} alt="" />
                     {
                        nationality !== undefined && nationality !== null ?
                           <select name="citizenship" id="citizenship" >
                              {nationality.map((n, i) => (
                                 n.code === 'AZ' ?
                                    <option key={i} defaultValue={n.code} selected>{n.nation}</option>
                                    :
                                    <option key={i} defaultValue={n.code}>{n.nation}</option>
                              ))}
                           </select>
                           :
                           null
                     }
                  </div>
               </div>
            </div>
            <div className="other-guest-area" ref={parent}>
               {
                  guestInfo.map((g, i) => (
                     <div className="form-area" key={i} data-id={i}>
                        <div className="form-header-text">
                           {
                              guestNumber > 0 ?
                                 <div className="remove-button" onClick={(e) => RemoveGuest(g)}>
                                    <img src={Remove} alt="" />
                                 </div>
                                 :
                                 null
                           }

                           <h3>Other guest {i + 2}</h3>
                        </div>
                        <div className="name-surname-wrapper">
                           <div className="name-wrapper">
                              <label htmlFor="name">Given name</label>
                              <input type="name" id="name" />
                           </div>

                           <div className="surname-wrapper">
                              <label htmlFor="surname">Surname</label>
                              <input type="surname" id="surname" />
                           </div>
                        </div>
                        <div className="citizenship-wrapper">
                           <label htmlFor="citizenship">Citizenship</label>
                           <div className="select-wrapper">
                              <img src={ArrowBlackBottom} alt="" />
                              <select name="citizenship" id="citizenship">
                                 {nationality.map((n, i) => (
                                    n.code === 'AZ' ?
                                       <option selected key={i} value={n.code}>{n.nation}</option>
                                       :
                                       <option key={i} value={n.code}>{n.nation}</option>
                                 ))}
                              </select>
                           </div>
                        </div>
                     </div>
                  ))
               }
            </div>

            {
               guestNumber < maxGuestNumber ?
                  <div className="add-another-button" id='add-other-guest' >
                     <button type='button'
                        onClick={(e) => {
                           window.scrollTo(document.getElementById('add-other-guest').offsetLeft, document.getElementById('add-other-guest').offsetTop);
                           setGuestNumber((prev) => prev + 1);
                           addGuest(e);
                        }}
                     >
                        <img src={AddVisiter} alt="" />
                        add other guest
                     </button>
                  </div>
                  :
                  null
            }
         </div>

         <div className="terms-booking-wrapper">
            {
               checkOutData !== null && checkOutData !== undefined ?
                  <h3>Terms of booking</h3> :
                  <Skeleton variant="rounded" width={'129px'} height={'20px'} style={{ marginBottom: '24px' }} />
            }

            {
               checkOutData !== null && checkOutData !== undefined ?
                  <ul>
                     <li>No refunds will be issued for late check-in or early check-out.</li>
                     <li>Stay extensions require a new reservation.</li>
                     <li>To make a Booking, you may need to create an Account. Please make sure all your info (including payment and contact details) is correct and up to date, or you might find you can’t access your Travel Experience(s). You’re responsible for anything that happens with your Account, so please don’t let anyone else use it, and please keep your username and password secret.</li>
                     <li>Our Platform only shows Accommodations that have a commercial relationship with us, and it doesn’t necessarily show all their products or services.</li>
                  </ul>
                  :
                  <ul style={{ width: '100%' }}>
                     <Skeleton variant="rounded" width={'65%'} height={'14px'} style={{ marginBottom: '16px' }} />
                     <Skeleton variant="rounded" width={'70%'} height={'14px'} style={{ marginBottom: '16px' }} />
                     <Skeleton variant="rounded" width={'75%'} height={'14px'} />
                  </ul>
            }

            {
               checkOutData !== null && checkOutData !== undefined ?
                  <p>By clicking on the button below, I acknowledge that I have reviewed the <span onClick={() => { window.location.href = '/terms-conditions' }}>Terms of Use.</span></p>
                  :
                  <ul style={{ width: '100%', padding: 0 }}>
                     <Skeleton variant="rounded" width={'65%'} height={'14px'} style={{ marginBottom: '16px' }} />
                     <Skeleton variant="rounded" width={'70%'} height={'14px'} style={{ marginBottom: '16px' }} />
                  </ul>
            }
            <div>
               {
                  checkOutData !== null && checkOutData !== undefined ?
                     <button onClick={() => {
                        PostData('P');
                     }} type='button'>Book and Pay</button>
                     :
                     <Skeleton variant="rounded" width={'247px'} height={'52px'} />
               }               
            </div>
         </div>
      </div>
   )
}

export default Details