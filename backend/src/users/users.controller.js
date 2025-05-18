const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/auth.middleware')
const {requireRole} = require('../middleware/role.middleware')
const {
  getAllUser,
  getUserById,
  updateUserById,
  createUser,
  deleteUserById
} = require('./users.service');


router.get('/', async (req, res) => {
  try {

    const users = await getAllUser()

    res.status(200).json({
      status: 'success',
      message: 'data user berhasil diambil',
      data: users
    })

  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await getUserById(userId)
    res.status(200).json({
      status: 'success',
      message: 'data user berhasil diambil',
      data: user
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

router.post('/', verifyToken, async (req, res) => {
  try {
    const dataUser = req.body;
    const user = await createUser(dataUser)
    res.status(201).json({
      status: 'success',
      message: 'data user berhasil dibuat',
      data: user
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const {id} = req.params;
    const dataUser = req.body;
    const user = await updateUserById(id, dataUser)
    res.status(200).json({
      status: 'success',
      message: 'data user berhasil diupdate',
      data: user
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const {id} = req.params;
    await deleteUserById(id)
    res.status(200).json({
      status: 'success',
      message: 'data user berhasil dihapus',
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