'use client';

// contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
  isConnected: boolean;
}

const defaultContextValue: SocketContextType = {
  socket: null,
  onlineUsers: [],
  isConnected: false
};

const SocketContext = createContext<SocketContextType>(defaultContextValue);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Fetch user data from API instead of directly accessing cookies
    const fetchUserAndConnect = async () => {
      try {
        const response = await fetch('/api/getToken',{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        console.log(response)
        
        if (!response.ok) {
          console.warn('Failed to fetch user data for socket authentication');
          return;
        }
        
        const userData = await response.json();
        const _id = userData.userId;
        
        if (!_id) {
          console.warn('No access token found in user data for socket authentication');
          return;
        }
        
        console.log('Connecting socket with token from API');
        
        // Connect with authentication
        const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
          auth: {
            _id // This matches what server expects in socket.handshake.auth.token
          }
        });

        // Connection events
        socketInstance.on('connect', () => {
          console.log('Socket connected with authentication');
          setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
          console.log('Socket disconnected');
          setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
          console.error('Socket connection error:', error.message);
        });

        // Online users tracking
        socketInstance.on('users:online', (users: string[]) => {
          setOnlineUsers(users);
        });

        socketInstance.on('user:online', (userId: string) => {
          setOnlineUsers(prev => Array.from(new Set([...prev, userId])));
        });

        socketInstance.on('user:offline', (userId: string) => {
          setOnlineUsers(prev => prev.filter(id => id !== userId));
        });

        setSocket(socketInstance);

        return () => {
          socketInstance.disconnect();
        };
      } catch (error) {
        console.error('Error fetching user data for socket connection:', error);
      }
    };

    fetchUserAndConnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};