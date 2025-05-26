const express = require('express');
const questionController = require('./questions/question.controller')
const userController = require('./users/users.controller')
const authController = require('./auth/auth.controller')
const { verifyResetToken } = require('./middleware/auth.middleware')
const { requireRole } = require('./middleware/role.middleware')
const surveyController = require('./surveys/survey.controller')
const dashboardController = require('./dashboard/dashboard.controller')
const analysisController = require('./analysis/analysis.controller')

const app = express();
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT;
app.use(express.json())
app.use('/api/dashboard', dashboardController) //!
app.use('/api/analysis', analysisController) // !
app.use('/api/surveys', surveyController)   
app.use('/api/questions', questionController)
app.use('/api/users', userController)
app.post('/api/auth/login',  authController.login) // !
app.post('/api/auth/register', requireRole('admin'), authController.register) // !
app.post('/api/auth/forget-password', authController.forgetPassword) //!
app.post('/api/auth/reset-password', verifyResetToken, authController.resetPassword) //!

app.get('/', (req, res) => {
  res.send('selamat datang  di API dashboard survey BNN Sleman')
})
app.listen(PORT, (req,res) => {
  console.log('server running in port : http://localhost:2100')
})

