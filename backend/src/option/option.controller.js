const optionReository = require('./option.repository')
const express = require("express");
const router = express.Router();
const {verifyToken} = require('../middleware/auth.middleware')

router.post('/', verifyToken, async (req, res) => {
  try {
    const data = req.body
    const newOption = await optionReository.insertManyOption(data)
    res.status(201).json({
      status: 'success',
      message: 'Option berhasil ditambahkan',
      data: newOption
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error
    })
  }

})

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const options = await optionReository.getOptionByQuestionId(id)
    res.status(200).json({
      status: 'success',
      message: 'Data option berhasil diambil',
      data: options
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
