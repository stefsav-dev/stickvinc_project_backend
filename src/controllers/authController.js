const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mahasiswa = require("../models/mahasiswaModels");

exports.register = async (req,res) => {
    try {
    const {email, password} = req.body;

    const mahasiswaExists = mahasiswa.findMahasiswaByEmail(u => u.email === email);

    if (mahasiswaExists) {
        return res.status(400).json({ message : "Data Mahasiswa already exists"});
    }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await mahasiswa.createMahasiswa(email, hashedPassword);

        res.status(201).json({ message : "Registrasi user berhasil"});
    } catch (error) {
        res.status(500).json({ message : error.message});
    }
};

exports.login = async (req,res) => {
    try {
        const {email, password} = req.body;

        const mahasiswa = await mahasiswa.findMahasiswaByEmail(email);
        if (!mahasiswa) {
            return res.status(400).json({ message : "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, mahasiswa.password);
        if (!isMatch) {
            return res(400).json({ message : "Invalid password"});
        }

        const token = jwt.sign(
            {id: mahasiswa.id, email: mahasiswa.email},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        res.json({token});

    } catch (error) {
        res.status(500).json({ message: err.message });
    }
};

exports.profile = (req,res) => {
    res.json({ message: `Welcome ${req.mahasiswa.email}`, user: req.mahasiswa });
}