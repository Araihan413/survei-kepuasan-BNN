const surveyService = require('./survey.service')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const surveys = await surveyService.getAllSurvey()

    res.status(200).json({
      status: 'success',
      message: 'data survey berhasil diambil',
      data: surveys
    })

  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})


router.get('/:id', async (req, res) => {
  try {
    const {surveyId} = req.params

    const surveyById = await surveyService.getSurveyById(surveyId)
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

router.post('/', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  try{
    const surveyId = req.params.id;
    await surveyService.deleteSurveyById(surveyId)
    res.status(200).json({
      status: 'success',
      message: 'data survey berhasil dihapus',
    })
  }catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const surveyId = req.params
    const newDataSurvey = req.body
    const updateDataSurvey = await surveyService.updateSurveyById(surveyId, newDataSurvey)
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