'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useBoard } from '@/context/BoardContext';
import { nanoid } from 'nanoid';

export default function Canvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const {
    objects,
    tool,
    color,
    strokeWidth,
    opacity,
    zoom,
    panOffset,
    setPanOffset,
    addObject,
    addNote,
    emitCursorMove
  } = useBoard();

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentObject, setCurrentObject] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });


  // Redraw canvas on changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const render = () => {
      // Set canvas dimensions to window inner sizes
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(zoom, zoom);

      // Draw dot grid
      const gridSize = 40;
      const startX = -panOffset.x / zoom;
      const startY = -panOffset.y / zoom;
      const endX = startX + canvas.width / zoom;
      const endY = startY + canvas.height / zoom;
      
      const offsetX = startX % gridSize;
      const offsetY = startY % gridSize;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let x = startX - offsetX; x < endX; x += gridSize) {
        for (let y = startY - offsetY; y < endY; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw all saved objects
      const allObjects = currentObject ? [...objects, currentObject] : objects;

      allObjects.forEach((obj) => {
        ctx.globalAlpha = obj.opacity || 1;
        ctx.strokeStyle = obj.color || '#fff';
        ctx.fillStyle = obj.color || '#fff';
        ctx.lineWidth = obj.strokeWidth || 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (obj.type === 'freehand' || obj.type === 'eraser') {
          if (obj.type === 'eraser') {
             ctx.globalCompositeOperation = 'destination-out';
             ctx.lineWidth = obj.strokeWidth * 2;
             ctx.strokeStyle = 'rgba(0,0,0,1)';
          }
          if (obj.points && obj.points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(obj.points[0].x, obj.points[0].y);
            for (let i = 1; i < obj.points.length; i++) {
              ctx.lineTo(obj.points[i].x, obj.points[i].y);
            }
            ctx.stroke();
          }
          ctx.globalCompositeOperation = 'source-over';
        } else if (obj.type === 'rect') {
          ctx.beginPath();
          ctx.rect(obj.startX, obj.startY, obj.endX - obj.startX, obj.endY - obj.startY);
          ctx.stroke();
        } else if (obj.type === 'circle') {
          ctx.beginPath();
          const radius = Math.sqrt(Math.pow(obj.endX - obj.startX, 2) + Math.pow(obj.endY - obj.startY, 2));
          ctx.arc(obj.startX, obj.startY, radius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (obj.type === 'line') {
          ctx.beginPath();
          ctx.moveTo(obj.startX, obj.startY);
          ctx.lineTo(obj.endX, obj.endY);
          ctx.stroke();
        } else if (obj.type === 'arrow') {
          ctx.beginPath();
          ctx.moveTo(obj.startX, obj.startY);
          ctx.lineTo(obj.endX, obj.endY);
          ctx.stroke();

          // Arrowhead
          const headlen = 15;
          const angle = Math.atan2(obj.endY - obj.startY, obj.endX - obj.startX);
          ctx.beginPath();
          ctx.moveTo(obj.endX, obj.endY);
          ctx.lineTo(obj.endX - headlen * Math.cos(angle - Math.PI / 6), obj.endY - headlen * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(obj.endX - headlen * Math.cos(angle + Math.PI / 6), obj.endY - headlen * Math.sin(angle + Math.PI / 6));
          ctx.lineTo(obj.endX, obj.endY);
          ctx.lineTo(obj.endX - headlen * Math.cos(angle - Math.PI / 6), obj.endY - headlen * Math.sin(angle - Math.PI / 6));
          ctx.stroke();
          ctx.fill();
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [objects, currentObject, zoom, panOffset]);

  const getPointerPos = (e) => {
    return {
      x: (e.clientX - panOffset.x) / zoom,
      y: (e.clientY - panOffset.y) / zoom
    };
  };

  const handlePointerDown = (e) => {
    if (tool === 'hand' || e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (e.button !== 0) return; // Only left click

    // Handle note tool: create sticky note at click position
    if (tool === 'note') {
      const pos = getPointerPos(e);
      addNote({
        id: nanoid(),
        x: pos.x,
        y: pos.y,
        text: '',
        color: '#FEF3C7',
        width: 200,
        height: 120,
      });
      return;
    }

    if (tool === 'select') return;

    setIsDrawing(true);
    const pos = getPointerPos(e);

    if (tool === 'pen' || tool === 'freehand' || tool === 'eraser') {
      setCurrentObject({
        id: nanoid(),
        type: tool === 'pen' ? 'freehand' : tool,
        points: [pos],
        color,
        strokeWidth,
        opacity
      });
    } else if (['rect', 'circle', 'line', 'arrow'].includes(tool)) {
      setCurrentObject({
        id: nanoid(),
        type: tool,
        startX: pos.x,
        startY: pos.y,
        endX: pos.x,
        endY: pos.y,
        color,
        strokeWidth,
        opacity
      });
    }
  };

  const handlePointerMove = (e) => {
    // Emit throttled cursor position
    const pos = getPointerPos(e);
    emitCursorMove(pos.x, pos.y);

    if (isPanning) {
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!isDrawing || !currentObject) return;

    if (tool === 'pen' || tool === 'freehand' || tool === 'eraser') {
      setCurrentObject(prev => ({
        ...prev,
        points: [...prev.points, pos]
      }));
    } else if (['rect', 'circle', 'line', 'arrow'].includes(tool)) {
      setCurrentObject(prev => ({
        ...prev,
        endX: pos.x,
        endY: pos.y
      }));
    }
  };

  const handlePointerUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }
    
    if (isDrawing && currentObject) {
      addObject(currentObject);
      setCurrentObject(null);
      setIsDrawing(false);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 bg-slate-900 overflow-hidden select-none touch-none"
      style={{ cursor: tool === 'hand' || isPanning ? 'grab' : 'crosshair' }}
    >
      <canvas
        ref={canvasRef}
        className="block"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
      />
    </div>
  );
}
