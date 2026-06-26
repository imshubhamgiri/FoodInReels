import React, { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';
import API_URL from '../config/api'

const BACKEND_URL = API_URL; // Replace with your backend domain
const SocketContext = createContext(undefined);

export const SocketProvider = ({ children }) => {
 
  const { user} = useAppContext();
  useEffect(() => {
    if (!user?.id) return;
    // 1. Grab your logged-in Partner ID from localStorage or Auth cookies
    // Replace 'partnerId' with whatever key you use to persist auth

    // 2. Establish connection
    const socket = io(BACKEND_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
      console.log('[SOCKET] Connected:', socket.id);
      // Join the private partner event room
      socket.emit('join_room', user?.id);
    });

    // 3. Listen for processing changes pushed from the BullMQ Worker
    socket.on('video_upload_status', (data) => {
      // Dismiss any current global loading toasts
      toast.dismiss('video-processing-toast');

      if (data.status === 'completed') {
        toast.success(`🎬 ${data.message}`, {
          autoClose: 5000,
          icon: "🚀"
        });
      } else {
        toast.error(`❌ ${data.message}`, {
          autoClose: 5000
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={undefined}>
      {children}
    </SocketContext.Provider>
  );
};