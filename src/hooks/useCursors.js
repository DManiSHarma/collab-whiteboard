'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { CURSOR_THROTTLE_MS } from '@/lib/constants';

export function useCursors(socket) {
  const [remoteCursors, setRemoteCursors] = useState(new Map());
  const lastEmitRef = useRef(0);

  useEffect(() => {
    if (!socket?.current) return;
    const s = socket.current;

    const handleCursorUpdate = ({ userId, x, y, userName, color }) => {
      setRemoteCursors(prev => {
        const next = new Map(prev);
        next.set(userId, { x, y, userName, color, lastUpdate: Date.now() });
        return next;
      });
    };

    const handleUserLeft = ({ userId }) => {
      setRemoteCursors(prev => {
        const next = new Map(prev);
        next.delete(userId);
        return next;
      });
    };

    s.on('cursor-update', handleCursorUpdate);
    s.on('user-left', handleUserLeft);

    // Clean up stale cursors every 5 seconds
    const cleanup = setInterval(() => {
      setRemoteCursors(prev => {
        const next = new Map(prev);
        const now = Date.now();
        for (const [id, cursor] of next) {
          if (now - cursor.lastUpdate > 5000) {
            next.delete(id);
          }
        }
        return next.size !== prev.size ? next : prev;
      });
    }, 5000);

    return () => {
      s.off('cursor-update', handleCursorUpdate);
      s.off('user-left', handleUserLeft);
      clearInterval(cleanup);
    };
  }, [socket]);

  const emitCursorMove = useCallback((x, y) => {
    const now = Date.now();
    if (now - lastEmitRef.current < CURSOR_THROTTLE_MS) return;
    lastEmitRef.current = now;
    if (socket?.current?.connected) {
      socket.current.emit('cursor-move', { x, y });
    }
  }, [socket]);

  return { remoteCursors, emitCursorMove };
}
