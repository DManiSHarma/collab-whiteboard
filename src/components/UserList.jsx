'use client';

import React from 'react';
import { useBoard } from '@/context/BoardContext';

export default function UserList() {
  const { users, userId } = useBoard();

  const maxVisible = 5;
  const visibleUsers = users.slice(0, maxVisible);
  const overflow = users.length - maxVisible;

  return (
    <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-1.5">
      <span className="text-xs text-white/50 mr-1 font-medium">
        {users.length} {users.length === 1 ? 'user' : 'users'}
      </span>

      <div className="flex items-center -space-x-2">
        {visibleUsers.map((user) => {
          const initials = (user.name || 'A')
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          const isCurrentUser = user.id === userId;

          return (
            <div
              key={user.id}
              className={`relative w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white cursor-default ${
                isCurrentUser ? 'ring-2 ring-white/80 ring-offset-1 ring-offset-board-dark' : ''
              }`}
              style={{
                backgroundColor: user.color || '#6C5CE7',
                zIndex: isCurrentUser ? 10 : 1,
              }}
              title={`${user.name}${isCurrentUser ? ' (you)' : ''}`}
            >
              {initials}
            </div>
          );
        })}

        {overflow > 0 && (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white/80 bg-board-border"
            title={`${overflow} more user${overflow > 1 ? 's' : ''}`}
          >
            +{overflow}
          </div>
        )}
      </div>
    </div>
  );
}
