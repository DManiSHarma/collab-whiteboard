'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Paintbrush, Users, MessageSquare, Sparkles, Plus, ArrowRight, StickyNote } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  // Form states
  const [createName, setCreateName] = useState('');
  const [joinName, setJoinName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  // Error states
  const [createError, setCreateError] = useState('');
  const [joinError, setJoinError] = useState('');

  // Handle Create Room
  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!createName.trim() || createName.trim().length < 2) {
      setCreateError('Name must be at least 2 characters.');
      return;
    }
    setCreateError('');
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/board/${roomCode}?name=${encodeURIComponent(createName.trim())}`);
  };

  // Handle Join Room
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!joinName.trim() || joinName.trim().length < 2) {
      setJoinError('Name must be at least 2 characters.');
      return;
    }
    const cleanCode = joinCode.trim().toUpperCase();
    if (!cleanCode || cleanCode.length !== 6) {
      setJoinError('Room code must be exactly 6 characters.');
      return;
    }
    setJoinError('');
    router.push(`/board/${cleanCode}?name=${encodeURIComponent(joinName.trim())}`);
  };

  return (
    <div className="landing-bg relative h-screen w-screen overflow-hidden flex flex-col justify-between p-6 md:p-12 text-slate-100 select-none">
      {/* Decorative floating animated background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl animate-float" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-1/3 right-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl animate-float" style={{ animationDuration: '9s', animationDelay: '1s' }} />
        <div className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl animate-float" style={{ animationDuration: '8s', animationDelay: '2s' }} />
      </div>

      {/* Header section */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-400 p-0.5 shadow-glow">
            <div className="w-full h-full bg-board-surface rounded-[10px] flex items-center justify-center">
              <Paintbrush className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Collab<span className="text-indigo-400">Board</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 glass px-3 py-1.5 rounded-full border border-board-border">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Real-time Workspace</span>
        </div>
      </header>

      {/* Main Content section */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-4 flex flex-col items-center">
        {/* Title & Tagline */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            <span className="gradient-text">CollabBoard</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium max-w-xl mx-auto">
            Draw. Collaborate. Create Together.
          </p>
          <p className="text-sm text-slate-400 mt-2">
            An interactive multi-user canvas for brainstorming, diagramming, and real-time ideas.
          </p>
        </div>

        {/* Side-by-side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Card 1: Create Room */}
          <div className="glass rounded-2xl p-6 border border-board-border/70 hover:border-indigo-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Create a New Room</h2>
              <p className="text-xs text-slate-400 mb-6">
                Start a fresh canvas and invite your team members with an instant room code.
              </p>

              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Display Name
                  </label>
                  <input
                    type="text"
                    value={createName}
                    onChange={(e) => {
                      setCreateName(e.target.value);
                      if (createError) setCreateError('');
                    }}
                    placeholder="e.g. Alex (Host)"
                    className="w-full px-4 py-2.5 rounded-xl bg-board-surface/90 border border-board-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                  {createError && (
                    <p className="text-xs text-rose-400 mt-1.5 font-medium">{createError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>Create Room</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Card 2: Join Room */}
          <div className="glass rounded-2xl p-6 border border-board-border/70 hover:border-teal-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-teal-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Join Existing Room</h2>
              <p className="text-xs text-slate-400 mb-6">
                Enter a 6-character room code to hop directly onto your team's whiteboard.
              </p>

              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Display Name
                  </label>
                  <input
                    type="text"
                    value={joinName}
                    onChange={(e) => {
                      setJoinName(e.target.value);
                      if (joinError) setJoinError('');
                    }}
                    placeholder="e.g. Sarah"
                    className="w-full px-4 py-2.5 rounded-xl bg-board-surface/90 border border-board-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Room Code (6 Characters)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={joinCode}
                    onChange={(e) => {
                      setJoinCode(e.target.value.toUpperCase());
                      if (joinError) setJoinError('');
                    }}
                    placeholder="e.g. X9K2P4"
                    className="w-full px-4 py-2.5 rounded-xl bg-board-surface/90 border border-board-border text-sm text-white font-mono tracking-wider uppercase placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                  {joinError && (
                    <p className="text-xs text-rose-400 mt-1.5 font-medium">{joinError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>Join Board</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mt-8">
          <div className="glass-light rounded-xl p-4 flex items-center gap-3 border border-board-border/40">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <Paintbrush className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Real-Time Drawing</h3>
              <p className="text-[11px] text-slate-400">Pencil, shapes, colors, and live cursors.</p>
            </div>
          </div>

          <div className="glass-light rounded-xl p-4 flex items-center gap-3 border border-board-border/40">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <StickyNote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Sticky Notes</h3>
              <p className="text-[11px] text-slate-400">Drag, resize, edit text and organize ideas.</p>
            </div>
          </div>

          <div className="glass-light rounded-xl p-4 flex items-center gap-3 border border-board-border/40">
            <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Live Chat</h3>
              <p className="text-[11px] text-slate-400">Integrated room messaging with live status.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-slate-500 max-w-6xl mx-auto w-full">
        CollabBoard &copy; {new Date().getFullYear()} — Built for seamless teamwork
      </footer>
    </div>
  );
}
