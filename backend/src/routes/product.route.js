import { Router } from "express";
import { 
    createProductController, 
    deleteProductsController, 
    getProductsController, 
    updateProductController 
} from "../controllers/product.controller";

const router = Router();

router.post("/", createProductController);

router.get("/", getProductsController);

router.patch("/:id", updateProductController);

router.delete("/:id", deleteProductsController);

export default router;