const express = require('express');
const questionController = require('./questions/question.controller')
const userController = require('./users/users.controller')
const authController = require('./auth/auth.controller')
const { verifyToken, verifyResetToken } = require('./middleware/auth.middleware')
const { requireRole } = require('./middleware/role.middleware')

const app = express();
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT;
app.use(express.json())

app.use('/questions', questionController)
app.use('/users', verifyToken, userController)
app.post('/login',  authController.login)
app.post('/register', requireRole('admin'), authController.register)
app.post('/forget-password', authController.forgetPassword)
app.post('/reset-password', verifyResetToken, authController.resetPassword)

app.listen(PORT, (req,res) => {
  console.log('server running in port : http://localhost:2100')
})

