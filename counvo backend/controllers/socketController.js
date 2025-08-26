const Chat = require('../models/chat.model');
const Consultation = require('../models/Consultation');

exports.handleJoinSession = (socket, data) => {
  const { chatSessionId, userId, role } = data;

  if (!chatSessionId || !userId || !role) return;

  socket.join(chatSessionId);
  socket.data = { chatSessionId, userId, role };

  socket.to(chatSessionId).emit('user-joined', { userId, role });
  console.log(`User ${userId} (${role}) joined chat ${chatSessionId}`);
};

exports.handleSendMessage = async (io, data) => {
  const { chatSessionId, sender, message, messageType = 'text', fileUrl } = data;

  if (!chatSessionId || !sender || (!message && !fileUrl)) return;

  const newMsg = await Chat.create({
    chatSessionId,
    sender,
    message,
    messageType,
    fileUrl
  });

  io.to(chatSessionId).emit('receive-message', newMsg);
};

exports.handleTyping = (socket, data) => {
  const { chatSessionId, userId } = data;
  socket.to(chatSessionId).emit('typing', { userId });
};

exports.handleStartTimer = async (io, data) => {
  const { consultationId } = data;

  const consultation = await Consultation.findById(consultationId);
  if (!consultation) return;

  setTimeout(async () => {
    consultation.status = 'completed';
    await consultation.save();
    io.to(consultation.chatSessionId).emit('session-ended');
  }, 5 * 60 * 1000); // 5 min timer
};
