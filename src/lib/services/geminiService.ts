import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getShoppingAssistance = async (
  userMessage: string,
  history: { role: string; text: string }[]
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct a context-aware prompt
    const systemInstruction = `You are "SwiftBot", a helpful, witty, and knowledgeable shopping assistant for SwiftMart. 
    SwiftMart sells high-quality electronics, fashion, and accessories.
    Your goal is to help users find products, answer questions about shipping (which is free over $50), and provide style or tech advice.
    Keep your answers concise (under 100 words) and use emojis to be friendly.
    If asked about products, assume we have the latest iPhone, high-end laptops, and premium fashion items.
    `;

    const contents = [
      { role: 'user', parts: [{ text: systemInstruction }] }, // Prime the conversation
      ...history.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      })),
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    const response = await ai.models.generateContent({
      model,
      contents: contents as any, // Type cast for simplified history structure
    });

    return response.text || "I'm having a bit of trouble connecting to the warehouse right now. Try again?";
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Oops! My brain circuits are a bit crossed. Please try again later.";
  }
};
