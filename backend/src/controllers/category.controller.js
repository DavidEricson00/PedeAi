import { 
    createCategory, 
    deleteCategory, 
    getCategories, 
    updateCategory
} from "../services/category.service.js";

export async function createCategoryController(req, res, next) {
    try {
        const { name } = req.body;
        const category = await createCategory({ name });

        return res.status(201).json(category);

    } catch (error) {
        next(error);
    }
}

export async function getCategoriesController(req, res, next) {
    try {
        const categories = await getCategories();

        return res.status(200).json(categories);
    
    } catch (error) {
        next(error);
    }
}

export async function updateCategoryController(req, res, next) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await updateCategory(id, {name})

        return res.status(200).json(category);

    } catch(error) {
        next(error)
    }
}

export async function deleteCategoryController(req, res, next) {
    try {
        const {id} = req.params;
        await deleteCategory(id);

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}