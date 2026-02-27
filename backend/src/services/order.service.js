import { 
    addOrderItem as addOrderItemRepo,
    createOrder as createOrderRepo,
    getOrderItems as getOrderItemsRepo,
    getOrder as getOrderRepo,
    updateOrder as updateOrderRepo,
} from "../repositories/order.repository.js"

function formatOrder(order) {
    return {
        id: order.id,
        order_number: order.order_number,
        address: order.address,
        status: order.status,
        total_price: order.total_price,
        payment: order.payment,
        change_for: order.change_for,
        observation: order.observation,
        created_at: order.created_at,
        updated_at: order.updated_at
    }   
}

function formatItem(item) {
    return {
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        total_price: item.total_price,
        unit_price: item.unit_price,
        created_at: item.created_at
    }   
}


export async function createOrder() {
    try {
        const order = await createOrderRepo();

        return formatOrder(order);

    } catch (error) {
        throw new AppError("Erro ao criar pedido", 500);
    }
}

export async function getOrder(id) {
    if (!id)
        throw new AppError("Id inválido", 400);

    const order = await getOrderRepo(id);

    if (!order)
        throw new AppError("Pedido não encontrado", 404);

    return formatOrder(order);
}

export async function updateOrder(
    id,
    { address = null, payment = null, change_for = null, observation = null, status = null }
) {
    if (!id)
        throw new AppError("Id inválido", 400);

    try {
        const order = await updateOrderRepo(id, {
            address,
            payment,
            change_for,
            observation,
            status
        });

        if (!order)
            throw new AppError("Pedido não encontrado", 404);

        return formatOrder(order);

    } catch (error) {

        if (error.code === "22P02") {
            throw new AppError("Valor inválido para status ou pagamento", 400);
        }

        throw new AppError("Erro ao atualizar pedido", 500);
    }
}

export async function addOrderItem({ orderId, productId, quantity, unit_price }) {
    if (!orderId || !productId)
        throw new AppError("Pedido e produto são obrigatórios", 400);

    if (!quantity || quantity <= 0)
        throw new AppError("Quantidade inválida", 400);

    if (!unit_price || unit_price < 0)
        throw new AppError("Preço unitário inválido", 400);

    const total_price = unit_price * quantity;

    try {
        const item = await addOrderItemRepo({
            orderId,
            productId,
            quantity,
            unit_price,
            total_price
        });

        return formatItem(item);

    } catch (error) {

        if (error.code === "23503") {
            throw new AppError("Pedido ou produto não encontrado", 404);
        }

        if (error.code === "23514") {
            throw new AppError("Quantidade inválida", 400);
        }

        throw new AppError("Erro ao adicionar item ao pedido", 500);
    }
}

export async function getOrderItems(orderId) {
    if (!orderId)
        throw new AppError("Id do pedido inválido", 400);

    const items = await getOrderItemsRepo(orderId);

    return items.map(formatItem);
}