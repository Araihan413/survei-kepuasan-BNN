const jwt = require('jsonwebtoken')
const admin = require('../admin/admin.repository')

const generateAccessToken = (admin) => {
 return jwt.sign({adminId: admin.adminId, username: admin.username, role: admin.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
}

const generateRefreshToken = (admin) => {
  return jwt.sign({adminId: admin.adminId, username: admin.username, role: admin.role}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'})
}

// ? untuk meriset password
const generateResetPasswordToken = (admin) => {
  return jwt.sign({adminId: admin.adminId, email: admin.email}, process.env.RESET_PASSWORD_TOKEN_SECRET, {expiresIn: '15m'})
}

const verifyToken = (token) => {
 return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) 
}

// ? untuk riset password 
const verifyResetToken = (token) => {
  return jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET) 
 }

 const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = {
  generateAccessToken, 
  generateRefreshToken,
  generateResetPasswordToken, 
  verifyToken, 
  verifyResetToken,
  verifyRefreshToken
}