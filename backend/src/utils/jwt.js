const jwt = require('jsonwebtoken')

const generateAccessToken = (admin) => {
 return jwt.sign({adminId: admin.adminId, username: admin.username, role: admin.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const generateRefreshToken = (admin) => {
  return jwt.sign({adminId: admin.adminId, username: admin.username, role: admin.role}, process.env.REFRES_TOKEN_SECRET, {expiresIn: '4h'})
}

const generateResetPasswordToken = (admin) => {
  return jwt.sign({adminId: admin.adminId, email: admin.email}, process.env.RESET_PASSWORD_TOKEN_SECRET, {expiresIn: '15m'})
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