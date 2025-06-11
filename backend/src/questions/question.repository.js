const prisma = require('../config')

const findQuestionById = (id) => {
  const question = prisma.question.findUnique({
    where: {
      questionId: id
    }
  })
  return question
}

const findQuestionByNameField = (field) => {
  const question = prisma.question.findFirst({
    where: {
      respondentField: field
    },
    include: {
      option: {
        orderBy: {
          displayOrder: 'asc'
        }
      }
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

const insertQuestion = (newQues) => {
  console.log("data le",newQues)
  const newQuestion = prisma.question.create({
    data: {
      surveyId: newQues.surveyId,
      questionText: newQues.questionText,
      questionType: newQues.questionType,
      isRequired: newQues.isRequired,
      displayOrder: newQues.displayOrder,
      adminId: newQues.adminId,
    }
  })
  return newQuestion
}

// Di question.repository.js
const insertQuestionAndOption = (newQues, options) => {
  const newQuestion =  prisma.question.create({
    data: {
      surveyId: newQues.surveyId,
      questionText: newQues.questionText,
      questionType: newQues.questionType,
      isRequired: newQues.isRequired,
      isActive: true,  // Default value sesuai schema
      displayOrder: newQues.displayOrder,
      adminId: newQues.adminId,
      isPersonal: newQues.isPersonal || false,  // Tambahkan default
      respondentField: newQues.respondentField || null,  // Handle optional field
      option: {
        create: options.map(opt => ({
          optionText: opt.optionText,
          scaleValue: opt.scaleValue || null,  // Sesuai schema (nullable)
          displayOrder: opt.displayOrder,
        })),
      },
    },
    include: { option: true },
  });
  return newQuestion
};

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
  findQuestions,
  findQuestionByNameField,
  insertQuestionAndOption
}