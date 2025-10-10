const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mahasiswaModel = require("../models/mahasiswaModels");
const adminModel = require("../models/adminModels");

exports.register = async (req,res) => {
    try {
        const { email, password, role } = req.body;

        if (role !== "mahasiswa") {
            return res.status(400)
            .json({ message : "Hanya role mahasiswa yang bisa register "});
        }

        const mahasiswaExists = await mahasiswaModel.findMahasiswaByEmail(email);
        if (mahasiswaExists) {
            return res.status(400).json({ message : "Email sudah terdaftar"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await mahasiswaModel.createMahasiswa(email, hashedPassword, role);

        res.status(201).json({ message : "Registrasi mahasiswa berhasil"})

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.login = async (req,res) => {
    try {
        const { email, password, role } = req.body;

        let user = null;
        let userModel = null;

        if (role === "mahasiswa") {
            user = await mahasiswaModel.findMahasiswaByEmail(email);
            userModel = mahasiswaModel;
        } else if (role === "admin") {
            user = await adminModel.findAdminByEmail(email);
            userModel = adminModel;
        } else {
            return res.status(400).json(
                { message : "Role tidak valid" }
            )
        }

        if (!user) {
            return res.status(400).json({
                message : "Email tidak ditemukan"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message : "Password Salah"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login Berhasil",
            token: token,
            user : {
                id: user.id,
                email: user.email,
                role: role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};  


exports.profile = async (req,res) => {
    try {
        const { id, role } = req.user;
        let user = null;

        if (role === "mahasiswa") {
            user = await mahasiswaModel.findMahasiswaByid(id);
        } else if (role === "admin") {
            user = await adminModel.findAdminById(id);
        }

        if (!user) {
            return res.status(404).json({
                message : "User tidak ditemukan"
            });
        }

        res.json({
            message :  `Welcome ${user.email}`,
            user : {
                id: user.id,
                email: user.email,
                role: role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};