const express = require('express');
const router = express.Router();
const themeFormRepository = require('./theme.repository')
const {verifyToken} = require('../middleware/auth.middleware')


router.get('/', async (req, res) => {
  try {

    const themeForm = await themeFormRepository.getThemeForm()
    res.status(200).json({ 
      status: 'success',
      message: 'data theme berhasil diambil',
      data: themeForm,
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }
})

router.patch('/:id',verifyToken, async (req, res) => {
  const data = req.body;
  try{
    const id = parseInt(req.params.id);
    if (typeof id !== 'number') throw Error('id harus angka')
    const updateTheme = await themeFormRepository.updateThemeById(id, data)
    res.status(200).json({ 
      status: 'success',
      message: 'theme berhasil diupdate',
      data: updateTheme,
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }
})

router.post('/', verifyToken, async (req, res) => {
  const data  = req.body;
  try{
    const updateTheme = await themeFormRepository.insertThemeForm(data)
    res.status(201).json({ 
      status: 'success',
      message: 'theme berhasil ditambah',
      data: updateTheme,
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