import { chatWithBot } from "../services/chatbot.service.js";
import { AppError } from "../utils/AppError.js";

export async function askChatbot(req, res, next) {
  try {
    const { message, telegramUserId, establishmentSlug, establishmentName } = req.body;

    if (!message) {
      throw new AppError("Mensagem é obrigatória", 400);
    }

    if (!telegramUserId) {
      throw new AppError("telegramUserId é obrigatório", 400);
    }

    if (!establishmentSlug) {
      throw new AppError("establishmentSlug é obrigatório", 400);
    }

    if (!establishmentName) {
      throw new AppError("establishmentName é obrigatório", 400);
    }

    const response = await chatWithBot(
      message,
      String(telegramUserId),
      establishmentSlug,
      establishmentName
    );

    res.json(response);
  } catch (error) {
    next(error);
  }
}