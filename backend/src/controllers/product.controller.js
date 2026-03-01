import { 
    createProduct, 
    deleteProduct, 
    getProducts, 
    getProductsByCategory, 
    updateProduct 
} from "../services/product.service.js"

function parseBoolean(value) {
    if (value === undefined) return undefined;
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
}

export async function createProductController(req, res, next) {
    try {
        const { name, price, category_id } = req.body;
        const product = await createProduct({
            name, 
            price, 
            category_id
        });

        return res.status(201).json(product);
    } catch(error) {
        next(error);
    }
}

export async function getProductsController(req, res, next) {
    try {
        const active = parseBoolean(req.query.active);

        const products = await getProducts(active);

        return res.status(200).json(products);
    } catch(error) {
        next(error);
    }
}

export async function updateProductController(req, res, next) {
    try {
        const { id } = req.params;
        const { name, price, category_id } = req.body;

        const product = await updateProduct(id, {
            name, 
            price, 
            category_id
        });

        return res.status(200).json(product);
    } catch(error) {
        next(error);
    }
}

export async function deleteProductsController(req, res, next) {
    try {
        const { id } = req.params;

        await deleteProduct(id);

        return res.sendStatus(204);
    } catch(error) {
        next(error);
    }
}

export async function getProductsByCategoryController(req, res, next) {
    try {
        const { category_id } = req.params;
        const active = parseBoolean(req.query.active);

        const products = await getProductsByCategory(category_id, active);

        return res.status(200).json(products);
    } catch(error) {
        next(error);
    }
}