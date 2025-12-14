import { GoogleGenAI } from "@google/genai";
import { CategoryType } from "../types";

const apiKey = import.meta.env.VITE_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Model configuration
const TEXT_MODEL = 'gemini-2.5-flash';

export const generatePostDraft = async (topic: string, category: CategoryType): Promise<string> => {
  if (!ai) throw new Error("API Key not found");

  const prompt = `Escribe una publicación de blog corta, divertida y atractiva para una red social sobre gestión del tiempo.
  Tema: ${topic}
  Categoría: ${category}
  
  El tono debe ser conversacional, útil y animado. Usa emojis. Máximo 150 palabras.
  No incluyas títulos ni markdown complejo, solo el cuerpo del texto.`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });
    return response.text || "No se pudo generar el contenido.";
  } catch (error) {
    console.error("Error generating post:", error);
    throw error;
  }
};

export const generateAiComment = async (postContent: string, mood: 'supportive' | 'critical' | 'funny'): Promise<string> => {
  if (!ai) throw new Error("API Key not found");

  let instruction = "";
  switch (mood) {
    case 'supportive':
      instruction = "Sé muy alentador, da un consejo positivo extra.";
      break;
    case 'critical':
      instruction = "Juega al abogado del diablo de forma educada, cuestiona la premisa o da un punto de vista opuesto.";
      break;
    case 'funny':
      instruction = "Haz una broma relacionada con el tiempo o una observación irónica divertida.";
      break;
  }

  const prompt = `Responde a esta publicación de blog: "${postContent}".
  Tu rol: Un experto en tiempo (o el Tiempo mismo).
  Instrucción: ${instruction}
  Mantenlo corto (max 2 oraciones) y usa emojis.`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });
    return response.text || "Hmm, el tiempo se me escapó y no pude pensar en nada.";
  } catch (error) {
    console.error("Error generating comment:", error);
    throw error;
  }
};
