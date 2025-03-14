import React, { useState, useEffect, useRef } from "react";
import { ref, push, onValue, set, update, remove } from "firebase/database";
import { db } from "../../firebase";
import "./chatadmin.scss";

///IMPORT COMPONENTS
import $ from "jquery";
import { uid } from "uid";

////IMPORT IMAGES
import Logo from "../../assets_concierge/images/logo/logo.svg";
import LogoIAC from "../../../src/assets/navbar-second/logo-iac2023.svg";
import useId from "@mui/material/utils/useId";
import { useChat } from "../ChatUser/hooks/useChat";
import ChatList from "./ChatList";
import MessageList from "../ChatUser/MessageList";
import { config } from "../../config";

const baseURL = config.baseURL;

const Admin = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sideBarToggle, setSideBarToggle] = useState(false);
  const [paymentDetailsModal, setPaymentDetailsModal] = useState(false);
  const [inputBarActive, setInputBarActive] = useState(false);
  const chatStore = useRef([]);
  var chatDateDivider_Today = false;
  var chatDateDivider_Yesterday = false;
  var chatDateDivider_Exists = [];

  useEffect(() => {
    const chatsRef = ref(db, "chats");
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const roomList = Object.entries(data).map(([id, room]) => ({
          id,
          ...room,
          lastMessage: room.messages
            ? Object.values(room.messages).pop()
            : { text: "No messages", timestamp: Date.now() },
          unreadCount: room.unreadCount || 0,
        }));
        setChatRooms(
          roomList.sort(
            (a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp
          )
        );
      }
    });

    return () => unsubscribe();
  }, [setChatRooms]);

  useEffect(() => {
    if (selectedChat) {
      const messagesRef = ref(db, `chats/${selectedChat}/messages`);
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messageList = Object.entries(data).map(([id, msg]) => ({
            id,
            ...msg,
          }));
          setMessages(messageList);

          const updates = {};
          messageList.forEach((msg) => {
            if (msg.sender !== "admin" && msg.status === "sent") {
              updates[`chats/${selectedChat}/messages/${msg.id}/status`] =
                "delivered";
            }
          });
          if (Object.keys(updates).length > 0) {
            update(ref(db), updates);
          }

          set(ref(db, `chats/${selectedChat}/unreadCount`), 0);
        } else {
         setMessages([]);
        }
      });

      return () => unsubscribe();
    }
  }, [selectedChat, setMessages]);

  const sendMessage = (text, type = "text", props) => {
    if (selectedChat) {
         const messagesRef = ref(db, `chats/${selectedChat}/messages`);
      
         let messageData = {
            text,
            sender: "admin",
            timestamp: Date.now(),
            type,
            status: "sent",
         };

         if (props) {
            messageData = {
              ...messageData,
              ...props
            }; 
         }

         push(messagesRef, messageData);
      }
  };

  useEffect(() => {
    $(document).on("click", ".dashboard-navigation__item", (e) => {
      var chatsInboxElement = document.querySelectorAll(
        ".dashboard-navigation__item"
      );
      $.each(chatsInboxElement, (i, v) => {
        $(v).removeClass("active");
      });

      $("#chatBody").children(".chat-messenger__content").remove();
      $("#chatBody").children(".alert").remove();
      //    setCurrentChatId(e.currentTarget.id)

      chatDateDivider_Today = false;
      chatDateDivider_Yesterday = false;
      chatDateDivider_Exists = [];
      document
        .querySelectorAll(".chat-messenger__date__divider")
        .forEach((chatDividerElement) => {
          chatDividerElement.remove();
        });

      $(e.currentTarget).addClass("active");
      localStorage.setItem("chk", e.currentTarget.id);
      $(e.currentTarget).children(".dashboard-navigation__badge").remove();

      $(".chat-admin-section .chat-messenger__footer").css("display", "flex");
      $(".chat-messenger__getStart__text").css("display", "none");

      if (window.screen.width < 768) {
        $(".dashboard-sidebar").css("left", "0");
      }
    });
  }, [selectedChat]);

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
      // handleDeleteMessage($(e.currentTarget).parent().parent().parent().parent().attr('id'))
      
   });
}, []);

  const sendMessageHandleKeyUp = (e) => {
    if ($("#messageText").val().trim() === "") {
      document.querySelector("textarea").style.height = "44px";
    }
  };

  const sendMessageHandleKeyPress = (e) => {
   if ($('#messageText').val().trim() === '') {
      document.querySelector('textarea').style.height = '44px'
   }

   if (e.keyCode === 13 && !e.shiftKey) {
      if ($('#messageText').val().trim() !== '') {
         sendMessage(newMessage);
         setNewMessage('')
      }
      e.preventDefault();
   }

   if (e.keyCode === 13 && e.shiftKey) {
      if ($('#messageText').val().trim() !== '') {
         document.querySelector('textarea').style.height = '60px'
      }
   }
   }

  const validatePrice = (price) => {
    const re = /^[0-9]*$/;
    return re.test(String(price).toLowerCase());
  };

  const sendMessageHandleChange = (e) => {
    const { value } = e.target;
    setNewMessage(value);
    if (value.length > 0) {
      setInputBarActive(true);
    } else {
      setInputBarActive(false);
    }
  };

  const sendPassportDetailsButtons = () => {
    sendMessage(
      "Click button to search for passport details.",
      "passport_details"
    );
  };
  const sendMainButtons = () => {
    sendMessage("Click button to search for passport details.", "main_link");
  };

  const sendPriceDetailsSubmitHandler = () => {
    if ($("#send-price-details-input").val() === "") {
      $("#send-price-details-input").css("border", "1px solid #d32f2f");
    } else {
      if (validatePrice($("#send-price-details-input").val())) {
        $("#send-price-details-input").css("border", "1px solid #e5e5e5");

      sendMessage('Click the button to pay', "pay_link", {amount: $("#send-price-details-input").val()});
      ChatBodyScrollTo();
      setPaymentDetailsModal(false);

      $("#send-price-details-input").val("");
      } else {
        $("#send-price-details-input").css("border", "1px solid #d32f2f");
      }
    }
  };

  const ChatBodyScrollTo = () => {
    var chatBody = document.querySelector("#chatBody");
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  const deleteMessage = async (messageId) => {
    if (selectedChat) {
      const messageRef = ref(db, `chats/${selectedChat}/messages/${messageId}`);
      await remove(messageRef);
    }
  };

  return (
    <section
      className="chat-admin-section"
      style={{ minHeight: "100%", height: "100%" }}
    >
      {/* <!-- Begin:: Header --> */}
      <header className="header">
        <div className="wrapper">
          <div className="header-holder">
            <div className="header-brand">
              <a
                href="https://iac.monkigo.com/chat"
                className="header-brand__logo"
              >
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

      {/* <!-- Begin:: Dashboard Layout--> */}
      <div className="dashboard-layout">
        <div
          className="dashboard-sidebar"
          style={{ left: sideBarToggle === false ? 0 : "100%" }}
        >
          <div className="dashboard-search">
            <h4 className="dashboard-search__title">Chats</h4>
            <div className="form-field">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                onKeyUp={(e) => {
                  let value = e.target.value.toLowerCase();
                  $(".dashboard-navigation__fullname").filter(function () {
                    $(this)
                      .parent()
                      .toggle($(this).text().toLowerCase().indexOf(value) > -1);
                  });
                }}
              />
              <span className="field-icon icon-search"></span>
            </div>
          </div>
          <div className="dashboard-navigation">
            {/* <ChatList activeChats={activeChats} onSelectChat={handleSelectChat} /> */}
            {chatRooms.map((room) => (
              <>
                <a
                  href="#"
                  key={room.id}
                  id={room.id}
                  onClick={() => {
                     setSelectedChat(room.id)
                     ChatBodyScrollTo()}}
                  className={`dashboard-navigation__item ${
                    selectedChat === room.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <div className="relative">
                    {room.unreadCount > 0 && (
                      <div className="absolute -top-2 -right-1">
                        <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {room.unreadCount}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <div className="dashboard-navigation__fullname">
                      {room.name}
                      {room.unreadCount > 0 && <p>{room.unreadCount}</p>}
                    </div>
                    <div className="dashboard-navigation__last-message">
                      {room.lastMessage?.timestamp
                        ? new Intl.DateTimeFormat("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                          }).format(new Date(room.lastMessage?.timestamp))
                        : "No timestamp"}
                      : {room.lastMessage.type === "form" ? JSON.parse(room.lastMessage?.text) : room.lastMessage?.text}
                    </div>
                  </div>
                </a>
              </>
            ))}
          </div>
        </div>
        <div className="dashboard-container">
          <div className="chat-messenger">
            <div className="chat-messenger__container">
              <div className="chat-messenger__body" id="chatBody">
                <div className="chat-messenger__body__nickname">
                  <span
                    className="chat-messenger__mobile-toggle icon-chevron-left"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSideBarToggle(true)}
                  ></span>
                </div>
                {messages.length ? (
                  <MessageList messages={Object.values(messages)} handledeleteMessage={deleteMessage}/>
                ) : 
                <div className="chat-messenger__getStart__text">
                <span>No messages.</span>
              </div>}
              </div>
              <div className="chat-messenger__getStart__text">
                <span>Select a chat to start messaging.</span>
              </div>
              <div className="chat-messenger__footer">
                <div className="chat-messenger__footer__action">
                  {/* <span className="chat-messenger__footer__action__item icon-file"></span> */}
                  <span className="chat-messenger__footer__action__item fs-24 icon-plus">
                    <div className="chat-messenger__dropdown">
                      {/* <div className="chat-messenger__dropdown__item" onClick={() => sendMessage('passport_details', 'passport_details')}> */}
                      <div
                        className="chat-messenger__dropdown__item"
                        onClick={() => sendPassportDetailsButtons()}
                      >
                        <span className="chat-messenger__dropdown__item__icon icon-info"></span>
                        <span className="chat-messenger__dropdown__item__label">
                          Send passport details
                        </span>
                      </div>
                      <div
                        className="chat-messenger__dropdown__item"
                        onClick={() => sendMainButtons()}
                      >
                        <span className="chat-messenger__dropdown__item__icon icon-bed"></span>
                        <span className="chat-messenger__dropdown__item__label">
                          Send main buttons
                        </span>
                      </div>
                      <div
                        className="chat-messenger__dropdown__item"
                        onClick={() => setPaymentDetailsModal(true)}
                      >
                        <span className="chat-messenger__dropdown__item__icon icon-debit-card"></span>
                        <span className="chat-messenger__dropdown__item__label">
                          Send link for payment
                        </span>
                      </div>
                    </div>
                  </span>
                </div>
                <div className="chat-messenger__footer__form">
                  <div className="form-field has-icon">
                    <textarea
                      id="messageText"
                      type="text"
                      value={newMessage}
                      className="form-control"
                      placeholder="Type your message"
                      onChange={(e) => sendMessageHandleChange(e)}
                      onKeyDown={(e) => sendMessageHandleKeyPress(e)}
                      onKeyUp={(e) => sendMessageHandleKeyUp(e)}
                    />
                    <button
                      className="chat-messenger__btn icon-send"
                      id="send-message-btn"
                      style={{
                        backgroundColor:
                          inputBarActive === true ? "#274DE0" : "transparent",
                        color: inputBarActive === true ? "#fff" : "#101010",
                      }}
                      onClick={() => {
                        if (newMessage.trim()) {
                          sendMessage(newMessage);
                          setNewMessage("");
                        }
                      }}
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Endn :: Dashboard Layout--> */}

      {/* <!-- Begin  :: Payment Details --> */}
      <div
        className={paymentDetailsModal === false ? "modal" : "modal show"}
        onClick={() => setPaymentDetailsModal(false)}
        id="modal-ticket-payment"
      >
        <div
          className="modal-container"
          style={{
            background: "white",
            padding: "32px 24px",
            borderRadius: "20px 20px 0 0",
          }}
          data-size="sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-layout">
            <div className="modal-layout__header">
              <h4 className="modal-layout__title">Payment details</h4>
              <span
                className="modal-layout__close modal-close icon-close"
                onClick={() => setPaymentDetailsModal(false)}
              ></span>
            </div>
            <div className="modal-layout__body">
              <div className="form-field m-t-24">
                <input
                  type="text"
                  className="form-control"
                  id="send-price-details-input"
                  placeholder="Price"
                />
              </div>
              <button
                className="btn btn-fluid btn-primary m-t-24"
                onClick={() => sendPriceDetailsSubmitHandler()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- End  ::  Payment Details --> */}
    </section>
  );
};

export default Admin;
