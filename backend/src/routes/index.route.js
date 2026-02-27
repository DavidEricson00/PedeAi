import { Router } from "express";
import categoryRouter from "./category.route.js"
import productRouter from "./product.route.js"
import orderRouter from "./order.route.js"
import userRouter from "./user.route.js"

const router = Router();

router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/users", userRouter);

export default router;