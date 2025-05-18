
const authService = require('./auth.servis')

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
  const {user_id,name, username, password, confirmPassword, role, email} = req.body;

  const registerUser = await authService.authRegister({user_id,name, username, password, confirmPassword, role, email})

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
}
}
module.exports = {
  login,
  register
}