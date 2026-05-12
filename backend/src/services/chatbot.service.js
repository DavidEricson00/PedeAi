import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAllProductsForContext } from "../repositories/chatbot.repository.js";
import { AppError } from "../utils/AppError.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function buildMenuContext() {
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
    
    return menuText;
}

export async function chatWithGemini(userMessage) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new AppError("Chave de API do Gemini não configurada", 500);
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const menuContext = await buildMenuContext();
        
        const systemPrompt = `Você é um assistente de atendimento de um restaurante/lanchonete chamado PedeAi.
Sua função é ajudar clientes com informações sobre o cardápio e responder dúvidas.

${menuContext}

IMPORTANTE:
- Responda APENAS sobre itens do cardápio acima
- Se perguntarem sobre produtos não listados, diga que não temos
- Seja amigável e atencioso
- Respostas em português
- Se perguntarem como pedir, explique que devem usar o contato do telegram
- Sempre mencione os preços quando sugerir produtos
- Escreva em texto plano, sem markdown, sem asteriscos, sem negrito, sem listas com traços, sem qualquer formatação especial`;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Entendido! Sou o assistente do PedeAi. Como posso ajudá-lo?" }],
                },
            ],
        });

        const result = await chat.sendMessage(userMessage);
        const response = result.response;
        const text = response.text();

        return {
            success: true,
            message: text,
            timestamp: new Date(),
        };
    } catch (error) {
        console.error("Erro ao chamar Gemini:", error);
        throw new AppError(
            "Erro ao processar sua pergunta. Tente novamente.",
            500
        );
    }
}