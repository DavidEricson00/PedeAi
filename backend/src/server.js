import express from "express";
import { PORT } from "./config/env";

const app = express();
app.use(express.json());

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


app.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
});