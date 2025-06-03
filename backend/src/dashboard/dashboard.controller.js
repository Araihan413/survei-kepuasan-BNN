
const dashboardService = require('./dashboard.service')
const express = require('express');
const router = express.Router();

router.get('/recent-respondents', async (req, res) => {
  try {
    const {dateAgo} = req.query
    const job = req.query.job || null;
    const serviceId = req.query.serviceId || null;
    const surveyId = req.query.surveyId || null;

    const data = await dashboardService.getRecentRespondentsByFilter(dateAgo, job, serviceId, surveyId)
    res.status(200).json({
      status: 'success',
      message: 'Data dashboard berhasil diambil',
      data: data
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

router.get('/count-respondents/:year', async (req, res) => {
  try {
    const serviceId = req.query.serviceId || null;
    const {year} = req.params
    const data = await dashboardService.getRespondenByYear(year, serviceId)
    res.status(200).json({
      status: 'success',
      message: 'Data dashboard berhasil diambil',
      data: data
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error.message
    })
  }
})

router.get('/avg-score', async (req, res) => {
  try {
    const {dateAgo} = req.query
    const data = await dashboardService.getAvgScoreSurvey(dateAgo)
    res.status(200).json({
      status: 'success',
      message: 'Data dashboard berhasil diambil',
      data: data
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error.message
    })
  }
})

module.exports = router