# PedeAi

PedeAi is a food ordering automation platform built to explore workflow automation with **n8n** and containerized infrastructure with **Docker**.

The server is built using **Node.js + Express**, communicates with a **PostgreSQL** database, and integrates with **n8n** for intelligent chatbot automation.

## 🚀 Technologies

- Node.js + Express 5
- PostgreSQL 16
- n8n (workflow automation)
- Docker + Docker Compose
- Swagger UI (API docs)
- ngrok (tunnel for Telegram webhook)
- Telegram Bot API (via BotFather)

## 🏗 Architecture

The project follows a layered architecture:

- **Routes** → **Controllers** → **Services** → **Repositories**
- Global error handling via `AppError`
- PostgreSQL connection pool via `pg`
- n8n handles all chatbot logic, connecting to the backend via HTTP

## 🐳 Infrastructure with Docker

All services are orchestrated with **Docker Compose**:

<pre>
services:

  postgres:
    image: postgres:16
    container_name: pedeai-postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database:/docker-entrypoint-initdb.d

  backend:
    build: ./backend
    container_name: pedeai-backend
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: ${DATABASE_URL}

  n8n:
    image: n8nio/n8n
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      N8N_BASIC_AUTH_ACTIVE: true
      N8N_BASIC_AUTH_USER: ${N8N_BASIC_AUTH_USER}
      N8N_BASIC_AUTH_PASSWORD: ${N8N_BASIC_AUTH_PASSWORD}
      N8N_HOST: ${N8N_HOST}
      N8N_PORT: ${N8N_PORT}
      N8N_PROTOCOL: ${N8N_PROTOCOL}
      WEBHOOK_URL: ${WEBHOOK_URL}
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - backend

volumes:
  postgres_data:
  n8n_data:
</pre>

The backend runs on port `3000`, PostgreSQL on port `5432`, and n8n on port `5678`.

## 🤖 n8n Workflow Automation
<div align="center">
<img src="https://i.imgur.com/oRnQ0Fo.png">
</div>

The entire chatbot logic is handled by **n8n**, a visual workflow automation tool.

### How it works

1. The user sends a message to the **Telegram bot**
2. The **Telegram Trigger** node fires in n8n
3. n8n extracts the input, queries the **PostgreSQL session table**, and routes the user through a state machine
4. Depending on the user's current state, n8n calls the backend REST API to read/write data
5. n8n sends responses back to the user via Telegram

### Main Workflow States

| State | Description |
|---|---|
| `main_menu` | User is shown the main menu |
| `awaiting_main_menu_option` | Waiting for the user to pick an option |
| `order_menu` | User is viewing the order/category menu |
| `awaiting_order_menu_option` | Waiting for category or checkout selection |
| `awaiting_product_menu_option` | Waiting for product selection |
| `checkout` | User is providing delivery address |
| `get_order` | User is querying an existing order |

### Workflow Features

- **Session management** via PostgreSQL (`user_sessions` table with JSONB state)
- **Dynamic menus** built at runtime from backend data (categories and products)
- **Options map** stored in session to resolve numbered inputs
- **Order creation and item management** via REST API calls
- **Order status notifications** via n8n webhook → Telegram message

### Order Status Webhook

The backend triggers a webhook to n8n when an order status changes. n8n then sends a Telegram notification to the user:

| Status | Message |
|---|---|
| `pedido_recebido` | 🧾 Order received |
| `em_preparo` | 👨‍🍳 Being prepared |
| `a_caminho` | 🛵 On the way |
| `finalizado` | ✅ Completed |
| `cancelado` | ❌ Cancelled |

## 🗄 Database Schema

The database is initialized automatically via the `./database/init.sql` file mounted into the PostgreSQL container.

### Tables

- `users` — Stores Telegram users (identified by `telegram_chat_id`)
- `categories` — Product categories
- `products` — Products linked to categories, with price and active flag
- `orders` — Orders linked to users, with status, total, address, and payment
- `order_items` — Items within an order (quantity, unit price, total)
- `user_sessions` — n8n chatbot session state per user (JSONB)

### Order Status Enum

<code>carrinho → pedido_recebido → em_preparo → a_caminho → finalizado | cancelado</code>

### Automatic Total Trigger

A PostgreSQL trigger (`trigger_update_order_total`) automatically recalculates `orders.total_price` whenever an `order_item` is inserted, updated, or deleted.

## 📡 REST API

The backend exposes a REST API on port `3000`. Full interactive documentation is available via **Swagger UI** at:

<pre>
http://localhost:3000/docs
</pre>

## 🔌 Telegram + ngrok Setup

The Telegram bot is created via **BotFather**. Since n8n runs locally, **ngrok** is used to expose n8n's webhook endpoint to the internet so Telegram can reach it.

Set the `WEBHOOK_URL` environment variable to your ngrok public URL so n8n can correctly register the Telegram webhook.

## 📦 Installation

**1.** Clone the repository

**2.** Copy the environment file and fill in your values:

<code>cp .env.example .env</code>

**3.** Start all services with Docker Compose:

<code>docker compose up -d --build</code>

**4.** Import the n8n workflow JSON into your n8n instance at `http://localhost:5678`

**5.** Configure your Telegram bot credentials in n8n and activate the workflow

## ⚙️ Environment Variables

<pre>
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DATABASE_URL=postgresql://user:password@postgres:5432/dbname

N8N_BASIC_AUTH_USER=
N8N_BASIC_AUTH_PASSWORD=
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
WEBHOOK_URL=https://your-ngrok-url.ngrok.io
</pre>

## 🎯 Purpose of the Project

PedeAi was built to:

- Practice **n8n workflow automation** with state machines and dynamic menus
- Integrate a **Telegram chatbot** with a real REST API backend
- Manage **containerized infrastructure** with Docker Compose
- Work with **PostgreSQL** including triggers, enums, JSONB, and indexing
- Build a practical, end-to-end food ordering system

## 📌 Notes

- Backend runs with **Node.js ES modules** (`"type": "module"`)
- n8n communicates with the backend via the internal Docker network using `http://backend:3000`
- The database schema is auto-applied on first container startup via `./database/init.sql`
- Swagger docs available at `<backend-address>/docs`
