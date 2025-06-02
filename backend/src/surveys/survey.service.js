const surveyRepository = require('./survey.repository')

const getAllQuestionInSurvey = async () => {
  const survey = await surveyRepository.findQuestionsInSurvey()
  return survey
}

const getDetailSurveyById = async (id) => {
  const survey = await surveyRepository.findDetaiSurvey(id)
  if (!survey) throw Error('data survey tidak ditemukan')
  return survey
}

// const getAllQuestionIsActive = async (isActive) => {
//   const survey = await surveyRepository.findQuestionsInSurvey()
//   const questionActive = survey.question.filter(question => question.isActive === isActive)
//   return questionActive
// }

const getSurveyIncludeQuestion = async (id) => {
  await getDetailSurveyById(id)
  const survey = await surveyRepository.findSurveyIncludeQuestion(id)
  return survey
}

const getAllSurvey = async () => {
  const survey = await surveyRepository.findSurveys()
  return survey
}



const insertSurvey = async (dataSurvey) => {
  const requiredFields = ['title', 'adminId', 'orderPage']

  for (const field of requiredFields) {
    if (!dataSurvey[field]) {
      throw new Error(`Data field "${field}" wajib dikirim`)
    }
  }
  const survey = await surveyRepository.insertSurvey(dataSurvey)
  return survey
}

const updateDataSurveyById = async (id, dataSurvey) => {
  const dataUpdate = {}

  if (typeof dataSurvey.title === 'string') {
    dataUpdate.title = dataSurvey.title
  }

  if (typeof dataSurvey.description === 'string') {
    dataUpdate.description = dataSurvey.description
  }

  if (typeof dataSurvey.isPublished === 'boolean') {
    dataUpdate.isPublished = dataSurvey.isPublished
  }

  // Cek apakah ada data yang akan diupdate
  if (Object.keys(dataUpdate).length === 0) {
    throw Error('Tidak ada data yang dapat diupdate')
  }

  const survey = await surveyRepository.updateSurveyById(id, dataUpdate)
  return survey
}

const deleteSurveyById = async (id) => {
  await getDetailSurveyById(id)
  const survey = await surveyRepository.deleteSurveyById(id)
  return survey
}

module.exports = { 
  getAllQuestionInSurvey,
  // getAllQuestionIsActive,
  getAllSurvey,
  getDetailSurveyById,
  insertSurvey,
  updateDataSurveyById,
  deleteSurveyById,
  getSurveyIncludeQuestion
}