const surveyRepository = require('./survey.repository')
const path = require('path');
const fs = require('fs');

const getAllQuestionInSurvey = async () => {
  const survey = await surveyRepository.findQuestionsInSurvey()
  return survey
}

const getDetailSurveyById = async (id) => {
  const survey = await surveyRepository.findDetaiSurvey(id)
  if (!survey) throw Error('data survey tidak ditemukan')
  return survey
}

const getSurveyIncludeQuestion = async (id) => {
  await getDetailSurveyById(id)
  const survey = await surveyRepository.findSurveyIncludeQuestion(id)
  return survey
}

const getAllSurvey = async () => {
  const survey = await surveyRepository.findSurveys()
  return survey
}


const insertSurvey = async (dataSurvey) => {
  const requiredFields = ['title', 'adminId', 'orderPage']

  for (const field of requiredFields) {
    if (!dataSurvey[field]) {
      throw new Error(`Data field "${field}" wajib dikirim`)
    }
  }
  const survey = await surveyRepository.insertSurvey(dataSurvey)
  return survey
}

const updateDataSurveyById = async (id, dataSurvey) => {
  const dataUpdate = {}

  if (typeof dataSurvey.title === 'string') {
    dataUpdate.title = dataSurvey.title
  }

  if (typeof dataSurvey.description === 'string') {
    dataUpdate.description = dataSurvey.description
  }

  if (typeof dataSurvey.isPublished === 'boolean') {
    dataUpdate.isPublished = dataSurvey.isPublished
  }

  // Cek apakah ada data yang akan diupdate
  if (Object.keys(dataUpdate).length === 0) {
    throw Error('Tidak ada data yang dapat diupdate')
  }

  const survey = await surveyRepository.updateSurveyById(id, dataUpdate)
  return survey
}

const deleteSurveyById = async (id) => {
  await getDetailSurveyById(id)
  const survey = await surveyRepository.deleteSurveyById(id)
  return survey
}

const uploadBannerSurvey = async (surveyId,  textInformation, file) => {
  let newFilePath = null; // Simpan path file baru untuk cleanup jika gagal

  try {
    // Validasi input
    if (!surveyId) {
      throw new Error('Survey ID is required');
    }

    const updateData = {
      textInformation: textInformation || null,
    };

    if (file) {
      // Validasi file
      if (!file.mimetype.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Hapus banner lama
      const survey = await getDetailSurveyById(surveyId);
      
      if (survey.bannerUrl) {
        const oldPath = path.join(__dirname, '../public', survey.bannerUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      
      // Simpan path baru untuk cleanup
      newFilePath = path.join(__dirname, '../public', `/uploads/${file.filename}`);
      updateData.bannerUrl = `/uploads/${file.filename}`;
    }

    const updatedSurvey = await surveyRepository.updateSurveyById(surveyId, updateData);
    
    // Jika update gagal (misal karena constraint database)
    if (!updatedSurvey) {
      throw new Error('Failed to update survey in database');
    }

    return updatedSurvey;
    
  } catch (error) {
    console.error('Error in uploadBannerSurvey:', error);
    
    // Cleanup file baru jika sudah diupload tapi operasi gagal
    if (newFilePath && fs.existsSync(newFilePath)) {
      try {
        fs.unlinkSync(newFilePath);
        console.log('Cleanup: Deleted uploaded file due to operation failure');
      } catch (cleanupError) {
        console.error('Failed to cleanup file:', cleanupError);
      }
    }
    
    throw error; // Re-throw error untuk ditangkap oleh route handler
  }
};

module.exports = { 
  getAllQuestionInSurvey,
  getAllSurvey,
  getDetailSurveyById,
  insertSurvey,
  updateDataSurveyById,
  deleteSurveyById,
  getSurveyIncludeQuestion,
  uploadBannerSurvey
}