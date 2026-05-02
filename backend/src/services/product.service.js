import redis from "../config/redis.js";
import { 
    createProduct as createProductRepo,
    deleteProduct as deleteProductRepo,
    getProductsByCategory as getProductsByCategoryRepo,
    getProducts as getProductsRepo,
    updateProduct as updateProductRepo,
} from "../repositories/product.repository.js";
import { AppError } from "../utils/AppError.js";

function formatProduct(product) {
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        category_id: product.category_id,
        active: product.active,
        created_at: product.created_at
    }   
}

export async function createProduct({ name, price, category_id }) {
    if (!name)
        throw new AppError("Nome é obrigatório", 400);

    if (typeof price !== "number" || price < 0)
        throw new AppError("Preço inválido", 400);

    if (!category_id)
        throw new AppError("Categoria é obrigatória", 400);

    try {
        const product = await createProductRepo({
            name,
            price,
            category_id
        });

        await redis.del("products:active=true");
        await redis.del("products:active=false");
        await redis.del("products:active=undefined");

        return formatProduct(product);
    } catch (error) {
        if (error.code === "23503") {
            throw new AppError("Categoria não encontrada", 404);
        }

        throw new AppError("Erro interno ao criar produto", 500);
    }
}

export async function getProducts(active) {
    if (active !== undefined && typeof active !== "boolean") {
        throw new AppError("Parâmetro 'active' deve ser boolean", 400);
    }

    const cacheKey = `products:active=${active}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const products = await getProductsRepo(active);
    const formatted = products.map(formatProduct);

    await redis.set(cacheKey, JSON.stringify(formatted), "EX", 300);

    return formatted;
}

export async function updateProduct(id, { name, price, category_id }) {
    if (!id)
        throw new AppError("Id inválido", 400);

    if (price !== undefined && price < 0)
        throw new AppError("Preço inválido", 400);
    
    try {
        const product = await updateProductRepo(id, {
            name,
            price,
            category_id
        });

        if (!product)
            throw new AppError("Produto não encontrado", 404);

        await redis.del("products:active=true");
        await redis.del("products:active=undefined");

        return formatProduct(product);
    } catch (error) {
        if (error.code === "23503") {
            throw new AppError("Categoria não encontrada", 404);
        }
        throw new AppError("Erro ao atualizar produto", 500);
    }
}

export async function deleteProduct(id) {
    if (!id)
        throw new AppError("Id inválido", 400);

    try {
        const deleted = await deleteProductRepo(id);

        if (!deleted)
            throw new AppError("Produto não encontrado", 404);

    } catch (error) {
        if (error instanceof AppError) throw error;

        if (error.code === "23503") {
            throw new AppError("Produto está vinculado a um pedido", 409);
        }

        throw new AppError("Erro ao deletar produto", 500);
    }

    await redis.del("products:active=true");
    await redis.del("products:active=false");
    await redis.del("products:active=undefined");
}

export async function getProductsByCategory(categoryId, active) {
    if (!categoryId)
        throw new AppError("Id da categoria inválido", 400);
    
    if (active !== undefined && typeof active !== "boolean") {
        throw new AppError("Parâmetro 'active' deve ser boolean", 400);
    }

    const cachedKey = `products:categoryId=${categoryId}:active${active}`

    const cached = await redis.get(cachedKey)
    if (cached) {
      return JSON.parse(cached);
    }

    const products = await getProductsByCategoryRepo(categoryId, active);
    const formatted = products.map(formatProduct);

    await redis.set(cachedKey, JSON.stringify(formatted), "EX", 300);

    return formatted;
}