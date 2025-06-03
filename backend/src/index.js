const express = require('express');
const path = require('path');
const cors = require('cors')
const questionController = require('./questions/question.controller')
const userController = require('./admin/admin.controller')
const authController = require('./auth/auth.controller')
const { verifyResetToken } = require('./middleware/auth.middleware')
const { requireRole } = require('./middleware/role.middleware')
const surveyController = require('./surveys/survey.controller')
const dashboardController = require('./dashboard/dashboard.controller')
const analysisController = require('./analysis/analysis.controller')
const optionController = require('./option/option.controller')
const serviceController = require('./service/service.controller')
const answerController = require('./answer/answer.controller')

const app = express();
const dotenv = require('dotenv')
// http://localhost:2100/images/default-avatar.png //? contoh request image profile
app.use(express.static(path.join(__dirname, 'public')));

dotenv.config()
app.use(cors())
const PORT = process.env.PORT;
app.use(express.json())
app.use('/api/dashboard', dashboardController) //!
app.use('/api/analysis', analysisController) // !
app.use('/api/survey', surveyController)   
app.use('/api/question', questionController)
app.use('/api/admin', userController)
app.post('/api/auth/login',  authController.login) // !
app.post('/api/auth/register', authController.register) // !
app.post('/api/auth/forget-password', authController.forgetPassword) //!
app.post('/api/auth/reset-password', verifyResetToken, authController.resetPassword) //!
app.post('/api/auth/logout', authController.logout)
app.use('/api/option', optionController)
app.use('/api/service', serviceController)
app.use('/api/answer', answerController)


app.get('/', (req, res) => {
  res.send('selamat datang  di API dashboard survey BNN Sleman')
})
app.listen(PORT, (req,res) => {
  console.log('server running in port : http://localhost:2100')
})

