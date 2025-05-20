const surveyRepository = require('./survey.repository')

const getAllSurvey = async () => {
  const survey = await surveyRepository.getSurveys()
  if (!survey) throw Error('data survey tidak ditemukan')
  return survey
}

const getSurveyById = async (id) => {
  const survey = surveyRepository.getSurveyById(id)
  if (!survey) throw Error('data survey tidak ditemukan')
  return survey
}

const insertSurvey = async (dataSurvey) => {
  const survey = await surveyRepository.insertsurvey(dataSurvey)
  return survey
}

const deleteSurveyById = async (id) => {
  const survey = await surveyRepository.deleteSurvey(id)
  if (!survey) throw Error('data survey tidak ditemukan')
  return survey
}

const updateSurveyById = async (id, dataSurvey) => {
  await getSurveyById(id)
  const survey = await surveyRepository.updateSurvey(id, dataSurvey)
  return survey
}

module.exports = { getAllSurvey, getSurveyById, insertSurvey, deleteSurveyById, updateSurveyById }