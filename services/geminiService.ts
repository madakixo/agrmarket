
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client according to strict guidelines
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateListingDetails = async (title: string, category: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a compelling marketplace listing description for ${title} under the category ${category}. Focus on freshness, quality, and farming methods. Also suggest a competitive price range per kg.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          suggestedPriceRange: { type: Type.STRING },
          marketingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["description", "suggestedPriceRange"]
      }
    }
  });
  
  // Directly access the text property as per extraction rules
  return JSON.parse(response.text || '{}');
};

export const getMarketAdvice = async (query: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an expert agricultural market advisor. Answer the following farmer query: "${query}". Provide specific, actionable advice about crop timing, pricing trends, or pest management.`,
  });
  
  // Directly access the text property as per extraction rules
  return response.text;
};
