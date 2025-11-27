import { GoogleGenAI, Type } from "@google/genai";
import { Field, Machine } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFarmData = async (fields: Field[], machines: Machine[]) => {
  const prompt = `
    You are an expert agricultural consultant. Analyze the following farm data:
    
    Fields:
    ${JSON.stringify(fields, null, 2)}
    
    Machinery:
    ${JSON.stringify(machines, null, 2)}
    
    Please provide:
    1. An efficiency score (0-100) based on the ratio of horsepower/equipment to acreage.
    2. A brief summary of the farm's operational capacity.
    3. A list of specific recommendations to improve efficiency or identify missing/redundant equipment.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            efficiencyScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("Error analyzing farm data:", error);
    throw error;
  }
};