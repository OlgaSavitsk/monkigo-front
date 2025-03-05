import React, { useEffect, useState, useRef } from 'react';
import './chatadmin.scss';

///IMPORT COMPONENTS
import $ from 'jquery';
import { uid } from 'uid';

////IMPORT IMAGES
import Logo from '../../assets_concierge/images/logo/logo.svg';
import LogoIAC from '../../../src/assets/navbar-second/logo-iac2023.svg';
import useId from '@mui/material/utils/useId';

const ChatAdmin = () => {

   const [inputBarActive, setInputBarActive] = useState(false);
   const [initChatsSocketConnection, setInitChatsSocketConnection] = useState(false);



   const [chatName, setChatName] = useState('Monkigo');
   const [sideBarToggle, setSideBarToggle] = useState(false);
   const [paymentDetailsModal, setPaymentDetailsModal] = useState(false);


   const chatSocketsArray = useRef([]);
   const chatSocket = useRef(null);
   const chatStore = useRef([]);
   var chatDateDivider_Today = false;
   var chatDateDivider_Yesterday = false;
   var chatDateDivider_Exists = [];
   var pagination = 0;

   useEffect(() => {
      localStorage.removeItem('chk');
      if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined) {
         $.ajax({
            method: 'GET',
            url: 'https://monkigo.com/app/v1/user/validation/info',
            data: { token: localStorage.getItem('token') },
            success: function (result) {
               if (result.data.license !== 'guest' && result.data.expiringDate > 0) {
                  return;
               }
               else {
                  localStorage.clear();
                  window.location.href = "/auth"
               }
            }
         })
      }
      else {
         localStorage.clear();
         window.location.href = "/auth"
      }
   }, []);

   const sendMessageHandleChange = (e) => {
      const { value } = e.target;
      if (value.length > 0) {
         setInputBarActive(true);
      } else {
         setInputBarActive(false);
      }

   }

   //////////SEND MESSAGE/////////
   const sendMessage = () => {
      if ($('#messageText').val().trim() !== '') {

         var msgID = uid();
         const messageTemp = $('#messageText').val().replace(/(\r\n|\r|\n)/g, '<br/>');

         var appendText =
            `
            <div class="chat-messenger__content content-right content-admin" id="${msgID}">
               <div class="chat-messenger__content__container">
                  <div class="chat-messenger__avatar">
                     <img src='${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png'
                        class="img-fluid border-radius-full" alt="avatar" />
                  </div>
                  <div class="chat-messenger__holder" style="">
                     <div class="chat-messenger__text" style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                        ${messageTemp}
                        <div class="remove-admin-message-btn" style="cursor: pointer;">
                           <img src='${process.env.PUBLIC_URL}/images_concierge/other/icon/x.svg'/>
                        </div>
                     </div>
                     <div class="chat-messenger__statusbar">
                        <span class="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(Date.now()))}</span>
                        <span class="chat-messenger__status sending"></span>
                     </div>   
                  </div>
               </div>
            </div>
         `;

         var message = {
            msgID: msgID,
            role: 1,
            type: 0,
            target: "message",
            body: messageTemp
         }
         chatStore.current.push(message);
         localStorage.setItem('store', JSON.stringify(chatStore.current));

         if (chatSocket.current !== null) {
            if (chatSocket.current.readyState === 1) {
               chatSocket.current.send(new TextEncoder().encode(JSON.stringify(message)));
            }
         }

         $('#chatBody').append(appendText);
         ChatBodyScrollTo();
         $('#messageText').val('');
      }
   }

   /////SEND MESSAGE HANDLER KEY PRESS
   const sendMessageHandleKeyPress = (e) => {
      if (e.keyCode === 13 && !e.shiftKey) {
         if ($('#messageText').val().trim() !== '') {
            sendMessage();
         }
      }

      if (e.keyCode === 13 && e.shiftKey) {
         document.querySelector('textarea').style.height = '60px'
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

   setInterval(() => {
      if (chatSocket.current !== null) {
         if (chatSocket.current.readyState === 1) {
            Observer();
         }
      }
   }, 2000);

   ///Observer
   function Observer() {
      if (chatSocket.current !== null) {
         if (chatSocket.current.readyState === 1) {
            if (chatStore.current !== null) {
               for (var i = 0; i < chatStore.current.length; i++) {
                  CheckMessageStatus(chatStore.current.pop().msgID);
               }
            }
         }
      }
   }

   function CheckMessageStatus(msgID) {
      if (chatSocket.current.readyState !== null) {
         if (chatSocket.current.readyState === 1) {
            var message = {
               msgID: msgID,
               target: 'chk_msg_status'
            }
            chatSocket.current.send(new TextEncoder().encode(JSON.stringify(message)));
         }
      }
   }

   useEffect(() => {
      document.querySelector('.dashboard-navigation').addEventListener("scroll", (event) => {
         if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight) {
            pagination++;
            $.ajax({
               method: 'GET',
               url: `https://monkigo.com/app/v1/concierge/chat/moderator/all/chats?token=${localStorage.getItem('token')}&p=${pagination}`,
               success: (response) => {

                  if (response.result.status && response.data) {
                     var inbox = document.querySelector('.dashboard-navigation');

                     for (var i = 0; i < response.data.length; i++) {
                        var messageCount = '';
                        if (response.data[i].unreadMsg > 0) {
                           messageCount = `<span class="dashboard-navigation__badge">${response.data[i].unreadMsg}</span>`
                        }
                        var appendText = '';

                        appendText = `
                                    <a href="#" class="dashboard-navigation__item" id=${response.data[i].chk}>
                                    <span class="dashboard-navigation__fullname">${response.data[i].name}</span>
                                    <span class="dashboard-navigation__last-message">${response.data[i].from}: ${response.data[i].message}</span>
                                    ${messageCount}
                                 </a>`;

                        $(inbox).append(appendText);                        
                     }
                  }
               }
            })
         }
      })
   }, [])

   /////INBOX SOCKET
   useEffect(() => {
      if (initChatsSocketConnection === false) {
         InitialInboxListenerSocket();
      }

   }, []);

   function InitialInboxListenerSocket() {
      try {
         const socket = new WebSocket('wss://monkigo.com/app/v1/concierge/chat/all?token=' + localStorage.getItem('token'));

         socket.onopen = () => {
            setInitChatsSocketConnection(true);
         }

         socket.onclose = () => {
            setTimeout(() => {
               InitialInboxListenerSocket();
            }, 1000)
         }

         socket.onerror = (error) => {
         }

         socket.onmessage = (content) => {

            if (content.data !== null) {
               InboxRender(content);
            }
         }
         setInitChatsSocketConnection(true);

      }
      catch (e) {

      }
   }

   function InboxRender(content) {
      const reader = new FileReader();
      reader.onload = function () {
         const data = new TextDecoder().decode(reader.result);
         var msgContent = JSON.parse(data);
         for (var i = 0; i < msgContent.length; i++) {
            if (RegexHtmlMatch(msgContent[i].message)) {
               msgContent[i].message = 'Information content'
            }
            if (IsJson(msgContent[i].message)) {
               msgContent[i].message = 'Information content'
            }
         }

         var inbox = document.querySelector('.dashboard-navigation');

         inbox.innerHTML = '';
         for (var i = 0; i < msgContent.length; i++) {
            var messageCount = '';
            if (msgContent[i].unreadMsg > 0) {
               messageCount = `<span class="dashboard-navigation__badge">${msgContent[i].unreadMsg}</span>`
            }
            var appendText = '';
            if (msgContent[i].message === 'New') {
               appendText = `
                  <a href="#" class="dashboard-navigation__item" id=${msgContent[i].chk}>
                  <span class="dashboard-navigation__fullname">New User</span>
                  <span class="dashboard-navigation__last-message">${msgContent[i].from} wait</span>
                  <span class="dashboard-navigation__badge">N</span>
               </a>
                  `;
            }
            else {
               if (localStorage.getItem('chk') === msgContent[i].chk) {
                  appendText = `
                     <a href="#" class="dashboard-navigation__item active" id=${msgContent[i].chk}>
                     <span class="dashboard-navigation__fullname">${msgContent[i].name}</span>
                     <span class="dashboard-navigation__last-message">${msgContent[i].from}: ${msgContent[i].message}</span>
                  </a>`;
               }
               else {
                  appendText = `
                        <a href="#" class="dashboard-navigation__item" id=${msgContent[i].chk}>
                        <span class="dashboard-navigation__fullname">${msgContent[i].name}</span>
                        <span class="dashboard-navigation__last-message">${msgContent[i].from}: ${msgContent[i].message}</span>
                        ${messageCount}
                     </a>`;
               }
            }
            $(inbox).append(appendText);
         }
      }
      reader.readAsArrayBuffer(content.data);

   }

   function RegexHtmlMatch(text) {
      const regex = /<(\/*?)(?!(em|p|br\s*\/|strong))\w+?.+?>/;
      return regex.test(String(text).toLowerCase())
   }

   function IsJson(text) {
      try {
         JSON.parse(text);
         return true;
      }
      catch (e) {
         return false;
      }
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


   useEffect(() => {

      $(document).on('click', '.dashboard-navigation__item', (e) => {
         var chatsInboxElement = document.querySelectorAll('.dashboard-navigation__item');
         $.each(chatsInboxElement, (i, v) => {
            $(v).removeClass('active');
         })

         $('#chatBody').children('.chat-messenger__content').remove();
         $('#chatBody').children('.alert').remove();
         GetChatMessages(e.currentTarget.id);

         chatDateDivider_Today = false;
         chatDateDivider_Yesterday = false;
         chatDateDivider_Exists = [];
         document.querySelectorAll('.chat-messenger__date__divider').forEach(chatDividerElement => {
            chatDividerElement.remove();
         });

         $(e.currentTarget).addClass('active');
         localStorage.setItem('chk', e.currentTarget.id);
         $(e.currentTarget).children('.dashboard-navigation__badge').remove();

         if (chatSocket.current !== null) {
            if (chatSocket.current.readyState === 1) {
               localStorage.setItem('store', '[]');
               chatSocket.current.close();
            }
         }

         InitialChatSocket();

         $('.chat-admin-section .chat-messenger__footer').css('display', 'flex');
         $('.chat-messenger__getStart__text').css('display', 'none')

         if (window.screen.width < 768) {
            $('.dashboard-sidebar').css('left', '0');
         }
      });
   }, []);

   function GetCurrentLocalTime(date) {
      var event = new Date(date);
      var getOffset = new Date().getTimezoneOffset() / 60;
      event.setHours(event.getHours() + (getOffset * -1));
      return event;
   }

   function InitialChatSocket() {
      try {

         if (chatSocketsArray.current !== null) {
            if (chatSocketsArray.current.length > 0) {
               for (var i = 0; i < chatSocketsArray.current.length; i++) {
                  chatSocketsArray.current.pop().close(1000, 'close');
               }
            }
         }

         var socket = new WebSocket(`wss://monkigo.com/app/v1/concierge/chat/moderator?token=${localStorage.getItem('token')}&chk=${localStorage.getItem('chk')}`);

         socket.onopen = () => {
            chatSocket.current = socket;
            chatSocketsArray.current.push(socket);

            chatSocket.current.send(new TextEncoder().encode(JSON.stringify({ target: 'read', msgID: '#read' })));

            if (localStorage.getItem('store') !== null) {
               chatStore.current = JSON.parse(localStorage.getItem('store'));
               if (chatStore.current.length > 0) {
                  for (var i = 0; i < chatStore.current.length; i++) {
                     if (chatSocket.current !== null) {
                        if (chatSocket.current.readyState === 1) {
                           chatSocket.current.send(new TextEncoder().encode(JSON.stringify(chatStore.current[i])));
                        }
                     }
                  }
               }
            }
         }

         socket.onclose = (res) => {
            // InitialChatSocket();
         }
         socket.onerror = (error) => {
         }

         socket.onmessage = (content) => {
            if (content.data !== null) {

               var appendText = '';

               const reader = new FileReader();
               reader.onload = function () {

                  const data = new TextDecoder().decode(reader.result);

                  var msgContent = JSON.parse(data);

                  if (msgContent.target === 'message') {
                     AppendDateDivider(Date.now());
                     var messageReadStatus = {
                        msgID: msgContent.msgID,
                        target: 'read'
                     }

                     if (chatSocket.current.readyState === 1) {
                        chatSocket.current.send(new TextEncoder().encode(JSON.stringify(messageReadStatus)));
                     }

                     appendText = `
                  <div class="chat-messenger__content content-left content-admin" id="${msgContent.msgID}">
                     <div class="chat-messenger__content__container">
                        <div class="chat-messenger__avatar">
                           <img src='${process.env.PUBLIC_URL}/images_concierge/template/avatar/user-avatar.png'
                              class="img-fluid border-radius-full" alt="avatar" />
                        </div>
                        <div class="chat-messenger__holder">
                           <div class="chat-messenger__text" style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                              ${msgContent.body}
                           </div>
                           <div class="chat-messenger__statusbar">
                           <span class="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(Date.now()))}</span>
                           <span class="chat-messenger__status"></span>
                        </div>   
                        </div>
                     </div>
                  </div>
                       `;
                  }

                  if (msgContent.target === 'read') {
                     var message = document.getElementById(`${msgContent.msgID}`);
                     if (message !== null) {
                        message.querySelector('.chat-messenger__status').classList.remove('sended');
                        message.querySelector('.chat-messenger__status').classList.remove('sending');
                        message.querySelector('.chat-messenger__status').classList.add('readed')
                     }
                  }

                  if (msgContent.target === 'read_all') {
                     var messages = document.querySelectorAll('.content-right');
                     if (messages !== null && messages !== undefined) {
                        if (messages.length > 0) {
                           for (var i = 0; i < messages.length; i++) {
                              var message = messages[i].querySelector('.chat-messenger__status');
                              message.classList.remove('sended');
                              message.classList.remove('sended');
                              message.classList.add('readed');
                           }
                        }
                     }
                  }

                  if (msgContent.target === 'delete') {
                     document.getElementById(msgContent.msgID).remove();
                  }

                  if (msgContent.target == 'chk_msg_status') {
                     if (msgContent.Body !== '-') {
                        localStorage.setItem('store', JSON.stringify(chatStore.current));

                        var message = document.getElementById(`${msgContent.msgID}`);
                        if (message !== null) {
                           message.querySelector('.chat-messenger__status').classList.remove('sending');
                           if (msgContent.isRead) {
                              message.querySelector('.chat-messenger__status').classList.add('readed');
                           }
                           else {
                              message.querySelector('.chat-messenger__status').classList.add('sended');
                           }
                        }
                     }
                  }

                  if (msgContent?.target === 'pay_status') {
                     appendText = `
                     <div class="alert ${msgContent.status ? 'alert-success' : 'alert-danger'}">
                     Payment ${msgContent.status ? 'successful' : 'canceled'}. (Amount: $${msgContent.total})
                    </div>
                     `;
                  }

                  if (msgContent.target !== 'ping') {
                     $('#chatBody').append(appendText);
                     ChatBodyScrollTo();
                  }
               }
               reader.readAsArrayBuffer(content.data);
            }
         }
      }
      catch (e) {

      }
   }

   useEffect(() => {
      $(document).on('click', '.new_user', function (e) {

      });
   }, []);

   $(document).on('click', '.chat-messenger__mobile-toggle', function (e) {
      $('.dashboard-sidebar').css('left', '100%');
   });

   function GetChatMessages(chk) {
      $.ajax({
         method: 'GET',
         url: `https://monkigo.com/app/v1/concierge/chat/messages/get?token=${localStorage.getItem('token')}&chk=${chk}`,
         dataType: 'json',
         success: (content) => {
            if (content.result.status) {

               for (var i = 0; i < content.data.length; i++) {
                  var msgContent = content.data[i];
                  var appendText = ''
                  if (msgContent.role === 1) {

                     if (msgContent.target === 'message') {
                        AppendDateDivider(msgContent.date);
                        appendText = `
                           <div class="chat-messenger__content content-right content-admin" id='${msgContent.msgID}'>
                              <div class="chat-messenger__content__container">
                                 <div class="chat-messenger__avatar">
                                    <img src='${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png'
                                       class="img-fluid border-radius-full" alt="avatar" />
                                 </div>
                                 <div class="chat-messenger__holder">
                                    <div class="chat-messenger__text" style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                                       ${msgContent.body}
                                       <div class="remove-admin-message-btn" style="cursor: pointer;">
                                          <img src='${process.env.PUBLIC_URL}/images_concierge/other/icon/x.svg'/>
                                       </div>
                                    </div>
                                    <div class="chat-messenger__statusbar">
                                    <span class="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(GetCurrentLocalTime(msgContent.date))}</span>
                                    <span class="chat-messenger__status ${msgContent.isRead ? 'readed' : 'sended'}"></span>
                                </div>                                       
                                 </div>
                              </div>
                           </div>
                        `
                     }

                     if (msgContent?.target === 'pay_status') {
                        var payStatus = JSON.parse(msgContent.body)
                        appendText = `
                        <div class="alert ${payStatus.status ? 'alert-success' : 'alert-danger'}">
                        Payment ${payStatus.status ? 'successful' : 'canceled'}. (Amount: $${payStatus.total})
                       </div>
                        `;
                     }

                     if (msgContent.target === 'pay_link') {
                        var payLink = JSON.parse(msgContent.body);
                        appendText = `
                     <div class="chat-messenger__content content-right content-admin" id='${msgContent.msgID}'>
                        <div class="chat-messenger__content__container">
                           <div class="chat-messenger__avatar">
                                 <img src="${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png"
                                    class="img-fluid border-radius-full" alt="avatar">
                           </div>
                           <div class="chat-messenger__holder">
                                 <div class="chat-messenger__text" style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                                    Click the button to pay
                                    <div class="remove-admin-message-btn" style="cursor: pointer;">
                                       <img src='${process.env.PUBLIC_URL}/images_concierge/other/icon/x.svg'/>
                                    </div>
                                 </div>
                                 <span class="chat-messenger__price">Price: $${payLink.amount}</span>
                                 <div class="chat-messenger__statusbar">
                                    <span class="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(Date.now()))}</span>
                                    <span class="chat-messenger__status ${msgContent.isRead ? 'readed' : 'sended'}"></span>
                                </div>                                  
                           </div>
                        </div>
                        <div class="chat-messenger__content__action" style="margin-right:64px;margin-left:auto;">
                           <a href="${payLink.url}" class="btn btn-fluid btn-primary" data-modal="modal-pay">Pay</a>
                        </div>
                     </div>
                     `;
                     }

                     if (msgContent.target === 'main_link') {
                        appendText = `
         <div class="chat-messenger__content content-right content-admin" id='${msgContent.msgID}'>
            <div class="chat-messenger__content__container">
               <div class="chat-messenger__avatar">
                  <img src='${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png'
                     class="img-fluid border-radius-full" alt="avatar" />
               </div>
               <div class="chat-messenger__content__action" style="margin-left: auto;">
                  <div class="btn-group">
                  <button id="btnHotelsLink" class="btn btn-outline btn-outline-sm btn-outline-primary" style="margin: 0; padding: 10px 0; min-width: 91px">Hotels</button>
                  <button id="btnFlightsLink" class="btn btn-outline btn-outline-sm btn-outline-primary" style="margin: 0; padding: 10px 0; min-width: 92px">Flights</button>
                  <button id="btnTransfer" class="btn btn-outline btn-outline-sm btn-outline-primary" style="margin: 0; padding: 10px 0; min-width: 102px">Transfer</button>
                  <button id="btnVillageLink" class="btn btn-outline btn-outline-sm btn-outline-primary" style="margin: 0; padding: 10px 0; min-width: 138px">Budget Room</button>
                  <button id="btnSocialTour" class="btn btn-outline btn-outline-sm btn-outline-primary" style="margin: 0; padding: 10px 0; min-width: 120px">Social Tour</button>
                  </div>
                  <div class="chat-messenger__content__info">
                     For group booking, please contact
                     <br />
                     <a href="mailto:hospitality@iac2023.org" class="link">hospitality@iac2023.org</a>
                  </div>
                  <div class="chat-messenger__statusbar">
                  <span class="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(Date.now()))}</span>
                  <span class="chat-messenger__status ${msgContent.isRead ? 'readed' : 'sended'}"></span>
              </div>    
               </div>
            </div>
         </div>
      `;
                     }

                     if (msgContent.target === 'passport_details') {
                        appendText = `
    <div class="chat-messenger__content content-right content-admin" id='${msgContent.msgID}'>
      <div class="chat-messenger__content__container">
         <div class="chat-messenger__avatar">
            <img src='${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png'
               class="img-fluid border-radius-full" alt="avatar" />
         </div>
         <div class="chat-messenger__holder">
            <div class="chat-messenger__text">Click button to search for passport details.</div>
            <div class="chat-messenger__statusbar">
            <span class="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(Date.now()))}</span>
            <span class="chat-messenger__status ${msgContent.isRead ? 'readed' : 'sended'}"></span>
        </div>    
         </div>
      </div>
      <div class="chat-messenger__content__action" style="margin-right:64px;margin-left:auto;">
         <button id="btnOpenPassportDetails" class="btn btn-fluid btn-primary">Enter passport details</button>
      </div>
   </div>
   
      `;
                     }

                  }
                  else {

                     if (msgContent.target === 'message') {
                        AppendDateDivider(msgContent.date);
                        appendText = `
                           <div class="chat-messenger__content content-left content-user" id='${msgContent.msgID}'>
                              <div class="chat-messenger__content__container">
                                 <div class="chat-messenger__avatar">
                                    <img src='${process.env.PUBLIC_URL}/images_concierge/template/avatar/user-avatar.png'
                                       class="img-fluid border-radius-full" alt="avatar" />
                                 </div>
                                 <div class="chat-messenger__holder">
                                    <div class="chat-messenger__text">${msgContent.body}</div>                                    
                                         <div class="chat-messenger__statusbar">
                                            <span class="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(GetCurrentLocalTime(msgContent.date))}</span>
                                            <span class="chat-messenger__status"></span>
                                         </div>    
                                 </div>
                              </div>
                           </div>
                        `;
                     }

                  }

                  $('#chatBody').append(appendText);
                  ChatBodyScrollTo();
               }

            }
         }
      });
   }

   useEffect(() => {
      setInterval(() => {
         if (chatSocket.current !== null) {
            if (chatSocket.current.readyState === 1) {
               chatSocket.current.send(new TextEncoder().encode(JSON.stringify({ target: 'ping' })));
            }
            else {
               InitialChatSocket();
            }
         }
      }, 10000);
   }, [])


   function LogOut() {
      $.ajax({
         method: 'GET',
         url: 'https://monkigo.com/app/v1/logout',
         data: { token: localStorage.getItem('token') },
         dataType: 'json',
         success: (content) => {
            if (content.result.status) {
               localStorage.clear();
               window.location.href = '/auth';
            }
         }
      });
   }
   ///Password Price
   const validatePrice = (price) => {
      const re = /^[0-9]*$/;
      return re.test(String(price).toLowerCase());
   };

   /////////////////////////////////////////SEND PRICE DETAILS SUBMIT HANDLER/////////////////////////////
   const sendPriceDetailsSubmitHandler = () => {
      if ($('#send-price-details-input').val() === '') {
         $('#send-price-details-input').css('border', '1px solid #d32f2f');
      } else {
         if (validatePrice($('#send-price-details-input').val())) {
            $('#send-price-details-input').css('border', '1px solid #e5e5e5');

            $.ajax({
               method: 'POST',
               url: 'https://monkigo.com/app/v1/concierge/payment/paylink',
               data: { token: localStorage.getItem('token'), chk: localStorage.getItem('chk'), total: $('#send-price-details-input').val() },
               dataType: 'json',
               success: (content) => {
                  if (content.result.status) {
                     var msgID = uid();
                     var appendText = `
                     <div class="chat-messenger__content content-right content-admin" id='${msgID}'>
                        <div class="chat-messenger__content__container">
                           <div class="chat-messenger__avatar">
                                 <img src="${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png"
                                    class="img-fluid border-radius-full" alt="avatar">
                           </div>
                           <div class="chat-messenger__holder">
                                 <div class="chat-messenger__text" style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                                    Click the button to pay
                                    <div class="remove-admin-message-btn" style="cursor: pointer;">
                                       <img src='${process.env.PUBLIC_URL}/images_concierge/other/icon/x.svg'/>
                                    </div>
                                 </div>
                                 <span class="chat-messenger__price">Price: $${$('#send-price-details-input').val()}</span>
                                 <div class="chat-messenger__statusbar">
                                    <span class="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(Date.now()))}</span>
                                    <span class="chat-messenger__status sending"></span>
                                </div>                                  
                           </div>
                        </div>
                        <div class="chat-messenger__content__action" style="margin-right:64px;margin-left:auto;">
                           <a href="https://monkigo.com/app/v1/payments/v2/pay?token=${localStorage.getItem('token')}&source=iac&target=card&type=1&data=${content.data.id}" class="btn btn-fluid btn-primary" data-modal="modal-pay">Pay</a>
                        </div>
                     </div>
                     `;
                     var payLink = {
                        amount: $('#send-price-details-input').val(),
                        url: `https://monkigo.com/app/v1/payments/v2/pay?token=${localStorage.getItem('token')}&source=iac&target=card&type=1&data=${content.data.id}`
                     }
                     var message = {
                        msgID: msgID,
                        role: 1,
                        type: 1,
                        target: "pay_link",
                        body: JSON.stringify(payLink)
                     }

                     if (chatSocket.current !== null && chatSocket.current !== undefined) {
                        if (chatSocket.current.readyState === 1) {
                           chatSocket.current.send(new TextEncoder().encode(JSON.stringify(message)))
                        }
                        chatStore.current.push(message);
                        localStorage.setItem('store', JSON.stringify(chatStore.current));
                        $('#chatBody').append(appendText);
                        ChatBodyScrollTo();

                     }

                     $('#send-price-details-input').val('');
                  }
               }
            });

            setPaymentDetailsModal(false);
            ChatBodyScrollTo();
         } else {
            $('#send-price-details-input').css('border', '1px solid #d32f2f');
         }
      }
   }


   useEffect(() => {
      $('body, html').on('click', (e) => {
         $('.remove-admin-message-btn').css('background', 'transparent');
         $('.remove-admin-message-btn').find('img').attr('src', `${process.env.PUBLIC_URL}/images_concierge/other/icon/x.svg`);
         $('.remove-admin-message-btn').removeAttr('id');
      });

      $(document).on('click', '.remove-admin-message-btn', (e) => {
         $(e.currentTarget).css('background', '#FBE2E2');
         $(e.currentTarget).find('img').attr('src', `${process.env.PUBLIC_URL}/images_concierge/other/icon/minus-black.svg`);
         $(e.currentTarget).attr('id', 'ready_to_remove');
      });

      $('body').on('click', '#ready_to_remove', (e) => {
         $('.remove-admin-message-btn').removeAttr('id');

         var message = {
            msgID: $(e.currentTarget).parent().parent().parent().parent().attr('id'),
            target: 'delete'
         }

         if (chatSocket.current !== null) {
            if (chatSocket.current.readyState === 1) {
               chatSocket.current.send(new TextEncoder().encode(JSON.stringify(message)));
            }
         }
      });
   }, []);

   /////////////////////////SEND MAIN BUTTONS
   const sendMainButtons = () => {
      var msgID = uid();
      var appendText = `
         <div class="chat-messenger__content content-right content-admin" id='${msgID}'>
            <div class="chat-messenger__content__container">
               <div class="chat-messenger__avatar">
                  <img src='${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png'
                     class="img-fluid border-radius-full" alt="avatar" />
               </div>
               <div class="chat-messenger__content__action" style="margin-left: auto;">
                  <div class="btn-group">
                  <button id="btnHotelsLink" class="btn btn-outline btn-outline-sm btn-outline-primary" style="margin: 0; padding: 10px 0; min-width: 91px">Hotels</button>
                  <button id="btnFlightsLink" class="btn btn-outline btn-outline-sm btn-outline-primary" style="margin: 0; padding: 10px 0; min-width: 92px">Flights</button>
                  <button id="btnTransfer" class="btn btn-outline btn-outline-sm btn-outline-primary" style="margin: 0; padding: 10px 0; min-width: 102px">Transfer</button>
                  <button id="btnVillageLink" class="btn btn-outline btn-outline-sm btn-outline-primary" style="margin: 0; padding: 10px 0; min-width: 138px">Budget Room</button>
                  <button id="btnSocialTour" class="btn btn-outline btn-outline-sm btn-outline-primary" style="margin: 0; padding: 10px 0; min-width: 120px">Social Tour</button>
                  </div>
                  <div class="chat-messenger__content__info">
                     For group booking, please contact
                     <br />
                     <a href="mailto:hospitality@iac2023.org" class="link">hospitality@iac2023.org</a>
                  </div>
                  <div class="chat-messenger__statusbar">
                  <span class="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(Date.now()))}</span>
                  <span class="chat-messenger__status sending"></span>
              </div>    
               </div>
            </div>
         </div>
      `;

      var message = {
         msgID: msgID,
         role: 1,
         type: 1,
         target: "main_link",
         body: "main_link"
      }

      if (chatSocket.current !== null && chatSocket.current !== undefined) {
         chatStore.current.push(message);
         localStorage.setItem('store', JSON.stringify(chatStore.current));
         if (chatSocket.current.readyState === 1) {
            chatSocket.current.send(new TextEncoder().encode(JSON.stringify(message)));
         }
         $('#chatBody').append(appendText);
         ChatBodyScrollTo();
      }
   }

   /////////////////////////SEND PASSPORT DETAILS
   const sendPassportDetailsButtons = () => {
      var msgID = uid();
      var appendText = `
    <div class="chat-messenger__content content-right content-admin" id='${msgID}'>
      <div class="chat-messenger__content__container">
         <div class="chat-messenger__avatar">
            <img src='${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png'
               class="img-fluid border-radius-full" alt="avatar" />
         </div>
         <div class="chat-messenger__holder">
            <div class="chat-messenger__text">Click button to search for passport details.</div>
            <div class="chat-messenger__statusbar">
            <span class="chat-messenger__date">${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(Date.now()))}</span>
            <span class="chat-messenger__status sending"></span>
        </div>    
         </div>
      </div>
      <div class="chat-messenger__content__action" style="margin-right:64px;margin-left:auto;">
         <button id="btnOpenPassportDetails" class="btn btn-fluid btn-primary">Enter passport details</button>
      </div>
   </div>
   
      `;

      var message = {
         msgID: msgID,
         role: 1,
         type: 1,
         target: "passport_details",
         body: 'passport_details'
      }

      if (chatSocket.current !== null && chatSocket.current !== undefined) {
         chatStore.current.push(message);
         localStorage.setItem('store', JSON.stringify(chatStore.current));
         if (chatSocket.current.readyState === 1) {
            chatSocket.current.send(new TextEncoder().encode(JSON.stringify(message)));
         }
         $('#chatBody').append(appendText);
         ChatBodyScrollTo();
      }
   }

   useEffect(() => {

      var moderatorList = document.querySelectorAll('.moderators-list');
      for (var i = 0; i < moderatorList.length; i++) {
         moderatorList[i].addEventListener('click', (e) => {
            $('.moderators-list').removeClass('active-moderator');
            $(e.currentTarget).addClass('active-moderator')
            localStorage.setItem('moderator', $(e.currentTarget).data('id'));
         });
      }

   }, []);

   return (
      <section className="chat-admin-section" style={{ minHeight: '100%', height: '100%' }}>
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
                  <a href="#" className="header-action" onClick={() => LogOut()}>
                     <span className="header-action__icon icon-exit"></span>
                     <span className="header-action__label">Log out</span>
                  </a>
               </div>
            </div>
         </header>
         {/* <!-- End  :: Header --> */}

         {/* <!-- Begin:: Dashboard Layout--> */}
         <div className="dashboard-layout">
            <div className="dashboard-sidebar" style={{ left: sideBarToggle === false ? 0 : '100%' }}>
               <div className="dashboard-search">
                  <h4 className="dashboard-search__title">Chats</h4>
                  <div className="form-field">
                     <input type="text" className="form-control" placeholder="Search"
                        onKeyUp={(e) => {
                           let value = e.target.value.toLowerCase();
                           $(".dashboard-navigation__fullname").filter(function () {
                              $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                           });
                        }}
                     />
                     <span className="field-icon icon-search"></span>
                  </div>
               </div>
               <div className="dashboard-navigation">
               </div>
            </div>
            <div className="dashboard-container">
               <div className="chat-messenger">
                  <div className="chat-messenger__container">
                     <div className="chat-messenger__body" id="chatBody">
                        <div className="chat-messenger__body__nickname">
                           {chatName}
                           <span className="chat-messenger__mobile-toggle icon-chevron-left" style={{ cursor: 'pointer' }} onClick={() => setSideBarToggle(true)}></span>
                        </div>
                     </div>
                     <div className="chat-messenger__getStart__text">
                        <span>Select a chat to start messaging.</span>
                     </div>
                     <div className="chat-messenger__footer">
                        <div className="chat-messenger__footer__action">
                           {/* <span className="chat-messenger__footer__action__item icon-file"></span> */}
                           <span className="chat-messenger__footer__action__item fs-24 icon-plus">
                              <div className="chat-messenger__dropdown">
                                 <div className="chat-messenger__dropdown__item" onClick={() => sendPassportDetailsButtons()}>
                                    <span className="chat-messenger__dropdown__item__icon icon-info"></span>
                                    <span className="chat-messenger__dropdown__item__label">Send passport details</span>
                                 </div>
                                 <div className="chat-messenger__dropdown__item" onClick={() => sendMainButtons()}>
                                    <span className="chat-messenger__dropdown__item__icon icon-bed"></span>
                                    <span className="chat-messenger__dropdown__item__label">Send main buttons</span>
                                 </div>
                                 <div className="chat-messenger__dropdown__item" onClick={() => setPaymentDetailsModal(true)}>
                                    <span className="chat-messenger__dropdown__item__icon icon-debit-card"></span>
                                    <span className="chat-messenger__dropdown__item__label">Send link for payment</span>
                                 </div>
                              </div>
                           </span>
                        </div>
                        <div className="chat-messenger__footer__form">
                           <div className="form-field has-icon">
                              <textarea id='messageText' type="text" className="form-control" placeholder="Type your message" onChange={(e) => sendMessageHandleChange(e)} onKeyDown={(e) => sendMessageHandleKeyPress(e)} onKeyUp={(e) => sendMessageHandleKeyUp(e)} />
                              <button className="chat-messenger__btn icon-send" id='send-message-btn' style={{
                                 backgroundColor: inputBarActive === true ? '#274DE0' : 'transparent',
                                 color: inputBarActive === true ? '#fff' : '#101010'
                              }} onClick={() => sendMessage()}></button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         {/* <!-- Endn :: Dashboard Layout--> */}

         {/* <!-- Begin  :: Payment Details --> */}
         <div className={paymentDetailsModal === false ? 'modal' : 'modal show'} onClick={() => setPaymentDetailsModal(false)} id="modal-ticket-payment">
            <div className="modal-container" style={{ background: 'white', padding: '32px 24px', borderRadius: '20px 20px 0 0' }} data-size="sm" onClick={(e) => e.stopPropagation()}>
               <div className="modal-layout">
                  <div className="modal-layout__header">
                     <h4 className="modal-layout__title">Payment details</h4>
                     <span className="modal-layout__close modal-close icon-close" onClick={() => setPaymentDetailsModal(false)}></span>
                  </div>
                  <div className="modal-layout__body">
                     <div className="form-field m-t-24">
                        <input type="text" className="form-control" id='send-price-details-input' placeholder="Price" />
                     </div>
                     <button className="btn btn-fluid btn-primary m-t-24" onClick={() => sendPriceDetailsSubmitHandler()}>Send</button>
                  </div>
               </div>
            </div>
         </div>
         {/* <!-- End  ::  Payment Details --> */}

      </section >
   )
}

export default ChatAdmin