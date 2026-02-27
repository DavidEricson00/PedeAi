CREATE TYPE order_status AS ENUM (
    'carrinho',
    'pedido_recebido',
    'em_preparo',
    'a_caminho',
    'finalizado',
    'cancelado'
);

CREATE TYPE payment_type AS ENUM (
    'dinheiro',
    'pix',
    'credito',
    'debito'
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    category_id INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,

    order_number SERIAL UNIQUE,

    address VARCHAR(255),

    status order_status NOT NULL DEFAULT 'carrinho',

    total_price NUMERIC(10,2) NOT NULL DEFAULT 0,

    payment payment_type,

    change_for NUMERIC(10,2),

    observation TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,

    order_id INT NOT NULL,

    product_id INT NOT NULL,

    quantity INT NOT NULL CHECK (quantity > 0),

    unit_price NUMERIC(10,2) NOT NULL,

    total_price NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_products_category
ON products(category_id);

CREATE INDEX idx_order_items_order
ON order_items(order_id);

CREATE INDEX idx_orders_status
ON orders(status);

CREATE INDEX idx_orders_created_at
ON orders(created_at);

CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE orders
    SET total_price = (
        SELECT COALESCE(SUM(total_price), 0)
        FROM order_items
        WHERE order_id = NEW.order_id
    ),
    updated_at = NOW()
    WHERE id = NEW.order_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_update_order_total
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_order_total();