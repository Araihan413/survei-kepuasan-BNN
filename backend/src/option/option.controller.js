const optionReository = require('./option.repository')
const express = require("express");
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const data = req.body
    const newOption = await optionReository.insertOption(data)

    res.status(200).json({
      status: 'success',
      message: 'Data option berhasil diambil',
      data: newOption
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
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
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

module.exports = router
