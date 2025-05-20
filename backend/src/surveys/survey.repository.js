const prisma = require('../config')
const { insertQuestion } = require('../questions/question.repository')

const findSurveys = async () => {
  const surveys = await prisma.survey.findMany()
  return surveys
}

const findSurveyById = async (id) => {
  const survey = await prisma.survey.findUnique({
    where: {
      surveyId: id
    }
  })
  return survey
}

const insertsurvey = async (id, dataSurvey) => {
  const survey = await prisma.survey.create({
    data: {
      title: dataSurvey.title,
      description: dataSurvey.description,
      questions: {
        connect: {
          questionId: id
        }
      }
    }
  })
  return survey
}

const deleteSurvey = async (id) => {
  const survey = await prisma.survey.delete({
    where: {
      surveyId: id
    }
  })
  return survey
}

const updateSurvey = async (id, dataSurvey) => {
  const survey = await prisma.survey.update({
    where: {
      surveyId: id
    },
    data: dataSurvey
  })
  return survey
}

module.exports = {
  findSurveys,
  findSurveyById,
  insertsurvey,
  deleteSurvey,
  updateSurvey
}