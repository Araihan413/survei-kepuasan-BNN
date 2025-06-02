const prisma = require('../config')

const findServices = async () => {
  const services = await prisma.service.findMany({})
  return services
}

const insertService = async (dataService) => {
  const newService = await prisma.service.create({ data: dataService })
  return newService
}

module.exports = { findServices, insertService }