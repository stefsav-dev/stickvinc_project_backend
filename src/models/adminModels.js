const pool = require("../config/database");

const findAdminByEmail = async (email) => {
    const [rows] = await pool.query(
        "SELECT * FROM admin WHERE email = ?",
        [email]
    );
    return rows[0];
}

const findAdminById = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM admin WHERE id = ?",
        [id]
    );
    return rows[0];
}

module.exports = {findAdminByEmail, findAdminById};