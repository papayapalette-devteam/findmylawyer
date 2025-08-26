const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();
require('./config'); // DB config


//const adminRoutes = require('./routes/admin.route');
const adminUserRoutes = require('./routes/adminUser.route');
const systemSettingsRoutes = require('./routes/systemSettings.route');

// Routes
const userRoutes = require('./routes/user.route');
const lawyerRouter = require('./routes/lawyer.router');

const consultationRoutes = require('./routes/consultationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/admin.route');


// WebSocket Logic
const chatSocket = require('./sockets/chat');

const app = express();
const server = http.createServer(app); // Use http server for socket.io
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Attach io to app (optional but nice)
app.set('io', io);

// Register socket logic
// chatSocket(io);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/upload', require('./routes/upload.route'));
//app.use('/uploads', express.static('uploads')); // Serve files



app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminUserRoutes);           // → for user management
app.use('/api/admin/system/settings', systemSettingsRoutes); // → for settings

// Routes
app.get('/', (req, res) => res.send('User Management System is running'));
app.use('/api/user', userRoutes);
app.use('/api/lawyer', lawyerRouter);

app.use('/api/user/consultation', consultationRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/user/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);


// WebSocket event registration
chatSocket(io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
