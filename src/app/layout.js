import './globals.css';

export const metadata = {
  title: 'CollabBoard — Real-Time Collaboration Whiteboard',
  description: 'A collaborative online whiteboard where multiple users can draw, add sticky notes, and chat in real time.',
  keywords: ['whiteboard', 'collaboration', 'real-time', 'drawing', 'socket.io'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
