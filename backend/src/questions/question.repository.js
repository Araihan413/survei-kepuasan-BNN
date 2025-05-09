const prisma = require('../db')

const findQuestions = async () => {
  const questions = await prisma.surveys.findMany()

  return questions
}

const findQuestionById = async (id) => {
  const question = await prisma.surveys.findUnique({
    where: {
      survey_id: id
    }
  })

  return question
}

const insertQuestion = async (newDataQuestion) => {
  const newQuestion = await prisma.surveys.create({
    data: {
      title: newDataQuestion.title,
      description: newDataQuestion.description
    }
  })
return newQuestion
}


const updateQuestion = async (id, questionData) => {
  const question = await prisma.surveys.update({
    where: {
      survey_id: id
    },
    data :{
      title: questionData.title,
      description:questionData.description
    }
  })

  return question
}

const deleteQuestion = async (id) => {
  const question = await prisma.surveys.delete({
    where: {
      survey_id: id
    }
  })

  return question
}


module.exports = {
  findQuestions,
  findQuestionById,
  insertQuestion,
  updateQuestion,
  deleteQuestion
}