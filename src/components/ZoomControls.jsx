'use client';

import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useBoard } from '@/context/BoardContext';
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from '@/lib/constants';

export default function ZoomControls() {
  const { zoom, setZoom, isChatOpen, setPanOffset } = useBoard();

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(MAX_ZOOM, +(prev + ZOOM_STEP).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(MIN_ZOOM, +(prev - ZOOM_STEP).toFixed(2)));
  };

  const handleReset = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const percentage = Math.round(zoom * 100);

  return (
    <div
      className="absolute bottom-4 z-40 glass rounded-xl flex items-center gap-1 px-2 py-1.5"
      style={{ right: isChatOpen ? '336px' : '16px', transition: 'right 0.3s ease' }}
    >
      <button
        onClick={handleZoomOut}
        disabled={zoom <= MIN_ZOOM}
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="Zoom Out"
      >
        <ZoomOut size={15} className="text-white/70" />
      </button>

      <span className="text-xs font-medium text-white/60 w-10 text-center tabular-nums">
        {percentage}%
      </span>

      <button
        onClick={handleZoomIn}
        disabled={zoom >= MAX_ZOOM}
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="Zoom In"
      >
        <ZoomIn size={15} className="text-white/70" />
      </button>

      <div className="w-px h-4 bg-white/10 mx-0.5" />

      <button
        onClick={handleReset}
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        title="Reset View"
      >
        <Maximize2 size={15} className="text-white/70" />
      </button>
    </div>
  );
}
