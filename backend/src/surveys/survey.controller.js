const surveyService = require('./survey.service')
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/auth.middleware')

// ! get all survey
router.get('/questions', async (req, res) => {
  const {isActive} = req.query
  try {
    if (isActive !== undefined) {
      const activeStatus = isActive === 'true'
      const surveys = await surveyService.getAllQuestionIsActive(activeStatus)

      res.status(200).json({
        status: 'success',
        message: 'data survey berhasil diambil',
        data: surveys
      })
    } else {
      const surveys = await surveyService.getAllQuestionInSurvey()

      res.status(200).json({
        status: 'success',
        message: 'data survey berhasil diambil',
        data: surveys
      })
      res.json({ message: 'Tanpa filter isActive' })
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})


// ! get all survey
router.get('/', async (req, res) => {
  try {
    const survey = await surveyService.getAllSurvey()
    res.status(200).json({
      status: 'success',
      message: 'data survey berhasil diambil',
      data: survey
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
    const {surveyId} = req.params

    const surveyById = await surveyService.getDetailSurveyById(surveyId)
    res.status(200).json({
      status: 'success',
      message: 'data survey berhasil diambil',
      data: surveyById
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
router.post('/', verifyToken, async (req, res) => {
  try {
    const dataSurvey = req.body
    const newSurvey = await surveyService.insertSurvey(dataSurvey)

    res.status(201).json({
      status: 'success',
      message: 'Survei berhasil dibuat',
      data: newSurvey
    })
  }catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

// ! delete survey
router.delete('/:id', verifyToken, async (req, res) => {
  try{
    const surveyId = req.params.id;
    const deleteSurvey = await surveyService.deleteSurveyById(surveyId)
    res.status(200).json({
      status: 'success',
      message: 'data survey berhasil dihapus',
      deleteSurveyId : deleteSurvey
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
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const surveyId = req.params
    const dataSurvey = req.body
    const updateDataSurvey = await surveyService.updateDataSurveyById(surveyId, dataSurvey)
    res.status(200).json({
      status: 'success',
      message : "Survey berhasil di update",
      data: updateDataSurvey
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