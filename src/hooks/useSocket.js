'use client';
import { useEffect, useRef, useCallback } from 'react';
import { getSocket, disconnectSocket } from '@/lib/socketClient';

export function useSocket(roomId, userName) {
  const socketRef = useRef(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!roomId || !userName) return;

    const socket = getSocket();
    socketRef.current = socket;

    if (!socket.connected) {
      socket.connect();
    }

    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
      connectedRef.current = true;
      socket.emit('join-room', { roomId, userName });
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      connectedRef.current = false;
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });

    // If already connected (reconnect scenario)
    if (socket.connected && !connectedRef.current) {
      connectedRef.current = true;
      socket.emit('join-room', { roomId, userName });
    }

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      disconnectSocket();
      connectedRef.current = false;
    };
  }, [roomId, userName]);

  return socketRef;
}
