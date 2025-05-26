const {questionRepository} = require('./question.repository')


const getQuestionById = async (id) => {
  const question = await questionRepository.findQuestionById(id)
  if (!question) throw Error('data question tidak ditemukan')
  return question
}

const createQuestion = async (newDataQuestion) => {

  const requiredFields = ['surveyId', 'questionText', 'questionType', 'isRequired', 'displayOrder', 'createdBy']

  for (const field of requiredFields) {
    if (!newDataQuestion[field]) {
      throw new Error(`Data field "${field}" wajib dikirim`)
    }
  }
  const newQuestion = await questionRepository.insertQuestion(newDataQuestion)
  return newQuestion
}

const updateQuestionById = async (id, questionData) => {
  await getQuestionById(id)

  const dataUpdate = {}

  if (typeof questionData.questionText === 'string') {
    dataUpdate.questionText = questionData.questionText
  }
  if (typeof questionData.questionType === 'string') {
    dataUpdate.questionType = questionData.questionType
  }
  if (typeof questionData.isRequired === 'boolean') {
    dataUpdate.isRequired = questionData.isRequired
  }
  if (typeof questionData.isActive === 'boolean') {
     dataUpdate.isActive = questionData.isActive
   }
  if (typeof questionData.displayOrder === 'number') {
    dataUpdate.displayOrder = questionData.displayOrder
  }
  const question = await questionRepository.updateQuestionById(id, dataUpdate)
  return question
}

const deleteQuestionById = async (id) => {
  await getQuestionById(id)
  const question = await questionRepository.deleteQuestionById(id)
  return question
}


module.exports = {
  getQuestionById,
  createQuestion,
  updateQuestionById,
  deleteQuestionById
}