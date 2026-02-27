import { Router } from "express";
import { 
    createUserController, 
    getUserByIdController, 
    getUserByTelegramChatIdController
} from "../controllers/user.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - telegram_chat_id
 *             properties:
 *               telegram_chat_id:
 *                 type: integer
 *                 example: 123456789
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Chat id é obrigatório
 *       500:
 *         description: Erro interno ao criar usuário
 */
router.post("/", createUserController);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Buscar usuário por id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/:id", getUserByIdController);

/**
 * @swagger
 * /users/telegram/{telegram_chat_id}:
 *   get:
 *     summary: Buscar usuário por telegram_chat_id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: telegram_chat_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 123456789
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Chat Id inválido
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/telegram/:telegram_chat_id", getUserByTelegramChatIdController);

export default router;