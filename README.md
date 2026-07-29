# CollabBoard — Real-Time Collaboration Whiteboard

A collaborative online whiteboard where multiple users can draw, add sticky notes, and chat in real time.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![Socket.io](https://img.shields.io/badge/Socket.io-4-blue?logo=socket.io) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss) ![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)

## ✨ Features

- **🎨 Real-Time Drawing** — Freehand pen, shapes (rectangle, circle, line, arrow), eraser, with live sync
- **📝 Sticky Notes** — Draggable, color-coded notes with real-time text editing
- **💬 Live Chat** — Slide-out chat panel with typing indicators and unread badges
- **👥 Multi-User Cursors** — See other users' cursors with name labels
- **🏠 Room System** — Create/join rooms with shareable 6-character codes
- **🔍 Zoom & Pan** — Infinite canvas with zoom (25%–300%) and pan support
- **↩️ Undo/Redo** — Full undo/redo stack for drawing actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Install & Start the Backend Server

```bash
cd server
npm install
npm run dev
```

The server starts on `http://localhost:3001`.

### 2. Install & Start the Frontend

```bash
# From the project root
npm install
npm run dev
```

The frontend starts on `http://localhost:3000`.

### 3. Open in Browser

1. Open `http://localhost:3000`
2. Enter your display name and create a room
3. Share the room code with others
4. Start collaborating!

## 🏗️ Architecture

```
Client A ←→ Socket.io Server ←→ Client B
              ↕
        In-Memory Store
        (Redis-ready)
```

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + Socket.io Client
- **Backend**: Node.js + Express + Socket.io Server
- **State**: In-memory store (Redis-ready for production scaling)

## 📁 Project Structure

```
collab-whiteboard/
├── server/                    # Backend Socket.io server
│   ├── index.js               # Express + Socket.io setup
│   ├── socketHandlers.js      # WebSocket event handlers
│   ├── store.js               # In-memory room state store
│   └── utils.js               # Helper utilities
│
├── src/                       # Next.js frontend
│   ├── app/                   # App Router pages
│   │   ├── page.js            # Landing page
│   │   └── board/[roomId]/    # Whiteboard workspace
│   ├── components/            # React components
│   ├── hooks/                 # Custom React hooks
│   ├── context/               # Board state context
│   └── lib/                   # Constants & socket client
```

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS 3 |
| Icons | Lucide React |
| Real-time | Socket.io (WebSocket) |
| Backend | Node.js, Express |
| State | In-memory (Redis-ready) |

## 📡 Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-room` | Client → Server | Join a whiteboard room |
| `draw-action` | Bidirectional | Drawing object created |
| `add-note` | Bidirectional | Sticky note added |
| `chat-message` | Bidirectional | Chat message sent |
| `cursor-move` | Client → Server | Cursor position update |
| `cursor-update` | Server → Client | Remote cursor broadcast |

## 📄 License

MIT

Copyright © 2026 DevOps Manish Sharma

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE
