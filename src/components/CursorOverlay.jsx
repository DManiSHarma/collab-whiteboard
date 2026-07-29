'use client';

import React from 'react';
import { useBoard } from '@/context/BoardContext';

export default function CursorOverlay() {
  const { remoteCursors, userId, zoom, panOffset } = useBoard();

  const cursors = [];
  if (remoteCursors && remoteCursors instanceof Map) {
    for (const [id, cursor] of remoteCursors) {
      if (id !== userId) {
        const age = Date.now() - (cursor.lastUpdate || 0);
        const opacity = age > 3000 ? Math.max(0, 1 - (age - 3000) / 2000) : 1;
        if (opacity > 0) {
          cursors.push({ id, ...cursor, opacity });
        }
      }
    }
  }

  if (cursors.length === 0) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 30 }}
    >
      {cursors.map((cursor) => {
        const screenX = cursor.x * zoom + panOffset.x;
        const screenY = cursor.y * zoom + panOffset.y;

        return (
          <div
            key={cursor.id}
            className="absolute"
            style={{
              left: 0,
              top: 0,
              transform: `translate(${screenX}px, ${screenY}px)`,
              transition: 'transform 0.1s ease-out',
              opacity: cursor.opacity,
              zIndex: 30,
            }}
          >
            {/* Cursor arrow */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
            >
              <path
                d="M3 2L17 10L10 11.5L7 18L3 2Z"
                fill={cursor.color || '#6C5CE7'}
                stroke="white"
                strokeWidth="1"
              />
            </svg>

            {/* Name label */}
            <div
              className="absolute left-4 top-4 px-2 py-0.5 rounded-md text-white whitespace-nowrap"
              style={{
                backgroundColor: cursor.color || '#6C5CE7',
                fontSize: '11px',
                fontWeight: 500,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                lineHeight: '16px',
              }}
            >
              {cursor.userName || 'Anonymous'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
