import { Router } from "express";
import { createCategoryController, 
    deleteCategoryController, 
    getCategoriesController, 
    updateCategoryController 
} from "../controllers/category.controller.js";
import { 
    getProductsByCategoryController 
} from "../controllers/product.controller.js";

const router = Router();

router.post("/", createCategoryController);

router.get("/", getCategoriesController);
router.get("/:category_id/products/", getProductsByCategoryController);

router.patch("/:id", updateCategoryController);

router.delete("/:id", deleteCategoryController);

export default router;