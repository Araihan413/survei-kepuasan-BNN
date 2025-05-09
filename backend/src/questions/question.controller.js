const express = require('express');
const router = express.Router();
const {
  getAllQuestion,
  getQuestionById,
  createQuestion,
  updateQuestionById,
  deleteQuestionById
} = require('./question.service')




// ! get all survey
router.get('/', async (req, res)  => {

  try {
    const surveys = await getAllQuestion()

    res.json({status: 200,data: surveys, message: 'data survey berhasil diambil'})
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (typeof id !== 'number') throw Error('id harus angka')

    const survey = await getQuestionById(id)
    res.json({status: 200,data: survey, message: 'data survey berhasil diambil'})
  } catch (error) {
   res.status(400).send(error.message)
  }
})

// ! create survey
router.post('/', async (req, res) => {
  try {
    const {title, description} = req.body;
    const newQuestion = await createQuestion({title, description})
    
    res.json({status: 201,data: newQuestion, message: 'data survey berhasil dibuat'})
  } catch (error) {

    res.status(500).json(error.message)
  }
})

// ! update survey
router.put('/:id', async (req, res) => {
  try{
    const {id} = req.params;
    if (typeof id !== 'number') throw Error('id harus angka')
    const DataQuestion = req.body;
    const updateSurvey = await updateQuestionById(parseInt(id), {title, DataQuestion})
    
    res.json({status: 200,data: updateSurvey, message: 'data survey berhasil diupdate'})
 
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// ! delete survey
router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    if (typeof id !== 'number') throw Error('id harus angka')
    await deleteQuestionById(parseInt(id))
    res.json({status: 200, message: 'data survey berhasil dihapus'})

  } catch (error) {
   res.status(500).json(error.message)
   }
})

module.exports = router