import { 
    createCategory as createCategoryRepo,
    deleteCategory as deleteCategoryRepo,
    getCategories as getCategoriesRepo,
    updateCategory as updateCategoryRepo,
} from "../repositories/category.repository.js";
import { AppError } from "../utils/AppError.js";

function formatCategory(category) {
    return {
        id: category.id,
        name: category.name,
        created_at: category.created_at
    };
}

export async function createCategory({name}) {
    if (!name)
        throw new AppError("Nome é obrigatório", 400);

    try {
        const category = await createCategoryRepo({ name });

        return formatCategory(category);
    } catch (error) {
        if (error.code === "23505") {
            throw new AppError("Categoria já existe", 409);
        }
        throw new AppError("Erro interno ao criar categoria", 500);
    }
}

export async function getCategories() {
    const categories = await getCategoriesRepo();

    if (categories.length === 0) return [];

    return categories.map(formatCategory);
}

export async function updateCategory(id, { name }) {
    if (!id)
        throw new AppError("Id inválido", 400);
    if (!name)
        throw new AppError("Nome é obrigatório", 400);

    try {
        const category = await updateCategoryRepo(id, { name });
        
        if (!category)
            throw new AppError("Categoria não encontrada", 404);
        
        return formatCategory(category);
    } catch (error) {
        if (error.code === "23505") {
            throw new AppError("Já existe uma categoria com esse nome", 409);
        }
        throw error;
    }
}

export async function deleteCategory(id) {
    if (!id)
        throw new AppError("Id inválido", 400);
    try {
        const deleted = await deleteCategoryRepo(id);

        if (!deleted)
            throw new AppError("Categoria não encontrada", 404);
    } catch (error) {
        throw new AppError("Erro ao deletar categoria", 500);
    }
}