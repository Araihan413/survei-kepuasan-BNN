const admin = require('../admin/admin.repository')
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt')
const utilsHash = require('../utils/hash')

const authLogin = async (username, password) => {

  const foundAdmin = await admin.findAdminByUsername(username)
  if (!foundAdmin) throw new Error('username salah')

  const isMatch = await utilsHash.comparePassword(password, foundAdmin.password)
  if (!isMatch) throw new Error('password salah')

    const dataAdmin = {
      adminId: foundAdmin.adminId,
      name: foundAdmin.name,
      username: foundAdmin.username,
      email: foundAdmin.email,
      role: foundAdmin.role,
      profileUrl : foundAdmin.profileUrl
    }

  const tokenAccess = generateAccessToken(dataAdmin) 
  const tokenRefresh = generateRefreshToken(dataAdmin)

  await admin.updateAdmin(dataAdmin.adminId, {refresToken : tokenRefresh})
  
  return {
    dataAdmin,
    tokenAccess,
    tokenRefresh
  }
}

const authRegister = async (dataAdmin) => {
  const { name, username, password, confirmPassword, email} = dataAdmin 
  const allAdmin = await admin.findAdmin()
  if (allAdmin.find(admin => toLowerCase(admin.role) === 'admin')) throw new Error('Admin sudah terdaftar')
  const role = 'admin'
  const adminByUsername = await admin.findAdminByUsername(username)
  if (adminByUsername) throw new Error('username sudah terdaftar')
  const adminByEmail = await admin.findAdminByEmail(email)
  if (adminByEmail) throw new Error('email sudah terdaftar')
  if (password !== confirmPassword) throw new Error('password tidak sama')
  const hashPassword = await utilsHash.hashPassword(password)

  const createAdmin = await admin.insertAdmin({name: name, username: username, password: hashPassword, role: role, email: email})
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

const authResetPassword = async (username, oldPassword, newPassword, confirmPassword) => {
  const foundAdmin = await admin.findAdminByUsername(username)
  if (newPassword.length < 8) throw new Error("Password baru minimal 8 karakter");
  if (!foundAdmin) throw new Error('user tidak ditemukan')
  const isPasswordMatch = await utilsHash.comparePassword(oldPassword, foundAdmin.password)
  if (!isPasswordMatch) throw new Error('password lama salah')
  if (newPassword !== confirmPassword) throw new Error('password tidak sama')
  const hashPassword = await utilsHash.hashPassword(newPassword)

  const updatePassword = await admin.updateAdmin(foundAdmin.adminId, {password: hashPassword})
  return updatePassword
}


module.exports = {
  authLogin,
  authRegister,
  authForgetPassword,
  authResetPassword,
  
}
