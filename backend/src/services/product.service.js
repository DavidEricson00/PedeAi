import { 
    createProduct as createProductRepo,
    deleteProduct as deleteProductRepo,
    getProductsByCategory as getProductsByCategoryRepo,
    getProducts as getProductsRepo,
    updateProduct as updateProductRepo,
} from "../repositories/product.repository";

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

export async function createProduct({ name, description, price, category_id }) {
    if (!name || typeof price !== "number" || price < 0 || !category_id ) throw new Error("Dados inválidos");

    const product = await createProductRepo({
        name,
        description,
        price,
        category_id
    })

    if(!product) throw new Error("Não foi possível criar o produto");

    return formatProduct(product);
}

export async function getProducts() {
    const products = await getProductsRepo();

    if (products.length === 0) return [];

    return products.map(formatProduct);
}

export async function updateProduct(id, {name, description, price, category_id}) {
    if (!id || price < 0) throw new Error("Dados inválidos");

    const product = await updateProductRepo(id,{
        name,
        description,
        price,
        category_id
    });

    if(!product) throw new Error("Não foi possível atualizar o produto");

    return formatProduct(product)
}

export async function deleteProduct(id) {
    if (!id) throw new Error("Dados inválidos");

    const deleted = await deleteProductRepo(id);

    if (!deleted) throw new Error("Produto não encontrado");
}

export async function getProductsByCategory(categoryId) {
    if(!categoryId) throw new Error("Dados inválidos")

    const products = await getProductsByCategoryRepo(categoryId);

    if (products.length === 0) return [];

    return products.map(formatProduct);
}