const prisma = require('../config')

const findUsers = async () => {
  const users = await prisma.users.findMany({
    select: {
      user_id: true,
      name: true,
      username: true,
      role: true,
      email: true
    }
  })
  return users
}

const findUsersById = async (id) => {
  const user = await prisma.users.findUnique({
    where: {
      user_id: id
    },
    select: {
      user_id: true,
      name: true,
      username: true,
      role: true,
      email: true
    }
  })
  return user
}

const findUserByUsername = async (username) => {
  const user = await prisma.users.findUnique({
    where: {
      username: username
    },
    select: {
      user_id: true,
      name: true,
      username: true,
      role: true,
      email: true
    }
  })
return user
}

const findUserByEmail = async (email) => {
  const user = await prisma.users.findUnique({
    where: {
      email: email
    },
    select: {
      user_id: true,
      email: true
    }
  })
return user
}

const updateUser = async (id, dataUser) => {
  const user = await prisma.users.update({
    where: {
      user_id: id
    },
    data: dataUser,
    select: {
      user_id: true,
      name: true,
      username: true,
      role: true,
      email: true
    }
  })

return user
}

const insertUser = async (newDataUser) => {
  const newUser = await prisma.users.create({
    data: newDataUser,
    select: {
      user_id: true,
      name: true,
      username: true,
      role: true,
      email: true
    }
  })

return newUser
}

const deleteUser = async (id) => {
  const user = await prisma.users.delete({
    where: {
      user_id: id
    },
    select: {
      user_id: true,
      name: true,
      username: true,
      role: true,
      email: true
    }
  })
return user
}

module.exports = {
  findUsers,
  findUsersById,
  findUserByEmail,
  updateUser,
  insertUser,
  deleteUser,
  findUserByUsername
}