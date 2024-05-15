import React, { useState, useEffect } from 'react';
import ChatMessages from './ChatMessages';

const ChatWindow = ({ socket }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
  
    useEffect(() => {
      if (!socket) return;
  
      socket.on('chatMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
  
      return () => {
        socket.off('chatMessage');
      };
    }, [socket]);
  
    const sendMessage = () => {
      if (message.trim() === '') return;
  
      socket.emit('sendMessage', message);
      setMessage('');
    };
  
    return (
      <div>
        <ChatMessages messages={messages} /> {/* ChatMessages 컴포넌트를 렌더링합니다. */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    );
  };
  
  export default ChatWindow;