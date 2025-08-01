// import { Stomp } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
// import { useRef, useEffect, useState } from "react";

// const useWebSocket = () => {
//   const stompClientRef = useRef(null);
//   const [connected, setConnected] = useState(false);
//   const [error, setError] = useState(null);

//   const connectWebSocket = () => {
//     const token = localStorage.getItem("access_token");
//     const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);
//     console.log(socket);
//     const stompClient = Stomp.over(socket);

//     if (!token) {
//       console.error("No access token found in localStorage");
//       setError("No access token found");
//       return;
//     }

//     stompClient.connect(
//       { Authorization: `Bearer ${token}` },
//       () => {
//         console.log("✅ Connected to WebSocket");
//         stompClientRef.current = stompClient;
//         setConnected(true);
//         setError(null);
//       },
//       (error) => {
//         console.error("❌ WebSocket error:", error);
//         setConnected(false);
//         setError(error.message || "Failed to connect to WebSocket");
//       }
//     );
//   };

//   useEffect(() => {
//     connectWebSocket();

//     return () => {
//       if (stompClientRef.current) {
//         stompClientRef.current.disconnect(() => {
//           console.log("Disconnected from WebSocket");
//         });
//       }
//     };
//   }, []);

//   return { stompClient: stompClientRef, connected, error };
// };

// export default useWebSocket;
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useRef, useEffect, useState } from "react";

const useWebSocket = () => {
  const stompClientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const connectWebSocket = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("❌ No access token found in localStorage");
      setError("No access token found");
      return;
    }

    const socket = new SockJS(
      `${import.meta.env.VITE_APP_WEBSOCKET_URL}?token=${token}`
    );
    const stompClient = Stomp.over(socket);

    stompClient.debug = () => {}; // tắt log STOMP

    stompClient.onWebSocketClose = (e) => {
      console.warn("⚠️ WebSocket closed. Attempting reconnect in 5s", e);
      setConnected(false);
      setTimeout(() => {
        connectWebSocket(); // 🔁 Tự động reconnect
      }, 5000);
    };

    stompClient.connect(
      {},
      () => {
        console.log("✅ Connected to WebSocket");
        stompClientRef.current = stompClient; // Gán ngay sau connect
        setConnected(true);
        setError(null);
      },
      (err) => {
        console.error("❌ WebSocket error:", err);
        setConnected(false);
        setError(err?.message || "WebSocket connection failed");
        setTimeout(() => {
          connectWebSocket(); // 🔁 Tự động reconnect nếu lỗi
        }, 5000);
      }
    );
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log("🔌 Disconnected from WebSocket");
        });
      }
    };
  }, []);

  return { stompClient: stompClientRef, connected, error };
};

export default useWebSocket;
