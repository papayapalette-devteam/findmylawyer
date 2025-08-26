const mongoose = require('mongoose');
const Message = require('../models/chathistory'); // Adjust path as needed

const onlineLawyers = {};
const onlineClients = {};

module.exports = (io) => {
  console.log('Chat socket connected');

  io.on('connection', (socket) => {
    // Lawyer comes online
    socket.on('lawyerOnline', async (lawyerId) => {
      socket.userType = 'lawyer';
      socket.userId = lawyerId;
      onlineLawyers[lawyerId] = socket.id;
      console.log(`👤 Lawyer ${lawyerId} is online`);
      io.emit('updateOnlineUsers', Object.keys(onlineLawyers));

      // Notify lawyer of unread messages sent to them, grouped by client
      try {
        const unread = await Message.aggregate([
          {
            $match: {
              to:new mongoose.Types.ObjectId(lawyerId),
              toModel: 'Lawyer',
              read: false,
            }
          },
          {
            $group: {
              _id: "$from",
              count: { $sum: 1 }
            }
          }
        ]);
        if (unread.length > 0) {
          io.to(socket.id).emit('missedMessagesNotification', unread);
          console.log(`🔔 Lawyer ${lawyerId} has unread messages:`, unread);
        }
      } catch (err) {
        console.error('❌ Error fetching unread messages for lawyer:', err);
      }
    });

    // Client comes online
    socket.on('clientOnline', async (clientId) => {
      socket.userType = 'client';
      socket.userId = clientId;
      onlineClients[clientId] = socket.id;
      console.log(`🧑‍💼 Client ${clientId} is online`);

      // Notify client of unread messages sent to them, grouped by lawyer
      try {
        const unread = await Message.aggregate([
          {
            $match: {
              to: new mongoose.Types.ObjectId(clientId), // ✅ Correct!
              toModel: 'User',
              read: false,
            }
          },
          {
            $group: {
              _id: "$from",
              count: { $sum: 1 }
            }
          }
        ]);
        if (unread.length > 0) {
          io.to(socket.id).emit('missedMessagesNotification', unread);
          console.log(`🔔 Client ${clientId} has unread messages:`, unread);
        }
      } catch (err) {
        console.error('❌ Error fetching unread messages for client:', err);
      }
    });

    // Provide online lawyers list (to clients)
    socket.on('getOnlineLawyers', () => {
      socket.emit('onlineLawyersList', Object.keys(onlineLawyers));
    });

      // When lawyer requests the list of online clients
    socket.on('getOnlineClients', () => {
      // Emit back to the requesting socket only
      socket.emit('onlineClientsList', Object.keys(onlineClients));
    })

    // Handle sending private messages from either side
    socket.on('privateMessage', async ({ toUserId, message, fromUserType, fileUrl, fileName, fileType, timestamp }) => {
      let receiverSocketId;
      let fromModel, toModel;

      if (fromUserType === 'client') {
        receiverSocketId = onlineLawyers[toUserId];
        fromModel = 'User';
        toModel = 'Lawyer';
      } else if (fromUserType === 'lawyer') {
        receiverSocketId = onlineClients[toUserId];
        fromModel = 'Lawyer';
        toModel = 'User';
      }

      const fromUserId = socket.userId;

      console.log(`📨 Message from ${fromUserId} to ${toUserId} (${fromUserType})`);

      // Deliver real-time if receiver online
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', {
          from: fromUserId,
          message,
          fileUrl,
          fileName,
          fileType,
          timestamp
        });
      }

      // Save message to DB as unread by receiver
      try {
        await Message.create({
          from: fromUserId,
          fromModel,
          to: toUserId,
          toModel,
          message,
          fileUrl,
          fileName,
          fileType,
          timestamp: timestamp || new Date(),
          read: false
        });
        console.log('💾 Message saved to DB');
      } catch (err) {
        console.error('❌ Error saving message:', err);
      }
    });

    // Relay typing notifications to the intended recipient
    socket.on('typing', ({ toUserId, fromUserType, name, fromUserId }) => {
      let receiverSocketId;
      if (fromUserType === 'client') {
        receiverSocketId = onlineLawyers[toUserId];
      } else if (fromUserType === 'lawyer') {
        receiverSocketId = onlineClients[toUserId];
      }
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing', {
          fromUserType,
          name,
          fromUserId
        });
      }
    });

    // Mark messages as read for a conversation (called when recipient opens chat)
    socket.on('markMessagesRead', async ({ readerId, senderId, readerModel }) => {
      // readerModel = 'User' or 'Lawyer'
      // Only messages sent TO readerId by senderId can be marked read
      try {
        await Message.updateMany(
          {
            from:new mongoose.Types.ObjectId(senderId),
            to: new mongoose.Types.ObjectId(readerId),
            toModel: readerModel,
            read: false
          },
          { $set: { read: true } }
        );
        console.log(`✅ Messages from ${senderId} marked read by ${readerId}`);

        // Optionally notify sender about read receipt
        let senderSocketId;
        if (readerModel === 'Lawyer') {
          senderSocketId = onlineClients[senderId];
        } else if (readerModel === 'User') {
          senderSocketId = onlineLawyers[senderId];
        }
        if (senderSocketId) {
          io.to(senderSocketId).emit('messagesRead', { readerId, senderId });
        }
      } catch (err) {
        console.error('❌ Failed to mark messages read:', err);
      }
    });

    // Handle disconnect event, clean up socket ids
    socket.on('disconnect', () => {
      const { userType, userId } = socket;

      if (userType === 'lawyer' && onlineLawyers[userId] === socket.id) {
        delete onlineLawyers[userId];
        io.emit('updateOnlineUsers', Object.keys(onlineLawyers));
        console.log(`❌ Lawyer ${userId} disconnected`);
      } else if (userType === 'client' && onlineClients[userId] === socket.id) {
        delete onlineClients[userId];
        console.log(`❌ Client ${userId} disconnected`);
      } else {
        console.log(`❌ Unknown socket disconnected: ${socket.id}`);
      }
    });
  });
};
