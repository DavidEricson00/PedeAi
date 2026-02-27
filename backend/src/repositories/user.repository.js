import pool from "../config/db.js";

export async function createUser({ telegram_chat_id }) {
    const { rows } = await pool.query(
        `
        INSERT INTO users (telegram_chat_id)
        VALUES($1)
        ON CONFLICT (telegram_chat_id) DO NOTHING
        RETURNING *
        `,
        [telegram_chat_id]
    );

    return rows[0];
}

export async function getUserById(id) {
    const { rows } = await pool.query(
    `
        SELECT * FROM users
        WHERE id = $1
    `,
    [id]
    );
    return rows;
}

export async function getUserByTelegramChatId(telegram_chat_id) {
    const { rows } = await pool.query(
        `
        SELECT *
        FROM users
        WHERE telegram_chat_id = $1
        `,
        [telegram_chat_id]
    );

    return rows[0];
}