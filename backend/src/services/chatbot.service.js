import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAllProductsForContext } from "../repositories/chatbot.repository.js";
import { AppError } from "../utils/AppError.js";
import redis from "../config/redis.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const HISTORY_TTL = 10 * 60;
const MAX_HISTORY = 6;
const MENU_CACHE_TTL = 5 * 60;

function sanitizeMessage(message) {
  if (!message || typeof message !== "string") {
    throw new AppError("Mensagem inválida", 400);
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    throw new AppError("Mensagem vazia", 400);
  }

  if (trimmed.length > 500) {
    throw new AppError("Mensagem muito longa (máximo 500 caracteres)", 400);
  }

  const injectionPattern =
    /(ignore (previous|all)|novo sistema|system prompt|you are now|ignore instructions|forget everything)/i;
  if (injectionPattern.test(trimmed)) {
    throw new AppError("Mensagem inválida", 400);
  }

  return trimmed;
}

async function buildMenuContext(establishmentSlug) {
  const cacheKey = `chatbot:menu:${establishmentSlug}`;

  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  const products = await getAllProductsForContext();

  let menuText = "CARDÁPIO DISPONÍVEL:\n\n";
  let currentCategory = null;

  for (const product of products) {
    if (product.category !== currentCategory) {
      currentCategory = product.category;
      menuText += `\n${currentCategory}:\n`;
    }
    menuText += `- ${product.name}: R$ ${parseFloat(product.price).toFixed(2)}\n`;
  }

  await redis.set(cacheKey, menuText, "EX", MENU_CACHE_TTL);

  return menuText;
}

export async function invalidateChatbotMenuCache(establishmentSlug) {
  await redis.del(`chatbot:menu:${establishmentSlug}`);
}

async function getHistory(telegramUserId) {
  const raw = await redis.get(`chat:history:${telegramUserId}`);
  return raw ? JSON.parse(raw) : [];
}

async function saveHistory(telegramUserId, history) {
  const trimmed = history.slice(-MAX_HISTORY);
  await redis.set(
    `chat:history:${telegramUserId}`,
    JSON.stringify(trimmed),
    "EX",
    HISTORY_TTL
  );
}

async function checkRateLimit(telegramUserId) {
  const key = `chatbot:ratelimit:${telegramUserId}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60);
  if (count > 8) {
    throw new AppError("Muitas mensagens enviadas. Aguarde um momento.", 429);
  }
}

function buildSystemPrompt(menuContext, establishmentName) {
  return `Você é um assistente de atendimento via Telegram do estabelecimento "${establishmentName}".

${menuContext}

REGRAS:
- Você representa o estabelecimento "${establishmentName}", nunca mencione o sistema PedeAi
- Responda de forma direta e completa, pois o usuário pode não responder de volta
- Nunca termine respostas com perguntas como "posso ajudar em mais algo?" ou similares
- Nunca use markdown, asteriscos, negrito, itálico ou traços para listas
- Se o produto não está no cardápio, diga claramente que não temos esse item
- Sempre mencione o preço ao falar de qualquer produto
- Para realizar pedidos, o usuário deve usar o menu interativo do Telegram
- Responda APENAS dúvidas sobre o cardápio e o funcionamento do restaurante
- Respostas em português, tom amigável e objetivo`;
}

export async function chatWithBot(
  userMessage,
  telegramUserId,
  establishmentSlug,
  establishmentName
) {
  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("Chave de API do Gemini não configurada", 500);
  }

  const sanitized = sanitizeMessage(userMessage);

  await checkRateLimit(telegramUserId);

  const [menuContext, history] = await Promise.all([
    buildMenuContext(establishmentSlug),
    getHistory(telegramUserId),
  ]);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: buildSystemPrompt(menuContext, establishmentName) }],
      },
      {
        role: "model",
        parts: [{ text: `Entendido! Sou o assistente do ${establishmentName}. Como posso ajudar?` }],
      },
      ...history,
    ],
  });

  let text;

  try {
    const result = await chat.sendMessage(sanitized);
    text = result.response.text();
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    throw new AppError("Erro ao processar sua mensagem. Tente novamente.", 500);
  }

  await saveHistory(telegramUserId, [
    ...history,
    { role: "user", parts: [{ text: sanitized }] },
    { role: "model", parts: [{ text: text }] },
  ]);

  return {
    success: true,
    message: text,
    timestamp: new Date(),
  };
}