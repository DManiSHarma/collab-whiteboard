'use client';

import React, { useRef, useEffect } from 'react';

const PRESET_COLORS = [
  '#FFFFFF', '#94A3B8', '#6C5CE7', '#A29BFE', 
  '#0984E3', '#74B9FF', '#00B894', '#55EFC4', 
  '#FDCB6E', '#FFEAA7', '#E17055', '#FF7675', 
  '#E84393', '#FAB1A0', '#00CEC9', '#2D3436'
];

export default function ColorPicker({ color, onChange, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div ref={ref} className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl w-48 z-50">
      <div className="grid grid-cols-4 gap-2 mb-3">
        {PRESET_COLORS.map(c => (
          <div 
            key={c}
            onClick={() => { onChange(c); onClose(); }}
            className={`w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800' : ''}`}
            style={{ backgroundColor: c }}
          >
            {color === c && (
              <svg className="w-4 h-4 text-slate-800 mix-blend-difference" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-white/10 flex items-center gap-2">
        <label className="text-xs text-slate-400 flex-1">Custom</label>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
        />
      </div>
    </div>
  );
}
