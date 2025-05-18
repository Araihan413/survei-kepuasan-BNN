const jwt = require('jsonwebtoken')

const generateAccessToken = (user) => {
 return jwt.sign({user_id: user.user_id, username: user.username, role: user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const generateRefreshToken = (user) => {
  return jwt.sign({user_id: user.user_id, username: user.username, role: user.role}, process.env.REFRES_TOKEN_SECRET, {expiresIn: '4h'})
}

const verifyToken = (token) => {
 return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) 
}

module.exports = {generateAccessToken, generateRefreshToken, verifyToken}