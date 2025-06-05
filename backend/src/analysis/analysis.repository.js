const prisma = require("../config");

const countAvgScore = async (surveyId, startDate) => {
  const avgScore = await prisma.$queryRaw`
    SELECT AVG(o."scale_value") as "averageScore"
    FROM "Answer" a
    JOIN "Option" o ON a."option_id" = o."option_id"
    JOIN "Question" q ON a."question_id" = q."question_id"
    JOIN "Respondent" r ON a."respondent_id" = r."respondent_id"
    WHERE q."survey_id" = ${surveyId} AND r."created_at" >= ${startDate}
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

const findAllResponsesBySurveyId = async (surveyId, startDate) => {
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
                select: {
                  respondentId: true,
                  createdAt: true // ambil createdAt supaya bisa difilter nanti
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
    }
  });

  // Filter respondent.createdAt >= startDate
  for (const q of answer.question) {
    q.answer = q.answer.filter(ans => {
      return ans.respondent && new Date(ans.respondent.createdAt) >= new Date(startDate);
    });
  }

  return answer;
};


module.exports = {
  countAvgScore,
  findAllRespondentBySurveyId,
  findAllResponsesBySurveyId
}