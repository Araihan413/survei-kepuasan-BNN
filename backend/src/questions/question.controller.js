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
      message: error.message,
      error: error
    })
  }
})

// ! create question
router.post('/', verifyToken, async (req, res) => {
  try {
    const data = req.body;
    const {surveyId, adminId, questionsData} = data
    const newQuestion = await questionService.createQuestion(parseInt(surveyId), adminId, questionsData)
    
    res.status(201).json({ 
      status: 'success',
      message: 'data question berhasil ditambahkan',
      data: newQuestion,
    })
  } catch (error) {

    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }
})

// ! update question and option
router.patch('/', verifyToken, async (req, res) => {
  const { questionData, optionChanges } = req.body;
  try{
    const updateSurvey = await questionService.updateQuestionAndOption(questionData, optionChanges)
    
    res.status(200).json({ 
      status: 'success',
      message: 'question berhasil diupdate',
      data: updateSurvey,
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }
})

// ! update question
router.patch('/:id', verifyToken, async (req, res) => {
  
  try{
    const id = parseInt(req.params.id);
    if (typeof id !== 'number') throw Error('id harus angka')
    const data = req.body;
    const updateSurvey = await questionService.updateQuestionById(id, data)
    res.status(200).json({ 
      status: 'success',
      message: 'question berhasil diupdate',
      data: updateSurvey,
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }
})

// ! delete question
router.delete('/:id', verifyToken,  async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (typeof id !== 'number') throw Error('id harus angka')
    const question = await questionService.deleteQuestionById(id)
    res.status(200).json({ 
      status: 'success',
      message: 'question berhasil dihapus',
      data: question,
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
   }
})

module.exports = router