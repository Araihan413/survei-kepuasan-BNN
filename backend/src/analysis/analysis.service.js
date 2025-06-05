const analysisRepository = require('./analysis.repository')
const { startOfMonth, startOfDay, startOfWeek, subMonths, subWeeks, subDays } = require('date-fns')
const optionRepository = require('../option/option.repository')


const getSurveyAnalysis = async (surveyId, rangeDate) => {
  const now = new Date();

  switch (rangeDate) {
    case 'daily':
      startDateSearch = subDays(startOfDay(now), 1);
      break;
    case 'weekly':
      startDateSearch = subWeeks(startOfWeek(now), 1);
      break;
    case '1month':
      startDateSearch = subMonths(startOfMonth(now), 1);
      break;
    case '3month':
      startDateSearch = subMonths(startOfMonth(now), 3);
      break;
    case '6months':
      startDateSearch = subMonths(startOfMonth(now), 6);
      break;
    case '12months':
      startDateSearch = subMonths(startOfMonth(now), 12);
      break;
    default:
      throw new Error('Invalid rangeDate');
  }
  const avgScore = await analysisRepository.countAvgScore(surveyId,  startDateSearch)
  const respondentsBySurveyId = await analysisRepository.findAllRespondentBySurveyId(surveyId, startDateSearch)
  const responsesBySurveyId = await analysisRepository.findAllResponsesBySurveyId(surveyId, startDateSearch)

  // ! menangani pengkelompokan data respondent
  const ageGroups = {
    "<18": 0,
    "19-30": 0,
    "31-40": 0,
    "41-50": 0,
    ">50": 0
  }
  const genders = {};
  const services = {};
  const jobs = {};
  respondentsBySurveyId.forEach((respondent) => {
    const age = respondent.age;
      if (age <= 18) ageGroups["<18"]++;
      else if (age <= 30) ageGroups["19-30"]++;
      else if (age <= 40) ageGroups["31-40"]++;
      else if (age <= 50) ageGroups["41-50"]++;
      else ageGroups[">50"]++;

      // Jenis kelamin
      genders[respondent.gender] = (genders[respondent.gender] || 0) + 1;

      // Layanan
      services[respondent.service.label] = (services[respondent.service.label] || 0) + 1;

      // Pekerjaan
      jobs[respondent.job] = (jobs[respondent.job] || 0) + 1;
  })
  
  // ! menangani pengkelompokan value option dari data jawaban berdasarkan pertanyaan
  const dataQuestions = responsesBySurveyId.question;
  const outputAnalysisScale = [];
  const outputAnalysisText = [];
  const outputAnalysisOption = []

  dataQuestions.forEach((question) => {

    if (question.questionType == 'skala') {
      const analysisByQuestionTypeScale = {
        id: question.questionId,
        questionText: question.questionText,
        displayOrder: question.displayOrder,
        countRespondent: 0,
        ratings: {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
        },
        avgAnswer: 0,
        ranking: 0
      };
  
     
      const answers = question.answer;
      answers.forEach((answerOption) => {
        analysisByQuestionTypeScale.countRespondent++;
      
        const scaleValue = answerOption.option.scaleValue;
        if (scaleValue >= 1 && scaleValue <= 4) {
          analysisByQuestionTypeScale.ratings[String(scaleValue)]++;
        }
      });
  
      let total = 0;
      for (let i = 1; i <= 4; i++) {
        total += analysisByQuestionTypeScale.ratings[String(i)] * i;
      }
      if (analysisByQuestionTypeScale.countRespondent > 0) {
        const average = total / analysisByQuestionTypeScale.countRespondent;
        analysisByQuestionTypeScale.avgAnswer = parseFloat(average.toFixed(2));
      }
  
      outputAnalysisScale.push(analysisByQuestionTypeScale);
    } 
    else if (question.questionType == 'text') {
      const analysisByQuestionTypeText = {
        id: question.questionId,
        questionText: question.questionText,
        displayOrder: question.displayOrder,
        countRespondent: 0,
        responsesText: []
      }

      const answers = question.answer;
      answers.forEach((answerText) => {
        analysisByQuestionTypeText.countRespondent++;
        analysisByQuestionTypeText.responsesText.push(answerText.answerText || "-")
      });

      outputAnalysisText.push(analysisByQuestionTypeText)
    }  else if (question.questionType == 'opsi') {
        const analysisByQuestionTypeOption = {
          id: question.questionId,
          questionText: question.questionText,
          displayOrder: question.displayOrder,
          countRespondent: 0,
          responsesOption: {}
        }
        const answers = question.answer;
        answers.forEach((answerOption) => {
          analysisByQuestionTypeOption.countRespondent++;
          const optionText = answerOption.option.optionText;
          analysisByQuestionTypeOption.responsesOption[optionText] = (analysisByQuestionTypeOption.responsesOption[optionText] || 0) + 1;
        });
  
        outputAnalysisOption.push(analysisByQuestionTypeOption)
      }
    
    
    
    
  });

  const sortedAnalysisByAvg = [...outputAnalysisScale].sort((a, b) => b.avgAnswer - a.avgAnswer);
  sortedAnalysisByAvg.forEach((analysis, index) => {
    analysis.ranking = index + 1
  })

  const sortedAnalysisByDisplayOrder = [...sortedAnalysisByAvg].sort((a, b) => a.displayOrder - b.displayOrder);


  // ! handle pertanyaan text

  const result = {
    surveyTitle: respondentsBySurveyId[0]?.survey?.title?? '-',
    averageScore: avgScore[0]?.averageScore ?? 0,
    distribution: {
      ageGroups,
      genders,
      services,
      jobs,
    },
    questionScaleAnalysis : sortedAnalysisByDisplayOrder,
    questionTextAnalysis: outputAnalysisText,
    questionOptionAnalysis: outputAnalysisOption
  }

  return result
}


module.exports = {getSurveyAnalysis}