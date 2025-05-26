const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/auth.middleware')
const {requireRole} = require('../middleware/role.middleware')
const userService = require('./users.service');

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const dataProfil  = await  userService.getUserById(req.user.userId)

    res.status(200).json({
      status: 'success',
      message: 'Profil user berhasil diambil',
      data: dataProfil
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const dataUser = req.body;
    const {password, newPassword, confirmNewPassword} = dataUser
    await  userService.updatePasswordById(req.user.userId, {password, newPassword, confirmNewPassword})
    res.status(200).json({
      status: 'success',
      message: 'Password Berhasil diubah',
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})


router.get('/', verifyToken, async (req, res) => {
  try {

    const users = await  userService.getAllUser()

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

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await  userService.getUserById(userId)
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
    const user = await  userService.createUser(dataUser)
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
    const user = await  userService.updateUserById(id, dataUser)
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
    await  userService.deleteUserById(id)
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