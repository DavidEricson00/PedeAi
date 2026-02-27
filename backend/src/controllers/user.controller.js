import { 
    createUser, 
    getUserById, 
    getUserByTelegramChatId
} from "../services/user.service";

export async function createUserController(req, res, next) {
    try {
        const { telegram_chat_id } = req.body;
        const user = await createUser({ telegram_chat_id });

        return res.status(201).json(user);

    } catch (error) {
        next(error);
    }
}

export async function getUserByIdController(req, res, next) {
    try {
        const { id } = req.params;

        const user = await getUserById(id);

        return res.status(200).json(user);
    } catch(error) {
        next(error);
    }
}

export async function getUserByTelegramChatIdController(req, res, next) {
    try {
        const { telegram_chat_id } = req.params;

        const user = await getUserByTelegramChatId(telegram_chat_id);

        return res.status(200).json(user);
    } catch(error) {
        next(error);
    }
}