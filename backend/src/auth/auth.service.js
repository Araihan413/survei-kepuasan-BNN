const admin = require('../admin/admin.repository')
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt')
const utilsHash = require('../utils/hash')

const authLogin = async (username, password) => {

  const admin = await admin.findAdminByUsername(username)
  if (!admin) throw new Error('username tidak ditemukan')

  const isMatch = await utilsHash.comparePassword(password, admin.password)
  if (!isMatch) throw new Error('password salah')

  const tokenAccess = generateAccessToken(user) 
  const tokenRefresh = generateRefreshToken(user)

  await admin.updateAdmin(admin.adminId, {refres_token: tokenRefresh})
  
  return {
    tokenAccess,
    tokenRefresh
  }
}

const authRegister = async (dataAdmin) => {
  const {adminId, name, username, password, confirmPassword, role, email} = dataAdmin 

  const admin = await admin.findAdminByUsername(username)
  if (admin) throw new Error('username sudah terdaftar')
  if (password !== confirmPassword) throw new Error('password tidak sama')
  const hashPassword = await utilsHash.hashPassword(password)

  const createAdmin = await admin.insertAdmin({adminId: adminId, name: name, username: username, password: hashPassword, role: role, email: email})
  return createAdmin
}

const authForgetPassword = async (email) => {
  const dataAdmin = await admin.findAdminByEmail(email)
  if (!dataAdmin) throw new Error('Email tidak ditemukan')
  if (dataAdmin.email !== email) throw new Error('Email salah')
  
  // bikin token untuk reset password
  const tokenResetPassword = generateResetPasswordToken(dataAdmin)

  // kirim email ke user
  const resetPasswordLink = `http://localhost:3000/reset-password?token=${tokenResetPassword}`
  return resetPasswordLink
}

const authResetPassword = async (adminId, password, confirmpassword) => {
  const admin = await admin.findAdminById(adminId)
  if (!admin) throw new Error('user tidak ditemukan')
  if (password !== confirmpassword) throw new Error('password tidak sama')
  const hashPassword = await utilsHash.hashPassword(password)

  const updatePassword = await admin.updateAdmin(adminId, {password: hashPassword})
  return updatePassword
}

module.exports = {
  authLogin,
  authRegister,
  authForgetPassword,
  authResetPassword
  
}
