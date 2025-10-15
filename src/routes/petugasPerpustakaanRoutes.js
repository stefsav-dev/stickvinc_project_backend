const express = require("express");
const { authMiddleware, authorize } = require("../middlewares/authMiddleware");
const petugasPerpustakaanController = require("../controllers/PetugasPerpustakaanController/PetugasPerpustakaanController");

const router = express.Router();

router.use(authMiddleware);
router.use(authorize['petugas_perpustakaan']);

router.get("/dashboard", petugasPerpustakaanController.petugasPerpustakaanDashboard);