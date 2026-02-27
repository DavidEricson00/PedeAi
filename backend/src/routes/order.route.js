import { Router } from "express";
import { 
    addOrderItemController,
    createOrderController,
    getOrderController,
    getOrderItemsController,
    updateOrderController
} from "../controllers/order.controller.js";

const router = Router();

router.post("/", createOrderController);
router.post("/:orderId/items", addOrderItemController);

router.get("/:id", getOrderController);
router.get("/:orderId/items", getOrderItemsController)

router.patch("/:id", updateOrderController);

export default router;