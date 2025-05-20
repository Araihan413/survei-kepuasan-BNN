
const authService = require('./auth.service')

const login = async (req, res) => {
  try {

    const {username, password} = req.body;

    const loginUser = await authService.authLogin(username, password)
    res.cookie('refreshToken', loginUser.tokenRefresh, 
      {
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000
      })
    res.status(200).json({
      status: 'success',
      message: 'login sukses',
      data: loginUser
    })

  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
}


const register = async (req, res) => {
try {
  const {userId, name, username, password, confirmPassword, role, email} = req.body;

  const registerUser = await authService.authRegister({userId, name, username, password, confirmPassword, role, email})

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
  const {password, confirmPassword } = req.body
  const userId = req.user.userId
  try {
    const resetPasswordLink = await authService.authResetPassword(userId, password, confirmPassword)
    res.status(200).json({
      status: 'success',
      message: 'Password berhasil direset',
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

module.exports = {
  login,
  register,
  forgetPassword,
  resetPassword
}