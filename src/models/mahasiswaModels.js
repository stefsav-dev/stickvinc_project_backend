const pool = require("../config/database");

const createMahasiswa = async(email,hashedPassword) => {
    const [result] = await pool.query(
        "INSERT INTO mahasiswa (email,password) VALUES (?,?)",
        [email, hashedPassword]
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

module.exports = {createMahasiswa, findMahasiswaByEmail};