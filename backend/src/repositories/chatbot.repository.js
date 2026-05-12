import pool from "../database/db.js";

export async function getAllProductsForContext() {
    const { rows } = await pool.query(`
        SELECT 
            p.id,
            p.name,
            p.price,
            c.name as category
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.active = TRUE
        ORDER BY c.name, p.name
    `);
    return rows;
}

export async function searchProductByName(name) {
    const { rows } = await pool.query(`
        SELECT p.*, c.name as category
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.name ILIKE $1 AND p.active = TRUE
    `, [`%${name}%`]);
    return rows;
}