const express = require('express');
const questionController = require('./questions/question.controller')
const userController = require('./users/users.controller')
const authController = require('./auth/auth.controller')
const { verifyToken, verifyResetToken } = require('./middleware/auth.middleware')
const { requireRole } = require('./middleware/role.middleware')
const surveyController = require('./surveys/survey.controller')

const app = express();
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT;
app.use(express.json())

app.use('/api/questions', questionController)
app.use('/api/users', userController)
app.use('/api/surveys', surveyController)
app.post('/api/login',  authController.login)
app.post('/api/register', requireRole('admin'), authController.register)
app.post('/api/forget-password', authController.forgetPassword)
app.post('/api/reset-password', verifyResetToken, authController.resetPassword)

app.listen(PORT, (req,res) => {
  console.log('server running in port : http://localhost:2100')
})

