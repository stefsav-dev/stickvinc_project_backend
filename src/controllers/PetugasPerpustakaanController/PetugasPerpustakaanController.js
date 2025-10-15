const petugasPerpustakaanModel = require("../../models/petugasPerpustakaanModels");

exports.petugasPerpustakaanDashboard = async (req,res) => {
    try {
        res.status(200).json({
            message: "Halaman Petugas Perpustakaan"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}