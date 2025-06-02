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

module.exports = router
