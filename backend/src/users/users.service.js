const { findUsers,
  findUsersById,
  updateUser,
  insertUser,
  deleteUser } = require('./users.repository')
  const utilsHash = require('../utils/hash')


  const getAllUser = async () => {
    const users = await findUsers()
    return users
  }

  const getUserById = async (id) => {
    const user = await findUsersById(id)

    if (!user) {
      throw Error('data user tidak ditemukan')
    }
    return user
  }

  const updateUserById = async (id, dataUser) => {
    await getUserById(id)
    const user = await updateUser(id, dataUser)
    return user
  }

  const updatePasswordById = async (id, passwordUser) => {
    const {password, newPassword, confirmNewPassword} = passwordUser

    if (password === newPassword) throw new Error('password tidak boleh sama')
    if (newPassword !== confirmNewPassword) throw new Error('password dan konfirmasi password tidak sama')

    const user = await getUserById(id)

    const isMatch = await utilsHash.comparePassword(password, user.password)
    if (!isMatch) throw new Error('Password salah')
    
    const hashPassword = await utilsHash.hashPassword(newPassword)
    const newPasswordUser = {password: hashPassword}
    const updatePasswordUser = await updateUser(id, newPasswordUser)
    return updatePasswordUser
  }

  const createUser = async (newDataUser) => {
    const newUser = await insertUser(newDataUser)
    return newUser
  }

  const deleteUserById = async (id) => {
    await getUserById(id)
    const user = await deleteUser(id)
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