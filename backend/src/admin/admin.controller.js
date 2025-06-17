const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/auth.middleware')
const {requireRole} = require('../middleware/role.middleware')
const adminService = require('./admin.service');

// router.get('/profile', verifyToken, async (req, res) => {
//   try {
//     const {adminId} = req.admin
//     const dataProfil  = await  adminService.getAdminById(parseInt(adminId))

//     res.status(200).json({
//       status: 'success',
//       message: 'Profil admin berhasil diambil',
//       data: dataProfil,
//       newAccessToken: res.get('New-Access-Token')
//     })
//   } catch (error) {
//     res.status(400).json({
//       status: "error",
//       message: "Something went wrong on the server",
//       error: error.message
//     })
//   }
// })

router.post('/ganti-password', verifyToken, async (req, res) => {
  try {
    const {adminId} = req.admin
    const dataAdmin = req.body;
    const {password, newPassword, confirmNewPassword} = dataAdmin
    await  adminService.updatePasswordById(adminId, {password, newPassword, confirmNewPassword})
    res.status(200).json({
      status: 'success',
      message: 'Password Berhasil diubah',
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


router.get('/',  async (req, res) => {
  try {

    const admin = await  adminService.getAllAdmin()

    res.status(200).json({
      status: 'success',
      message: 'data admin berhasil diambil',
      data: admin,
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

router.get('/:id',  async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await adminService.getAdminById(adminId)
    res.status(200).json({
      status: 'success',
      message: 'data admin berhasil diambil',
      data: admin,
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

router.post('/tambah-admin', verifyToken,requireRole('admin'), async (req, res) => {
  try {
    const dataAdmin = req.body;
    const admin = await  adminService.createAdmin(dataAdmin)
    res.status(201).json({
      status: 'success',
      message: 'data admin berhasil dibuat',
      data: admin,
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

router.patch('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const dataAdmin = req.body;
    const admin = await  adminService.updateAdminById(id, dataAdmin)
    res.status(200).json({
      status: 'success',
      message: 'data admin berhasil diupdate',
      data: admin,
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

router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const {id} = req.params;
    const admin = await  adminService.deleteAdminById(id)
    res.status(200).json({
      status: 'success',
      message: 'data admin berhasil dihapus',
      data: admin,
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