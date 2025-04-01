import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, update, remove, runTransaction } from 'firebase/database';
import { db } from '../../firebase';
import './chatuser.scss';
import '../../assets_concierge/styles/main.css';

///IMPORT COMPONENTS
import $ from 'jquery';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input';

////IMPORT IMAGES
import Logo from '../../assets_concierge/images/logo/logo.svg';
import LogoIAC from '../../../src/assets/navbar-second/logo-iac2023.svg';
import Banner from '../../assets_concierge/images/template/banner/banner.png';
import Close from '../../assets_concierge/images/other/icon/close.svg';
import CalendarImg from '../../assets_concierge/images/other/icon/calendar.svg';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';

import countryFile from '../../data/country.json';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Pagination, FreeMode, Navigation, Thumbs } from "swiper";
import { uid } from 'uid';
import MessageList from './MessageList';
import { refreshToken } from '../../components/Security/authService';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';
import { formatDate } from '../../utils';

const baseURL = config.baseURL;
const linkURL = config.linkURL;

const buttons = [
   { id: "btnHotelsLink", label: "Hotels", key: "Hotels" },
   { id: "btnFlightsLink", label: "Flights", key: "Flights" },
   { id: "btnSocialTour", label: "Social Tour", key: "Tours" },
 ];

 const predefinedResponses = {
   Hotels: [
     {
       text: "Click button to search for hotels.",
       id: 'btnHotelsSearch',
     },
   ],
   Tours: [
     {
       text: "Click button to search for social tours.",
       id: "btnSocialTourSearch",
     },
   ],
   Flights: [{ text: "Click button to search for flights.", id: "btnFlightsSearch" }],
 };

const ChatUser = () => {
   const { userData, checkTokenExpiration } = useAuth();
   const [inputBarActive, setInputBarActive] = useState(false);
   const [btnSendMessage, setBtnSendMessage] = useState(false);
   const [modalContent, setModalContent] = useState(null);
   const [typeOfFlightModal, setTypeOfFlightModal] = useState(false);
   const [typeOfClassesModal, setTypeOfClassesModal] = useState(false);
   const [typeOfPassengersModal, setTypeOfPassengersModal] = useState(false);
   const [budgetHotelGalleryModal, setBudgetHotelGalleryModal] = useState(false);
   const [flightDirection, setFlightDirection] = useState('One way');
   const [flightDirectionFlag, setFlightDirectionFlag] = useState('One way');
   const [flightClasses, setFlightClasses] = useState('Economy');
   const [flightClassesFlag, setFlightClassesFlag] = useState('Economy');
   const [flightAdultNumber, setFlightAdultNumber] = useState(1);
   const [flightChildrenNumber, setFlightChildrenNumber] = useState(0);
   const [flightInfantsNumber, setFlightInfantsNumber] = useState(0);
   const [flightPassengersFlag, setFlightPassengersFlag] = useState({
      adults: 1,
      childrens: 0,
      infants: 0
   });
   const [phoneValue, setPhoneValue] = useState()
   const [value, setValue] = React.useState([new Date().toDateString(), flightDirection === 'One way' ? null : new Date(2025, new Date().getMonth(), new Date().getDate() + 1).toDateString()]);
   const [iata, setIata] = useState('');
   const [iataData, setIataData] = useState(null);
   const [thumbsSwiper, setThumbsSwiper] = useState(null);
   const [galleryImageIndex, setGalleryImageIndex] = useState({
      current: 1,
      all: 14
   });
   const [transferDateValue, setTransferDateValue] = useState(null);
   const [transferTimeValue, setTransferTimeValue] = useState({
      h: '12',
      m: '00'
   });
   const [transferDetails, setTransferDetails] = useState({
      category: 'Economy',
      PickUpAddress: '',
      DropOffAddress: ''
   });
   const [transferPassengerNumber, setTransferPassengerNumber] = useState('');
   const [transferTimePopupActive, setTransferTimePopupActive] = useState(false);
   const [currentUser, setCurrentUser] = useState(null);
   const [ token, setToken ] = useState(null);
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState('');

   const socketState = useRef(null);
   const chatStore = useRef([]);
   var chatDateDivider_Today = false;
   var chatDateDivider_Yesterday = false;
   var chatDateDivider_Exists = [];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user) {
       setCurrentUser(user);
    }
  }, [setCurrentUser]);

  useEffect(() => {
    const messagesRef = ref(db, `chats/${currentUser?.userId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg
        }));
        setMessages(messageList);

        const updates = {};
        messageList.forEach(msg => {
          if (msg.sender === 'admin' && msg.status !== 'read') {
            updates[`chats/${currentUser?.userId}/messages/${msg.id}/status`] = 'delivered';
          }
        });
        if (Object.keys(updates).length > 0) {
          update(ref(db), updates);
        }
      }
      ChatBodyScrollTo();
    });

    return () => unsubscribe();
  }, [currentUser?.userId]);

  const sendMessage = async (text, type = 'text', props = null) => {
   const messagesRef = ref(db, `chats/${currentUser?.userId}/messages`);
   const messagesRefName = ref(db, `chats/${currentUser?.userId}`);
   const unreadCountRef = ref(db, `chats/${currentUser?.userId}/unreadCount`);
 
   let messageData = {
     text,
     sender: currentUser?.userId,
     timestamp: Date.now(),
     type,
     status: 'sent',
   };
 
   if (props) {
     messageData = { ...messageData, ...props };
   }
 
   await push(messagesRef, messageData);
   await update(messagesRefName, { name: `${currentUser?.firstName} ${currentUser?.lastName}` });
   await runTransaction(unreadCountRef, (currentCount) => {
     return messageData.sender !== 'admin' ? (currentCount || 0) + 1 : (currentCount || 0);
   });
 };
    
   useEffect(() => {
      const { token } = JSON.parse(localStorage.getItem('user')) || {};
      setToken(token)

    }, []);

   useEffect(() => {
      $('.modal').on('click', () => {
         $('.from-input-search-dropdown').removeClass('dropdown-show');
      })
   })

   const sendAdminResponse = (message) => {
      if (message.sender !== "admin" && message.key) {
        const response = predefinedResponses[message.key][0];
        sendMessage(response.text, 'button_click', {key: response.id, sender: 'admin'});
      }
    };
   
   useEffect(() => {
      const lastMessage = messages[messages.length - 1];

      const timer = setTimeout(() => {
          if (lastMessage) {
              sendAdminResponse(lastMessage);
              ChatBodyScrollTo();
          }
      }, 1000);
  
      return () => clearTimeout(timer); 
   }, [messages, sendAdminResponse]);

   const deleteMessage = async (messageId) => {
      $(document).on('click', '.remove-admin-message-btn', (e) => {
        $(e.currentTarget).css('background', '#FBE2E2');
        $(e.currentTarget).find('img').attr('src', `${process.env.PUBLIC_URL}/images_concierge/other/icon/minus-black.svg`);
        $(e.currentTarget).attr('id', 'ready_to_remove');
     });
  
     $('body').on('click', '#ready_to_remove', async (e) => {
        $('.remove-admin-message-btn').removeAttr('id');    
        if (currentUser?.userId) {
         const messageRef = ref(db, `chats/${currentUser?.userId}/messages/${messageId}`);
         await remove(messageRef);
       }
     });
    };

   //////TRANFER DETAILS PASSENGER NUMBER HANDLE CHANGE
   const tranferPassengerHandleChange = (event) => {
      const newValue = event.target.value.replace(/\D/g, '');
      setTransferPassengerNumber(newValue);

      if (event.target.value === '') {
         $('.transfer-details-passenger-input').css('border', '1px solid rgb(211, 47, 47)');
      } else {
         $('.transfer-details-passenger-input').css('border', '1px solid #e5e5e5');
      }
   };

   const sendMessageHandleChange = (e) => {
      const { value } = e.target;
      setNewMessage(value);
      if (value.length > 0) {
         setInputBarActive(true);
      } else {
         setInputBarActive(false);
      }
   }

   const handleHotelsSearch = () => {
      const queryParams = new URLSearchParams();
      if (userData && !checkTokenExpiration(userData)) {
         queryParams.append('token', token);
         window.location.href = `${linkURL}/hotels-concierge?${queryParams.toString()}`;
     } else {
         refreshToken(
            (newToken) => {
               queryParams.append('token', newToken);
               window.location.href = `${linkURL}/hotels-concierge?${queryParams.toString()}`;
            },
            (errorMessage) => {
               console.error(errorMessage);
               window.location.href = '/auth';
            }
         );
      }
   };
  
    useEffect(() => {
      $(document).on('click', '#btnHotelsSearch', handleHotelsSearch);
      return () => {
        $(document).off('click', '#btnHotelsSearch', handleHotelsSearch);
      };
    }, [handleHotelsSearch]);

   function GetCurrentLocalTime(date) {
      var event = new Date(date);
      var getOffset = new Date().getTimezoneOffset() / 60;
      event.setHours(event.getHours() + (getOffset * -1));
      return event;
   }

   $(document).on('click', '#reserve_budget_hotel_btn', () => {
      setModalContent('budget-room-reserve')
   })


   const sendMessageHandleKeyPress = (e) => {
      if ($('#messageText').val().trim() === '') {
         document.querySelector('textarea').style.height = '44px'
      }

      if (e.keyCode === 13 && !e.shiftKey) {
         if ($('#messageText').val().trim() !== '') {
            setBtnSendMessage(true);
            sendMessage(newMessage);
         }
         e.preventDefault();
      }

      if (e.keyCode === 13 && e.shiftKey) {
         if ($('#messageText').val().trim() !== '') {
            document.querySelector('textarea').style.height = '60px'
         }
      }
   }

   const sendMessageHandleKeyUp = (e) => {
      if ($('#messageText').val().trim() === '') {
         document.querySelector('textarea').style.height = '44px'
      }
   }

   function ChatBodyScrollTo() {
      var chatBody = document.querySelector('#chatBody');

      chatBody.scrollTop = chatBody.scrollHeight;
   }

   function AppendDateDivider(chatDate) {
      var date = new Date(chatDate);
      var yesterDay = new Date(Date.now());
      yesterDay.setDate(yesterDay.getDate() - 1);

      var formatedDateNow = new Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(Date.now())
      var formatedDateYesterday = new Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(yesterDay);
      var formatedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(new Date(chatDate))


      if (chatDateDivider_Today === false) {
         if (formatedDateNow === formatedDate) {
            RenderDateDivider('Today');
            chatDateDivider_Today = true;
            chatDateDivider_Exists.push(formatedDate)
         }

      }

      if (chatDateDivider_Yesterday === false) {
         if (formatedDate === formatedDateYesterday) {
            RenderDateDivider('Yesterday');
            chatDateDivider_Yesterday = true;
            chatDateDivider_Exists.push(formatedDate)
         }

      }

      if (chatDateDivider_Exists.find(element => element == formatedDate) === undefined) {
         RenderDateDivider(new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date));
         chatDateDivider_Exists.push(formatedDate);
      }
   }

   function RenderDateDivider(date) {
      $("#chatBody").append(
         `<div class="chat-messenger__date__divider">
                                    <span>${date}</span>
                               </div>
                              `
      );
   }

   const sendPriceDetailsSubmitHandler = (amount) => {
      const formMessages = JSON.parse(localStorage.getItem(`flights_${currentUser?.userId}`)) || [];

      if (formMessages.length === 0) {
         sendMessage("There is no flight data. Please enter flight details.", 'button_click', {key: 'btnFlightsSearch', sender: 'admin'})
         return;
      }

      const sendRequest = (token) => {
         $.ajax({
             method: "POST",
             url: `${baseURL}/app/v1/payment/iac`,
             data: JSON.stringify({
                 book_type: "FLIGHT",
                 currency: "USD",
                 amount: amount,
                 flights: [formMessages]
             }),
             dataType: "json",
             headers: {
                 "x-auth-key": token,
                 "content-type": "application/json",
             },
             success: (content) => {
                 if (content.result?.status && content.data) {
                     window.location.href = content.data;
                     localStorage.removeItem(`flights_${currentUser?.userId}`);
                 } else {
                     sendMessage('Failed to create a payment session. Please try again.', { sender: 'admin' });
                 }
             },
            error: (xhr, status, error) => {
               console.error(error);
               if (xhr.status === 401) {
                  refreshToken(
                     (newToken) => {sendRequest(newToken);},
                     (errorMessage) => {
                        console.error(errorMessage);
                        sendMessage('An error occurred while refreshing the token. Please log in again.', { sender: 'admin' });
                     }
                  );
               } else {
                  sendMessage('An error occurred while sending the request. Please try again later', { sender: 'admin' });
               }
            }
         });
     };
 
     sendRequest(token);
     };

   function Message(message) {
      if (message.target === 'message') {
         if (message.role === 1) {
            switch (message.type) {
               case 0: //plain
                  return `
               <div class="chat-messenger__content content-left content-admin" id='${message.msgID}'>
                  <div class="chat-messenger__content__container">
                     <div class="chat-messenger__avatar">
                        <img src='${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png'
                           class="img-fluid border-radius-full" alt="avatar" />
                     </div>
                     <div class="chat-messenger__holder">
                        <div class="chat-messenger__text">${message.body}</div>     
                        <div class="chat-messenger__statusbar">
                           <span class="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(Date.now()))}</span>
                           <span class="chat-messenger__status"></span>
                        </div>
                     </div>
                  </div>
               </div>
            `;
            }
         }
      }
   }

   useEffect(() => {
      if (btnSendMessage !== false) {
         $('#messageText').val('');
         setNewMessage('')
         setInputBarActive(false);
         setBtnSendMessage(false);
         ChatBodyScrollTo();
         $('#messageText').focus();
      } 
   }, [btnSendMessage, messages]);

   /////////////////////////////////////////////SEARCH FLIGHTS BUTTON ON CLICKS FUNCTION////////////////////////////////////////////
   $(document).on('click', '#btnFlightsSearch', () => {
      setModalContent('flight-details');
   });

   /////////////////////////////////////////////SEARCH Transfer BUTTON ON CLICKS FUNCTION////////////////////////////////////////////
   $(document).on('click', '#btnTransferSearch', () => {
      // setModalContent('transfer-details');
   });

   $(document).on('click', '#btnSocialTourSearch', () => {
      window.location.href = '/social-tours'
   });

   ////////////////////////////////////////////ADD ANOTHER PASSENGER//////////////////////////////////////////
   $(document).on('click', '#add-another-passenger', () => {
      $('.modal-layout__body').append(`
         <div class="form-step">
            <h4 class="form-step__title"><span class="form-step__remove icon-minus"></span>Primary passenger
            </h4>
            <div class="form-step__container">
               <div class="form-field m-b-20">
                  <label for="" class="form-label">Given name</label>
                  <input type="text" class="form-control" placeholder="Given name" />
               </div>
               <div class="form-field m-b-20">
                  <label for="" class="form-label">Surname</label>
                  <input type="text" class="form-control" placeholder="Surname" />
               </div>
               
               <div class="form-field has-icon m-b-20">
                  <label for="" class="form-label">Gender</label>
                  <div class="form-field">
                     <select class="form-control">
                        <option disabled selected>Choose gender</option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                     </select>
                     <span class="field-icon icon-chevron-down fs-8 color-black"></span>
                  </div>
               </div>
               <div class="form-field m-b-20">
                  <label for="" class="form-label">Date of birth</label>
                  <div class="form-field-multiple">
                     <div class="form-field day-input">
                        <input type="text" class="form-control" placeholder="DD" />
                     </div>
                     <div class="form-field has-icon month-input">
                        <select class="form-control">
                           <option disabled selected>Month</option>
                           <option value="1">January</option>
                           <option value="2">February</option>
                           <option value="3">March</option>
                           <option value="4">April</option>
                           <option value="5">May</option>
                           <option value="6">June</option>
                           <option value="7">July</option>
                           <option value="8">August</option>
                           <option value="9">September</option>
                           <option value="10">October</option>
                           <option value="11">November</option>
                           <option value="12">December</option>
                        </select>
                        <span class="field-icon icon-chevron-down fs-8 color-black"></span>
                     </div>
                     <div class="form-field year-input">
                        <input type="text" class="form-control" placeholder="YYYY" />
                     </div>
                  </div>
               </div>
               <div class="form-field m-b-20">
                  <label for="" class="form-label">Passport or ID number</label>
                  <input type="text" class="form-control" placeholder="Passport or ID number" />
               </div>
               <div class="form-field has-icon m-b-20">
                  <label for="" className="form-label">Country of issue</label>
                  <div class="form-field">
                     <select class="form-control">
                        <option disabled selected>Choose country</option>
                        ${countryFile.map((c, i) => {
         <option value={c.name}>{c.name}</option>
      })
         }           
                     </select>
                     <span class="field-icon icon-chevron-down fs-8 color-black"></span>
                  </div>
               </div>
               <div class="form-field m-b-20">
                  <label for="" class="form-label">Expiration date</label>
                  <div class="form-field-multiple">
                     <div class="form-field day-input">
                        <input type="text" class="form-control" placeholder="DD" />
                     </div>
                     <div class="form-field has-icon month-input">
                        <select class="form-control">
                           <option disabled selected>Month</option>
                           <option value="1">January</option>
                           <option value="2">February</option>
                           <option value="3">March</option>
                           <option value="4">April</option>
                           <option value="5">May</option>
                           <option value="6">June</option>
                           <option value="7">July</option>
                           <option value="8">August</option>
                           <option value="9">September</option>
                           <option value="10">October</option>
                           <option value="11">November</option>
                           <option value="12">December</option>
                        </select>
                        <span class="field-icon icon-chevron-down fs-8 color-black"></span>
                     </div>
                     <div class="form-field year-input">
                        <input type="text" class="form-control" placeholder="YYYY" />
                     </div>
                  </div>
               </div>
               <label for="1" class="checkbox m-b-20">
                  <input type="checkbox" id="1" />
                  <span class="checkbox-control"></span>
                  <span class="checkbox-label">No expiration</span>
               </label>
            </div>
         </div>
      `)
   });

   function GuestCountCalc() {
      var guestCount = flightAdultNumber + flightChildrenNumber + flightInfantsNumber;
      var guestCountStr = '';

      if (guestCount > 1) {

         if (flightAdultNumber > 1)
            guestCountStr += `${flightAdultNumber} Adults`
         else {
            guestCountStr += `${flightAdultNumber} Adult`
         }
         if (flightChildrenNumber > 0)
            guestCountStr += `, ${flightChildrenNumber} Children`


         if (flightInfantsNumber > 1)
            guestCountStr += `, ${flightInfantsNumber} Infants`

         if (flightInfantsNumber === 1)
            guestCountStr += `, ${flightInfantsNumber} Infant`
      }
      else {
         guestCountStr += `${flightAdultNumber} Adult`
      }


      return guestCountStr;
   }

   ////////////////////////////////////////////FLIGHT DETAILS SUBMIT HANDLER////////////////////////////////////
   const flightDetailsSubmitHandler = (e) => {
      const fromInput1 = $('.from-input').val();
      const fromInput2 = $('.from-input-m').val();

      e.preventDefault();
      if (window.innerWidth >= 504 && fromInput1 === '') {
         $('.from-input').css('border', '1px solid #d32f2f');
      } else {
         $('.from-input').css('border', '1px solid #E5E5E5');
      }
      if (window.innerWidth < 504 && fromInput2 === '') {
         $('.from-input-m').css('border', '1px solid #d32f2f');
      } else {
         $('.from-input-m').css('border', '1px solid #E5E5E5');
      }

      if (value[1] === null && flightDirection === 'Return') {
         $('#return-input').css('border', '1px solid #d32f2f')
      } else {
         $('#return-input').css('border', '1px solid #E5E5E5')
      }


      if ((window.innerWidth >= 504 && fromInput1 !== "") || (window.innerWidth < 504 && fromInput2 !== "")) {
         if ((value[1] === null && flightDirection === 'One way') || (value[1] !== null && flightDirection === 'Return')) {   
            const newFlight = {
               from_city: fromInput1 || fromInput2,
               to_city: "Baku (GYD)",
               departure_date: new Date(value[0]).toISOString().split('T')[0],
               return_date: value[1] !== null ? new Date(value[1]).toISOString().split('T')[0] : null,
               flight_type: flightClasses,
               flight_direction: flightDirection,
               adults_count: flightAdultNumber || 0,
               children_count: flightChildrenNumber || 0,
               infants_count: flightInfantsNumber || 0,
            };
            sendMessage(JSON.stringify(newFlight), 'form');
            ChatBodyScrollTo();
      
            setTimeout(() => {
               sendMessage('Thank you for your request. We will reply to you as soon as possible.', 'message', { sender: 'admin' });
               ChatBodyScrollTo();
            }, 1000);
      
            setModalContent(null);
         }
         
      }
   }

   ////////////////////////////////////////////TRANSFER DETAILS SUBMIT HANDLER////////////////////////////////////
   const transferDetailsSubmitHandler = () => {

      if (transferDetails.PickUpAddress === '') {
         $('.transfer-details-pick-up-input').css('border', '1px solid #d32f2f');
      } else {
         $('.transfer-details-pick-up-input').css('border', '1px solid #e5e5e5');
      }

      if (transferDetails.DropOffAddress === '') {
         $('.transfer-details-drop-off-input').css('border', '1px solid #d32f2f');
      } else {
         $('.transfer-details-drop-off-input').css('border', '1px solid #e5e5e5');
      }

      if (transferDateValue === null) {
         $('.transfer-details-pick-up-date-input').css('border', '1px solid #d32f2f');
      } else {
         $('.transfer-details-pick-up-date-input').css('border', '1px solid #e5e5e5');
      }

      if (transferPassengerNumber === '') {
         $('.transfer-details-passenger-input').css('border', '1px solid #d32f2f');
      } else {
         $('.transfer-details-passenger-input').css('border', '1px solid #e5e5e5');
      }

      if (transferDetails.PickUpAddress !== '' && transferDetails.DropOffAddress !== '' && transferDateValue !== null && transferPassengerNumber !== '') {
         if (socketState !== null) {
            var msgID = uid();
            var messageBody = `<div class="info-list">
                     <span class="info-list__title">Transfer details</span>
                     <span class="info-list__item">Category: ${transferDetails.category}</span>
                     <span class="info-list__item">Pick-up point: ${transferDetails.PickUpAddress}</span>
                     <span class="info-list__item">Drop-off point: ${transferDetails.DropOffAddress}</span>
                     <span class="info-list__item">Pick-up Date:  ${new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(transferDateValue))}</span>
                     <span class="info-list__item">Pick-up Time: ${transferTimeValue.h}:${transferTimeValue.m}</span>
                     <span class="info-list__item">Number of Passengers: ${transferPassengerNumber}</span>                           
               </div>`;

            var appendText = `
               <div class="chat-messenger__content content-right content-user" id='${msgID}'>
                  <div class="chat-messenger__content__container">
                     <div class="chat-messenger__avatar">
                        <img src="${process.env.PUBLIC_URL}/images_concierge/template/avatar/user-avatar.png"
                              class="img-fluid border-radius-full" alt="avatar">
                     </div>
                     <div class="chat-messenger__holder">
                        ${messageBody}
                        <span class="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(Date.now()))}</span>
                     </div>
                  </div>
               </div>
            `;

            var message = {
               msgID: msgID,
               role: 0,
               type: 0,
               target: "message",
               body: messageBody
            }
            chatStore.current.push(message);
            localStorage.setItem('store', JSON.stringify(chatStore.current));

            socketState.current.send(JSON.stringify(message));

            $('#chatBody').append(appendText);
            ChatBodyScrollTo();
            setTimeout(() => {

               message.msgID = uid();
               message.type = 0;
               message.target = "#autoReply"
               message.role = 0;
               message.body = '';


               $('#chatBody').append(`
                  <div class="chat-messenger__content content-left content-admin" id='${message.msgID}'>
                     <div class="chat-messenger__content__container">
                        <div class="chat-messenger__avatar">
                           <img src='${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png'
                              class="img-fluid border-radius-full" alt="avatar" />
                        </div>
                        <div class="chat-messenger__holder">
                           <div class="chat-messenger__text">Thank you for your request.
                           We will reply to you as soon as possible.</div>
                           <div class="chat-messenger__statusbar">
                           <span class="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(Date.now()))}</span>
                     </div>    
                        </div>
                     </div>                
                  </div>
               `);

               chatStore.current.push(message);
               localStorage.setItem('store', JSON.stringify(chatStore.current));
               sendMessage(message)
               socketState.current.send(JSON.stringify(message));
               ChatBodyScrollTo();
            }, 1000);
            setModalContent(null);
         }
      }
   }

   $(document).on('click', '#btnOpenPassportDetails', () => {
      setModalContent('flights-pay');
   });

   const addAnotherPassenger = (e) => {
      let lengthPassengerInfo = $(e.currentTarget).parent().parent().find('.modal-layout__body .form-step');
      var country = ''

      for (var i = 0; i < countryFile.length; i++) {
         country += `<option value=${countryFile[i].name}>${countryFile[i].name}</option>`
      }

      $('#passport-details-passengers-area').append(`
         <div class="form-step">
            <h4 class="form-step__title">
               <span class="form-step__remove icon-minus remove-passenger-btn"></span>
               <span class="passengers-title-text">Passenger ${lengthPassengerInfo.length}</span>
            </h4>
            <div class="form-step__container">
               <div class="form-field m-b-20">
                  <label htmlFor="" class="form-label">Given name</label>
                  <input type="text" class="form-control add-passenger-given-name" placeholder="Given name" />
               </div>
               <div class="form-field m-b-20">
                  <label htmlFor="" class="form-label">Surname</label>
                  <input type="text" class="form-control add-passenger-surname" placeholder="Surname" />
               </div>
               
               <div class="form-field has-icon m-b-20">
                  <label htmlFor="" class="form-label">Gender</label>
                  <div class="form-field">
                     <select class="form-control add-passenger-gender">
                        <option disabled defaultValue>Choose gender</option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                        <option value="3">Other</option>
                     </select>
                     <span class="field-icon icon-chevron-down fs-8 color-black"></span>
                  </div>
               </div>
               <div class="form-field m-b-20">
                  <label htmlFor="" class="form-label">Date of birth</label>
                  <div class="form-field-multiple add-passenger-birthDate">
                     <div class="form-field day-input">
                        <input type="number" class="form-control add-passenger-day-of-birth" placeholder="DD" />
                     </div>
                     <div class="form-field has-icon month-input">
                        <select class="form-control add-passenger-month-of-birth">
                           <option disabled defaultValue>Month</option>
                           <option value="0">January</option>
                           <option value="1">February</option>
                           <option value="2">March</option>
                           <option value="3">April</option>
                           <option value="4">May</option>
                           <option value="5">June</option>
                           <option value="6">July</option>
                           <option value="7">August</option>
                           <option value="8">September</option>
                           <option value="9">October</option>
                           <option value="10">November</option>
                           <option value="11">December</option>
                        </select>
                        <span class="field-icon icon-chevron-down fs-8 color-black"></span>
                     </div>
                     <div class="form-field year-input">
                        <input type="number" class="form-control add-passenger-year-of-birth" placeholder="YYYY" />
                     </div>
                  </div>
               </div>
               <div class="form-field m-b-20">
                  <label htmlFor="" class="form-label">Passport or ID number</label>
                  <input type="text" class="form-control add-passenger-passportID" maxlength="30" placeholder="Passport or ID number" />
               </div>
               <div class="form-field has-icon m-b-20">
                  <label htmlFor="" class="form-label">Country of issue</label>
                  <div class="form-field">
                     <select class="form-control add-passenger-country">
                        <option>Choose Country</option>
                        ${country}       
                     </select>
                     <span class="field-icon icon-chevron-down fs-8 color-black"></span>
                  </div>
               </div>
               <div class="form-field m-b-20">
                  <label htmlFor="" class="form-label">Expiration date</label>
                  <div class="form-field-multiple add-passenger-expiredDate">
                     <div class="form-field day-input">
                        <input type="text" class="form-control add-passenger-expired-day" maxlength="2" placeholder="DD" />
                     </div>
                     <div class="form-field has-icon month-input">
                        <select class="form-control add-passenger-expired-month">
                           <option disabled defaultValue>Month</option>
                           <option value="0">January</option>
                           <option value="1">February</option>
                           <option value="2">March</option>
                           <option value="3">April</option>
                           <option value="4">May</option>
                           <option value="5">June</option>
                           <option value="6">July</option>
                           <option value="7">August</option>
                           <option value="8">September</option>
                           <option value="9">October</option>
                           <option value="10">November</option>
                           <option value="11">December</option>
                        </select>
                        <span class="field-icon icon-chevron-down fs-8 color-black"></span>
                     </div>
                     <div class="form-field year-input">
                        <input type="text" class="form-control add-passenger-expired-year" maxlength="4" placeholder="YYYY" />
                     </div>
                  </div>
               </div>
               <label htmlFor="1" class="checkbox no-expired m-b-20">
                  <input type="checkbox" id="1" />
                  <span class="checkbox-control"></span>
                  <span class="checkbox-label">No expiration</span>
               </label>
            </div>
         </div>
      `);

      const modal = document.querySelector('#passport-details-passengers-area');
      modal.scrollTop = modal.scrollHeight - 800;

   }

   //////REMOVE ONE PASSENGER
   $('.modal').on('click', '.remove-passenger-btn', (e) => {

      //let lengthPassengerInfo = $(e.currentTarget).parent().parent().parent().find('.form-step');
      const passengers = document.querySelectorAll('#passport-details-passengers-area .form-step');

      $(e.target).parent().parent().remove();

      for (var i = 0; i < passengers.length; i++) {

         if (i > 1) {
            passengers[i].children[0].children[1].outerHTML = `<span class=\"passengers-title-text\">Passenger ${i}</span>`;
         }
      }

   });

   /////SUBMIT PASSENGERS HANDLER
   const validateEmail = (email) => {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
   };

   ///ONLY NUMBER REGEX
   const onlyNumberAndLettersRegex = (text) => {
      const re = /^[a-zA-Z0-9]*$/;
      return re.test(String(text).toLowerCase());
   };

   const passengersSubmitHandler = () => {
      let errorFlagArr = [];

      /////EMAIL VALIDATE
      if ($('#add-passengers-email').val() === '' || !validateEmail($('#add-passengers-email').val())) {
         $('#add-passengers-email').css('border', '1px solid #d32f2f');
         errorFlagArr.push(false);
      } else {
         $('#add-passengers-email').css('border', '1px solid #e5e5e5');
      }

      /////PHONE NUMBER VALIDATE
      if (phoneValue === undefined) {
         $('.PhoneInput').css('border', '1px solid #d32f2f');
         errorFlagArr.push(false);
      } else {
         $('.PhoneInput').css('border', '1px solid #e5e5e5');
      }

      /////GIVEN NAME VALIDATE
      const passengerGivenName = document.querySelectorAll('.modal-layout__body .form-step');
      for (var i = 0; i < passengerGivenName.length; i++) {
         if (i !== 0) {
            if ($(passengerGivenName[i]).find('.add-passenger-given-name').val() === '') {
               $(passengerGivenName[i]).find('.add-passenger-given-name').css('border', '1px solid #d32f2f');
               errorFlagArr.push(false);
            } else {
               $(passengerGivenName[i]).find('.add-passenger-given-name').css('border', '1px solid #e5e5e5');
            }
         }
      }

      const passengerSurname = document.querySelectorAll('.modal-layout__body .form-step');
      for (var i = 0; i < passengerSurname.length; i++) {
         if (i !== 0) {
            if ($(passengerSurname[i]).find('.add-passenger-surname').val() === '') {
               $(passengerSurname[i]).find('.add-passenger-surname').css('border', '1px solid #d32f2f');
               errorFlagArr.push(false);
            } else {
               $(passengerSurname[i]).find('.add-passenger-surname').css('border', '1px solid #e5e5e5');
            }
         }
      }

      const passengerDayOfBirth = document.querySelectorAll('.modal-layout__body .form-step');
      for (var i = 0; i < passengerDayOfBirth.length; i++) {
         if (i !== 0) {
            let day = Number($(passengerDayOfBirth[i]).find('.add-passenger-day-of-birth').val());
            let month = Number($(passengerDayOfBirth[i]).find('.add-passenger-month-of-birth').val());
            let year = Number($(passengerDayOfBirth[i]).find('.add-passenger-year-of-birth').val());
            let birthDate = new Date(year, month, day);

            if (day === 0 ||
               year === 0 ||
               birthDate >= new Date(Date.now()) ||
               birthDate.toDateString() <= new Date(1920, 1, 1)) {
               $(passengerDayOfBirth[i]).find('.add-passenger-birthDate').css('border', '1px solid #d32f2f');
               errorFlagArr.push(false);
            } else {
               $(passengerDayOfBirth[i]).find('.add-passenger-birthDate').css('border', '1px solid #e5e5e5');
            }
         }
      }

      const passengerPassportID = document.querySelectorAll('.modal-layout__body .form-step');
      for (var i = 0; i < passengerPassportID.length; i++) {
         if (i !== 0) {
            if ($(passengerPassportID[i]).find('.add-passenger-passportID').val() !== undefined)
               if ($(passengerPassportID[i]).find('.add-passenger-passportID').val().trim() === '' ||
                  $(passengerPassportID[i]).find('.add-passenger-passportID').val().length > 20 ||
                  $(passengerPassportID[i]).find('.add-passenger-passportID').val().length < 5 ||
                  !onlyNumberAndLettersRegex($(passengerPassportID[i]).find('.add-passenger-passportID').val())) {
                  $(passengerPassportID[i]).find('.add-passenger-passportID').css('border', '1px solid #d32f2f');
                  errorFlagArr.push(false);
               } else {
                  $(passengerPassportID[i]).find('.add-passenger-passportID').css('border', '1px solid #e5e5e5');
               }
         }
      }

      const passengerExpiredDate = document.querySelectorAll('.modal-layout__body .form-step');
      for (var i = 0; i < passengerExpiredDate.length; i++) {
         if (i !== 0) {
            let day = Number($(passengerExpiredDate[i]).find('.add-passenger-expired-day').val());
            let month = Number($(passengerExpiredDate[i]).find('.add-passenger-expired-month').val());
            let year = Number($(passengerExpiredDate[i]).find('.add-passenger-expired-year').val());
            let expiredDate = new Date(year, month, day);
            let checkbox = $(passengerExpiredDate).find('.no-expired input')[i - 1]?.checked;

            if (checkbox === false) {
               if (
                  day === 0 ||
                  year == 0 ||
                  expiredDate.toDateString() > new Date(2050, 1, 1) ||
                  expiredDate < new Date(Date.now())) {
                  $(passengerExpiredDate[i]).find('.add-passenger-expiredDate').css('border', '1px solid #d32f2f');
                  errorFlagArr.push(false);
               } else {
                  $(passengerExpiredDate[i]).find('.add-passenger-expiredDate').css('border', '1px solid #e5e5e5');
               }
            }
         }
      }

      if (errorFlagArr.length === 0) {
         var guest = [];
         var primaryContactDetails = {
            email: "",
            phone: ""
         }
         var guestArray = document.querySelectorAll('.modal-layout__body .form-step');

         for (var i = 0; i < guestArray.length; i++) {
            if (i == 0) {
               primaryContactDetails.email = $(guestArray[i]).find('#add-passengers-email').val();
               primaryContactDetails.phone = $(guestArray[i]).find('#add-passengers-phone').val();
            }
            else {
               var formatDate = new Intl.DateTimeFormat('en-US', { year: "numeric", month: 'short', day: '2-digit' });
               var birthDayDate = new Date($(guestArray[i]).find('.add-passenger-year-of-birth').val(), $(guestArray[i]).find('.add-passenger-month-of-birth').val(), $(guestArray[i]).find('.add-passenger-day-of-birth').val());
               var expDate = new Date($(guestArray[i]).find('.add-passenger-expired-year').val(), $(guestArray[i]).find('.add-passenger-expired-month').val(), $(guestArray[i]).find('.add-passenger-expired-day').val());
               var expDateFlag = $(guestArray[i]).find('.no-expired input')[0]?.checked;

               guest.push(
                  {
                     name: $(guestArray[i]).find('.add-passenger-given-name').val(),
                     surname: $(guestArray[i]).find('.add-passenger-surname').val(),
                     gender: $(guestArray[i]).find('.add-passenger-gender').val() === "1" ? "Male" : $(guestArray[i]).find('.add-passenger-gender').val() === "2" ? "Female" : $(guestArray[i]).find('.add-passenger-gender').val() === "3" ? 'Other' : 'Male',
                     birthDay: formatDate.format(birthDayDate),
                     passport: $(guestArray[i]).find('.add-passenger-passportID').val(),
                     country: $(guestArray[i]).find('.add-passenger-country').val(),
                     expDate: expDateFlag === false ? formatDate.format(expDate) : "-"
                  }
               );
            }

         }    
         sendMessage('Contact details', 'contacts', {phone: primaryContactDetails.phone, email: primaryContactDetails.email})
         sendMessage('Primary passenger details', 'passport', {guest})
         ChatBodyScrollTo();
         setModalContent(null);
      }

   }

   useEffect(() => {
      ////NO EXPIRED TOGGLE
      $('.modal').on('click', '.no-expired', (e) => {
         let checkbox = $(e.currentTarget).children('input')[0].checked;
         let date = $(e.currentTarget).parent();

         if (checkbox === true) {
            $(date).find('.add-passenger-expiredDate').css('border', '1px solid #e5e5e5');
            $(date).find('.add-passenger-expired-day').attr('disabled', true).css('border-radius', '8px 0 0 8px').val('');
            $(date).find('.add-passenger-expired-month').attr('disabled', true).css('border-radius', '0').val(0);
            $(date).find('.add-passenger-expired-year').attr('disabled', true).css('border-radius', '0 8px 8px 0').val('');
         } else {
            $(date).find('.add-passenger-expired-day').attr('disabled', false).css('border-radius', '8px');
            $(date).find('.add-passenger-expired-month').attr('disabled', false).css('border-radius', '0');
            $(date).find('.add-passenger-expired-year').attr('disabled', false).css('border-radius', '8px');
         }
      })
   }, []);

   //////INPUT DATE ONLY WITH NUMBER
   useEffect(() => {
      $('.modal').on('input', '.add-passenger-day-of-birth', (e) => {
         let currentInputValue = Number(e.currentTarget.value.replace(/[^0-9]/g, ''));

         if (currentInputValue < 1) {
            $(e.currentTarget).val('');
         }
         if (currentInputValue > 31) {
            $(e.currentTarget).val(31);
         }
      });

      $('.modal').on('input', '.add-passenger-year-of-birth', (e) => {
         let currentInputValue = Number(e.currentTarget.value.replace(/[^0-9]/g, ''));

         if (currentInputValue < 1) {
            $(e.currentTarget).val('')
         }
         if (currentInputValue > new Date().getFullYear()) {
            $(e.currentTarget).val(new Date().getFullYear());
         }
      });

      $('.modal').on('input', '.add-passenger-expired-day', (e) => {
         let currentInputValue = Number(e.currentTarget.value.replace(/[^0-9]/g, ''));

         if (currentInputValue < 1) {
            $(e.currentTarget).val('');
         }
         if (currentInputValue > 31) {
            $(e.currentTarget).val(31);
         }
      });

      $('.modal').on('input', '.add-passenger-expired-year', (e) => {
         let currentInputValue = Number(e.currentTarget.value.replace(/[^0-9]/g, ''));

         if (currentInputValue < 1) {
            $(e.currentTarget).val('')
         }
         if (currentInputValue > 2050) {
            $(e.currentTarget).val(2050);
         }
      });
   }, []);

   ////Budget Hotel Gallery Modal Opening
   useEffect(() => {
      $(document).on('click', '#budget_hotel_gallery_wrapper', () => {
         setBudgetHotelGalleryModal(true);
      })
   }, []);

   const handleStartDateChange = (newValue) => {
      const startDate = new Date(newValue);
      if (value[1] && newValue.isSame(value[1], 'day')) {
          const nextDay = new Date(startDate);
          nextDay.setDate(nextDay.getDate() + 1);
          setValue([startDate, nextDay]);
      } else {
          setValue([startDate, value[1]]);
      }
   };

   const handleEndDateChange = (newValue) => {
      const endDate = new Date(newValue);
      setValue([value[0], endDate]);
  
      if (endDate) {
          setFlightDirection('Return');
      }
   };


   /////BUDGET ROOMS SUBMIT HANDLER
   // const BudgetReserveSubmitHandler = () => {
   //    let errorFlagArr = [];

   //    /////EMAIL VALIDATE
   //    if ($('#budget-reserve-email').val() === '' || !validateEmail($('#budget-reserve-email').val())) {
   //       $('#budget-reserve-email').css('border', '1px solid #d32f2f');
   //       errorFlagArr.push(false);
   //    } else {
   //       $('#budget-reserve-email').css('border', '1px solid #e5e5e5');
   //    }

   //    if ($('#budget-reserve-given-name').val() === '') {
   //       $('#budget-reserve-given-name').css('border', '1px solid #d32f2f');
   //       errorFlagArr.push(false);
   //    } else {
   //       $('#budget-reserve-given-name').css('border', '1px solid #e5e5e5');
   //    }

   //    if ($('#budget-reserve-surname').val() === '') {
   //       $('#budget-reserve-surname').css('border', '1px solid #d32f2f');
   //       errorFlagArr.push(false);
   //    } else {
   //       $('#budget-reserve-surname').css('border', '1px solid #e5e5e5');
   //    }

   //    if ($('#budget-reserve-gender').val() === null) {
   //       $('#budget-reserve-gender').css('border', '1px solid #d32f2f');
   //       errorFlagArr.push(false);
   //    } else {
   //       $('#budget-reserve-gender').css('border', '1px solid #e5e5e5');
   //    }

   //    if (errorFlagArr.length === 0) {

   //       $("#chatBody").append(`
   //          <div class="chat-messenger__content content-right content-user">
   //             <div class="chat-messenger__content__container">
   //                <div class="chat-messenger__avatar">
   //                   <img src="${process.env.PUBLIC_URL}/images_concierge/template/avatar/user-avatar.png"
   //                         class="img-fluid border-radius-full" alt="avatar">
   //                </div>
   //                <div class="chat-messenger__holder">
   //                   <div class="info-list">
   //                         <span class="info-list__title">Contact details</span>
   //                         <span class="info-list__item">E-mail: ${$('#budget-reserve-email').val()}</span>
   //                   </div>
   //                   <div class="info-list">
   //                         <span class="info-list__title">Guest details</span>
   //                         <span class="info-list__item">Given name: ${$('#budget-reserve-given-name').val()}</span>
   //                         <span class="info-list__item">Surname: ${$('#budget-reserve-surname').val()}</span>
   //                         <span class="info-list__item">Gender: ${$('#budget-reserve-gender').val()}</span>
   //                         <span class="info-list__item">Type of room: ${$('input[name=type-of-room]')[0].checked === true ? 'Same room' : 'Different rooms'}</span>
   //                   </div>
   //                   <span class="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(Date.now()))}</span>
   //                </div>
   //             </div>
   //          </div>
   //       `);
   //       setModalContent(null);
   //       ChatBodyScrollTo();
   //    }
   // }

   return (
      <section className="chat-user-section">
         {/* <!-- Begin:: Header --> */}
         <header className="header">
            <div className="wrapper">
               <div className="header-holder">
                  <div className="header-brand">
                     <a href="https://iac.monkigo.com/chat" className="header-brand__logo">
                        <img src={Logo} className="img-fluid" alt="logo" />
                     </a>
                     <span className="logo-divider">X</span>
                     <a href="#" className="header-brand__logo">
                        <img src={LogoIAC} className="img-fluid" alt="logo" />
                     </a>
                  </div>
                  <a href="#" className="header-action" onClick={() => {
                     localStorage.clear();
                     window.location.href = '/auth';
                  }}>
                     <span className="header-action__icon icon-exit"></span>
                     <span className="header-action__label">Log out</span>
                  </a>
               </div>
            </div>
         </header>
         {/* <!-- End  :: Header --> */}

         {/* <!-- Begin:: Section Banner --> */}
         {/* <!-- End  :: Section Banner --> */}

         {/* <!-- Begin:: Chat Messenger --> */}
         <section className="section-chat">
            <div className="wrapper">
               <div className="chat-messenger">
                  {/* <div className="chat-messenger__heading">Concierge</div> */}
                  <div className="chat-messenger__container">
                        <div className="chat-messenger__body__nickname">Monki</div>
                        <div className="chat-messenger__body__joined">Monki joined the chat</div>
                     <div className="chat-messenger__body" id="chatBody">
                     <div className="chat-messenger__content content-left content-admin">
                           <div className="chat-messenger__content__container">
                              <div className="chat-messenger__avatar">
                              <img src={`${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png`}
                                 className="img-fluid border-radius-full" alt="avatar" />
                              </div>
                              <div className="chat-messenger__holder">
                              <div className="chat-messenger__text">Hi, <br /> I’m Monki! How can I help you?</div>
                              <div className="chat-messenger__statusbar">
                                 <span className="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(Date.now()))}</span>
                                 <span className="chat-messenger__status"></span>
                              </div> 
                              </div>
                           </div>
                           <div className="chat-messenger__content__action">
                              <div className="btn-group">
                                 {buttons.map(({id, key, label}) => (
                                    <button
                                    key={id}
                                    id={id}
                                    className="btn btn-outline btn-outline-sm btn-outline-primary"
                                    style={{ margin: 0, padding: "10px 0", minWidth: "91px" }}
                                    onClick={() => {
                                       sendMessage(key, 'message', { key })
                                    }}
                                    >
                                    {label}
                                    </button>
                                 ))}
                              </div>
                              <div className="chat-messenger__content__info">
                              For group booking, please contact
                              <br />
                              <a href="mailto:hospitality@iac2023.org" className="link">hospitality@iac2023.org</a>
                              </div>
                           </div>
                        </div>
                        <MessageList 
                           messages={messages}
                           user={currentUser?.userId}
                           sendMessage={sendMessage} 
                           handlePayment={sendPriceDetailsSubmitHandler} 
                           handledeleteMessage={deleteMessage}/>
                     </div>
                     <div className="chat-messenger__footer">
                        {/* <div className="chat-messenger__footer__action">
                           <span className="chat-messenger__footer__action__item icon-file"></span>
                        </div> */}
                        <div className="chat-messenger__footer__form">
                           <div className="form-field has-icon">
                              <textarea id='messageText' 
                                 type="text" 
                                 className="form-control"
                                 value={newMessage} 
                                 placeholder="Type your message" 
                                 onChange={(e) => sendMessageHandleChange(e)} 
                                 onKeyDown={(e) => sendMessageHandleKeyPress(e)} 
                                 onKeyUp={(e) => sendMessageHandleKeyUp(e)} />
                              <button className="chat-messenger__btn icon-send" id='send-message-btn' style={{
                                 backgroundColor: inputBarActive === true ? '#274DE0' : 'transparent',
                                 color: inputBarActive === true ? '#fff' : '#101010'
                              }}
                              onClick={() => {
                                 if (newMessage.trim()) {
                                   sendMessage(newMessage);
                                   setNewMessage('');
                                 }
                               }}></button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
         {/* <!-- End  :: Chat Messenger --> */}

         {/* <!-- Begin  :: Search Flight --> */}
         <div className={modalContent === 'flight-details' ? 'modal show' : 'modal'} id="modal-search-flights"
            style={{ cursor: 'pointer' }}
            // onClick={() => setModalContent(null)}
         >
            <div className="modal-container" data-size="sm" style={{ cursor: 'auto', background: 'white', padding: '32px 24px', borderRadius: '20px 20px 0 0' }}>
               <div className="modal-layout">
                  <div className="modal-layout__header">
                     <h4 className="modal-layout__title">Enter flight details</h4>
                     <span className="modal-layout__close modal-close icon-close" onClick={() => setModalContent(null)}></span>
                  </div>
                  <div className="modal-layout__body overflow-inherit">
                     <div className="filter-mobile web-hidden">
                        <div className="filter-list">
                           <div className="filter-list__item" data-modal="modal-type-of-flight">
                              <div className="filter-list__item__label" onClick={() => { window.innerWidth < 504 ? setTypeOfFlightModal(true) : setTypeOfFlightModal(false); setFlightDirectionFlag(flightDirection) }}>
                                 <span className="filter-list__item__selected">{flightDirection}</span>
                                 <span className="filter-list__item__icon icon-chevron-down"></span>
                              </div>
                           </div>
                           <div className="filter-list__item" data-modal="modal-type-of-class">
                              <div className="filter-list__item__label" onClick={() => { window.innerWidth < 504 ? setTypeOfClassesModal(true) : setTypeOfClassesModal(false); setFlightClassesFlag(flightClasses) }}>
                                 <span className="filter-list__item__selected">{flightClasses}</span>
                                 <span className="filter-list__item__icon icon-chevron-down"></span>
                              </div>
                           </div>
                           <div className="filter-list__item" data-modal="modal-type-of-passanger">
                              <div className="filter-list__item__label" onClick={() => { window.innerWidth < 504 ? setTypeOfPassengersModal(true) : setTypeOfPassengersModal(false); setFlightPassengersFlag({ adults: flightAdultNumber, childrens: flightChildrenNumber, infants: flightInfantsNumber }) }}>
                                 <span className="filter-list__item__selected">{
                                    flightAdultNumber > 1 || flightChildrenNumber > 0 || flightInfantsNumber > 0 ?
                                       `${flightAdultNumber + flightChildrenNumber + flightInfantsNumber} Guests` :
                                       `${flightAdultNumber} Adults`
                                 }</span>
                                 <span className="filter-list__item__icon icon-chevron-down"></span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="filter-web mobile-hidden">
                        <div className="filter-list">
                           <div className="filter-list__item with-hover">
                              <div className="filter-list__item__label">
                                 <span className="filter-list__item__selected">{flightDirection}</span>
                                 <span className="filter-list__item__icon icon-chevron-down"></span>
                              </div>
                              <div className="filter-list__item__dropdown">
                                 <span
                                    className={flightDirection === 'One way' ? 'filter-list__item__dropdown__link selected' : 'filter-list__item__dropdown__link'}
                                    onClick={() => { setFlightDirection('One way'); setValue([new Date().toDateString(), null]) }}
                                 >One way</span>
                                 <span
                                    className={flightDirection === 'Return' ? 'filter-list__item__dropdown__link selected' : 'filter-list__item__dropdown__link'}
                                    onClick={() => { setFlightDirection('Return'); setValue([new Date().toDateString(), new Date(2025, new Date().getMonth(), new Date().getDate() + 1).toDateString()]) }}
                                 >Return</span>
                                 {/* <span 
                                    className={flightDirection === 'Multi City' ? 'filter-list__item__dropdown__link selected' : 'filter-list__item__dropdown__link'}
                                    onClick={() => setFlightDirection('Multi City')}
                                 >Multi-city</span> */}
                              </div>
                           </div>
                           <div className="filter-list__item with-hover">
                              <div className="filter-list__item__label">
                                 <span className="filter-list__item__selected">{flightClasses}</span>
                                 <span className="filter-list__item__icon icon-chevron-down"></span>
                              </div>
                              <div className="filter-list__item__dropdown">
                                 <span
                                    className={flightClasses === 'Economy' ? 'filter-list__item__dropdown__link selected' : 'filter-list__item__dropdown__link'}
                                    onClick={() => setFlightClasses('Economy')}
                                 >Economy</span>
                                 <span
                                    className={flightClasses === 'Business' ? 'filter-list__item__dropdown__link selected' : 'filter-list__item__dropdown__link'}
                                    onClick={() => setFlightClasses('Business')}
                                 >Business</span>
                                 <span
                                    className={flightClasses === 'First' ? 'filter-list__item__dropdown__link selected' : 'filter-list__item__dropdown__link'}
                                    onClick={() => setFlightClasses('First')}
                                 >First Class</span>
                              </div>
                           </div>
                           <div className="filter-list__item with-hover">
                              <div className="filter-list__item__label">
                                 <span className="filter-list__item__selected">{
                                    flightAdultNumber > 1 || flightChildrenNumber > 0 || flightInfantsNumber > 0 ?
                                       `${flightAdultNumber + flightChildrenNumber + flightInfantsNumber} Guests` :
                                       `${flightAdultNumber} Adults`
                                 }</span>
                                 <span className="filter-list__item__icon icon-chevron-down"></span>
                              </div>
                              <div className="filter-list__item__dropdown size-lg">
                                 <div className="quantity-list">
                                    <div className="quantity-list__item">
                                       <div className="quantity-list__info">
                                          <span className="quantity-list__info__title">Adults</span>
                                          <span className="quantity-list__info__subtitle">Over 11</span>
                                       </div>
                                       <div className="quantity-list__control quantity-container">
                                          <span className="quantity-control decrease icon-minus" onClick={() => setFlightAdultNumber((prev) => flightAdultNumber > 1 ? prev -= 1 : prev = 1)}></span>
                                          <span type="number" className="quantity-amount">{flightAdultNumber}</span>
                                          <span className="quantity-control increase icon-plus" onClick={() => setFlightAdultNumber((prev) => flightAdultNumber < 6 ? prev += 1 : prev = 6)}></span>
                                       </div>
                                    </div>
                                    <div className="quantity-list__item">
                                       <div className="quantity-list__info">
                                          <span className="quantity-list__info__title">Children</span>
                                          <span className="quantity-list__info__subtitle">2-11</span>
                                       </div>
                                       <div className="quantity-list__control quantity-container">
                                          <span className="quantity-control decrease icon-minus" onClick={() => setFlightChildrenNumber((prev) => flightChildrenNumber > 0 ? prev -= 1 : prev = 0)}></span>
                                          <span type="number" className="quantity-amount">{flightChildrenNumber}</span>
                                          <span className="quantity-control increase icon-plus" onClick={() => setFlightChildrenNumber((prev) => flightChildrenNumber < 4 ? prev += 1 : prev = 4)}></span>
                                       </div>
                                    </div>
                                    <div className="quantity-list__item">
                                       <div className="quantity-list__info">
                                          <span className="quantity-list__info__title">Infants</span>
                                          <span className="quantity-list__info__subtitle">Under 2</span>
                                       </div>
                                       <div className="quantity-list__control quantity-container">
                                          <span className="quantity-control decrease icon-minus" onClick={() => setFlightInfantsNumber((prev) => flightInfantsNumber > 0 ? prev -= 1 : prev = 0)}></span>
                                          <span type="number" className="quantity-amount">{flightInfantsNumber}</span>
                                          <span className="quantity-control increase icon-plus" onClick={() => setFlightInfantsNumber((prev) => flightInfantsNumber < 2 ? prev += 1 : prev = 2)}></span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className='form-field has-label-md m-b-12 mobile-hidden'>
                        <label htmlFor="" className="float-label">From</label>
                        <input type="text"
                           className="form-control placeholder-medium from-input"
                           placeholder="City"
                           autoComplete='off'
                           // onChange={(e) => setIata(e.target.value)}
                           onClick={(e) => e.stopPropagation()}
                        />
                        <img src={Close} className='zero-input-value' onClick={() => {
                           $('.from-input, .from-input-m').val('').attr('disabled', false);
                           setIata('');
                           $('.zero-input-value').css('display', 'none');
                        }} alt="" />
                        {/* <!-- Inputda search etdikde form-dropdown classina "dropdown-show" classi elave edilecek dropdown acilacaq --> */}
                        <div className={iata.length > 0 ? 'form-dropdown dropdown-show from-input-search-dropdown' : 'form-dropdown from-input-search-dropdown'} style={{ padding: '20px 0 0' }}>
                           <div className="search-result" data-section="region">
                              <div className="search-result__section">
                                 <h6 className="search-result__section__title">City / Airport</h6>
                                 <div className="search-result__list">
                                    {
                                       iataData ? iataData.map((i, index) => (
                                          <span key={i.iata} className="search-result__list__item"
                                             onClick={(e) => {
                                                $('.from-input, .from-input-m').val(`${i.city} (${i.iata})`).attr('disabled', true);
                                                $('.from-input-search-dropdown').removeClass('dropdown-show');
                                                $('.zero-input-value').css('display', 'flex');
                                             }}
                                          >{i.city} ({i.iata})</span>
                                       )) :
                                          <span className='not-find-anything'>Can not find anything</span>
                                    }
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     {/* <!-- Begin  :: Mobile From Input --> */}
                     <div className='form-field has-label-md m-b-12 web-hidden' data-modal="modal-search">
                        <label htmlFor="" className="float-label">From</label>
                        <input
                           type="text"
                           className="form-control placeholder-medium from-input-m"
                           placeholder="City"
                           autoComplete='off'
                           onChange={(e) => setIata(e.target.value)}
                           onClick={(e) => e.stopPropagation()}
                        />
                        <img src={Close} className='zero-input-value' onClick={() => {
                           $('.from-input, .from-input-m').val('').attr('disabled', false);
                           setIata('');
                           $('.zero-input-value').css('display', 'none');
                        }} alt="" />
                        {/* <!-- Inputda search etdikde form-dropdown classina "dropdown-show" classi elave edilecek dropdown acilacaq --> */}
                        <div className={iata.length > 0 ? 'form-dropdown dropdown-show from-input-search-dropdown' : 'from-input-search-dropdown form-dropdown'} id="from-input-search-dropdown" style={{ padding: '20px 0 0' }}>
                           <div className="search-result" data-section="region">
                              <div className="search-result__section">
                                 <h6 className="search-result__section__title">City / Airport</h6>
                                 <div className="search-result__list">
                                    {
                                       iataData?.map((i, index) => (
                                          <span className="search-result__list__item"
                                             onClick={(e) => {
                                                $('.from-input, .from-input-m').val(`${i.city} (${i.iata})`).attr('disabled', true);
                                                $('.from-input-search-dropdown').removeClass('dropdown-show');
                                                $('.zero-input-value').css('display', 'flex');
                                             }}
                                          >{i.city} ({i.iata})</span>
                                       ))
                                    }
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     {/* <!-- End    :: Mobile From Input --> */}
                     <div className="form-field has-label-sm m-b-12">
                        <label htmlFor="" className="float-label" id='to-input'>To</label>
                        <input
                           type="text"
                           className="form-control placeholder-medium"
                           disabled
                           placeholder="Baku (GYD)"
                        />
                     </div>

                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div>
                           <div className="form-field has-label-xl m-b-12" style={{ width: '100%' }}>
                              <DatePicker
                                 label="Departure"
                                 value={value[0]}
                                 onChange={handleStartDateChange}
                                 renderInput={(params) => (
                                    <TextField 
                                       {...params} 
                                       variant="outlined" 
                                       fullWidth 
                                       InputProps={{
                                             ...params.InputProps,
                                             readOnly: true
                                       }} 
                                       sx={{
                                          '& .MuiInputBase-root': {
                                                borderRadius: '8px'
                                          }
                                       }}
                                    />
                                 )}
                                 disablePast
                              />
                           </div>
                           <div className="form-field has-label-lg m-b-12" style={{ width: '100%' }}>
                              <DatePicker
                                 label="Return"
                                 value={value[1]}
                                 onChange={handleEndDateChange}
                                 renderInput={(params) => (
                                    <TextField 
                                       {...params} 
                                       variant="outlined" 
                                       fullWidth 
                                       InputProps={{
                                             ...params.InputProps,
                                             readOnly: true
                                       }} 
                                       sx={{
                                          '& .MuiInputBase-root': {
                                                borderRadius: '8px'
                                          }
                                       }}
                                    />
                                 )}
                                 disablePast
                                 disabled={!value[0]}
                              />
                           </div>
                        </div>
                     </LocalizationProvider>

                     <button className="btn btn-fluid btn-primary m-t-24" onClick={(e) => flightDetailsSubmitHandler(e)}>Submit</button>
                  </div>
               </div>
            </div>
         </div >
         {/* <!-- End  :: Search Flight --> */}

         {/* <!-- Begin  :: Search Flight --> */}
         <div className={modalContent === 'transfer-details' ? 'modal show' : 'modal'} id="modal-search-flights"
            style={{ cursor: 'pointer' }}
            onClick={() => setTransferTimePopupActive(false)}
         >
            <div className="modal-container" data-size="sm" style={{ cursor: 'auto', background: 'white', padding: '32px 24px', borderRadius: '20px 20px 0 0' }}>
               <div className="modal-layout">
                  <div className="modal-layout__header" style={{ marginBottom: '24px' }}>
                     <h4 className="modal-layout__title">Enter Transfer Details</h4>
                     <span className="modal-layout__close modal-close icon-close" onClick={() => setModalContent(null)}></span>
                  </div>
                  <div className="modal-layout__body overflow-inherit">
                     <div className="form-field has-icon m-b-20">
                        <label htmlFor="" className="form-label">Category</label>
                        <div className="form-field">
                           <select className="form-control transfer-details-category-input" style={{ background: '#fff' }} onChange={(e) => setTransferDetails({ ...transferDetails, category: e.target.value })}>
                              <option value="Economy">Economy</option>
                              <option value="Comfort">Comfort</option>
                              <option value="Business">Business</option>
                              <option value="Premium">Premium</option>
                              <option value="Minivan">Minivan</option>
                           </select>
                           <span className="field-icon icon-chevron-down fs-8 color-black"></span>
                        </div>
                     </div>

                     <div className="form-field m-b-20">
                        <label htmlFor="" className="form-label">Pick-up point (address)</label>
                        <input type="text" className="form-control transfer-details-pick-up-input" onChange={(e) => { e.target.value === '' ? $('.transfer-details-pick-up-input').css('border', '1px solid rgb(211, 47, 47)') : $('.transfer-details-pick-up-input').css('border', '1px solid #e5e5e5'); setTransferDetails({ ...transferDetails, PickUpAddress: e.target.value }) }} placeholder="Enter the address" />
                     </div>

                     <div className="form-field m-b-20">
                        <label htmlFor="" className="form-label">Drop-off point (address)</label>
                        <input type="text" className="form-control transfer-details-drop-off-input" onChange={(e) => { e.target.value === '' ? $('.transfer-details-drop-off-input').css('border', '1px solid rgb(211, 47, 47)') : $('.transfer-details-drop-off-input').css('border', '1px solid #e5e5e5'); setTransferDetails({ ...transferDetails, DropOffAddress: e.target.value }) }} placeholder="Enter the address" />
                     </div>

                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                           disablePast
                           value={transferDateValue}
                           inputFormat='DD-MM-YYYY'
                           showToolbar={false}
                           renderInput={({ inputRef, inputProps, InputProps }) => (
                              <React.Fragment>
                                 <div className="form-field m-b-12 transfer-pick-up-date" style={{ width: '100%' }}>
                                    <label htmlFor="" className="form-label">Pick-up Date</label>
                                    <input type="text" className="form-control placeholder-medium transfer-details-pick-up-date-input"
                                       ref={inputRef}
                                       {...inputProps}
                                       placeholder="Select the Date and Time"
                                    />
                                    {InputProps?.endAdornment}
                                    <img src={CalendarImg} style={{
                                       position: 'absolute',
                                       bottom: '13px',
                                       right: '20px',
                                       cursor: 'pointer',
                                       pointerEvents: 'none'
                                    }} alt="" />
                                 </div>
                              </React.Fragment>
                           )}
                           onChange={(newValue) => {
                              setTransferDateValue(newValue);
                              if (newValue === null) {
                                 $('.transfer-details-pick-up-date-input').css('border', '1px solid rgb(211, 47, 47)');
                              } else {
                                 $('.transfer-details-pick-up-date-input').css('border', '1px solid #e5e5e5');
                              }
                           }}
                        />
                     </LocalizationProvider>

                     <div className="form-field m-b-20 transfer-pick-up-time">
                        <label className="form-label">Pick-up Time</label>
                        <input type="text" className="form-control transfer-details-pick-up-time-input" onClick={(e) => { setTransferTimePopupActive(true); e.stopPropagation() }} value={`${transferTimeValue.h}:${transferTimeValue.m}`} readOnly />

                        <div className={transferTimePopupActive === true ? 'transfer-time-popup transfer-time-popup_active' : 'transfer-time-popup'} onClick={(e) => e.stopPropagation()}>
                           <span className='pick-up-text'>Pick-up time</span>

                           <div className="time-select-wrapper">
                              <div className="hour">
                                 <select className='form-control transfer-details-pick-up-hour-input' defaultValue="12" onChange={(e) => setTransferTimeValue({ ...transferTimeValue, h: e.target.value })} style={{ padding: '12px 24px 12px 12px' }}>
                                    <option value="00">00</option>
                                    <option value="01">01</option>
                                    <option value="02">02</option>
                                    <option value="03">03</option>
                                    <option value="04">04</option>
                                    <option value="05">05</option>
                                    <option value="06">06</option>
                                    <option value="07">07</option>
                                    <option value="08">08</option>
                                    <option value="09">09</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                 </select>
                                 <span className="field-icon icon-chevron-down fs-8 color-black"></span>
                              </div>
                              <div className="minute">
                                 <select className='form-control transfer-details-pick-up-hour-input' defaultValue="00" onChange={(e) => setTransferTimeValue({ ...transferTimeValue, m: e.target.value })} style={{ padding: '12px 24px 12px 12px' }}>
                                    <option value="00">00</option>
                                    <option value="05">05</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                    <option value="30">30</option>
                                    <option value="35">35</option>
                                    <option value="40">40</option>
                                    <option value="45">45</option>
                                    <option value="50">50</option>
                                    <option value="55">55</option>
                                 </select>
                                 <span className="field-icon icon-chevron-down fs-8 color-black"></span>
                              </div>

                              <button type='button' className='btn btn-primary' onClick={() => setTransferTimePopupActive(false)}>Confirm</button>
                           </div>
                        </div>
                     </div>

                     <div className="form-field m-b-20">
                        <label htmlFor="" className="form-label">Number of Passengers</label>
                        <input type="text" className="form-control transfer-details-passenger-input" value={transferPassengerNumber} onChange={tranferPassengerHandleChange} placeholder="Enter the number of Passengers" />
                     </div>

                     <button className="btn btn-fluid btn-primary m-t-24" onClick={() => transferDetailsSubmitHandler()}>Submit</button>
                  </div>
               </div>
            </div>
         </div >
         {/* <!-- End  :: Search Flight --> */}

         {/* <!-- Begin  :: Ticket Detail --> */}
         {/* <div className={modalContent === 'ticket-details' ? 'modal mobile-fullscreen show' : 'modal mobile-fullscreen'} id="modal-ticket-detail"
            style={{ cursor: 'pointer' }}
            onClick={() => setModalContent(null)}
         >
            <div className="modal-container" data-size="sm" style={{ cursor: 'auto' }} onClick={(e) => e.stopPropagation()}>
               <div className="modal-layout">
                  <div className="modal-layout__header">
                     <h4 className="modal-layout__title">Itinerary details</h4>
                     <span className="modal-layout__close modal-close icon-close"></span>
                  </div>
                  <div className="modal-layout__body">
                     <div className="flight-detail">
                        <div className="flight-detail__container">
                           <div className="flight-detail__info">
                              <span className="flight-detail__info__date">12:00 PM</span>
                              <span className="flight-detail__info__content">
                                 <span className="flight-detail__info__country">Baku</span>
                                 <span className="flight-detail__info__airport">Heydar Aliyev International (GYD)</span>
                              </span>
                           </div>
                           <div className="flight-detail__feature">
                              <div className="flight-detail__feature__label">
                                 <span className="flight-detail__feature__label__info">
                                    <div className="flight-detail__feature__label__avatar">
                                       <img src={AirlinesImg}
                                          className="img-fluid" alt="logo" />
                                    </div>
                                    <span className="flight-detail__feature__label__badge">Turkish Airlines</span>
                                    <span className="flight-detail__feature__label__badge">2h 10m</span>
                                 </span>
                                 <span className="flight-detail__feature__label__icon icon-chevron-down"></span>
                              </div>
                              <div className="flight-detail__feature__list">
                                 <div className="flight-detail__feature__list__item">
                                    <span className="flight-detail__feature__list__icon icon-shoulder-bag"></span>
                                    <span className="flight-detail__feature__list__label">8 kg cabin baggage</span>
                                 </div>
                                 <div className="flight-detail__feature__list__item">
                                    <span className="flight-detail__feature__list__icon icon-suitcase"></span>
                                    <span className="flight-detail__feature__list__label">23 kg checked baggage</span>
                                 </div>
                                 <div className="flight-detail__feature__list__item">
                                    <span className="flight-detail__feature__list__icon icon-info"></span>
                                    <span className="flight-detail__feature__list__label">Flight no. F8 789</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flight-detail__info">
                              <span className="flight-detail__info__date">10:35 PM</span>
                              <span className="flight-detail__info__content">
                                 <span className="flight-detail__info__country">Istanbul</span>
                                 <span className="flight-detail__info__airport">Istanbul Airport (IST)</span>
                              </span>
                           </div>
                        </div>
                        <div className="flight-detail__container">
                           <div className="flight-detail__holder">
                              <span className="flight-detail__holder__icon icon-info"></span>
                              <div className="flight-detail__holder__list">
                                 <span className="flight-detail__holder__list__item">3h 20m layover</span>
                                 <span className="flight-detail__holder__list__item">Self-transfer</span>
                              </div>
                           </div>
                        </div>
                        <div className="flight-detail__container">
                           <div className="flight-detail__info">
                              <span className="flight-detail__info__date">11:00 AM</span>
                              <span className="flight-detail__info__content">
                                 <span className="flight-detail__info__country">Istanbul</span>
                                 <span className="flight-detail__info__airport">Istanbul Airport (IST)</span>
                              </span>
                           </div>
                           <div className="flight-detail__feature">
                              <div className="flight-detail__feature__label">
                                 <span className="flight-detail__feature__label__info">
                                    <div className="flight-detail__feature__label__avatar">
                                       <img src={AirlinesImg}
                                          className="img-fluid" alt="logo" />
                                    </div>
                                    <span className="flight-detail__feature__label__badge">Turkish Airlines</span>
                                    <span className="flight-detail__feature__label__badge">2h 10m</span>
                                 </span>
                                 <span className="flight-detail__feature__label__icon icon-chevron-down"></span>
                              </div>
                              <div className="flight-detail__feature__list">
                                 <div className="flight-detail__feature__list__item">
                                    <span className="flight-detail__feature__list__icon icon-shoulder-bag"></span>
                                    <span className="flight-detail__feature__list__label">8 kg cabin baggage</span>
                                 </div>
                                 <div className="flight-detail__feature__list__item">
                                    <span className="flight-detail__feature__list__icon icon-suitcase"></span>
                                    <span className="flight-detail__feature__list__label">23 kg checked baggage</span>
                                 </div>
                                 <div className="flight-detail__feature__list__item">
                                    <span className="flight-detail__feature__list__icon icon-info"></span>
                                    <span className="flight-detail__feature__list__label">Flight no. F8 789</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flight-detail__info">
                              <span className="flight-detail__info__date">10:35 PM</span>
                              <span className="flight-detail__info__content">
                                 <span className="flight-detail__info__country">New York</span>
                                 <span className="flight-detail__info__airport">John F. Kennedy International
                                    (JFK)</span>
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="modal-layout__footer">
                     <div className="flight-calculator">
                        <span className="flight-calculator__amount">€389</span>
                        <span className="flight-calculator__label">1 adult</span>
                     </div>
                     <button className="btn btn-fluid btn-primary" onClick={() => setModalContent('flights-pay')}>Buy</button>
                  </div>
               </div>
            </div>
         </div> */}
         {/* <!-- End  :: Ticket Detail --> */}

         {/* <!-- Begin  :: Flight Pay --> */}
         <div className={modalContent === 'flights-pay' ? 'modal mobile-fullscreen show' : 'modal mobile-fullscreen'} id="modal-pay"
            style={{ cursor: 'pointer' }}
            onClick={() => setModalContent(null)}
         >
            <div className="modal-container" style={{ background: 'white', padding: '32px 24px', borderRadius: '20px 20px 0 0' }} data-size="sm" onClick={(e) => e.stopPropagation()}>
               <div className="modal-layout">
                  <div className="modal-layout__header">
                     <h4 className="modal-layout__title">Enter passport details</h4>
                     <span className="modal-layout__close modal-close icon-close" onClick={() => setModalContent(null)}></span>
                  </div>
                  <div className="modal-layout__body" id='passport-details-passengers-area'>
                     <div className="form-step">
                        <h4 className="form-step__title">Contact details</h4>
                        <div className="form-step__container">
                           <div className="form-field m-b-20">
                              <label htmlFor="" className="form-label">E-mail adress</label>
                              <input type="email" className="form-control" id='add-passengers-email' placeholder="E-mail" />
                           </div>
                           <div className="form-field">
                              <label htmlFor="" className="form-label">Phone number</label>
                              <div className="form-field-multiple" style={{ width: '100%' }}>
                                 <div className="form-field" style={{ width: '100%' }}>
                                    {/* <input type="email" className="form-control" placeholder="Phone number" /> */}
                                    <PhoneInput
                                       placeholder="Enter phone number"
                                       value={phoneValue}
                                       onChange={setPhoneValue}
                                       defaultCountry="AZ"
                                       countryCallingCodeEditable={false}
                                       international
                                       className="form-control"
                                       id="add-passengers-phone" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="form-step">
                        <h4 className="form-step__title">
                           {/* <span className="form-step__remove icon-minus"></span> */}
                           Primary passenger
                        </h4>
                        <div className="form-step__container">
                           <div className="form-field m-b-20">
                              <label htmlFor="" className="form-label">Given name</label>
                              <input type="text" className="form-control add-passenger-given-name" placeholder="Given name" />
                           </div>
                           <div className="form-field m-b-20">
                              <label htmlFor="" className="form-label">Surname</label>
                              <input type="text" className="form-control add-passenger-surname" placeholder="Surname" />
                           </div>
                           <div className="form-field has-icon m-b-20">
                              <label htmlFor="" className="form-label">Gender</label>
                              <div className="form-field">
                                 <select className="form-control add-passenger-gender">
                                    <option disabled defaultValue>Choose gender</option>
                                    <option value="1">Male</option>
                                    <option value="2">Female</option>
                                    <option value="3">Other</option>
                                 </select>
                                 <span className="field-icon icon-chevron-down fs-8 color-black"></span>
                              </div>
                           </div>
                           <div className="form-field m-b-20">
                              <label htmlFor="" className="form-label">Date of birth</label>
                              <div className="form-field-multiple add-passenger-birthDate">
                                 <div className="form-field day-input">
                                    <input type="number" className="form-control add-passenger-day-of-birth" placeholder="DD" />
                                 </div>
                                 <div className="form-field has-icon month-input">
                                    <select className="form-control add-passenger-month-of-birth">
                                       <option disabled defaultValue>Month</option>
                                       <option value="0">January</option>
                                       <option value="1">February</option>
                                       <option value="2">March</option>
                                       <option value="3">April</option>
                                       <option value="4">May</option>
                                       <option value="5">June</option>
                                       <option value="6">July</option>
                                       <option value="7">August</option>
                                       <option value="8">September</option>
                                       <option value="9">October</option>
                                       <option value="10">November</option>
                                       <option value="11">December</option>
                                    </select>
                                    <span className="field-icon icon-chevron-down fs-8 color-black"></span>
                                 </div>
                                 <div className="form-field year-input">
                                    <input type="number" className="form-control add-passenger-year-of-birth" placeholder="YYYY" />
                                 </div>
                              </div>
                           </div>
                           <div className="form-field m-b-20">
                              <label htmlFor="" className="form-label">Passport or ID number</label>
                              <input type="text" className="form-control add-passenger-passportID" maxLength={30} placeholder="Passport or ID number" />
                           </div>
                           <div className="form-field has-icon m-b-20">
                              <label htmlFor="" className="form-label">Country of issue</label>
                              <div className="form-field">
                                 <select className="form-control add-passenger-country">
                                    <option defaultValue>Azerbaijan</option>
                                    {countryFile.map((c, i) => (
                                       <option key={i} value={c.name}>{c.name}</option>

                                    ))
                                    }
                                 </select>
                                 <span className="field-icon icon-chevron-down fs-8 color-black"></span>
                              </div>
                           </div>
                           <div className="form-field m-b-20">
                              <label htmlFor="" className="form-label">Expiration date</label>
                              <div className="form-field-multiple add-passenger-expiredDate">
                                 <div className="form-field day-input">
                                    <input type="text" className="form-control add-passenger-expired-day" maxLength={2} placeholder="DD" />
                                 </div>
                                 <div className="form-field has-icon month-input">
                                    <select className="form-control add-passenger-expired-month">
                                       <option disabled defaultValue>Month</option>
                                       <option value="0">January</option>
                                       <option value="1">February</option>
                                       <option value="2">March</option>
                                       <option value="3">April</option>
                                       <option value="4">May</option>
                                       <option value="5">June</option>
                                       <option value="6">July</option>
                                       <option value="7">August</option>
                                       <option value="8">September</option>
                                       <option value="9">October</option>
                                       <option value="10">November</option>
                                       <option value="11">December</option>
                                    </select>
                                    <span className="field-icon icon-chevron-down fs-8 color-black"></span>
                                 </div>
                                 <div className="form-field year-input">
                                    <input type="text" className="form-control add-passenger-expired-year" maxLength={4} placeholder="YYYY" />
                                 </div>
                              </div>
                           </div>
                           <label htmlFor="1" className="checkbox no-expired m-b-20">
                              <input type="checkbox" id="1" />
                              <span className="checkbox-control"></span>
                              <span className="checkbox-label">No expiration</span>
                           </label>
                        </div>
                     </div>
                  </div>
                  <div className="modal-layout__footer">
                     <button className="btn btn-fluid btn-secondary" id='add-another-passenger' onClick={(e) => addAnotherPassenger(e)}><span className="btn-icon icon-add-person"></span>Add
                        another passenger</button>
                     <button className="btn btn-fluid btn-primary m-t-12" onClick={(e) => passengersSubmitHandler(e)}>Submit Details</button>
                  </div>
               </div>
            </div>
         </div>
         {/* <!-- End  :: Flight Pay --> */}

         {/* <!-- Begin  :: Mobile Filter Type of Flight --> */}
         <div className={typeOfFlightModal === false ? 'modal' : 'modal show'} id="modal-type-of-flight" onClick={() => { setFlightDirection(flightDirectionFlag); setTypeOfFlightModal(false) }}>
            <div className="modal-container" style={{ background: 'white', padding: '32px 24px', borderRadius: '20px 20px 0 0' }} data-size="sm" onClick={(e) => e.stopPropagation()}>
               <div className="radio-list">
                  <label htmlFor="one-way" className="radio-list__item">
                     <input type="radio" id="one-way" name="type-of-flight" onClick={() => { setFlightDirection('One way'); setValue([new Date().toDateString(), null]) }} />
                     <span className="radio-list__item__label">One way</span>
                     <span className="radio-list__item__control" style={{ borderColor: flightDirection === 'One way' ? '#274DE0' : '#E5E5E5' }}>
                        <div className="radio-list__item__control_circle" style={{ background: flightDirection === 'One way' ? '#274DE0' : 'transparent' }}></div>
                     </span>
                  </label>
                  <label htmlFor="return" className="radio-list__item">
                     <input type="radio" id="return" name="type-of-flight" onClick={() => { setFlightDirection('Return'); setValue([new Date().toDateString(), new Date(2025, new Date().getMonth(), new Date().getDate() + 1).toDateString()]) }} />
                     <span className="radio-list__item__label">Return</span>
                     <span className="radio-list__item__control" style={{ borderColor: flightDirection === 'Return' ? '#274DE0' : '#E5E5E5' }}>
                        <div className="radio-list__item__control_circle" style={{ background: flightDirection === 'Return' ? '#274DE0' : 'transparent' }}></div>
                     </span>
                  </label>
               </div>
               <div className="flex flex-middle">
                  <button className="btn btn-md btn-fluid btn-light modal-close m-r-8" onClick={() => { setFlightDirection(flightDirectionFlag); setTypeOfFlightModal(false) }}>Close</button>
                  <button className="btn btn-md btn-fluid btn-primary modal-close ml-8" onClick={() => setTypeOfFlightModal(false)}>Save</button>
               </div>
            </div>
         </div>
         {/* <!-- End  ::  Mobile Filter Type of Flight --> */}

         {/* <!-- Begin  :: Mobile Filter Type of Class --> */}
         <div className={typeOfClassesModal === false ? 'modal' : 'modal show'} id="modal-type-of-class" onClick={() => { setFlightClasses(flightClassesFlag); setTypeOfClassesModal(false) }}>
            <div className="modal-container" style={{ background: 'white', padding: '32px 24px', borderRadius: '20px 20px 0 0' }} data-size="sm" onClick={(e) => e.stopPropagation()}>
               <div className="radio-list">
                  <label htmlFor="Economy" className="radio-list__item" onClick={() => setFlightClasses('Economy')}>
                     <input type="radio" id="economy" defaultChecked name="type-of-class" />
                     <span className="radio-list__item__label">Economy</span>
                     <span className="radio-list__item__control" style={{ borderColor: flightClasses === 'Economy' ? '#274DE0' : '#E5E5E5' }}>
                        <div className="radio-list__item__control_circle" style={{ background: flightClasses === 'Economy' ? '#274DE0' : 'transparent' }}></div>
                     </span>
                  </label>
                  <label htmlFor="Business" className="radio-list__item" onClick={() => setFlightClasses('Business')}>
                     <input type="radio" id="business" name="type-of-class" />
                     <span className="radio-list__item__label">Business</span>
                     <span className="radio-list__item__control" style={{ borderColor: flightClasses === 'Business' ? '#274DE0' : '#E5E5E5' }}>
                        <div className="radio-list__item__control_circle" style={{ background: flightClasses === 'Business' ? '#274DE0' : 'transparent' }}></div>
                     </span>
                  </label>
                  <label htmlFor="First-Class" className="radio-list__item" onClick={() => setFlightClasses('First')}>
                     <input type="radio" id="first-class" name="type-of-class" />
                     <span className="radio-list__item__label">First Class</span>
                     <span className="radio-list__item__control" style={{ borderColor: flightClasses === 'First' ? '#274DE0' : '#E5E5E5' }}>
                        <div className="radio-list__item__control_circle" style={{ background: flightClasses === 'First' ? '#274DE0' : 'transparent' }}></div>
                     </span>
                  </label>
               </div>
               <div className="flex flex-middle">
                  <button className="btn btn-md btn-fluid btn-light modal-close m-r-8" onClick={() => { setFlightClasses(flightClassesFlag); setTypeOfClassesModal(false) }}>Close</button>
                  <button className="btn btn-md btn-fluid btn-primary modal-close ml-8" onClick={() => setTypeOfClassesModal(false)}>Save</button>
               </div>
            </div>
         </div>
         {/* <!-- End  ::  Mobile Filter Type of Class --> */}

         {/* <!-- Begin  :: Mobile Filter Type of Passanger --> */}
         <div className={typeOfPassengersModal === false ? 'modal' : 'modal show'} id="modal-type-of-passanger" onClick={() => { setFlightAdultNumber(flightPassengersFlag.adults); setFlightChildrenNumber(flightPassengersFlag.childrens); setFlightInfantsNumber(flightPassengersFlag.infants); setTypeOfPassengersModal(false) }}>
            <div className="modal-container" style={{ background: 'white', padding: '32px 24px', borderRadius: '20px 20px 0 0' }} data-size="sm" onClick={(e) => e.stopPropagation()}>
               <div className="quantity-list">
                  <div className="quantity-list__item">
                     <div className="quantity-list__info">
                        <span className="quantity-list__info__title">Adults</span>
                        <span className="quantity-list__info__subtitle">Over 12</span>
                     </div>
                     <div className="quantity-list__control quantity-container">
                        <span className="quantity-control decrease icon-minus" onClick={() => setFlightAdultNumber((prev) => flightAdultNumber > 1 ? prev -= 1 : prev = 1)}></span>
                        <span className="quantity-amount">{flightAdultNumber}</span>
                        <span className="quantity-control increase icon-plus" onClick={() => setFlightAdultNumber((prev) => flightAdultNumber < 6 ? prev += 1 : prev = 6)}></span>
                     </div>
                  </div>
                  <div className="quantity-list__item">
                     <div className="quantity-list__info">
                        <span className="quantity-list__info__title">Children</span>
                        <span className="quantity-list__info__subtitle">2-11</span>
                     </div>
                     <div className="quantity-list__control quantity-container">
                        <span className="quantity-control decrease icon-minus" onClick={() => setFlightChildrenNumber((prev) => flightChildrenNumber > 0 ? prev -= 1 : prev = 0)}></span>
                        <span className="quantity-amount">{flightChildrenNumber}</span>
                        <span className="quantity-control increase icon-plus" onClick={() => setFlightChildrenNumber((prev) => flightChildrenNumber < 4 ? prev += 1 : prev = 4)}></span>
                     </div>
                  </div>
                  <div className="quantity-list__item">
                     <div className="quantity-list__info">
                        <span className="quantity-list__info__title">Infants</span>
                        <span className="quantity-list__info__subtitle">0-2</span>
                     </div>
                     <div className="quantity-list__control quantity-container">
                        <span className="quantity-control decrease icon-minus" onClick={() => setFlightInfantsNumber((prev) => flightInfantsNumber > 0 ? prev -= 1 : prev = 0)}></span>
                        <span className="quantity-amount">{flightInfantsNumber}</span>
                        <span className="quantity-control increase icon-plus" onClick={() => setFlightInfantsNumber((prev) => flightInfantsNumber < 2 ? prev += 1 : prev = 2)}></span>
                     </div>
                  </div>
               </div>
               <div className="flex flex-middle">
                  <button className="btn btn-md btn-fluid btn-light modal-close m-r-8" onClick={() => { setFlightAdultNumber(flightPassengersFlag.adults); setFlightChildrenNumber(flightPassengersFlag.childrens); setFlightInfantsNumber(flightPassengersFlag.infants); setTypeOfPassengersModal(false) }}>Close</button>
                  <button className="btn btn-md btn-fluid btn-primary modal-close ml-8" onClick={() => setTypeOfPassengersModal(false)}>Save</button>
               </div>
            </div>
         </div>
         {/* <!-- End  ::  Mobile Filter Type of Passanger --> */}

         {/* <!-- Begin  :: Search and Search Result --> */}
         <div className="modal mobile-fullscreen" id="modal-search">
            <div className="modal-container" style={{ background: 'white', padding: '32px 24px', borderRadius: '20px 20px 0 0' }} data-size="sm">
               <div className="modal-layout">
                  <div className="modal-layout__header">
                     <h4 className="modal-layout__title">Departure from</h4>
                     <span className="modal-layout__close modal-close icon-close"></span>
                  </div>
                  <div className="modal-layout__body">
                     <div className="form-field m-b-20 m-t-20">
                        <input type="text" className="form-control placeholder-medium" placeholder="Enter a city, airport, or place" />
                     </div>
                     <div className="search-result" data-section="region">
                        <div className="search-result__section">
                           <h6 className="search-result__section__title">Regions</h6>
                           <div className="search-result__list">
                              <span className="search-result__list__item">Baku</span>
                              <span className="search-result__list__item">Barcelona</span>
                              <span className="search-result__list__item">Bali</span>
                           </div>
                        </div>
                     </div>
                     <div className="search-result" data-section="airport">
                        <div className="search-result__section">
                           <h6 className="search-result__section__title">Airports</h6>
                           <div className="search-result__list">
                              <span className="search-result__list__item">Baku Heydar Aliyev International Airport (GYD)</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="modal-layout__footer">
                     <div className="flex flex-middle">
                        <button className="btn btn-md btn-fluid btn-light modal-close m-r-8">Close</button>
                        <button className="btn btn-md btn-fluid btn-primary modal-close ml-8">Save</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         {/* <!-- End  ::  Search and Search Result --> */}

         {/* <!-- Begin  :: Preview Gallery --> */}
         {/* <div className={budgetHotelGalleryModal === false ? 'modal' : 'modal show'} onClick={() => setBudgetHotelGalleryModal(false)} id="modal-gallery">
            <div className="modal-container budget-hotel-modal-container" data-size="sm" onClick={(e) => e.stopPropagation()}>
               <div className="modal-layout">
                  <div className="modal-layout__header">
                     <h4 className="modal-layout__title">Gallery</h4>
                     <span className="modal-layout__close modal-close icon-close" onClick={() => setBudgetHotelGalleryModal(false)}></span>
                  </div>
                  <div className="modal-layout__body">
                     <div className="gallery-wrapper">
                        <div className="gallery-main">
                           <Swiper
                              navigation={true}
                              speed={250}
                              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                              onSlideChange={(e) => { setGalleryImageIndex({ ...galleryImageIndex, current: e.realIndex += 1 }); $('.swiper-slide-active .hotel-image .overlay-filter').css('background', 'rgba(255, 255, 255, 0.6)') }}
                              onSwiper={(e) => { setGalleryImageIndex({ ...galleryImageIndex, current: e.realIndex + 1 }) }}
                              modules={[Navigation, Thumbs]}
                              spaceBetween={10}
                              className="mySwiper2"
                           >
                              <SwiperSlide>
                                 <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/1.jpg')` }}></div>
                              </SwiperSlide>
                              <SwiperSlide>
                                 <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/2.jpg` }}></div>
                              </SwiperSlide>
                              <SwiperSlide>
                                 <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/3.jpg` }}></div>
                              </SwiperSlide>
                              <SwiperSlide>
                                 <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/4.jpg')` }}></div>
                              </SwiperSlide>
                              <SwiperSlide>
                                 <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/5.jpg')` }}></div>
                              </SwiperSlide>
                              <SwiperSlide>
                                 <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/6.jpg')` }}></div>
                              </SwiperSlide>
                              <SwiperSlide>
                                 <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/7.jpg')` }}></div>
                              </SwiperSlide>
                              <SwiperSlide>
                                 <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/8.jpg')` }}></div>
                              </SwiperSlide>
                              <SwiperSlide>
                                 <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/9.jpg')` }}></div>
                              </SwiperSlide>
                              <SwiperSlide>
                                 <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/10.jpg')` }}></div>
                              </SwiperSlide>
                              <SwiperSlide>
                                 <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/11.jpg')` }}></div>
                              </SwiperSlide>
                              <SwiperSlide>
                                 <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/12.jpg')` }}></div>
                              </SwiperSlide>
                              <SwiperSlide>
                                 <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/13.jpg')` }}></div>
                              </SwiperSlide>
                              <SwiperSlide>
                                 <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/14.jpg')` }}></div>
                              </SwiperSlide>
                           </Swiper>
                        </div>
                     </div>
                     <span className="swiper-fraction"></span>
                     <div className="gallery-thumbnail">
                        <div className="image-counter-area">
                           <span>{galleryImageIndex.current} / {galleryImageIndex.all}</span>
                        </div>
                        <Swiper
                           onSwiper={setThumbsSwiper}
                           spaceBetween={10}
                           speed={250}
                           slidesPerGroup={1}
                           modules={[Thumbs]}
                           watchSlidesProgress={true}
                           slidesPerView={6}
                           className="mySwiper"
                        // breakpoints={{
                        //    0: {
                        //       slidesPerView: 7
                        //    },
                        //    504: {
                        //       slidesPerView: 6
                        //    }
                        // }}
                        >
                           <SwiperSlide>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/1.jpg')` }}></div>
                           </SwiperSlide>
                           <SwiperSlide>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/2.jpg` }}></div>
                           </SwiperSlide>
                           <SwiperSlide>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/3.jpg` }}></div>
                           </SwiperSlide>
                           <SwiperSlide>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/4.jpg')` }}></div>
                           </SwiperSlide>
                           <SwiperSlide>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/5.jpg')` }}></div>
                           </SwiperSlide>
                           <SwiperSlide>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/6.jpg')` }}></div>
                           </SwiperSlide>
                           <SwiperSlide>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/7.jpg')` }}></div>
                           </SwiperSlide>
                           <SwiperSlide>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/8.jpg')` }}></div>
                           </SwiperSlide>
                           <SwiperSlide>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/9.jpg')` }}></div>
                           </SwiperSlide>
                           <SwiperSlide>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/10.jpg')` }}></div>
                           </SwiperSlide>
                           <SwiperSlide>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/11.jpg')` }}></div>
                           </SwiperSlide>
                           <SwiperSlide>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/12.jpg')` }}></div>
                           </SwiperSlide>
                           <SwiperSlide>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/13.jpg')` }}></div>
                           </SwiperSlide>
                           <SwiperSlide>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('https://cdn.monkigo.com/budget-hotel/14.jpg')` }}></div>
                           </SwiperSlide>
                        </Swiper>
                     </div>
                  </div>
               </div>
            </div>
         </div> */}
         {/* <!-- End  ::  Preview Gallery --> */}

         {/* <!-- Begin  :: Flight Pay --> */}
         {/* <div className={modalContent === 'budget-room-reserve' ? 'modal mobile-fullscreen show' : 'modal mobile-fullscreen'} id="modal-pay"
            style={{ cursor: 'pointer' }}
            onClick={() => setModalContent(null)}
         >
            <div className="modal-container" data-size="sm" onClick={(e) => e.stopPropagation()}>
               <div className="modal-layout">
                  <div className="modal-layout__header">
                     <h4 className="modal-layout__title">Enter guest details</h4>
                     <span className="modal-layout__close modal-close icon-close"></span>
                  </div>
                  <div className="modal-layout__body">
                     <div className="form-step">
                        <h4 className="form-step__title">Contact details</h4>
                        <div className="form-step__container">
                           <div className="form-field m-b-20">
                              <label htmlFor="" className="form-label">E-mail adress</label>
                              <input type="email" id='budget-reserve-email' className="form-control" placeholder="E-mail" />
                           </div>
                        </div>
                     </div>
                     <div className="form-step">
                        <h4 className="form-step__title">Primary guest</h4>
                        <div className="form-step__container">
                           <div className="form-field m-b-20">
                              <label htmlFor="" className="form-label">Given name</label>
                              <input type="text" id='budget-reserve-given-name' className="form-control" placeholder="Given name" />
                           </div>
                           <div className="form-field m-b-20">
                              <label htmlFor="" className="form-label">Surname</label>
                              <input type="text" id='budget-reserve-surname' className="form-control" placeholder="Surname" />
                           </div>
                           <div className="form-field has-icon m-b-20">
                              <label htmlFor="" className="form-label">Gender</label>
                              <div className="form-field">
                                 <select className="form-control" id='budget-reserve-gender'>
                                    <option disabled selected>Choose gender</option>
                                    <option defaultValue="1">Male</option>
                                    <option defaultValue="2">Female</option>
                                    <option defaultValue="3">Other</option>
                                 </select>
                                 <span className="field-icon icon-chevron-down fs-8 color-black"></span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="radio-list radio-list__standart p-b-20">
                        <label htmlFor="same-room" className="radio-list__item">
                           <input defaultValue='same-room' type="radio" id="same-room" defaultChecked name="type-of-room" />
                           <span className="radio-list__item__control"></span>
                           <span className="radio-list__item__label">Same room</span>
                        </label>
                        <label htmlFor="different-room" className="radio-list__item">
                           <input defaultValue='different-room' type="radio" id="different-room" name="type-of-room" />
                           <span className="radio-list__item__control"></span>
                           <span className="radio-list__item__label">Different rooms</span>
                        </label>
                     </div>
                  </div>
                  <div className="modal-layout__footer">
                     <button className="btn btn-fluid btn-primary m-t-12" onClick={() => BudgetReserveSubmitHandler()}>Submit</button>
                  </div>
               </div>
            </div>
         </div> */}
         {/* <!-- End  :: Flight Pay --> */}

      </section >
   )
}


export default ChatUser
