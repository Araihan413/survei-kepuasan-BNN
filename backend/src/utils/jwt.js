const jwt = require('jsonwebtoken')

const generateAccessToken = (user) => {
 return jwt.sign({userId: user.userId, username: user.username, role: user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const generateRefreshToken = (user) => {
  return jwt.sign({userId: user.userId, username: user.username, role: user.role}, process.env.REFRES_TOKEN_SECRET, {expiresIn: '4h'})
}

const generateResetPasswordToken = (user) => {
  return jwt.sign({userId: user.userId, email: user.email}, process.env.RESET_PASSWORD_TOKEN_SECRET, {expiresIn: '15m'})
}

const verifyToken = (token) => {
 return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) 
}
const verifyResetToken = (token) => {
  return jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET) 
 }

module.exports = {
  generateAccessToken, 
  generateRefreshToken,
  generateResetPasswordToken, 
  verifyToken, 
  verifyResetToken
}