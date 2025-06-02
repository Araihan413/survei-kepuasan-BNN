const surveyService = require('./survey.service')
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/auth.middleware')

// ! get all survey
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
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

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
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})


// ! get all survey
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
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

// ! get detail survey
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
      message: "Something went wrong on the server",
      error: error.message
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
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

// ! buat banyak jawaban
// router.post('/submit-survey', async (req, res) => {
//   try {
//     const dataSurvey = req.body
//     const newSurvey = await surveyService.insertManySurvey(dataSurvey)
//     res.status(201).json({
//       status: 'success',
//       message: 'Survei berhasil dibuat',
//       data: newSurvey,
//       newAccessToken: res.get('New-Access-Token')
//     })
//   }catch (error) {
//     res.status(400).json({
//       status: "error",
//       message: "Something went wrong on the server",
//       error: error.message
//     })
//   }
// })


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
      message: "Something went wrong on the server",
      error: error.message
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
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

module.exports = router