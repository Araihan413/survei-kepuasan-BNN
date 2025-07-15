
const authService = require('./auth.service')
const utilsJwt = require('../utils/jwt')
const admin = require('../admin/admin.repository')


const login = async (req, res) => {
  try {

    const {username, password} = req.body;

    const loginAdmin = await authService.authLogin(username, password)
    res.cookie('refreshToken', loginAdmin.tokenRefresh, 
      {
        httpOnly: true, 
        // secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      })
    res.status(200).json({
      status: 'success',
      message: 'login sukses',
      data: {
        accessToken: loginAdmin.tokenAccess,
        admin: loginAdmin.dataAdmin
      }
    })

  } catch (error) {
    res.status(401).json({
      status: "error",
      message: error.message,
      error: error.message
    })
  }
}


const register = async (req, res) => {
try {
  const {name, username, password, confirmPassword, email} = req.body;

  const registerUser = await authService.authRegister({name, username, password, confirmPassword, email})

  res.status(201).json({
    status: 'success',
    message: 'register sukses',
    data: registerUser
  })

} catch (error) {
  res.status(400).json({
    status: "error",
    message: "Something went wrong on the server",
    error: error.message
  })
}}

const forgetPassword = async (req, res) => {
  const email = req.body.email
  try {
    const resetPasswordLink = await authService.authForgetPassword(email)
    res.status(200).json({
      status: 'success',
      message: 'Link reset password berhasil dikirim',
      data: resetPasswordLink
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
}

const resetPassword = async (req, res) => {
  const {oldPassword, newPassword, confirmPassword } = req.body
  const username = req.admin.username
  try {
    const resetPasswordLink = await authService.authResetPassword(username,oldPassword, newPassword, confirmPassword)
    res.status(200).json({
      status: 'success',
      message: 'Password berhasil direset',
      data: resetPasswordLink,
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
}

const logout = async (req, res) => {
  // 1. Hapus cookie refreshToken
  res.clearCookie('refreshToken');

  // 2. Revoke refresh token di database (jika ada)
  const token = req.cookies.refreshToken;
  await admin.updateTokenRefresh(token);

  res.json({ message: "Logout berhasil" });
};

module.exports = {
  login,
  register,
  forgetPassword,
  resetPassword,
  logout
}