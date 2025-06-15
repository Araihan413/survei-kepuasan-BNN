const questionRepository = require('./question.repository')
const optionRepository = require('../option/option.repository')


const getQuestionById = async (id) => {
  const question = await questionRepository.findQuestionById(id)
  if (!question) throw Error('data question tidak ditemukan')
  return question
}

const getQuestionByNameField = async (field) => {
  const question = await questionRepository.findQuestionByNameField(field)
  if (!question) throw Error('data question tidak ditemukan')
  return question
}
const getAllQuestion = async () => {
  const question = await questionRepository.findQuestions()
  return question
}

// Di question.service.js
const createQuestion = async (surveyId, adminId, questionsData) => {
  const createdQuestions = [];

  for (const item of questionsData) {
    const baseQuestion = {
      surveyId,
      questionText: item.question,
      questionType: item.type,
      isRequired: item.required,
      displayOrder: item.displayOrder || 0,
      adminId,
      isPersonal: item.isPersonal || false,  // Tambahkan field baru
      respondentField: item.respondentField || null,  // Tambahkan field baru
    };

    // Case 1: Pertanyaan teks
    if (item.type === "text") {
      const newQuestion = await questionRepository.insertQuestion({
        ...baseQuestion,
        options: { create: [] },  // Tetap buat relasi kosong
      });
      createdQuestions.push(newQuestion);
    }

    // Case 2: Pertanyaan opsi
    else if (item.type === "opsi") {
      const options = item.options.map((optionText, index) => ({
        optionText: optionText,
        scaleValue: null,
        displayOrder: index + 1,
      }));
    
      const newQuestion = await questionRepository.insertQuestionAndOption(
        baseQuestion,
        options
      );
      createdQuestions.push(newQuestion);
    }

    // Case 3: Pertanyaan skala
    else if (item.type === "skala") {
      const options = item.scaleOptions.map((optionText, index) => ({
        optionText,
        scaleValue: item.scaleValues[index],  // Gunakan nilai skala
        displayOrder: index + 1,
      }));

      const newQuestion = await questionRepository.insertQuestionAndOption(
        baseQuestion,
        options
      );
      createdQuestions.push(newQuestion);
    }
  }

  return createdQuestions;
};

const updateQuestionById = async (id, questionData) => {
  await getQuestionById(id)

  const dataUpdate = {}

  if (typeof questionData.questionText === 'string') {
    dataUpdate.questionText = questionData.questionText
  }
  if (typeof questionData.questionType === 'string') {
    dataUpdate.questionType = questionData.questionType
  }
  if (typeof questionData.isRequired === 'boolean') {
    dataUpdate.isRequired = questionData.isRequired
  }
  if (typeof questionData.isActive === 'boolean') {
     dataUpdate.isActive = questionData.isActive
   }
  if (typeof questionData.displayOrder === 'number') {
    dataUpdate.displayOrder = questionData.displayOrder
  }
  const updatedQuestion = await questionRepository.updateQuestionById(id, dataUpdate)
  return updatedQuestion
}

const updateQuestionAndOption = async (questionData, optionChanges) => {
  await getQuestionById(parseInt(questionData.questionId))

  const dataUpdate = {}

  if (typeof questionData.questionText === 'string') {
    dataUpdate.questionText = questionData.questionText
  }
  if (typeof questionData.questionType === 'string') {
    dataUpdate.questionType = questionData.questionType
  }
  if (typeof questionData.isRequired === 'boolean') {
    dataUpdate.isRequired = questionData.isRequired
  }
  if (typeof questionData.isActive === 'boolean') {
     dataUpdate.isActive = questionData.isActive
   }
  if (typeof questionData.displayOrder === 'number') {
    dataUpdate.displayOrder = questionData.displayOrder
  }
  const updatedQuestion = await questionRepository.updateQuestionById(parseInt(questionData.questionId), dataUpdate)

   // 2. Hapus Opsi yang Dihapus User
   if (optionChanges.toDelete.length > 0) {
    await optionRepository.deleteManyOption(optionChanges);
  }

  // 3. Update Opsi yang Diubah
  const updatePromises = optionChanges.toUpdate.map(opt =>
    optionRepository.updateOptionById(opt.optionId, {
      optionText: opt.optionText,
      scaleValue: opt.scaleValue || null,
      displayOrder: opt.displayOrder
    })
  );
  await Promise.all(updatePromises);

  // 4. Tambah Opsi Baru
  if (optionChanges.toCreate.length > 0) {
    await optionRepository.insertManyOption(optionChanges.toCreate);
  }

  return updatedQuestion
}

const deleteQuestionById = async (id) => {
  await getQuestionById(id)
  const question = await questionRepository.deleteQuestionById(id)
  return question
}


module.exports = {
  getQuestionById,
  createQuestion,
  updateQuestionById,
  deleteQuestionById,
  getAllQuestion,
  getQuestionByNameField,
  updateQuestionAndOption
}