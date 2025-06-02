const prisma = require('../config')

const findQuestionById = (id) => {
  const question = prisma.question.findUnique({
    where: {
      questionId: id
    }
  })
  return question
}
const findQuestions = () => {
  const question = prisma.question.findMany({
    where: {
      survey: {
        isPublished: true
      }
    }
  })
  return question
}

const insertQuestion = (newDataQuestion) => {
  const newQuestion = prisma.question.create({
    data: newDataQuestion
  })
  return newQuestion
}

const updateQuestionById = (id, questionData) => {
  const question = prisma.question.update({
    where: {
      questionId: id
    },
    data: questionData,
    select: {
      questionId: true,
      surveyId: true,
      questionText: true,
      questionType: true,
      isRequired: true,
      isActive: true,
      displayOrder: true,
      adminId: true
    }
  })
  return question
}

const deleteQuestionById = (id) => {
  const question = prisma.question.delete({
    where: {
      questionId: id
    },
    select: {
      questionId: true,
      questionText: true,
      surveyId: true
    }
  })
  return question
}


module.exports = {
  findQuestionById,
  insertQuestion,
  updateQuestionById,
  deleteQuestionById,
  findQuestions
}