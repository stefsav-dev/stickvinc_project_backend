const express = require("express");
const { authMiddleware, authorize } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/AdminController/AdminController");

const router = express.Router();

// Semua route di sini hanya bisa diakses oleh admin
router.use(authMiddleware);
router.use(authorize(['admin']));

// Dashboard Admin
router.get("/dashboard", adminController.adminDashboard);

// Manage Users
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.delete("/users/:id", adminController.deleteUser);

// Manage Admin
router.post("/create-admin", adminController.createAdmin);

// Statistics (contoh tambahan)
router.get("/statistics", async (req, res) => {
    try {
        const pool = require("../config/database");
        
        const [mahasiswaCount] = await pool.query("SELECT COUNT(*) as count FROM mahasiswa");
        const [adminCount] = await pool.query("SELECT COUNT(*) as count FROM admin");
        
        res.json({
            message: "Statistik sistem",
            data: {
                total_mahasiswa: mahasiswaCount[0].count,
                total_admin: adminCount[0].count,
                total_users: mahasiswaCount[0].count + adminCount[0].count
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;