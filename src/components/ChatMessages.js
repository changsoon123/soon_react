import React from 'react';

const ChatMessages = ({ messages }) => {

    console.log(messages);

  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
};

export default ChatMessages;