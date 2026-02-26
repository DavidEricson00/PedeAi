import { 
    createCategory as createCategoryRepo,
    deleteCategory as deleteCategoryRepo,
    getCategories as getCategoriesRepo,
    updateCategory as updateCategoryRepo,
} from "../repositories/category.repository";

function formatCategory(category) {
    return {
        id: category.id,
        name: category.name,
        created_at: category.created_at
    };
}

export async function createCategory({name}) {
    if (!name) throw new Error("Dados inválidos");

    const category = await createCategoryRepo({ name });

    if(!category) throw new Error("Não foi possível criar a categoria");

    return formatCategory(category);
}

export async function getCategories() {
    const categories = await getCategoriesRepo();

    if (categories.length === 0) return [];

    return categories.map(formatCategory);
}

export async function updateCategory(id, {name}) {
    if (!id) throw new Error("Dados inválidos");

    const category = await updateCategoryRepo(id,{name});

    if(!category) throw new Error("Não foi possível atualizar a categoria");

    return formatCategory(category)
}

export async function deleteCategory(id) {
    if (!id) throw new Error("Dados inválidos");

    const deleted = await deleteCategoryRepo(id);

    if (!deleted) throw new Error("Categoria não encontrada");
}