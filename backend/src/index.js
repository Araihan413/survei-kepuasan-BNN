const express = require('express');
const path = require('path');
const cors = require('cors')
const http = require('http');
const { Server } = require('socket.io');
const questionController = require('./questions/question.controller')
const adminController = require('./admin/admin.controller')
const authController = require('./auth/auth.controller')
const { verifyResetToken } = require('./middleware/auth.middleware')
const { requireRole } = require('./middleware/role.middleware')
const {verifyToken} = require('./middleware/auth.middleware')
const surveyController = require('./surveys/survey.controller')
const dashboardController = require('./dashboard/dashboard.controller')
const analysisController = require('./analysis/analysis.controller')
const optionController = require('./option/option.controller')
const serviceController = require('./service/service.controller')
const answerController = require('./answer/answer.controller')
const notifController = require('./notification/notif.controller')

const app = express();
const dotenv = require('dotenv')
// http://localhost:2100/images/default-avatar.png //? contoh request image profile
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Contoh kirim pesan ke client
  socket.emit('welcome', { message: 'Selamat datang di dashboard realtime BNN' });

  // Contoh jika ada survei baru
  socket.on('send-new-survey', (data) => {
    // broadcast ke semua client
    io.emit('new-survey', data);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

dotenv.config()
app.use(cors())
const PORT = process.env.PORT;
app.use(express.json())
app.use('/api/dashboard', dashboardController) //!
app.use('/api/analysis', analysisController) // !
app.use('/api/survey', surveyController)   
app.use('/api/question', questionController)
app.use('/api/admin', adminController)
app.post('/api/auth/login',  authController.login) // !
app.post('/api/auth/register', authController.register) // !
app.post('/api/auth/forget-password', authController.forgetPassword) //!
app.post('/api/auth/reset-password', verifyToken, authController.resetPassword) //!
app.post('/api/auth/logout', authController.logout)
app.use('/api/option', optionController)
app.use('/api/service', serviceController)
app.use('/api/answer', answerController)
app.use('/api/notification', notifController)


app.get('/', (req, res) => {
  res.send('selamat datang  di API dashboard survey BNN Sleman')
})
server.listen(PORT, () => {
  console.log(`Server + WebSocket running at http://localhost:${PORT}`);
});
