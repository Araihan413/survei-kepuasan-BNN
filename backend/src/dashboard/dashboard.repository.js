const prisma = require('../config')

const respondentsPerMonth = async (year, serviceId) => {
  const dataRespondents = await prisma.respondent.findMany({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${Number(year) + 1}-01-01`)
      },

      ...(serviceId && {
        serviceId: parseInt(serviceId)
      }),
      survey: {
        isPublished: true
      }
    },
    select: {
      respondentId: true,
      createdAt: true
    }
  })
    
  return dataRespondents
}

const avgScorePerSurvey = async (startDate) => {
  const dataAvgScore = await prisma.$queryRaw`
    SELECT 
      s."title",
      AVG(o."scaleValue") AS "averageScore"
    FROM "Answer" a
    JOIN "Respondent" r ON a."respondentId" = r."respondentId"
    JOIN "Survey" s ON r."surveyId" = s."surveyId"
    JOIN "Option" o ON a."optionId" = o."optionId"
    WHERE r."createdAt" >= ${startDate}
      AND s."isPublished" = true
    GROUP BY s."title";
  `
  return dataAvgScore
}

const recentRespondents = (startDate) => {
  const dataRecentRespondents = prisma.respondent.findMany({
    where: {
      createdAt: { gte: startDate },
      survey: {
          isPublished: true
      }
    },
    include: {
      survey: true,
      service: true
    },
    orderBy: { createdAt: 'desc' },
  })
  return dataRecentRespondents
}

module.exports = {
  respondentsPerMonth,
  avgScorePerSurvey,
  recentRespondents,
} 