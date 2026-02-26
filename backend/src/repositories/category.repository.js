import pool from "../config/db.js";

export async function createCategory({name}) {
    const { rows } = await pool.query(
    `
        INSERT INTO categories (name)
        VALUES($1)
        RETURNING *
    `,
    [name]
    );
    return rows[0];
}

export async function getCategories() {
    const { rows } = await pool.query(
    `
        SELECT * FROM categories
    `
    );
    return rows;
}

export async function updateCategory(id, { name = null }) {
    const { rows } = await pool.query(
    `
        UPDATE categories
        SET
            name = COALESCE($2, name)
        WHERE id = $1
        RETURNING *
    `,
    [id, name]
    );
    return rows[0];
}

export async function deleteCategory(id) {
    const { rowCount } = await pool.query(
    `
        DELETE FROM categories
        WHERE id = $1
    `,
    [id]
    );

    return rowCount > 0;
}