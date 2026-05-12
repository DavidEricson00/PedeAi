import pool from "./db.js";

const categories = [
  "Pizzas Brotinho",
  "Bebidas",
  "Sobremesas"
];

const products = [
  { name: "Brotinho Calabresa", price: 24.9, category: "Pizzas Brotinho" },
  { name: "Brotinho Mussarela", price: 22.9, category: "Pizzas Brotinho" },
  { name: "Brotinho Frango com Catupiry", price: 27.9, category: "Pizzas Brotinho" },
  { name: "Brotinho Portuguesa", price: 28.9, category: "Pizzas Brotinho" },
  { name: "Brotinho Quatro Queijos", price: 29.9, category: "Pizzas Brotinho" },
  { name: "Brotinho Bacon", price: 30.9, category: "Pizzas Brotinho" },
  { name: "Brotinho Chocolate", price: 26.9, category: "Pizzas Brotinho" },
  { name: "Brotinho Romeu e Julieta", price: 27.9, category: "Pizzas Brotinho" },

  { name: "Coca-Cola 350ml", price: 6.5, category: "Bebidas" },
  { name: "Guaraná Antarctica 350ml", price: 6.0, category: "Bebidas" },
  { name: "Fanta Laranja 350ml", price: 6.0, category: "Bebidas" },
  { name: "Água Mineral", price: 4.5, category: "Bebidas" },

  { name: "Pudim", price: 10.9, category: "Sobremesas" },
  { name: "Mousse de Chocolate", price: 12.9, category: "Sobremesas" }
];

async function seed() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const name of categories) {
      await client.query(
        `
        INSERT INTO categories (name)
        VALUES ($1::varchar)
        ON CONFLICT (name) DO NOTHING
        `,
        [name]
      );
    }

    for (const product of products) {
      const categoryRes = await client.query(
        `
        SELECT id
        FROM categories
        WHERE name = $1::varchar
        LIMIT 1
        `,
        [product.category]
      );

      if (categoryRes.rows.length === 0) {
        throw new Error(`Categoria não encontrada: ${product.category}`);
      }

      const categoryId = categoryRes.rows[0].id;

      await client.query(
        `
        INSERT INTO products (name, price, category_id, active)
        SELECT
          $1::varchar,
          $2::numeric,
          $3::int,
          TRUE
        WHERE NOT EXISTS (
          SELECT 1
          FROM products
          WHERE name = $1::varchar
            AND category_id = $3::int
        )
        `,
        [product.name, product.price, categoryId]
      );
    }

    await client.query("COMMIT");

    console.log("Seed concluído com sucesso.");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Erro no seed:", error.message);

    process.exitCode = 1;
  } finally {
    client.release();

    await pool.end();
  }
}

seed();