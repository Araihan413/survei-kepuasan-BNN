const notificationService = require("./notif.service");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const notif = await notificationService.getAllNotification();
    res.status(200).json({
      status: "success",
      message: "Data notifikasi berhasil diambil",
      data: notif,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const notif = await notificationService.createNotification(data);
    res.status(201).json({
      status: "success",
      message: "Data notifikasi berhasil di tambahkan",
      data: notif,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const notif = await notificationService.deleteNotificationById(id);
    res.status(200).json({
      status: "success",
      message: "Data notifikasi berhasil dihapus",
      data: notif,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error,
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const notif = await notificationService.updateNotificationById(id, data);
    res.status(200).json({
      status: "success",
      message: "Data notifikasi berhasil diupdate",
      data: notif,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error,
    });
  }
});

module.exports = router;