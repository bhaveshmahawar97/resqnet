/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { authToken, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Use a ref to prevent unnecessary re-connections
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && authToken && !socketRef.current) {
      const url = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
      
      const newSocket = io(url, {
        auth: {
          token: authToken
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    }

    return () => {
      // We don't disconnect on every re-render to maintain connection
      // But we will handle cleanup if the user logs out
    };
  }, [isAuthenticated, authToken]);

  // Clean up socket when user logs out
  useEffect(() => {
    if (!isAuthenticated && socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
