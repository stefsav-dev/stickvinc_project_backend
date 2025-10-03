const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use("/", (req,res) => {
    res.send("Hello World");
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))