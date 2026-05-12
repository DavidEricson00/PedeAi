import { Router } from "express";
import { askChatbot } from "../controllers/chatbot.controller.js";

const router = Router();

/**
 * @swagger
 * /bot:
 *   post:
 *     summary: Fazer uma pergunta ao chatbot do cardápio
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Quais são os lanches disponíveis?"
 *     responses:
 *       200:
 *         description: Resposta do chatbot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 */
router.post("/", askChatbot);

export default router;