// import { Offline } from "react-detect-offline";
// import { useEffect, useState } from "react";

// const NetworkHandler = () => {
//   const [isInitialOffline, setIsInitialOffline] = useState(false);

//   useEffect(() => {
//     if (!navigator.onLine) {
//       setIsInitialOffline(true);
//     }
//   }, []);

//   const renderContent = (message) => (
//     <div style={overlayStyle}>
//       <div style={spinnerStyle} />
//       <p>{message}</p>
//     </div>
//   );

//   return (
//     <>
//       {isInitialOffline ? (
//         renderContent("Mất kết nối. Vui lòng thử lại khi có mạng.")
//       ) : (
//         <Offline>
//           {renderContent("Bạn đang offline, vui lòng kết nối mạng...")}
//         </Offline>
//       )}
//     </>
//   );
// };

// const overlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   height: "100vh",
//   width: "100vw",
//   backgroundColor: "rgba(0,0,0,0.6)",
//   color: "#fff",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 9999,
// };

// const spinnerStyle = {
//   width: "48px",
//   height: "48px",
//   border: "6px solid #fff",
//   borderTop: "6px solid #1890ff",
//   borderRadius: "50%",
//   animation: "spin 1s linear infinite",
//   marginBottom: "20px",
// };

// // Inject CSS keyframes manually
// const styleSheet = document.styleSheets[0];
// styleSheet.insertRule(
//   `
// @keyframes spin {
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// }`,
//   styleSheet.cssRules.length
// );

// export default NetworkHandler;

import { Offline } from "react-detect-offline";
import { useEffect, useState } from "react";

const NetworkHandler = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [wasReloadedOffline, setWasReloadedOffline] = useState(
    !navigator.onLine
  );

  useEffect(() => {
    const updateStatus = () => {
      const online = navigator.onLine;
      setIsOffline(!online);
      if (online) {
        setWasReloadedOffline(false); // khi có mạng lại, reset cờ reload offline
      }
    };

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  const renderContent = (message) => (
    <div style={overlayStyle}>
      <div style={spinnerStyle} />
      <p>{message}</p>
    </div>
  );

  if (!isOffline) return null;

  // nếu reload mà mất mạng → hiển thị thông báo tĩnh
  if (wasReloadedOffline) {
    return renderContent("Mất kết nối. Vui lòng thử lại khi có mạng.");
  }

  // nếu đang dùng → mất mạng → loading
  return renderContent("Bạn đang offline, vui lòng kết nối mạng...");
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: "100vw",
  backgroundColor: "rgba(0,0,0,0.6)",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const spinnerStyle = {
  width: "48px",
  height: "48px",
  border: "6px solid rgba(255, 255, 255, 0.3)",
  borderTop: "6px solid #1890ff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginBottom: "20px",
};

// inject spin animation nếu chưa có
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
  styleSheet.cssRules.length
);

export default NetworkHandler;
