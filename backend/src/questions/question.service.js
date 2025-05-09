const { 
  findQuestions,
  findQuestionById,
  insertQuestion,
  updateQuestion,
  deleteQuestion
} = require('./question.repository')


const getAllQuestion = async () => {
  const surveys = await findQuestions()
  return surveys
}

const getQuestionById = async (id) => {
  const question = await findQuestionById(id)

  if (!question) {
    throw Error('data question tidak ditemukan')
  }

  return question
}

const createQuestion = async (newDataQuestion) => {
  const newQuestion = await insertQuestion(newDataQuestion)
  return newQuestion
}

const updateQuestionById = async (id, questionData) => {
  await getQuestionById(id)
  const question = await updateQuestion(id, questionData)
  return question
}

const deleteQuestionById = async (id) => {
  await getQuestionById(id)
  const question = await deleteQuestion(id)
  return question 
}


module.exports = {
  getAllQuestion,
  getQuestionById,
  createQuestion,
  updateQuestionById,
  deleteQuestionById
}