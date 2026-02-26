import pool from "../config/db.js";

export async function createProduct({ name, description=null, price, category_id }) {
    const { rows } = await pool.query(
    `
        INSERT INTO products (name, description, price, category_id)
        VALUES($1, $2, $3, $4)
        RETURNING *
    `,
    [name, description, price, category_id]
    );
    return rows[0];
}

export async function getProducts() {
    const { rows } = await pool.query(
    `
        SELECT * FROM products
    `
    );
    return rows;
}

export async function updateProduct(id, { name=null, description=null, price=null, category_id=null }) {
    const { rows } = await pool.query(
    `
        UPDATE products
        SET
            name = COALESCE($2, name),
            description = COALESCE($3, description),
            price = COALESCE($4, price),
            category_id = COALESCE($5, category_id)
        WHERE id = $1
        RETURNING *
    `,
    [id, name, description, price, category_id]
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

export async function getProductsByCategory(categoryId) {
    const { rows } = await pool.query(
    `
        SELECT * FROM products
        WHERE category_id = $1
    `,
    [categoryId]
    );
    return rows;
}