const prisma = require('../config')

const findQuestionById = (id) => {
  const question = prisma.question.findUnique({
    where: {
      questionId: id
    }
  })
  return question
}

const insertQuestion = (newDataQuestion) => {
  const newQuestion = prisma.question.create({
    data: {
      surveyId: newDataQuestion.surveyId,
      questionText: newDataQuestion.questionText,
      questionType: newDataQuestion.questionType,
      isRequired: newDataQuestion.isRequired,
      displayOrder: newDataQuestion.displayOrder,
      createdBy: newDataQuestion.createdBy
    }
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
      displayOrder: true,
      createdBy: true
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
  deleteQuestionById
}