const serviceService = require("./service.service");
const { verifyToken } = require("../middleware/auth.middleware");
const express = require("express");
const router = express.Router();  

router.get("/", async (req, res) => {
  try {
    const service = await serviceService.getAllService();
    res.status(200).json({
      status: "success",
      message: "Data service berhasil diambil",
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message,
    });
  }
})

router.post("/", verifyToken, async (req, res) => {
  try {
    const dataService = req.body;
    const service = await serviceService.createService(dataService);
    res.status(201).json({
      status: "success",
      message: "Data service berhasil di tambahkan",
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message,
    });
  }
});

router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new Error('id harus angka');

    const dataService = req.body;
    const updateService = await serviceService.updateServiceById(id, dataService);

    // ✅ Tidak perlu kirim token di response body
    res.status(200).json({
      status: 'success',
      message: "Service berhasil diupdate",
      data: updateService
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw Error('id harus angka')
    const deleteService = await serviceService.deleteServiceById(id)
    res.status(200).json({
      status: 'success',
      message : "Service berhasil di hapus",
      data: deleteService,
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Something went wrong on the server",
      error: error.message
    })
  }
})

module.exports = router;