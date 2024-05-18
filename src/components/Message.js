import React, { useEffect, useState } from "react";
import { useSocket } from "../customHooks/useSocket";
import { RiSendPlaneLine, RiSendPlaneFill } from "react-icons/ri";
import "../styles/Message.scss";
import { MessageList } from "./MessageList";
import { useFetch } from "../customHooks/useFetch";

export const Message = ({ room, username }) => {

  
  const {socketResponse, sendData } = useSocket(room, username);
  const [messageInput, setMessageInput] = useState("");
  const [messageList, setMessageList] = useState([]);

  const { responseData } = useFetch("/message/" + room);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const addMessageToList = (val) => {
    if (val.room === "") return;
    setMessageList([...messageList, val]);
  };

  useEffect(() => {
    if (responseData !== undefined && Array.isArray(responseData) ) {
      setMessageList([...responseData, ...messageList]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseData]);

  useEffect(() => {
    console.log("Socket Response: ", socketResponse);
    addMessageToList(socketResponse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketResponse]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput !== "") {
      sendData({
        content: messageInput,
      });
      
      addMessageToList({
        content: messageInput,
        username: username,
        createdDateTime: new Date(),
        messageType: "CLIENT",
      });
      

      setMessageInput("");
    }
  };

  return (
    <div className="message_root_div">
      <span className="room_name"> {room} </span>
      <span className="user_name"> {username} 님 반갑습니다 </span>
      <div className="message_component">
        <MessageList username={username} messageList={messageList} />
        <form className="chat-input" onSubmit={(e) => sendMessage(e)}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message"
          />
          <button type="submit">
            {messageInput === "" ? (
              <RiSendPlaneLine size={25} />
            ) : (
              <RiSendPlaneFill color="#2671ff" size={25} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};