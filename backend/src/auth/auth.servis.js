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
  const {user_id,name, username, password, confirmPassword, role, email} = dataUser 

  if (password !== confirmPassword) throw new Error('password tidak sama')
  const hashPassword = await utilsHash.hashPassword(password)

  const user = await User.insertUser({user_id: user_id, name: name, username: username, password: hashPassword, role: role, email: email})
  return user
}

module.exports = {
  authLogin,
  authRegister
}