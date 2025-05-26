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
      data: questionById
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
router.post('/', verifyToken, async (req, res) => {
  try {
    const dataQuestion = req.body;
    const newQuestion = await questionService.createQuestion(dataQuestion)
    
    res.status(201).json({ 
      status: 'success',
      message: 'data question berhasil ditambahkan',
      data: newQuestion
    })
  } catch (error) {

    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

// ! update survey
router.patch('/:id',verifyToken, async (req, res) => {
  try{
    const id = parseInt(req.params.id);
    if (typeof id !== 'number') throw Error('id harus angka')
    const DataQuestion = req.body;
    const updateSurvey = await questionService.updateQuestionById(id, DataQuestion)
    
    res.status(200).json({ 
      status: 'success',
      message: 'question berhasil diupdate',
      data: updateSurvey
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

// ! delete survey
router.delete('/:id',verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (typeof id !== 'number') throw Error('id harus angka')
    const question = await questionService.deleteQuestionById(id)
    res.status(200).json({ 
      status: 'success',
      message: 'question berhasil dihapus',
      data: question
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