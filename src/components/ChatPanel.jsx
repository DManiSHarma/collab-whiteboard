'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { useBoard } from '@/context/BoardContext';

export default function ChatPanel() {
  const {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    sendMessage,
    userName,
    userId,
    typingUsers,
    socket,
    unreadCount,
    setUnreadCount,
  } = useBoard();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Track unread messages when panel is closed
  useEffect(() => {
    if (!isChatOpen && chatMessages.length > 0) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg.userId !== userId && lastMsg.type !== 'system') {
        setUnreadCount((prev) => prev + 1);
      }
    }
  }, [chatMessages.length]);

  // Reset unread when opening chat
  useEffect(() => {
    if (isChatOpen) {
      setUnreadCount(0);
      inputRef.current?.focus();
    }
  }, [isChatOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
    socket?.current?.emit('typing-stop');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    // Typing indicator
    if (e.target.value.trim()) {
      socket?.current?.emit('typing-start');
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket?.current?.emit('typing-stop');
      }, 2000);
    } else {
      socket?.current?.emit('typing-stop');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredTyping = typingUsers.filter((u) => u.userId !== userId);

  return (
    <>
      {/* Toggle button (always visible) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed right-4 bottom-20 z-50 glass rounded-xl p-3 hover:bg-white/10 transition-all group"
        >
          <MessageSquare size={20} className="text-white/80 group-hover:text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-board-accent rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] glass flex flex-col transition-transform duration-300 ease-in-out ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 50 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-board-border/50">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-board-accent" />
            <h3 className="font-semibold text-white/90 text-sm">Chat</h3>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={16} className="text-white/60" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {chatMessages.length === 0 && (
            <div className="text-center text-white/30 text-sm mt-8">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
              <p>No messages yet</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          )}

          {chatMessages.map((msg) => {
            if (msg.type === 'system') {
              return (
                <div key={msg.id} className="text-center py-1 chat-bubble">
                  <span className="text-[11px] text-white/40 italic">
                    {msg.text}
                  </span>
                </div>
              );
            }

            const isOwn = msg.userId === userId;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} chat-bubble`}
              >
                {!isOwn && (
                  <span className="text-[10px] text-white/40 ml-1 mb-0.5">
                    {msg.userName}
                  </span>
                )}
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm break-words ${
                    isOwn
                      ? 'bg-board-accent/80 text-white rounded-br-sm'
                      : 'bg-board-card text-white/90 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-white/30 mt-0.5 mx-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            );
          })}

          {/* Typing indicator */}
          {filteredTyping.length > 0 && (
            <div className="flex items-center gap-1.5 text-white/40 text-xs pl-1">
              <span className="italic">
                {filteredTyping.map((u) => u.userName).join(', ')}{' '}
                {filteredTyping.length === 1 ? 'is' : 'are'} typing
              </span>
              <span className="flex gap-0.5">
                <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-3 py-3 border-t border-board-border/50">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-board-dark/60 text-sm text-white placeholder-white/30 px-3 py-2.5 rounded-xl border border-board-border/30 outline-none focus:border-board-accent/50 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-board-accent/80 hover:bg-board-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
