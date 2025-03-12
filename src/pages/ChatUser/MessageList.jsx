import React from 'react';
import $ from 'jquery';

const MessageList = ({ messages }) => {
  return (
    <div>
      {messages.map((message) => (
        <MessageItem key={message.msgID} message={message} />
      ))}
    </div>
  );
};

const MessageItem = ({ message }) => {
  const isAdmin = message.role === 1;
  const messageClass = isAdmin ? 'content-left content-admin' : 'content-right content-user';
  const avatarSrc = isAdmin
    ? `${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png`
    : `${process.env.PUBLIC_URL}/images_concierge/template/avatar/user-avatar.png`;
  function ChatBodyScrollTo() {
    var chatBody = document.querySelector('#chatBody');

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  const renderMessageContent = () => {
    switch (message.target) {
      case 'pay_status':
        const payStatusData = JSON.parse(message.body);
        return (
          <div className={`alert ${payStatusData.status ? 'alert-success' : 'alert-danger'}`}>
            Payment {payStatusData.status ? 'successful' : 'canceled'}. (Amount: ${payStatusData.total})
          </div>
        );

      case 'pay_link':
        const payLink = JSON.parse(message.body);
        return (
          <>
            <div className="chat-messenger__text" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Click the button to pay
            </div>
            <span className="chat-messenger__price">Price: ${payLink.amount}</span>
            <div className="chat-messenger__content__action">
              <a href={payLink.url} className="btn btn-fluid btn-primary" data-modal="modal-pay">
                Pay
              </a>
            </div>
          </>
        );

      case 'main_link':
        return (
          <>
            <div className="btn-group">
              <button id="btnHotelsLink" className="btn btn-outline btn-outline-sm btn-outline-primary">
                Hotels
              </button>
              <button id="btnFlightsLink" className="btn btn-outline btn-outline-sm btn-outline-primary">
                Flights
              </button>
              <button id="btnTransfer" className="btn btn-outline btn-outline-sm btn-outline-primary">
                Transfer
              </button>
              <button id="btnVillageLink" className="btn btn-outline btn-outline-sm btn-outline-primary">
                Budget Room
              </button>
              <button id="btnSocialTour" className="btn btn-outline btn-outline-sm btn-outline-primary">
                Social Tour
              </button>
            </div>
            <div className="chat-messenger__content__info">
              For group booking, please contact
              <br />
              <a href="mailto:hospitality@iac2023.org" className="link">
                hospitality@iac2023.org
              </a>
            </div>
          </>
        );

      case 'passport_details':
        return (
          <>
            <div className="chat-messenger__text">Click button to search for passport details.</div>
            <div className="chat-messenger__content__action">
              <button id="btnOpenPassportDetails" className="btn btn-fluid btn-primary">
                Enter passport details
              </button>
            </div>
          </>
        );

      default:
        ChatBodyScrollTo()
        return message.items ? message.items.map((item, index) => (
          <span key={index} className="info-list__item">{item}</span>
      )) : <div className="chat-messenger__text">{message.body}</div>;
    }
  };

  return (
    <div className={`chat-messenger__content ${messageClass}`} id={message.id}>
      <div className="chat-messenger__content__container">
        <div className="chat-messenger__avatar">
          <img src={avatarSrc} className="img-fluid border-radius-full" alt="avatar" />
        </div>
        <div className="chat-messenger__holder">
          {renderMessageContent()}
          <div className="chat-messenger__statusbar">
            <span className="chat-messenger__date">
            {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(
                message.timestamp ? new Date(message.timestamp) : new Date()
            )}
            </span>
            <span className={`chat-messenger__status ${message.isRead ? 'readed' : 'sended'}`}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageList;