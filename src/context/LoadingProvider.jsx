import { createContext, useContext, useState } from "react";
import { Spin } from "antd";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {/* Hiển thị Spin khi loading */}
      {loading && (
        <div className="fixed inset-0 z-[1000] bg-white/60 flex items-center justify-center">
          <Spin size="large" />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
