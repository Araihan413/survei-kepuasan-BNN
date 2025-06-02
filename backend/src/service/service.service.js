const serviceRepository = require("./service.repository");

const getAllService = async () => {
  const services = await serviceRepository.findServices();
  return services;
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

module.exports = {getAllService , createService };