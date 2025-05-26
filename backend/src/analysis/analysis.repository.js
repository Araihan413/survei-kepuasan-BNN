const prisma = require("../config");

const countAvgScore = async (surveyId, startDate) => {
  const avgScore = await prisma.$queryRaw`
    SELECT AVG(o."scaleValue") as "averageScore"
    FROM "Answer" a
    JOIN "Option" o ON a."optionId" = o."optionId"
    JOIN "Question" q ON a."questionId" = q."questionId"
    JOIN "Respondent" r ON a."respondentId" = r."respondentId"
    WHERE q."surveyId" = ${surveyId} AND r."createdAt" >= ${startDate}
    `;
  return avgScore
}

const findAllRespondentBySurveyId = async (surveyId, startDate) => {
  const respondents = await prisma.respondent.findMany({
    where: { surveyId : surveyId, createdAt: { gte: startDate } },
    select: {
      respondentId: true,
      age: true,
      job: true,
      lastEducation: true,
      gender: true,
      service : true,
      survey: {
        select: {
          title: true
        }
      }
    },
  });

  return respondents
}

const findAllResponsesBySurveyId = async (surveyId,  startDate) => {
  const answer = await prisma.survey.findUnique({
    where: {
      surveyId: surveyId
    },
    select: {
      surveyId: true,
      title: true,
      question: {
        orderBy: {
          displayOrder: 'asc'
        },
        select: {
          questionId: true,
          questionText: true,
          displayOrder: true,
          questionType: true,
          answer: {
          select: {
            answerText: true,
            respondent: {
              where: {
                createdAt: { gte: startDate }
              },
              select: {
              respondentId: true
              }
            },
            option: {
            select: {
              optionId: true,
              optionText: true,
              scaleValue: true
              }
            }
            }
          }
        }
      }
    },
    
  })
  return answer
}

module.exports = {
  countAvgScore,
  findAllRespondentBySurveyId,
  findAllResponsesBySurveyId
}