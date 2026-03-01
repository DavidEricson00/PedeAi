import pool from "../config/db.js";

export async function createProduct({ name, price, category_id }) {
    const { rows } = await pool.query(
    `
        INSERT INTO products (name, price, category_id)
        VALUES($1, $2, $3)
        RETURNING *
    `,
    [name, price, category_id]
    );
    return rows[0];
}

export async function getProducts(active) {
    let query = `SELECT * FROM products`;
    const values = [];

    if (typeof active === "boolean") {
        query += ` WHERE active = $1`;
        values.push(active);
    }

    const { rows } = await pool.query(query, values);
    return rows;
}

export async function updateProduct(id, { name=null, price=null, category_id=null }) {
    const { rows } = await pool.query(
    `
        UPDATE products
        SET
            name = COALESCE($2, name),
            price = COALESCE($3, price),
            category_id = COALESCE($4, category_id)
        WHERE id = $1
        RETURNING *
    `,
    [id, name, price, category_id]
    );
    return rows[0];
}

export async function deleteProduct(id) {
    const { rowCount } = await pool.query(
    `
        DELETE FROM products
        WHERE id = $1
    `,
    [id]
    );
    return rowCount > 0;
}

export async function getProductsByCategory(categoryId, active) {
    let query = `
    SELECT * FROM products
    WHERE category_id = $1
    `
    const values = [categoryId]

    if (typeof active === "boolean") {
        query += ` AND active = $2`
        values.push(active);
    }

    const {rows} = await pool.query(query, values);
    return rows;
}