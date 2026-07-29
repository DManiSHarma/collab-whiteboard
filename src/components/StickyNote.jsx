'use client';

import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useBoard } from '@/context/BoardContext';

const STRIP_COLORS = {
  '#FEF3C7': '#F59E0B',
  '#FCE7F3': '#EC4899',
  '#D1FAE5': '#10B981',
  '#DBEAFE': '#3B82F6',
  '#EDE9FE': '#8B5CF6',
};

export default function StickyNote({ note }) {
  const { updateNote, deleteNote, zoom, panOffset } = useBoard();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, noteX: 0, noteY: 0 });
  const textRef = useRef(null);

  const stripColor = STRIP_COLORS[note.color] || '#F59E0B';

  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      noteX: note.x,
      noteY: note.y,
    };

    const handleDragMove = (moveEvent) => {
      const dx = (moveEvent.clientX - dragStartRef.current.x) / zoom;
      const dy = (moveEvent.clientY - dragStartRef.current.y) / zoom;
      const newX = dragStartRef.current.noteX + dx;
      const newY = dragStartRef.current.noteY + dy;
      updateNote(note.id, { x: newX, y: newY });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
  };

  const handleTextChange = (e) => {
    updateNote(note.id, { text: e.target.innerText });
  };

  useEffect(() => {
    if (textRef.current && textRef.current.innerText !== note.text) {
      textRef.current.innerText = note.text || '';
    }
  }, [note.text]);

  return (
    <div
      className={`sticky-note absolute ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${note.x}px`,
        top: `${note.y}px`,
        minWidth: '180px',
        minHeight: '100px',
        width: note.width || 200,
        zIndex: isDragging ? 1000 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top drag strip */}
      <div
        className="h-2 rounded-t-lg cursor-move"
        style={{ backgroundColor: stripColor }}
        onMouseDown={handleDragStart}
      />

      {/* Note body */}
      <div
        className="rounded-b-lg px-3 py-2 relative"
        style={{ backgroundColor: note.color || '#FEF3C7' }}
      >
        {/* Delete button */}
        {isHovered && (
          <button
            className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              deleteNote(note.id);
            }}
          >
            <X size={12} className="text-gray-700" />
          </button>
        )}

        {/* Editable text */}
        <div
          ref={textRef}
          contentEditable
          suppressContentEditableWarning
          className="text-gray-800 text-sm outline-none min-h-[60px] break-words"
          style={{ fontSize: '14px' }}
          onInput={handleTextChange}
          onMouseDown={(e) => e.stopPropagation()}
          data-placeholder="Type here..."
        />
        {(!note.text || note.text.trim() === '') && (
          <div className="absolute top-2 left-3 text-gray-400/60 text-sm pointer-events-none select-none">
            Type here...
          </div>
        )}
      </div>
    </div>
  );
}
