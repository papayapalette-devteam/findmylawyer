const multer = require('multer');
const storage = multer.memoryStorage(); // <-- Use memory storage!
const chatupload = multer({ storage: storage });
module.exports = chatupload;
