const prisma = require('../config')

const findAdmin = async () => {
  const admin = await prisma.admin.findMany({
    select: {
      adminId: true,
      name: true,
      username: true,
      role: true,
      email: true,
      profileUrl : true
    }
  })
  return admin
}

const findAdminById = async (id) => {
  const admin = await prisma.admin.findUnique({
    where: {
      adminId: id
    },
    select: {
      adminId: true,
      name: true,
      username: true,
      role: true,
      email: true,
      profileUrl : true
    }
  })
  return admin
}

const findAdminByUsername = async (username) => {
  const admin = await prisma.admin.findUnique({
    where: {
      username: username
    },
    select: {
      adminId: true,
      name: true,
      username: true,
      password: true,
      role: true,
      email: true,
      profileUrl : true
    }
  })
return admin
}

const findAdminByEmail = async (email) => {
  const admin = await prisma.admin.findUnique({
    where: {
      email: email
    },
    select: {
      adminId: true,
      email: true
    }
  })
return admin
}

const updateAdmin = async (id, dataUser) => {
  const admin = await prisma.admin.update({
    where: {
      adminId: id
    },
    data: dataUser,
    select: {
      adminId: true,
      name: true,
      username: true,
      role: true,
      email: true,
      profileUrl : true
    }
  })

return admin
}

const insertAdmin = async (newDataUser) => {
  const newAdmin = await prisma.admin.create({
    data: newDataUser,
    select: {
      adminId: true,
      name: true,
      username: true,
      role: true,
      email: true,
      profileUrl : true
    }
  })

return newAdmin
}

const deleteAdmin = async (id) => {
  const admin = await prisma.admin.delete({
    where: {
      adminId: id
    },
    select: {
      adminId: true,
      name: true,
      username: true,
      role: true,
      email: true,
      profileUrl : true
    }
  })
return admin
}

module.exports = {
  findAdmin,
  findAdminById,
  findAdminByEmail,
  updateAdmin,
  insertAdmin,
  deleteAdmin,
  findAdminByUsername
}