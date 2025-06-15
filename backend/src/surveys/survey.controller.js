const surveyService = require('./survey.service')
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/auth.middleware')
const multer = require('multer');
const upload = multer({
  dest: 'public/uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// !mengambil semua survei beserta pertanyaan nya
// ? pakai
router.get('/questions', async (req, res) => {
  try {
      const surveys = await surveyService.getAllQuestionInSurvey()
      res.status(200).json({
        status: 'success',
        message: 'data survey berhasil diambil',
        data: surveys,
        newAccessToken: res.get('New-Access-Token')
      })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }
})

// ! mengambil survei berdasarkan id dan pertanyaannya
// ? pakai
router.get('/:id/questions', async (req, res) => {
  const surveyId = parseInt(req.params.id)
  try {
      const surveys = await surveyService.getSurveyIncludeQuestion(surveyId)
      res.status(200).json({
        status: 'success',
        message: 'data survey berhasil diambil',
        data: surveys,
        newAccessToken: res.get('New-Access-Token')
      })
    
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }
})


// ! mengambil semua survei tanpa pertanyaan
// ? pakai
router.get('/', async (req, res) => {
  try {
    const survey = await surveyService.getAllSurvey()
    res.status(200).json({
      status: 'success',
      message: 'data survey berhasil diambil',
      data: survey,
      newAccessToken: res.get('New-Access-Token')
    })

  }catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }
})

// ! mengambil data survey berdasarkan id
router.get('/:id', async (req, res) => {
  try {
    const surveyId = req.params.id

    const surveyById = await surveyService.getDetailSurveyById(parseInt(surveyId))
    res.status(200).json({
      status: 'success',
      message: 'data survey berhasil diambil',
      data: surveyById,
      newAccessToken: res.get('New-Access-Token')
    })

  }catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }
})

// ! create survey
router.post('/',  async (req, res) => {
  try {
    const dataSurvey = req.body
    const newSurvey = await surveyService.insertSurvey(dataSurvey)

    res.status(201).json({
      status: 'success',
      message: 'Survei berhasil dibuat',
      data: newSurvey,
      newAccessToken: res.get('New-Access-Token')
    })
  }catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }
})

// ! delete survey
router.delete('/:id', async (req, res) => {
  try{
    const surveyId = parseInt(req.params.id);
    const deleteSurvey = await surveyService.deleteSurveyById(surveyId)
    res.status(200).json({
      status: 'success',
      message: 'data survey berhasil dihapus',
      deleteSurveyId : deleteSurvey,
      newAccessToken: res.get('New-Access-Token')
    })
  }catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }
})

// ! update survey
router.patch('/:id',  async (req, res) => {
  try {
    const surveyId = req.params.id
    const dataSurvey = req.body
    const updateDataSurvey = await surveyService.updateDataSurveyById(parseInt(surveyId), dataSurvey)
    res.status(200).json({
      status: 'success',
      message : "Survey berhasil di update",
      data: updateDataSurvey,
      newAccessToken: res.get('New-Access-Token')
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }
})

router.post('/update', upload.single('banner'), async (req, res) => {
  try {
    const { surveyId, textInformation } = req.body;
    const id = Number(surveyId);
  if (isNaN(id)) {
    return res.status(400).json({ status: "error", message: "Survei Id tidak falid" });
    }
    const file = req.file;
    const uploadBenner = await surveyService.uploadBannerSurvey(id,  textInformation, file);
    res.status(200).json({
      status: 'success',
      message : "Survey berhasil di update",
      data: uploadBenner,
      newAccessToken: res.get('New-Access-Token')
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }
});

module.exports = router