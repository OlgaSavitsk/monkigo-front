import { useState, useEffect } from "react";
import {
  ref,
  onValue,
  set,
  push,
  serverTimestamp,
  query,
  update,
  remove,
  orderByChild,
} from "firebase/database";
import { db } from "../../../firebase";

export function useChat(user) {
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [activeChats, setActiveChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.userId;
  const isAdmin = user?.support;
  
  useEffect(() => {
    if (!user) return;

    const userChatsRef = ref(db, `userChats/${userId}`);

    const unsubscribe = onValue(userChatsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const existingChatId = snapshot.val();
        setCurrentChatId(existingChatId);
      } else {
        try {
          const newChatRef = push(ref(db, "chats"));
          const newChatId = newChatRef.key;

          await set(ref(db, `chats/${newChatId}`), {
            userId,
            name: user?.firstName,
            createdAt: serverTimestamp(),
            lastMessage: "",
            lastMessageTime: Date.now(),
            unreadCount: 0,
          });

          await set(ref(db, `userChats/${userId}`), newChatId);
          setCurrentChatId(newChatId);
        } catch (error) {
          console.error(error);
        }
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!currentChatId) return;
    const messagesRef = ref(db, `chats/${currentChatId}/messages`);
    const messagesQuery = query(messagesRef, orderByChild("timestamp"));

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const messagesData = [];
      snapshot.forEach((childSnapshot) => {
        messagesData.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [currentChatId]);

  useEffect(() => {
    if(!isAdmin) return
    const chatsRef = ref(db, "chats");

    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const chatsData = [];
      snapshot.forEach((childSnapshot) => {
        const chatData = childSnapshot.val();
        chatsData.push({
          id: childSnapshot.key,
          ...chatData,
        });
      });
      setActiveChats(chatsData);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const sendMessage = async (content) => {
    const messagesRef = ref(db, `chats/${currentChatId}/messages`);
    const newMessageRef = push(messagesRef);

    const messageData = {
      ...content,
      body: content.body.trim(),
      timestamp: serverTimestamp(),
      read: false,
    };

    try {
      const chatUpdateData = {
        lastMessage: content.body.trim(),
        lastMessageTime: serverTimestamp(),
        unreadCount: 0,
      };

      if (!isAdmin) {
        chatUpdateData.name = user?.firstName;
      }
      await update(ref(db, `chats/${currentChatId}`), chatUpdateData);

      await set(newMessageRef, messageData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await remove(ref(db, `chats/${currentChatId}/messages/${messageId}`));
      const updatedMessages = messages.filter((msg) => msg.id !== messageId);
      const lastMessage = updatedMessages[updatedMessages.length - 1];

      if (lastMessage) {
        const chatUpdates = {
          lastMessage: lastMessage ? lastMessage.body : "",
          lastMessageTime: lastMessage ? lastMessage.timestamp : 0,
        };   
        await update(ref(db, `chats/${currentChatId}`), chatUpdates);
        document.getElementById(messageId)?.remove()
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    messages,
    currentChatId,
    loading,
    setCurrentChatId,
    sendMessage,
    handleDeleteMessage,
    activeChats,
  };
}
