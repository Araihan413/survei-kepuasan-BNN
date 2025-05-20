const prisma = require('../config')

const findUsers = async () => {
  const users = await prisma.users.findMany({
    select: {
      userId: true,
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
      userId: id
    },
    select: {
      userId: true,
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
      userId: true,
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
      userId: true,
      email: true
    }
  })
return user
}

const updateUser = async (id, dataUser) => {
  const user = await prisma.users.update({
    where: {
      userId: id
    },
    data: dataUser,
    select: {
      userId: true,
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
      userId: true,
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
      userId: id
    },
    select: {
      userId: true,
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