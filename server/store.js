class RoomStore {
  constructor() {
    this.rooms = new Map();
  }

  getRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        objects: [],
        notes: [],
        chatMessages: [],
        users: new Map()
      });
    }
    return this.rooms.get(roomId);
  }

  addObject(roomId, obj) {
    const room = this.getRoom(roomId);
    room.objects.push(obj);
  }

  updateObject(roomId, objId, updates) {
    const room = this.getRoom(roomId);
    const index = room.objects.findIndex((item) => item.id === objId);
    if (index !== -1) {
      room.objects[index] = { ...room.objects[index], ...updates };
    }
  }

  deleteObject(roomId, objId) {
    const room = this.getRoom(roomId);
    room.objects = room.objects.filter((item) => item.id !== objId);
  }

  clearObjects(roomId) {
    const room = this.getRoom(roomId);
    room.objects = [];
  }

  addNote(roomId, note) {
    const room = this.getRoom(roomId);
    room.notes.push(note);
  }

  updateNote(roomId, noteId, updates) {
    const room = this.getRoom(roomId);
    const index = room.notes.findIndex((item) => item.id === noteId);
    if (index !== -1) {
      room.notes[index] = { ...room.notes[index], ...updates };
    }
  }

  deleteNote(roomId, noteId) {
    const room = this.getRoom(roomId);
    room.notes = room.notes.filter((item) => item.id !== noteId);
  }

  addChatMessage(roomId, msg) {
    const room = this.getRoom(roomId);
    room.chatMessages.push(msg);
    if (room.chatMessages.length > 200) {
      room.chatMessages = room.chatMessages.slice(-200);
    }
  }

  getChatHistory(roomId) {
    const room = this.getRoom(roomId);
    return room.chatMessages;
  }

  addUser(roomId, user) {
    const room = this.getRoom(roomId);
    room.users.set(user.id, user);
  }

  removeUser(roomId, userId) {
    const room = this.getRoom(roomId);
    room.users.delete(userId);
  }

  getUsers(roomId) {
    const room = this.getRoom(roomId);
    return Array.from(room.users.values());
  }

  getState(roomId) {
    const room = this.getRoom(roomId);
    return {
      objects: room.objects,
      notes: room.notes,
      chatMessages: room.chatMessages,
      users: Array.from(room.users.values())
    };
  }

  getRoomCount() {
    return this.rooms.size;
  }
}

module.exports = new RoomStore();
