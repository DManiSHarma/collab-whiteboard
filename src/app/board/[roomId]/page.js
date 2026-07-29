'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { BoardProvider } from '@/context/BoardContext';
import Canvas from '@/components/Canvas';
import Toolbar from '@/components/Toolbar';
import StickyNoteLayer from '@/components/StickyNoteLayer';
import CursorOverlay from '@/components/CursorOverlay';
import ChatPanel from '@/components/ChatPanel';
import UserList from '@/components/UserList';
import ZoomControls from '@/components/ZoomControls';

export default function BoardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId;
  const userName = searchParams.get('name') || 'Anonymous';

  return (
    <BoardProvider roomId={roomId} userName={userName}>
      <div className="h-screen w-screen overflow-hidden bg-board-dark relative">
        {/* Top bar with room info */}
        <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-2 pointer-events-none">
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-3 pointer-events-auto">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-semibold text-white/90">Room: {roomId}</span>
          </div>
          <div className="pointer-events-auto">
            <UserList />
          </div>
        </div>

        {/* Toolbar - left side */}
        <Toolbar />

        {/* Canvas area */}
        <div className="absolute inset-0">
          <Canvas />
          <StickyNoteLayer />
          <CursorOverlay />
        </div>

        {/* Chat panel - right side */}
        <ChatPanel />

        {/* Zoom controls - bottom right */}
        <ZoomControls />
      </div>
    </BoardProvider>
  );
}
