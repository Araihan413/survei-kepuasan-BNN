const { findUsers,
  findUsersById,
  updateUser,
  insertUser,
  deleteUser } = require('./users.repository')


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
    createUser,
    deleteUserById
  }