const answerRepository = require("./answer.repository");

const createManyAnswerAndRespondent = async (newData) => {
  const biodata = newData.biodata;
  const answers = newData.answers;

  // melakukan grup pada data berdasarkan surveyID
  const groupedByType = answers.reduce((acc, item) => {
    const key = item.surveyId;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  const keyObject = Object.keys(groupedByType)

  const dataInsertAnswer = []

  for (const key of keyObject) {
    const surveyId = key;
    const respondent = {
      name: biodata.name,
      age: parseInt(biodata.age),
      job:biodata.job,
      lastEducation: biodata.lastEducation,
      agency: biodata.agency || null,
      gender: biodata.gender,
      phoneNumber: String(biodata.phoneNumber),
      serviceId: parseInt(biodata.serviceId),
      surveyId: parseInt(surveyId),
    }
    const dataRespondent = await answerRepository.insertRespondent(respondent);
    const respondentId = parseInt(dataRespondent.respondentId)

    groupedByType[key].forEach(item => {
      const optionId = parseInt(item.optionId) || null;
      const answerText = item.answerText || null;

       // Jika optionId null dan answerText juga null, maka isi default '-'
      const finalAnswerText = optionId == null && !answerText ? '-' : answerText;

      dataInsertAnswer.push({
        respondentId,
        questionId: parseInt(item.questionId),
        answerText: finalAnswerText,
        optionId: optionId
      });
    })

  }

  dataInsertAnswer.map((itemAnswer, index) => {
      if (
        itemAnswer.respondentId == null ||
        itemAnswer.questionId == null ||
        (itemAnswer.answerText == null && itemAnswer.optionId == null)
      ) {
        throw new Error(`Data answer ke-${index + 1} tidak lengkap`);
      }
  })
  return await answerRepository.insertManyAnswer(dataInsertAnswer);
};

module.exports = { createManyAnswerAndRespondent };