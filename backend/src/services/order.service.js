import { 
    addOrderItem as addOrderItemRepo,
    createOrder as createOrderRepo,
    getOrderItems as getOrderItemsRepo,
    getOrder as getOrderRepo,
    updateOrder as updateOrderRepo,
} from "../repositories/order.repository"

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
    const order = await createOrderRepo();

    if(!order) throw new Error("Não foi possível criar a ordem");

    return formatOrder(order);
}

export async function getOrder(id) {
    if (!id) throw new Error("Dados inválidos");

    const order = await getOrderRepo(id);

    if(!order) throw new Error("Não foi possível encontrar a ordem");

    return formatOrder(order);
}

export async function updateOrder(id, {address = null, payment = null, change_for = null, observation = null, status=null}) {
    if (!id) throw new Error("Dados inválidos");

    const order = await updateOrderRepo(id, {
        address,
        payment,
        change_for,
        observation,
        status
    });

    
    if(!order) throw new Error("Não foi possível atualizar a ordem");

    return formatOrder(order);
}

export async function addOrderItem({orderId, productId, quantity, unit_price}) {
    if (!orderId || !productId || !quantity || !unit_price ) throw new Error("Dados inválidos");

    const total_price = unit_price * quantity

    const item = await addOrderItemRepo({
        orderId,
        productId,
        quantity,
        unit_price,
        total_price
    })

    if(!item) throw new Error("Não foi possível criar o item");

    return formatItem(item);
}

export async function getOrderItems(orderId) {
    if (!orderId) throw new Error("Dados inválidos");

    const items = await getOrderItemsRepo(orderId);

    if (items.length === 0) return [];

    return items.map(formatItem);
}