const prisma = require('../config')

const findServices = async () => {
  const services = await prisma.service.findMany({})
  return services
}

const findServiceById = async (id) => {
  const service = await prisma.service.findUnique({ where: { serviceId: id } })
  return service
}

const insertService = async (dataService) => {
  const newService = await prisma.service.create({ data: dataService })
  return newService
}

const updateService = async (id, dataService) => {
  const updatedService = await prisma.service.update({ where: { serviceId: id }, data: dataService })
  return updatedService
}

const deleteService = async (id) => {
  const deletedService = await prisma.service.delete({ where: { serviceId: id } })
  return deletedService
}

module.exports = { findServices, insertService, findServiceById, updateService, deleteService }