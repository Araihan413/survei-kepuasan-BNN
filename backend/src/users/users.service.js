const { userRepository } = require('./users.repository')
const utilsHash = require('../utils/hash')


  const getAllUser = async () => {
    const users = await  userRepository.findUsers()
    return users
  }

  const getUserById = async (id) => {
    const user = await  userRepository.findUserById(id)

    if (!user) {
      throw Error('data user tidak ditemukan')
    }
    return user
  }

  const updateUserById = async (id, dataUser) => {
    await getUserById(id)
    const user = await  userRepository.updateUser(id, dataUser)
    return user
  }

  const updatePasswordById = async (id, passwordUser) => {
    const {password, newPassword, confirmNewPassword} = passwordUser
    
    if (!password || !newPassword || !confirmNewPassword) throw new Error('Data password wajib dikirim')

    if (password === newPassword) throw new Error('password tidak boleh sama')
    if (newPassword !== confirmNewPassword) throw new Error('password dan konfirmasi password tidak sama')

    const user = await getUserById(id)

    const isMatch = await utilsHash.comparePassword(password, user.password)
    if (!isMatch) throw new Error('Password salah')
    
    const hashPassword = await utilsHash.hashPassword(newPassword)
    const newPasswordUser = {password: hashPassword}
    const updatePasswordUser = await  userRepository.updateUser(id, newPasswordUser)
    return updatePasswordUser
  }

  const createUser = async (newDataUser) => {
  const requiredFields = ['name', 'username', 'password', 'confirmPassword', 'role', 'email']

  for (const field of requiredFields) {
    if (!newDataUser[field]) {
      throw new Error(`Data field "${field}" wajib dikirim`)
    }
  }

  if (newDataUser.password !== newDataUser.confirmPassword) throw new Error('Password dan konfirmasi password tidak sama')
  const usernameUser = await userRepository.findUserByUsername(newDataUser.username)
  if (usernameUser) throw new Error('username sudah terdaftar')
  const emailUser = await userRepository.findUserByEmail(newDataUser.email)
  if (emailUser) throw new Error('email sudah terdaftar') 

  const hashPassword = await utilsHash.hashPassword(newDataUser.password)

  const dataUser = {name: newDataUser.name, username: newDataUser.username, password: hashPassword, role: newDataUser.role, email: newDataUser.email}
    const newUser = await  userRepository.insertUser(dataUser)
    return newUser
  }

  const deleteUserById = async (id) => {
    await getUserById(id)
    const user = await  userRepository.deleteUser(id)
    return user
  }

  module.exports = {
    getAllUser,
    getUserById,
    updateUserById,
    updatePasswordById,
    createUser,
    deleteUserById
  }