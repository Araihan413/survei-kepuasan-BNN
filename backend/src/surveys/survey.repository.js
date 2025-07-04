const prisma = require('../config')

// ? untuk menampilkan daftar pertanyaan berdasarkan survei dan menampikan pertanyaan yang active
const findQuestionsInSurvey = async () => {
  const surveys = await prisma.survey.findMany({
    select: {
      surveyId: true,
      title: true,
      isPublished: true,
      orderPage: true,
      isPersonal: true,
      createdAt: true,
      textInformation: true,
      bannerUrl: true,
      question: {
        select: {
          questionId: true,
          questionText: true,
          displayOrder: true,
          isActive: true,
          isPersonal: true,
          respondentField: true
        },
        orderBy: {
          displayOrder: 'asc'
        }
      },
    },
    orderBy: {
      orderPage: 'asc'
    }
  })
  return surveys
}

const findSurveyIncludeQuestion = async (id) => {
  const survey = await prisma.survey.findUnique({
    where: {
      surveyId: id
    },
    include: {
      question: {
        orderBy: {
          displayOrder: 'asc'
        },
        include: {
          admin: {
            select: {
              name: true
            }
          },
          option: {
            orderBy: {
              displayOrder: 'asc'
            }
          }
        }
      }
    }
  });
  
  return survey
}

// ? untuk menampilkan daftar survei di menu survey
const findSurveys = async () => {
  const surveys = await prisma.survey.findMany({
    select: {
      surveyId: true,
      title: true,
      isPublished: true,
      orderPage: true,
      createdAt: true,
      isPersonal: true,
      textInformation: true,
      bannerUrl: true,
    },
    orderBy: {
      orderPage: 'asc'
    }
  })
  return surveys
}


// ? untuk menampikan data detail survei di halaman survei
const findDetaiSurvey = async (id) => {
  const survey = await prisma.survey.findUnique({
    where: {
      surveyId: id
    }, select: {
      surveyId: true,
      title: true,
      description: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      isPersonal: true,
      bannerUrl: true,
      textInformation: true,
      adminId: true,
      _count: {
        select: {
          question: true
        }
      }, admin: {
        select: {
          name: true
        }
      }
    }, 
  })
  return survey
}

// ? untuk update data di halaman survei
const updateSurveyById = async (id, dataSurvey) => {
  const survey = await prisma.survey.update({
    where: {
      surveyId: id
    }, 
    data: dataSurvey,
    select: {
      surveyId: true,
      title: true,
      description: true,
      isPublished: true,
      updatedAt: true,
      isPersonal: true,
      bannerUrl: true,
      textInformation: true
    }
  })
  return survey
}

// ? untuk hapus data di halaman survei
const deleteSurveyById = async (id) => {
  const survey = await prisma.survey.delete({
    where: {
      surveyId: id
    }, 
    select: {
      surveyId: true,
      title: true
    }
  })
  return survey
}

// ? untuk insert data di halaman survei
const insertSurvey = async (dataSurvey) => {
  const survey = await prisma.survey.create({
    data: dataSurvey,
    select: {
      surveyId: true,
      title: true,
      isPublished: true,
      orderPage: true,
      createdAt: true,
      isPersonal: true
    }
  })
  return survey
}

module.exports = {
  findQuestionsInSurvey,
  findSurveys,
  findDetaiSurvey,
  deleteSurveyById,
  updateSurveyById,
  insertSurvey,
  findSurveyIncludeQuestion
}