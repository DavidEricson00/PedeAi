/**
 * @swagger
 * components:
 *   schemas:
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         telegram_chat_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         category_id:
 *           type: integer
 *         active:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         order_number:
 *           type: integer
 *         address:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - carrinho
 *             - pedido_recebido
 *             - em_preparo
 *             - a_caminho
 *             - finalizado
 *             - cancelado
 *         total_price:
 *           type: number
 *         payment:
 *           type: string
 *           enum:
 *             - dinheiro
 *             - pix
 *             - credito
 *             - debito
 *         change_for:
 *           type: number
 *         observation:
 *           type: string
 *         user_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         order_id:
 *           type: integer
 *         product_id:
 *           type: integer
 *         quantity:
 *           type: integer
 *         unit_price:
 *           type: number
 *         total_price:
 *           type: number
 *         created_at:
 *           type: string
 *           format: date-time
 */