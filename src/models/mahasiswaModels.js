const pool = require("../config/database");

const createMahasiswa = async(email,hashedPassword, role = "mahasiswa") => {
    const [result] = await pool.query(
        "INSERT INTO mahasiswa (email,password,role) VALUES (?,?,?)",
        [email, hashedPassword, role]
    );
    return result;
}

const findMahasiswaByEmail = async (email) => {
    const [rows] = await pool.query(
        "SELECT * FROM mahasiswa WHERE email = ?",
        [email]
    );
    return rows[0];
}

const findMahasiswaByid = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM mahasiswa WHERE id = ?",
        [id]
    )
    return rows[0];
}

module.exports = {createMahasiswa, findMahasiswaByEmail, findMahasiswaByid};