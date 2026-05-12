import { chatWithGemini } from "../services/chatbot.service.js";
import { AppError } from "../utils/AppError.js";

export async function askChatbot(req, res, next) {
    try {
        const { message } = req.body;

        if (!message) {
            throw new AppError("Mensagem é obrigatória", 400);
        }

        if (typeof message !== "string" || message.trim().length === 0) {
            throw new AppError("Mensagem inválida", 400);
        }

        const response = await chatWithGemini(message);

        res.json(response);
    } catch (error) {
        next(error);
    }
}