const utilsJwt = require('../utils/jwt')  

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({status: "Unauthorized", message: "invalid token"})

  try {
    const decoded = utilsJwt.verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      status: "Unauthorized",
      message: "Something went wrong on the server",  
      error: error.message
    })
  }
}

module.exports = {verifyToken}