const { generateUserColor, createId } = require('./utils');

function registerHandlers(io, socket, store) {
  socket.on('join-room', ({ roomId, userName }) => {
    if (!roomId || !userName) return;

    const user = {
      id: socket.id,
      name: userName,
      color: generateUserColor()
    };

    socket.join(roomId);
    store.addUser(roomId, user);

    socket.data.roomId = roomId;
    socket.data.user = user;

    socket.emit('room-state', store.getState(roomId));
    socket.to(roomId).emit('user-joined', user);
  });

  socket.on('draw-action', (action) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    store.addObject(roomId, action);
    socket.to(roomId).emit('draw-action', action);
  });

  socket.on('update-object', ({ id, updates }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    store.updateObject(roomId, id, updates);
    socket.to(roomId).emit('update-object', { id, updates });
  });

  socket.on('delete-object', (id) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    store.deleteObject(roomId, id);
    socket.to(roomId).emit('delete-object', id);
  });

  socket.on('clear-canvas', () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    store.clearObjects(roomId);
    socket.to(roomId).emit('clear-canvas');
  });

  socket.on('add-note', (note) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    store.addNote(roomId, note);
    socket.to(roomId).emit('add-note', note);
  });

  socket.on('update-note', ({ id, updates }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    store.updateNote(roomId, id, updates);
    socket.to(roomId).emit('update-note', { id, updates });
  });

  socket.on('delete-note', (id) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    store.deleteNote(roomId, id);
    socket.to(roomId).emit('delete-note', id);
  });

  socket.on('cursor-move', ({ x, y }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    const userName = socket.data.user ? socket.data.user.name : '';
    socket.to(roomId).emit('cursor-update', {
      userId: socket.id,
      x,
      y,
      userName
    });
  });

  socket.on('chat-message', ({ text }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    const message = {
      id: createId(),
      userId: socket.id,
      userName: socket.data.user ? socket.data.user.name : 'Anonymous',
      text,
      timestamp: Date.now()
    };
    store.addChatMessage(roomId, message);
    io.to(roomId).emit('chat-message', message);
  });

  socket.on('typing-start', () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    const userName = socket.data.user ? socket.data.user.name : '';
    socket.to(roomId).emit('user-typing', {
      userId: socket.id,
      userName
    });
  });

  socket.on('typing-stop', () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    socket.to(roomId).emit('user-stop-typing', {
      userId: socket.id
    });
  });

  socket.on('disconnect', () => {
    const roomId = socket.data.roomId;
    const user = socket.data.user;
    if (roomId) {
      store.removeUser(roomId, socket.id);
      socket.to(roomId).emit('user-left', {
        userId: socket.id,
        userName: user ? user.name : ''
      });
    }
  });
}

module.exports = { registerHandlers };
