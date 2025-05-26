const analysisService = require('./analysis.service')
const express = require('express');
const router = express.Router();


router.get('/:id', async (req, res) => {
  const surveyId = req.params.id
  const {rangeDate} = req.query
  try {
    const data = await analysisService.getAnalysis(surveyId, rangeDate)
    res.status(200).json({
      status: 'success',
      message: 'Data dashboard berhasil diambil',
      data: data
    })

  }catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

module.exports = router