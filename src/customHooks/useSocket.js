import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";
import { SOCKET_BASE_URL } from "../config/host-config";

export const useSocket = (room, username) => {
  const [socket, setSocket] = useState();
  
  const [socketResponse, setSocketResponse] = useState({
    room: "",
    content: "",
    username: "",
    messageType: "",
    createdDateTime: "",
  });
  const [isConnected, setConnected] = useState(false);
  const sendData = useCallback(
    (payload) => {
      socket.emit("send_message", {
        room: room,
        content: payload.content,
        username: username,
        messageType: "CLIENT",
      });
    },
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socket, room]
  );
  // useEffect(() => {
  //   setSocket(io(SOCKET_BASE_URL, {
  //     withCredentials: true, // CORS 요청에 자격 증명을 포함
      
  //     reconnection: true,
  //     query: `username=${username}&room=${room}`,
  //   }));
  //   console.log(socket);
  //   socket.on("connect", () => {
  //     console.log("Connected to server!");
  //     setConnected(true);
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    const s = io.connect(SOCKET_BASE_URL, {
      transports: ['websocket'],
      rejectUnauthorized: false,
      withCredentials: true, // CORS 요청에 자격 증명을 포함
      reconnection: true,
      query: `username=${username}&room=${room}`,
    });
    setSocket(s);
    console.log(s);
    s.on("connect", () => {
      console.log("Connected to server!");
      setConnected(true);
    });
    
    s.on("read_message", (res) => {
      console.log("Read Message Event Received:", res);
      setSocketResponse({
        room: res.room,
        content: res.content,
        username: res.username,
        messageType: res.messageType,
        createdDateTime: res.createdDateTime,
      });
    });
    
    return () => {
      s.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { socketResponse, isConnected, sendData };
};