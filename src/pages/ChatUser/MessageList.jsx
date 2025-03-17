import React, { useEffect } from "react";

const buttons = [
  { id: "btnHotelsSearch", label: "Hotels", key: "Hotels" },
  { id: "btnFlightsSearch", label: "Flights", key: "Flights" },
  { id: "btnSocialTourSearch", label: "Social Tour", key: "Tours" },
];

const MessageList = ({ messages, user, sendMessage, handlePayment, handledeleteMessage }) => {
  useEffect(() => {
    const chatBody = document.querySelector("#chatBody");
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          user={user}
          sendMessage={sendMessage}
          handlePayment={handlePayment}
          handledeleteMessage={handledeleteMessage}
        />
      ))}
    </div>
  );
};

const MessageItem = ({ message, user, sendMessage, handlePayment, handledeleteMessage }) => {
  const isAdmin = message.sender === "admin";

  const getMessageClass = () => {
    if (isAdmin && user) return "content-left content-admin";
    if (!isAdmin && user) return "content-right content-user";
    if (isAdmin && !user) return "content-right content-admin";
    return "content-left content-user";
  };

  const getAvatarSrc = () => {
    return isAdmin
      ? `${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png`
      : `${process.env.PUBLIC_URL}/images_concierge/template/avatar/user-avatar.png`;
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(date));
  };

  const getMessageStatus = (status) => {
    switch (status) {
      case "sent":
        return "sended";
      case "delivered":
        return "readed";
      default:
        return "sending";
    }
  };

  const getGuestCount = (adults, children, infants) => {
    let guestCountStr = `${adults} Adult${adults > 1 ? "s" : ""}`;
    if (children > 0) guestCountStr += `, ${children} Children`;
    if (infants > 0) guestCountStr += `, ${infants} Infant${infants > 1 ? "s" : ""}`;
    return guestCountStr;
  };

  const renderMessageContent = () => {
    const messageConfig = {
      pay_status: {
        render: () => {
          const payStatusData = JSON.parse(message.text);
          return (
            <div className={`alert ${payStatusData.status ? "alert-success" : "alert-danger"}`}>
              Payment {payStatusData.status ? "successful" : "canceled"}. (Amount: ${payStatusData.total})
            </div>
          );
        },
      },
      pay_link: {
        render: () => (
          <>
            <div className="chat-messenger__text" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {message.text}
              {isAdmin && !user && <DeleteButton onClick={() => handledeleteMessage(message.id)} />}
            </div>
            <span className="chat-messenger__price">Price: $ {message.amount}</span>
            <div style={{ marginTop: "12px"}}>
              <button className="btn btn-fluid btn-primary" onClick={() => handlePayment(message.amount)}>
                Pay
              </button>
            </div>
          </>
        ),
      },
      main_link: {
        render: () => (
          <>
            <div className="btn-group" style={{ gap: 8 }}>
              {buttons.map(({ id, key, label }) => (
                <button
                  key={id}
                  className="btn btn-outline btn-outline-sm btn-outline-primary"
                  style={{ margin: 0, padding: "10px 0", minWidth: "91px" }}
                  onClick={() => user && sendMessage(key, "message", { key })}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="chat-messenger__content__info">
              For group booking, please contact
              <br />
              <a href="mailto:hospitality@iac2023.org" className="link">
                hospitality@iac2023.org
              </a>
            </div>
          </>
        ),
      },
      passport_details: {
        render: () => (
          <>
            <div className="chat-messenger__text" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              Click button to search for passport details.
            {(user && !isAdmin && message.sender !== "admin") || (isAdmin && !user && message.sender === "admin") ? (
                <DeleteButton onClick={() => handledeleteMessage(message.id)} />
              ) : null}</div>
            <div style={{ marginTop: "12px"}}>
              <button id="btnOpenPassportDetails" className="btn btn-fluid btn-primary">
                Enter passport details
              </button>
            </div>
          </>
        ),
      },
      contacts: {
        render: () => (
          <div className="info-list">
            <span className="info-list__title">Contact details</span>
            <span className="info-list__item">Phone: {message.phone}</span>
            <span className="info-list__item">E-mail: {message.email}</span>
          </div>
        ),
      },
      passport: {
        render: () => (
          <div className="info-list">
            {message.guest.map((guest, i) => (
              <React.Fragment key={i}>
                <span className="info-list__title">
                  {i === 0 ? "Primary passenger details" : `Passenger ${i + 1} details`}
                </span>
                <span className="info-list__item">Given name: {guest.name}</span>
                <span className="info-list__item">Surname: {guest.surname}</span>
                <span className="info-list__item">Gender: {guest.gender}</span>
                <span className="info-list__item">Date of birth: {guest.birthDay}</span>
                <span className="info-list__item">Passport or ID number: {guest.passport}</span>
                <span className="info-list__item">Expiration date: {guest.expDate}</span>
                <span className="info-list__item">Country of issue: {guest.country}</span>
              </React.Fragment>
            ))}
          </div>
        ),
      },
      button_click: {
        render: () => (
          <>
            <div className="chat-messenger__text">{message.text}</div>
            <div style={{ marginTop: "12px"}}>
              <button id={message?.key} className="btn btn-fluid btn-primary">
                Search
              </button>
            </div>
          </>
        ),
      },
      default: {
        render: () => {
          const parsedData = message.type === "form" ? JSON.parse(message.text) : null;
          if (parsedData && message.sender !== 'admin') {
            localStorage.setItem(`flights_${message.sender}`, JSON.stringify(parsedData));
          }
          return parsedData ? (
            <div className="flex flex-between">
              <div className="flex flex-col">
                <span className="info-list__item">
                  {parsedData.flight_direction} / {parsedData.flight_type} class
                </span>
                <span className="info-list__item">
                  {getGuestCount(parsedData.adults_count, parsedData.children_count, parsedData.infants_count)}
                </span>
                <span className="info-list__item">From: {parsedData.from_city}</span>
                <span className="info-list__item">To: Baku (GYD)</span>
                <span className="info-list__item">Departure: {parsedData.departure_date}</span>
                <span className="info-list__item">Return: {parsedData.return_date}</span>
              </div>
              {(user && !isAdmin && message.sender !== "admin") || (isAdmin && !user && message.sender === "admin") ? (
                <DeleteButton onClick={() => handledeleteMessage(message.id)} />
              ) : null}
              </div>
          ) : (
            <div className="chat-messenger__text" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {String(message.text)}
              {(user && !isAdmin && message.sender !== "admin") || (isAdmin && !user && message.sender === "admin") ? (
                <DeleteButton onClick={() => handledeleteMessage(message.id)} />
              ) : null}
            </div>
          );
        },
      },
    };

    const config = messageConfig[message.type] || messageConfig.default;
    return (
      <div className={`chat-messenger__content ${getMessageClass()}`} id={message.id}>
        <div className="chat-messenger__content__container">
          <Avatar src={getAvatarSrc()} />
          <div className="chat-messenger__holder">
            {config.render()}
            <div className="chat-messenger__statusbar">
            <span className="chat-messenger__date">{formatTime(message.timestamp)}</span>
            {(user && !isAdmin && message.sender !== "admin") ||
              (isAdmin && !user && message.sender === "admin") ? (
                <span className={`chat-messenger__status ${getMessageStatus(message.status)}`}></span>
              ) : null}
          </div>
          </div>
        </div>
      </div>
    );
  };

  return renderMessageContent();
};

const Avatar = ({ src }) => (
  <div className="chat-messenger__avatar">
    <img src={src} className="img-fluid border-radius-full" alt="avatar" />
  </div>
);

const StatusBar = ({ date, status }) => (
  <div className="chat-messenger__statusbar">
    <span className="chat-messenger__date">{date}</span>
    <span className={`chat-messenger__status ${status}`}></span>
  </div>
);

const DeleteButton = ({ onClick }) => (
  <div className="remove-admin-message-btn" style={{ cursor: "pointer" }} onClick={onClick}>
    <img src={`${process.env.PUBLIC_URL}/images_concierge/other/icon/x.svg`} alt="delete" />
  </div>
);

export default MessageList;
