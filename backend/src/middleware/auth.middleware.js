const utilsJwt = require('../utils/jwt')  

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({
      status: "Unauthorized",
      message: "token tidak valid atau tidak tersedia"
    });
  }

  try {
    const decoded = utilsJwt.verifyToken(token);
    req.admin = decoded;
    next();
  } catch (accessTokenError) {
    if (accessTokenError.name === 'TokenExpiredError') {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          error: "access token expired dan refresh token tidak tersedia"
        });
      }

      try {
        const decodedRefresh = utilsJwt.verifyRefreshToken(refreshToken);
        const newAccessToken = utilsJwt.generateAccessToken(decodedRefresh);
        res.setHeader('New-Access-Token', newAccessToken);
        req.admin = decodedRefresh;
        next();
      } catch (refreshTokenError) {
        return res.status(403).json({
          error: "Sesi telah berakhir, silakan login kembali",
          details: refreshTokenError.message
        });
      }
    } else {
      console.error("Access token tidak valid:", accessTokenError);
      return res.status(403).json({
        error: "Access token tidak valid",
        details: accessTokenError.message
      });
    }
  }
};


// ? menangani middleware saat reset password
const verifyResetToken = async (req, res, next) => {

  const token = req.query.token
  if (!token) return res.status(401).json({status: "Unauthorized", message: "Token Tidak Valid"})

  try {
    const decoded = utilsJwt.verifyResetToken(token)
    req.admin = decoded
    next()
  } catch (error) {
    res.status(401).json({
      status: "Unauthorized",
      message: "Token tidak valid atau kedaluwarsa" 
    })
  }

}

module.exports = {verifyToken, verifyResetToken}