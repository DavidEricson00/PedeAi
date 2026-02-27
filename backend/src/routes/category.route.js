import { Router } from "express";
import { createCategoryController, 
    deleteCategoryController, 
    getCategoriesController, 
    updateCategoryController 
} from "../controllers/category.controller.js";
import { 
    getProductsByCategoryController 
} from "../controllers/product.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gerenciamento de categorias
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Criar categoria
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bebidas
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Nome é obrigatório
 *       409:
 *         description: Categoria já existe
 *       500:
 *         description: Erro interno ao criar categoria
 */
router.post("/", createCategoryController);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Listar categorias
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Erro interno
 */
router.get("/", getCategoriesController);

/**
 * @swagger
 * /categories/{category_id}/products:
 *   get:
 *     summary: Listar produtos por categoria
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de produtos da categoria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno
 */
router.get("/:category_id/products/", getProductsByCategoryController);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Atualizar categoria
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Lanches
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Id inválido ou nome obrigatório
 *       404:
 *         description: Categoria não encontrada
 *       409:
 *         description: Já existe uma categoria com esse nome
 *       500:
 *         description: Erro ao atualizar categoria
 */
router.patch("/:id", updateCategoryController);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Deletar categoria
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Categoria deletada com sucesso
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro ao deletar categoria
 */
router.delete("/:id", deleteCategoryController);

export default router;