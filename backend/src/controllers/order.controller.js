import { 
    createOrder, 
    updateOrder, 
    getOrder, 
    addOrderItem,
    getOrderItems
} from "../services/order.service.js";

export async function createOrderController(req, res, next) {
    try {
        const { user_id } = req.body;
        const order = await createOrder(user_id);

        return res.status(201).json(order);
    } catch(error) {
        next(error);
    }
}

export async function getOrderController(req, res, next) {
    try {
        const { id } = req.params;

        const order = await getOrder(id);

        return res.status(200).json(order);
    } catch(error) {
        next(error);
    }
}

export async function updateOrderController(req, res, next) {
    try {
        const { id } = req.params;
        const { address, payment, change_for, observation, status } = req.body;

        const order = await updateOrder(id,{
            address,
            payment,
            change_for,
            observation,
            status
        });

        return res.status(200).json(order);
    } catch(error) {
        next(error);
    }
}

export async function addOrderItemController(req, res, next) {
    try {
        const { orderId } = req.params;
        const { productId, quantity, unit_price } = req.body;

        const order = await addOrderItem({
            orderId, 
            productId, 
            quantity, 
            unit_price
        });

        res.status(200).json(order);
    } catch(error) {
        next(error);
    }
}

export async function getOrderItemsController(req, res, next) {
    try {
        const { orderId } = req.params;

        const items = await getOrderItems(orderId);

        return res.status(200).json(items);
    } catch(error) {
        next(error);
    }
}