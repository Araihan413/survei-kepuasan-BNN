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
      s."survey_id",
      AVG(o."scale_value") AS "averageScore"
    FROM "Answer" a
    JOIN "Respondent" r ON a."respondent_id" = r."respondent_id"
    JOIN "Survey" s ON r."survey_id" = s."survey_id"
    JOIN "Option" o ON a."option_id" = o."option_id"
    WHERE r."created_at" >= ${startDate}
      AND s."is_published" = true
    GROUP BY s."title" , s."survey_id";
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
      survey: {
        select: {
          surveyId: true,
          title: true
        }
      },
      service: {
        select: {
          serviceId: true,
          name: true,
          label: true
        }
      }
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