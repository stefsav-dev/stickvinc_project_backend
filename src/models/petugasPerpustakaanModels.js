const pool = require("../config/database");

const findPetugasPerpustakaanByEmail = async (email) => {
    const [rows] = await pool.query(
        "SELECT * FROM petugas_perpustakaan WHERE email = ?",
        [email]
    );
    return rows[0];
}

const findPetugasPerpustakaanById = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM petugas_perpustakaan WHERE id = ?", [id]
    );
    return rows[0];
}

module.exports = {findPetugasPerpustakaanByEmail, findPetugasPerpustakaanById};