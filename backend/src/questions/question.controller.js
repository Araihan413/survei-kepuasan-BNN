const express = require('express');
const router = express.Router();
const questionService = require('./question.service')
const {verifyToken} = require('../middleware/auth.middleware')

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (typeof id !== 'number') throw Error('id harus angka')

    const questionById = await questionService.getQuestionById(id)
    res.status(200).json({ 
      status: 'success',
      message: 'data question berhasil diambil',
      data: questionById,
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

router.get('/:field/option', async (req, res) => {
  try {
    const field = req.params.field;
    const questionByField = await questionService.getQuestionByNameField(field)
    res.status(200).json({ 
      status: 'success',
      message: 'data question berhasil diambil',
      data: questionByField,
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const questionById = await questionService.getAllQuestion()
    res.status(200).json({ 
      status: 'success',
      message: 'data question berhasil diambil',
      data: questionById,
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

// ! create question
router.post('/',  async (req, res) => {
  try {
    const dataQuestion = req.body;
    const newQuestion = await questionService.createQuestion(dataQuestion)
    
    res.status(201).json({ 
      status: 'success',
      message: 'data question berhasil ditambahkan',
      data: newQuestion,
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

// ! update question
router.patch('/:id', async (req, res) => {
  try{
    const id = parseInt(req.params.id);
    if (typeof id !== 'number') throw Error('id harus angka')
    const DataQuestion = req.body;
    const updateSurvey = await questionService.updateQuestionById(id, DataQuestion)
    
    res.status(200).json({ 
      status: 'success',
      message: 'question berhasil diupdate',
      data: updateSurvey,
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

// ! delete question
router.delete('/:id',verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (typeof id !== 'number') throw Error('id harus angka')
    const question = await questionService.deleteQuestionById(id)
    res.status(200).json({ 
      status: 'success',
      message: 'question berhasil dihapus',
      data: question,
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