import { AppError } from "../utils/AppError.js";
import { 
    createUser as createUserRepo, 
    getUserById as getUserByIdRepo,
    getUserByTelegramChatId as getUserByTelegramChatIdRepo
} from "../repositories/user.repository.js";

function formatUser(user) {
    return {
        id: user.id,
        telegram_chat_id: user.telegram_chat_id,
        created_at: user.created_at
    };
}

export async function createUser({ telegram_chat_id }) {
    if (!telegram_chat_id)
        throw new AppError("Chat id é obrigatório", 400);

    try {
        let user = await getUserByTelegramChatIdRepo(telegram_chat_id);

        if (!user) {
            user = await createUserRepo({ telegram_chat_id });
        }

        return formatUser(user);

    } catch (error) {
        throw new AppError("Erro interno ao criar usuário", 500);
    }
}

export async function getUserById(id) {
    if (!id)
        throw new AppError("Id inválido", 400);

    const user = await getUserByIdRepo(id);

    if (!user)
        throw new AppError("Usuário não encontrado", 404);

    return formatUser(user);
}

export async function getUserByTelegramChatId(telegram_chat_id) {
    if (!telegram_chat_id)
        throw new AppError("Chat Id inválido", 400);

    const user = await getUserByTelegramChatIdRepo(telegram_chat_id);

    if (!user)
        throw new AppError("Usuário não encontrado", 404);

    return formatUser(user);
}