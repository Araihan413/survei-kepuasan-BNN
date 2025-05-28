const { adminRepository } = require('./admin.repository')
const utilsHash = require('../utils/hash')


  const getAllAdmin = async () => {
    const admin = await  adminRepository.findAdmin()
    return admin
  }

  const getAdminById = async (id) => {
    const admin = await  adminRepository.findAdminById(id)

    if (!admin) {
      throw Error('data admin tidak ditemukan')
    }
    return admin
  }

  const updateAdminById = async (id, dataAdmin) => {
    await getAdminById(id)
    const admin = await  adminRepository.updateAdmin(id, dataAdmin)
    return admin
  }

  const updatePasswordById = async (id, passwordAdmin) => {
    const {password, newPassword, confirmNewPassword} = passwordAdmin
    
    if (!password || !newPassword || !confirmNewPassword) throw new Error('Data password wajib dikirim')

    if (password === newPassword) throw new Error('password tidak boleh sama')
    if (newPassword !== confirmNewPassword) throw new Error('password dan konfirmasi password tidak sama')

    const admin = await getAdminById(id)

    const isMatch = await utilsHash.comparePassword(password, admin.password)
    if (!isMatch) throw new Error('Password salah')
    
    const hashPassword = await utilsHash.hashPassword(newPassword)
    const newPasswordAdmin = {password: hashPassword}
    const updatePasswordAdmin = await  adminRepository.updateAdmin(id, newPasswordAdmin)
    return updatePasswordAdmin
  }

  const createAdmin = async (newDataAdmin) => {
  const requiredFields = ['name', 'username', 'password', 'confirmPassword', 'role', 'email']

  for (const field of requiredFields) {
    if (!newDataAdmin[field]) {
      throw new Error(`Data field "${field}" wajib dikirim`)
    }
  }

  if (newDataAdmin.password !== newDataAdmin.confirmPassword) throw new Error('Password dan konfirmasi password tidak sama')
  const usernameAdmin = await adminRepository.findAdminByUsername(newDataAdmin.username)
  if (usernameAdmin) throw new Error('username sudah terdaftar')
  const emailUser = await adminRepository.findAdminByEmail(newDataAdmin.email)
  if (emailUser) throw new Error('email sudah terdaftar') 

  const hashPassword = await utilsHash.hashPassword(newDataAdmin.password)

  const dataAdmin = {name: newDataAdmin.name, username: newDataAdmin.username, password: hashPassword, role: newDataAdmin.role, email: newDataAdmin.email}
    const newAdmin = await  adminRepository.insertAdmin(dataAdmin)
    return newAdmin
  }

  const deleteAdminById = async (id) => {
    await getAdminById(id)
    const admin = await  adminRepository.deleteAdmin(id)
    return admin
  }

  module.exports = {
    getAllAdmin,
    getAdminById,
    updateAdminById,
    updatePasswordById,
    createAdmin,
    deleteAdminById
  }