import express from "express";
import router from "./routes/index.route.js";

import { PORT } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";

const app = express();
app.use(express.json());


app.use("/", router)

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.use(errorHandler)


app.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
});