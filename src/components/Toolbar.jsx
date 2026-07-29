'use client';

import React, { useState } from 'react';
import { useBoard } from '@/context/BoardContext';
import {
  MousePointer2, Pencil, Square, Circle, Minus, MoveRight, 
  Eraser, StickyNote, Hand, Undo, Redo, Trash2
} from 'lucide-react';
import ColorPicker from './ColorPicker';

export default function Toolbar() {
  const {
    tool, setTool,
    color, setColor,
    strokeWidth, setStrokeWidth,
    opacity, setOpacity,
    undoStack, redoStack,
    undo, redo,
    clearCanvas
  } = useBoard();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);
  const [showOpacityPicker, setShowOpacityPicker] = useState(false);

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'hand', icon: Hand, label: 'Pan' },
    { divider: true },
    { id: 'pen', icon: Pencil, label: 'Pen' },
    { id: 'rect', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'arrow', icon: MoveRight, label: 'Arrow' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'note', icon: StickyNote, label: 'Sticky Note' }
  ];

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the entire board?')) {
      clearCanvas();
    }
  };

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 p-2 bg-slate-800/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl z-40">
      
      {tools.map((t, idx) => {
        if (t.divider) return <div key={`div-${idx}`} className="w-8 h-px bg-white/20 my-1" />;
        const Icon = t.icon;
        const isActive = tool === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            title={t.label}
            className={`p-2.5 rounded-xl transition-all ${isActive ? 'tool-active text-white' : 'text-slate-300 hover:bg-white/10'}`}
          >
            <Icon size={20} />
          </button>
        );
      })}

      <div className="w-8 h-px bg-white/20 my-1" />

      {/* Color Picker Toggle */}
      <div className="relative">
        <button
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            setShowStrokePicker(false);
            setShowOpacityPicker(false);
          }}
          title="Color"
          className="p-2.5 rounded-xl transition-all hover:bg-white/10 flex justify-center items-center"
        >
          <div className="w-5 h-5 rounded-full ring-2 ring-white/50" style={{ backgroundColor: color }} />
        </button>
        {showColorPicker && (
          <div className="absolute left-14 top-0">
            <ColorPicker color={color} onChange={setColor} onClose={() => setShowColorPicker(false)} />
          </div>
        )}
      </div>

      {/* Stroke Width Toggle */}
      <div className="relative">
        <button
          onClick={() => {
            setShowStrokePicker(!showStrokePicker);
            setShowColorPicker(false);
            setShowOpacityPicker(false);
          }}
          title="Stroke Width"
          className="p-2.5 rounded-xl transition-all hover:bg-white/10 text-slate-300 flex flex-col items-center justify-center gap-1"
        >
          <div className="w-5 bg-current rounded-full" style={{ height: `${Math.max(2, strokeWidth / 2)}px` }} />
        </button>
        {showStrokePicker && (
          <div className="absolute left-14 top-0 bg-slate-800/90 backdrop-blur border border-white/10 p-4 rounded-xl flex items-center gap-3">
            <span className="text-white text-xs">{strokeWidth}px</span>
            <input 
              type="range" min="1" max="20" 
              value={strokeWidth} 
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-24 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Opacity Toggle */}
      <div className="relative">
        <button
          onClick={() => {
            setShowOpacityPicker(!showOpacityPicker);
            setShowColorPicker(false);
            setShowStrokePicker(false);
          }}
          title="Opacity"
          className="p-2.5 rounded-xl transition-all hover:bg-white/10 text-slate-300 text-xs font-semibold"
        >
          {Math.round(opacity * 100)}%
        </button>
        {showOpacityPicker && (
          <div className="absolute left-14 top-0 bg-slate-800/90 backdrop-blur border border-white/10 p-4 rounded-xl flex items-center gap-3">
            <input 
              type="range" min="0.1" max="1" step="0.1"
              value={opacity} 
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-24 cursor-pointer"
            />
          </div>
        )}
      </div>

      <div className="w-8 h-px bg-white/20 my-1" />

      <button
        onClick={undo}
        disabled={undoStack.length === 0}
        title="Undo"
        className={`p-2.5 rounded-xl transition-all ${undoStack.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-white/10'}`}
      >
        <Undo size={20} />
      </button>
      
      <button
        onClick={redo}
        disabled={redoStack.length === 0}
        title="Redo"
        className={`p-2.5 rounded-xl transition-all ${redoStack.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-white/10'}`}
      >
        <Redo size={20} />
      </button>

      <div className="w-8 h-px bg-white/20 my-1" />

      <button
        onClick={handleClear}
        title="Clear Board"
        className="p-2.5 rounded-xl transition-all text-red-400 hover:bg-red-500/20"
      >
        <Trash2 size={20} />
      </button>

    </div>
  );
}
