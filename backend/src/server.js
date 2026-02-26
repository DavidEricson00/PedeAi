import express from "express";
import pkg from "pg";
import dotenv from "dotenv"

dotenv.config();

const { Pool } = pkg;

const app = express();
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.get("/", (req, res) => {
    res.json({ message: "PedeAi API rodando" })
});

app.get("/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ database_time: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error : "Erro ao consultar o banco" });
    }
});

const PORT = 3000

app.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
});