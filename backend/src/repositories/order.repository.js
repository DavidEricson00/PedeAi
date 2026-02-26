import pool from "../config/db.js";

export async function createOrder({ adress, payment, change_for=null, observation=null }) {
    const { rows } = await pool.query(
    `
        INSERT INTO orders (adress, payment, change_for, observation)
        VALUES($1, $2, $3, $4)
        RETURNING *
    `,
    [adress, payment, change_for, observation]
    );
    return rows[0];
}

export async function getOrder(id) {
    const { rows } = await pool.query(
    `
        SELECT * FROM orders
        WHERE id = $1
    `,
    [id]
    );
    return rows;
}

export async function changeOrderStatus(id, { status }) {
    const { rows } = await pool.query(
    `
        UPDATE orders
        SET
            status = COALESCE($2, status)
        WHERE id = $1
        RETURNING *
    `,
    [id, status]
    );
    return rows[0];
}

export async function addOrderItem({ orderId, productId, quantity, unit_price, total_price }) {
    const { rows } = await pool.query(
    `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
        VALUES($1, $2, $3, $4)
        RETURNING *
    `,
    [orderId, productId, quantity, unit_price, total_price]
    );
    return rows[0];
}

export async function getOrderItems(orderId) {
    const { rows } = await pool.query (
        `
            SELECT * FROM order_items
            WHERE order_id = $1
        `,
        [orderId]
    );
    return rows;
}