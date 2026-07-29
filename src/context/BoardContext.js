'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useCursors } from '@/hooks/useCursors';
import { TOOLS, DEFAULT_COLOR, DEFAULT_STROKE_WIDTH, DEFAULT_OPACITY, NOTE_COLORS } from '@/lib/constants';
import { nanoid } from 'nanoid';

const BoardContext = createContext(null);

export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard must be used within BoardProvider');
  return ctx;
}

export function BoardProvider({ roomId, userName, children }) {
  const socketRef = useSocket(roomId, userName);
  const { remoteCursors, emitCursorMove } = useCursors(socketRef);

  // Tool state
  const [tool, setTool] = useState(TOOLS.PEN);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(DEFAULT_STROKE_WIDTH);
  const [opacity, setOpacity] = useState(DEFAULT_OPACITY);

  // Viewport state
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Board data
  const [objects, setObjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // User info
  const [userId, setUserId] = useState(null);
  const [userColor, setUserColor] = useState('#6C5CE7');

  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Socket event listeners
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleRoomState = (state) => {
      setObjects(state.objects || []);
      setNotes(state.notes || []);
      setChatMessages(state.chatMessages || []);
      setUsers(state.users || []);
      setUserId(socket.id);
      // Find our color from the users list
      const me = (state.users || []).find(u => u.id === socket.id);
      if (me) setUserColor(me.color);
    };

    const handleDrawAction = (action) => {
      setObjects(prev => [...prev, action]);
    };

    const handleUpdateObject = ({ id, updates }) => {
      setObjects(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    };

    const handleDeleteObject = (id) => {
      setObjects(prev => prev.filter(o => o.id !== id));
    };

    const handleClearCanvas = () => {
      setObjects([]);
    };

    const handleAddNote = (note) => {
      setNotes(prev => [...prev, note]);
    };

    const handleUpdateNote = ({ id, updates }) => {
      setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    };

    const handleDeleteNote = (id) => {
      setNotes(prev => prev.filter(n => n.id !== id));
    };

    const handleChatMessage = (msg) => {
      setChatMessages(prev => [...prev, msg]);
      // Increment unread if chat is closed and message is not from us
      // We need to use a ref or functional update for isChatOpen
    };

    const handleUserJoined = (user) => {
      setUsers(prev => {
        if (prev.find(u => u.id === user.id)) return prev;
        return [...prev, user];
      });
      setChatMessages(prev => [...prev, {
        id: nanoid(),
        type: 'system',
        text: `${user.name} joined the room`,
        timestamp: Date.now()
      }]);
    };

    const handleUserLeft = ({ userId: leftId, userName: leftName }) => {
      setUsers(prev => prev.filter(u => u.id !== leftId));
      setChatMessages(prev => [...prev, {
        id: nanoid(),
        type: 'system',
        text: `${leftName || 'A user'} left the room`,
        timestamp: Date.now()
      }]);
    };

    const handleUserTyping = ({ userId: typId, userName: typName }) => {
      setTypingUsers(prev => {
        if (prev.find(u => u.userId === typId)) return prev;
        return [...prev, { userId: typId, userName: typName }];
      });
    };

    const handleUserStopTyping = ({ userId: typId }) => {
      setTypingUsers(prev => prev.filter(u => u.userId !== typId));
    };

    socket.on('room-state', handleRoomState);
    socket.on('draw-action', handleDrawAction);
    socket.on('update-object', handleUpdateObject);
    socket.on('delete-object', handleDeleteObject);
    socket.on('clear-canvas', handleClearCanvas);
    socket.on('add-note', handleAddNote);
    socket.on('update-note', handleUpdateNote);
    socket.on('delete-note', handleDeleteNote);
    socket.on('chat-message', handleChatMessage);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('user-typing', handleUserTyping);
    socket.on('user-stop-typing', handleUserStopTyping);

    return () => {
      socket.off('room-state', handleRoomState);
      socket.off('draw-action', handleDrawAction);
      socket.off('update-object', handleUpdateObject);
      socket.off('delete-object', handleDeleteObject);
      socket.off('clear-canvas', handleClearCanvas);
      socket.off('add-note', handleAddNote);
      socket.off('update-note', handleUpdateNote);
      socket.off('delete-note', handleDeleteNote);
      socket.off('chat-message', handleChatMessage);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('user-typing', handleUserTyping);
      socket.off('user-stop-typing', handleUserStopTyping);
    };
  }, [socketRef]);

  // Action dispatchers
  const addObject = useCallback((obj) => {
    setObjects(prev => [...prev, obj]);
    setUndoStack(prev => [...prev, { type: 'add', obj }]);
    setRedoStack([]);
    socketRef.current?.emit('draw-action', obj);
  }, [socketRef]);

  const updateObject = useCallback((id, updates) => {
    setObjects(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    socketRef.current?.emit('update-object', { id, updates });
  }, [socketRef]);

  const deleteObject = useCallback((id) => {
    setObjects(prev => prev.filter(o => o.id !== id));
    socketRef.current?.emit('delete-object', id);
  }, [socketRef]);

  const clearCanvas = useCallback(() => {
    setObjects([]);
    setNotes([]);
    socketRef.current?.emit('clear-canvas');
  }, [socketRef]);

  const addNote = useCallback((note) => {
    setNotes(prev => [...prev, note]);
    socketRef.current?.emit('add-note', note);
  }, [socketRef]);

  const updateNote = useCallback((id, updates) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    socketRef.current?.emit('update-note', { id, updates });
  }, [socketRef]);

  const deleteNote = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    socketRef.current?.emit('delete-note', id);
  }, [socketRef]);

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;
    socketRef.current?.emit('chat-message', { text });
  }, [socketRef]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const lastAction = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    if (lastAction.type === 'add') {
      setObjects(prev => prev.filter(o => o.id !== lastAction.obj.id));
      socketRef.current?.emit('delete-object', lastAction.obj.id);
      setRedoStack(prev => [...prev, lastAction]);
    }
  }, [undoStack, socketRef]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const action = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    if (action.type === 'add') {
      setObjects(prev => [...prev, action.obj]);
      socketRef.current?.emit('draw-action', action.obj);
      setUndoStack(prev => [...prev, action]);
    }
  }, [redoStack, socketRef]);

  const value = {
    socket: socketRef,
    roomId,
    userName,
    userId,
    userColor,
    users,
    objects,
    notes,
    chatMessages,
    tool, setTool,
    color, setColor,
    strokeWidth, setStrokeWidth,
    opacity, setOpacity,
    zoom, setZoom,
    panOffset, setPanOffset,
    addObject, updateObject, deleteObject, clearCanvas,
    addNote, updateNote, deleteNote,
    sendMessage,
    remoteCursors,
    emitCursorMove,
    typingUsers,
    undoStack, redoStack,
    undo, redo,
    isChatOpen, setIsChatOpen,
    unreadCount, setUnreadCount,
  };

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
}
