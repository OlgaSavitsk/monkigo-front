import React from 'react';

const ChatList = ({ activeChats, onSelectChat }) => {
  return (
      activeChats.map((chat) => (
        <a href="#" key={chat.id} className="dashboard-navigation__item" id={chat.id} onClick={() => onSelectChat(chat.id)}>
            <span className="dashboard-navigation__fullname">{chat.name}</span>
            <span className="dashboard-navigation__last-message">
            {chat?.lastMessageTime
                ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(chat.lastMessageTime))
                : 'No timestamp'
            }: {chat.lastMessage}
            </span>
            {chat.unreadMsg > 0 && (
                <span className="dashboard-navigation__badge">{chat.unreadMsg}</span>
            )}
        </a>
      ))
  );
};

export default ChatList;