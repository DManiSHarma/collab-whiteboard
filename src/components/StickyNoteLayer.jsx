'use client';

import React from 'react';
import { useBoard } from '@/context/BoardContext';
import StickyNote from './StickyNote';

export default function StickyNoteLayer() {
  const { notes, zoom, panOffset } = useBoard();

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 20 }}
    >
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {notes.map((note) => (
          <div key={note.id} className="pointer-events-auto">
            <StickyNote note={note} />
          </div>
        ))}
      </div>
    </div>
  );
}
