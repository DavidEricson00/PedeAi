import pool from "../config/db.js";

export async function createOrder(user_id) {
    const { rows } = await pool.query(`
        INSERT INTO orders (user_id)
        VALUES ($1)
        RETURNING *
    `, [user_id]);

    return rows[0];
}

export async function getOrder(id) {
    const { rows } = await pool.query(`
        SELECT * FROM orders
        WHERE id = $1
    `, [id]);

    return rows[0];
}

export async function updateOrder(id,{ address = null, payment = null, change_for = null, observation = null, status=null }) {
    const { rows } = await pool.query(`
        UPDATE orders
        SET
            address = COALESCE($2, address),
            payment = COALESCE($3, payment),
            change_for = COALESCE($4, change_for),
            observation = COALESCE($5, observation),
            status = COALESCE($6, status)
        WHERE id = $1
        RETURNING *
    `,
    [id, address, payment, change_for, observation, status]);

    return rows[0];
}

export async function addOrderItem({ orderId, productId, quantity, unit_price, total_price }) {
    const { rows } = await pool.query(`
        INSERT INTO order_items
        (order_id, product_id, quantity, unit_price, total_price)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *
    `,
    [orderId, productId, quantity, unit_price, total_price]);

    return rows[0];
}

export async function getOrderItems(orderId) {
    const { rows } = await pool.query(`
        SELECT *
        FROM order_items
        WHERE order_id = $1
    `,
    [orderId]);

    return rows;
}