const serviceRepository = require("./service.repository");

const getAllService = async () => {
  const services = await serviceRepository.findServices();
  return services;
};

const getServiceById = async (id) => {
  const service = await serviceRepository.findServiceById(id);
  if (!service) throw new Error('data service tidak ditemukan')
  return service;
};

const createService = async (dataService) => {
  const requiredFields = ['name', 'label']

  for (const field of requiredFields) {
    if (!dataService[field]) {
      throw new Error(`Data field "${field}" wajib dikirim`)
    }
  }
  const service = await serviceRepository.insertService(dataService);
  return service;
};

const updateServiceById= async (id, dataService) => {
  await getServiceById(id)
  const service = await serviceRepository.updateService(id, dataService);
  return service;
};

const deleteServiceById = async (id) => {
  await getServiceById(id)
  const service = await serviceRepository.deleteService(id);
  return service;
};

module.exports = {getAllService , createService, getServiceById, updateServiceById, deleteServiceById};