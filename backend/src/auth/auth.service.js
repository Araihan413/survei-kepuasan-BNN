const User = require('../users/users.repository')
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt')
const utilsHash = require('../utils/hash')

const authLogin = async (username, password) => {

  const user = await User.findUserByUsername(username)
  if (!user) throw new Error('username tidak ditemukan')

  const isMatch = await utilsHash.comparePassword(password, user.password)
  if (!isMatch) throw new Error('password salah')

  const tokenAccess = generateAccessToken(user) 
  const tokenRefresh = generateRefreshToken(user)

  await User.updateUser(user.user_id, {refres_token: tokenRefresh})
  
  return {
    tokenAccess,
    tokenRefresh
  }
}

const authRegister = async (dataUser) => {
  const {userId, name, username, password, confirmPassword, role, email} = dataUser 

  const user = await User.findUserByUsername(username)
  if (user) throw new Error('username sudah terdaftar')
  if (password !== confirmPassword) throw new Error('password tidak sama')
  const hashPassword = await utilsHash.hashPassword(password)

  const createUser = await User.insertUser({userId: userId, name: name, username: username, password: hashPassword, role: role, email: email})
  return createUser
}

const authForgetPassword = async (email) => {
  const dataUser = await User.findUserByEmail(email)
  if (!dataUser) throw new Error('Email tidak ditemukan')
  if (dataUser.email !== email) throw new Error('Email salah')
  
  // bikin token untuk reset password
  const tokenResetPassword = generateResetPasswordToken(dataUser)

  // kirim email ke user
  const resetPasswordLink = `http://localhost:3000/reset-password?token=${tokenResetPassword}`
  return resetPasswordLink
}

const authResetPassword = async (userId, password, confirmpassword) => {
  const user = await User.findUserById(userId)
  if (!user) throw new Error('user tidak ditemukan')
  if (password !== confirmpassword) throw new Error('password tidak sama')
  const hashPassword = await utilsHash.hashPassword(password)

  const updatePassword = await User.updateUser(userId, {password: hashPassword})
  return updatePassword
}

module.exports = {
  authLogin,
  authRegister,
  authForgetPassword,
  authResetPassword
  
}
