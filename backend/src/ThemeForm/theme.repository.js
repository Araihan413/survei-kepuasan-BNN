const prisma = require('../config')

const getThemeForm = () => {
  const theme = prisma.formTheme.findMany()
  return theme
}

const updateThemeById = (id, data) => {
  const theme = prisma.formTheme.update({
    where: {
      id : id
    }, 
    data: data
  })

  return theme
}

const insertThemeForm = (data) => {
  const theme = prisma.formTheme.create({
    data: {
      colorTheme: data.colorTheme
    }
  })

  return theme
}

module.exports = {getThemeForm, updateThemeById, insertThemeForm}