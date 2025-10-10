const adminModel = require("../../models/adminModels");

exports.adminDashboard = async (req,res) => {
    try {
        res.status(200).json({ message : "Halaman admin dashboard"});
    } catch (error) {
        res.status(500).json({ message : error.message});
    }
};

exports.getAllUsers = async (req,res) => {
    try {
        const pool = require("../../config/database");

        const [mahasiswa] = await pool.query("SELECT id, email, role, created_at FROM mahasiswa");

        const [admin] = await pool.query("SELECT id, email, role, created_at FROM admin");

        res.status(200).json({
            message: "Data user berhasil diambil",
            data: {
                mahasiswa: mahasiswa,
                admin: admin,
                total_users: mahasiswa.length + admin.length
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.query; 

        let user = null;
        const pool = require("../config/database");

        if (role === 'mahasiswa') {
            const [rows] = await pool.query(
                "SELECT id, email, role, created_at FROM mahasiswa WHERE id = ?",
                [id]
            );
            user = rows[0];
        } else if (role === 'admin') {
            const [rows] = await pool.query(
                "SELECT id, email, role, created_at FROM admin WHERE id = ?",
                [id]
            );
            user = rows[0];
        } else {
            return res.status(400).json({ 
                message: "Parameter role harus diisi (mahasiswa atau admin)" 
            });
        }

        if (!user) {
            return res.status(404).json({ 
                message: "User tidak ditemukan" 
            });
        }

        res.status(200).json({
            message: "Data user berhasil diambil",
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteUser = async (req,res) => {
    try {
        const {id} = req.params;
        const {role} = req.body;


        const pool = require("../../config/database");

        if (role === "mahasiswa") {
            await pool.query("DELETE FROM mahasiswa WHERE id = ?", [id]);
        } else if (role === "admin") {
            if (parseInt(id) === req.user.id) {
                return res.status(400).json({
                    message : "Tidak dapat menghapus akun sendiri"
                });
            }
            await pool.query("DELETE FROM admin WHERE id = ?", [id]);
        } else {
            return res.status(400).json({
                message: "Parameter role harus diisi (mahasiswa atau admin)"
            });
        }

        res.status(200).json({
            message: "User berhasil dihapus"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.createAdmin = async (req,res) => {
    try {
        const {email, password} = req.body

        const bcrypt = require("bcryptjs");

        const adminExists = await adminModel.findAdminByEmail(email);
        if (adminExists) {
            return res.status(400).json({
                message: "Admin sudah terdaftar"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const pool = require("../../config/database");
        await pool.query(
            "INSERT INTO admin (email,password) VALUES (?,?)",
            [email, hashedPassword]
        );

        res.status(201).json({
            message: "Admin Berhasil dibuat"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
