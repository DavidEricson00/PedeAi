import { Router } from "express";
import { 
    createProductController, 
    deleteProductsController, 
    getProductsController, 
    updateProductController 
} from "../controllers/product.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Criar produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: X-Burger
 *               price:
 *                 type: number
 *                 example: 29.90
 *               category_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno ao criar produto
 */
router.post("/", createProductController);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Listar produtos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: active
 *         required: false
 *         schema:
 *           type: boolean
 *         example: true
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Parâmetro inválido
 */
router.get("/", getProductsController);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Atualizar produto
 *     tags: [Products]
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
 *               name:
 *                 type: string
 *                 example: X-Burger Especial
 *               price:
 *                 type: number
 *                 example: 34.90
 *               category_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Produto ou categoria não encontrada
 *       500:
 *         description: Erro ao atualizar produto
 */
router.patch("/:id", updateProductController);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Deletar produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Produto deletado com sucesso
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Produto não encontrado
 *       409:
 *         description: Produto vinculado a pedido
 *       500:
 *         description: Erro ao deletar produto
 */
router.delete("/:id", deleteProductsController);

export default router;