import React, { useEffect } from "react";

const buttons = [
  { id: "btnHotelsSearch", label: "Hotels", key: "Hotels" },
  { id: "btnFlightsSearch", label: "Flights", key: "Flights" },
  { id: "btnSocialTourSearch", label: "Social Tour", key: "Tours" },
];

const MessageList = ({ messages, user, sendMessage }) => {
  useEffect(() => {
    ChatBodyScrollTo();
  }, [messages]);

  function ChatBodyScrollTo() {
    var chatBody = document.querySelector("#chatBody");
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  return (
    <div>
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          user={user}
          sendMessage={sendMessage}
        />
      ))}
    </div>
  );
};

const MessageItem = ({ message, user, sendMessage }) => {
  const isAdmin = message.sender === "admin";
  const messageClass =
    isAdmin && user
      ? "content-left content-admin"
      : !isAdmin && user
      ? "content-right content-user"
      : isAdmin && !user
      ? "content-right content-admin"
      : "content-left content-user";
  const avatarSrc = isAdmin
    ? `${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png`
    : `${process.env.PUBLIC_URL}/images_concierge/template/avatar/user-avatar.png`;
  const inlineStyles = !user ? { marginRight: "64px", marginLeft: "auto" } : {};

  const GetCurrentLocalTime = (date) => {
    var event = new Date(date);
    var getOffset = new Date().getTimezoneOffset() / 60;
    event.setHours(event.getHours() + getOffset * -1);
    return event;
  };

  const MessageStatus = ({ status }) => {
    if (status === "sent") {
      return "sended";
    } else if (status === "delivered") {
      return "readed";
    } else {
      return "sending";
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case "pay_status":
        const payStatusData = JSON.parse(message.text);
        return (
          <div
            className={`alert ${
              payStatusData.status ? "alert-success" : "alert-danger"
            }`}
          >
            Payment {payStatusData.status ? "successful" : "canceled"}. (Amount:
            ${payStatusData.total})
          </div>
        );

      case "pay_link":
        const payLink = JSON.parse(message.text);
        return (
          <div
            className={`chat-messenger__content ${messageClass}`}
            id={message.id}
          >
            <div className="chat-messenger__content__container">
              <div className="chat-messenger__avatar">
                <img
                  src={`${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png`}
                  className="img-fluid border-radius-full"
                  alt="avatar"
                />
              </div>
              <div className="chat-messenger__holder">
                <div
                  className="chat-messenger__text"
                  style={{
                    width: "100%",
                    display: "flexbox",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  Click the button to pay
                  <div
                    className="remove-admin-message-btn"
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images_concierge/other/icon/x.svg`}
                      alt="avatar"
                    />
                  </div>
                </div>
                <span className="chat-messenger__price">
                  Price: $${payLink.amount}
                </span>
                <div className="chat-messenger__statusbar">
                  <span className="chat-messenger__date">
                    $
                    {new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    }).format(new Date(Date.now()))}
                  </span>
                  <span
                    className={`chat-messenger__status ${
                      message.isRead ? "readed" : "sended"
                    }`}
                  ></span>
                </div>
              </div>
            </div>
            <div
              className="chat-messenger__content__action"
              style={{ marginRight: "64px" }}
            >
              <a
                href={payLink.url}
                className="btn btn-fluid btn-primary"
                data-modal="modal-pay"
              >
                Pay
              </a>
            </div>
          </div>
        );

      case "main_link":
        return (
          <div className={`chat-messenger__content ${messageClass}`}>
            <div className="chat-messenger__content__container">
              <div className="chat-messenger__avatar">
                <img
                  src={avatarSrc}
                  className="img-fluid border-radius-full"
                  alt="avatar"
                />
              </div>
              <div className="chat-messenger__holder">
                <div className="btn-group" style={{ gap: 8 }}>
                  {buttons.map(({ id, key, label }) => (
                    <button
                      key={id}
                      className="btn btn-outline btn-outline-sm btn-outline-primary"
                      style={{
                        margin: 0,
                        padding: "10px 0",
                        minWidth: "91px",
                      }}
                      onClick={() => {
                        sendMessage(key, "message", {key});
                      }}
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
                <div className="chat-messenger__statusbar">
                  <span className="chat-messenger__date">
                    {new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    }).format(new Date(Date.now()))}
                  </span>
                  {(user && !isAdmin && message.sender !== "admin") ||
                  (isAdmin && !user && message.sender === "admin") ? (
                    <span
                      className={`chat-messenger__status ${MessageStatus(
                        message
                      )}`}
                    ></span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );

      case "passport_details":
        return (
          <>
            <div className={`chat-messenger__content ${messageClass}`}>
              <div className="chat-messenger__content__container">
                <div className="chat-messenger__avatar">
                  <img
                    src={`${process.env.PUBLIC_URL}/images_concierge/template/avatar/admin-avatar.png`}
                    className="img-fluid border-radius-full"
                    alt="avatar"
                  />
                </div>
                <div className="chat-messenger__holder">
                  <div className="chat-messenger__text">
                    Click button to search for passport details.
                  </div>
                  <div className="chat-messenger__statusbar">
                    <span className="chat-messenger__date">
                      {new Intl.DateTimeFormat("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                      }).format(new Date(Date.now()))}
                    </span>
                    <span
                      className={`chat-messenger__status ${
                        message.isRead ? "readed" : "sended"
                      }`}
                    ></span>
                  </div>
                </div>
              </div>
              <div
                className="chat-messenger__content__action"
                style={inlineStyles}
              >
                <button
                  id="btnOpenPassportDetails"
                  className="btn btn-fluid btn-primary"
                >
                  Enter passport details
                </button>
              </div>
            </div>
          </>
        );

      case "button_click":
        return (
          <div className={`chat-messenger__content ${messageClass}`}>
            <div className="chat-messenger__content__container">
              <div className="chat-messenger__avatar">
                <img
                  src={avatarSrc}
                  className="img-fluid border-radius-full"
                  alt="avatar"
                />
              </div>
              <div className="chat-messenger__holder">
                <div className="chat-messenger__text">{message.text}</div>
                <div className="chat-messenger__statusbar">
                  <span className="chat-messenger__date">
                    {new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    }).format(new Date(Date.now()))}
                  </span>
                  <span className="chat-messenger__status"></span>
                </div>
              </div>
            </div>
            <div
              className="chat-messenger__content__action"
              style={inlineStyles}
            >
              <button id={message?.key} className="btn btn-fluid btn-primary">
                Search
              </button>
            </div>
          </div>
        );

      default:
        const parsedData = message.type === "form" && JSON.parse(message.text);
        return (
          <div
            className={`chat-messenger__content ${messageClass}`}
            id={message.id}
          >
            <div className="chat-messenger__content__container">
              <div className="chat-messenger__avatar">
                <img
                  src={avatarSrc}
                  className="img-fluid border-radius-full"
                  alt="avatar"
                />
              </div>
              <div className="chat-messenger__holder">
                {parsedData ? (
                  parsedData.map((item, index) => (
                    <span key={index} className="info-list__item">
                      {item}
                    </span>
                  ))
                ) : (
                  <div
                    className="chat-messenger__text"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {message.text}
                    {(user && !isAdmin && message.sender !== "admin") ||
                    (isAdmin && !user && message.sender === "admin") ? (
                      <div
                        className="remove-admin-message-btn"
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={`${process.env.PUBLIC_URL}/images_concierge/other/icon/x.svg`}
                        />
                      </div>
                    ) : null}
                  </div>
                )}

                <div className="chat-messenger__statusbar">
                  <span className="chat-messenger__date">
                    {new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    }).format(GetCurrentLocalTime(message.timestamp))}
                  </span>
                  {(user && !isAdmin && message.sender !== "admin") ||
                  (isAdmin && !user && message.sender === "admin") ? (
                    <span
                      className={`chat-messenger__status ${MessageStatus(
                        message
                      )}`}
                    ></span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderMessageContent();
};

export default MessageList;
