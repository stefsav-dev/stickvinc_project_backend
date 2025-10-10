const express = require("express");
const { register, login, profile } = require("../controllers/authController");
const { authMiddleware, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// Register hanya untuk mahasiswa
router.post("/register", register);

// Login untuk semua role
router.post("/login", login);

// Profile dengan autentikasi
router.get("/profile", authMiddleware, profile);

// Route khusus admin
router.get("/admin-only", authMiddleware, authorize(['admin']), (req, res) => {
    res.json({ 
        message: "Ini hanya bisa diakses oleh admin",
        user: req.user 
    });
});

// Route khusus mahasiswa
router.get("/mahasiswa-only", authMiddleware, authorize(['mahasiswa']), (req, res) => {
    res.json({ 
        message: "Ini hanya bisa diakses oleh mahasiswa",
        user: req.user 
    });
});

module.exports = router;