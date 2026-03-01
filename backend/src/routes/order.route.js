import { Router } from "express";
import { 
    addOrderItemController,
    createOrderController,
    getOrderController,
    getOrderItemsController,
    updateOrderController
} from "../controllers/order.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Criar pedido
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: User id inválido
 *       500:
 *         description: Erro ao criar pedido
 */
router.post("/", createOrderController);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Buscar pedido por id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Pedido não encontrado
 */
router.get("/:id", getOrderController);

/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     summary: Atualizar pedido
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 example: Rua A, 123
 *               payment:
 *                 type: string
 *                 enum: [dinheiro, pix, credito, debito]
 *                 example: pix
 *               change_for:
 *                 type: number
 *                 example: 100
 *               observation:
 *                 type: string
 *                 example: Sem cebola
 *               status:
 *                 type: string
 *                 enum: [carrinho, pedido_recebido, em_preparo, a_caminho, finalizado, cancelado]
 *                 example: pedido_recebido
 *     responses:
 *       200:
 *         description: Pedido atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Id inválido ou valor inválido
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao atualizar pedido
 */
router.patch("/:id", updateOrderController);

/**
 * @swagger
 * /orders/{orderId}/items:
 *   post:
 *     summary: Adicionar item ao pedido
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 10
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item adicionado ao pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Pedido ou produto não encontrado
 *       500:
 *         description: Erro ao adicionar item
 */
router.post("/:orderId/items", addOrderItemController);

/**
 * @swagger
 * /orders/{orderId}/items:
 *   get:
 *     summary: Listar itens do pedido
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de itens do pedido
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Id do pedido inválido
 */
router.get("/:orderId/items", getOrderItemsController);

export default router;