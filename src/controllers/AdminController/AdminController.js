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


//route mahasiswa controller
exports.getAllDataMahasiswa = async (req,res) => {
    try {
        const pool = require("../../config/database");

        const [mahasiswa] = await pool.query("SELECT * FROM mahasiswa")

        res.status(200).json({
            message: "Data Semua Mahasiswa",
            data: {
                mahasiswa: mahasiswa,
                total_data_mahasiswa: mahasiswa.length
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.createDataMahasiswa = async (req,res) => {
    try {
        const {email,password} = req.body;
        const pool = require("../../config/database");

        if (!email || !password) {
            return res.status(400).json({
                message: "Email dan password harus diisi"
            });
        }

        const [existingMahasiswa] = await pool.query("SELECT id FROM mahasiswa WHERE email = ?", [email]);

        if (existingMahasiswa.length > 0) {
            return res.status(500).json({
                message: "Email sudah terdaftar"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            "INSERT INTO mahasiswa (email, password, role) VALUES (?,?,?)",
            [email, password, "mahasiswa"]
        );

        res.status(200).json({
            message: "Berhasil membuat data mahasiswa",
            data: {
                id: result.insertId,
                email: email,
                role: "mahasiswa"
            }
        });
    } catch (error) {
        message: error.message
    }
}


exports.getDataMahasiswaById = async (req,res) => {
    try {
        
        const {id} = req.params;
        const pool = require("../../config/database");

        const [mahasiswa] = await pool.query(
            "SELECT * FROM mahasiswa WHERE id = ?",[id]
        );

        if (mahasiswa.length === 0) {
            return res.status(404).json({
                message : "Mahasiswa tidak ditemukan"
            });
        }

        return res.status(200).json({
            message: "Data mahasiswa berhasil ditemukan",
            data: mahasiswa[0]
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


exports.updateDataMahasiswa = async (req,res) => {
    try {
        const {id} = req.params;
        const { email, password} = req.body;
        const pool = require("../../config/database");

        const [existingMahasiswa] = await pool.query(
            "SELECT id FROM mahasiswa WHERE id = ?", [id]
        );

        if (mahasiswa.length === 0) {
            return res.status(404).json({
                message: "Mahasiswa tidak ditemukan"
            });
        }

        let updateQuery = "UPDATE mahasiswa SET ";
        let updateValues = [];
        let updateFields = [];

        if (email) {
            const [emailCheck] = await pool.query(
                "SELECT id FROM mahasiswa WHERE email = ? AND id != ?",
                [email,id]
            );

            if (emailCheck.length > 0) {
                return res.status(404).json({
                    message : "Email sudah di gunakan oleh mahasiswa lain"
                });
            }

            updateFields.push("email = ?");
            updateValues.push(email);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push("password = ?");
            updateValues.push(hashedPassword);
        }

        if (updateFields.length === 0) {
            return res.status(404).json({
                message: "Tidak ada data yang diupdate"
            });
        }

        updateQuery += updateFields.join(", ") + " WHERE id = ?";
        updateValues.push(id);

        await pool.query(updateQuery, updateValues);

        return res.status(200).json({
            message : "Data Mahasiswa berhasil terupdate"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


exports.deleteDataMahasiswa = async (req,res) => {
    try {
        
        const {id} = req.params;
        const pool = require("../../config/database");
        
        const [existingMahasiswa] = await pool.query(
            "SELECT id FROM mahasiswa WHERE id = ?", [id]
        );

        if (existingMahasiswa.length > 0) {
            return res.json(404).json({
                message: "Data mahasiswa tidak ditemukan"
            });
        }

        await pool.query("DELETE mahasiswa WHERE id = ?", [id]);

        res.status(200).json({
            message: "Data mahasiswa berhasil dihapus"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
