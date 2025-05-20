const prisma = require('../config')

const findQuestions = async () => {
  const questions = await prisma.question.findMany()

  return questions
}

const findQuestionById = async (id) => {
  const question = await prisma.question.findUnique({
    where: {
      questionId: id
    }
  })

  return question
}

const insertQuestion = async (newDataQuestion) => {
  const newQuestion = await prisma.question.create({
    data: {
      title: newDataQuestion.title,
      description: newDataQuestion.description
    }
  })
return newQuestion
}


const updateQuestion = async (id, dataQuestion) => {
  const question = await prisma.question.update({
    where: {
      questionId: id
    },
    data :{
      title: dataQuestion.title,
      description: dataQuestion.description
    }
  })

  return question
}

const deleteQuestion = async (id) => {
  const question = await prisma.question.delete({
    where: {
      questionId: id
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