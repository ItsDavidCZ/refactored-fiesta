import { GoogleGenAI } from "@google/genai";
import { Question } from '../types';

// NOTE: The API key must be available in process.env.API_KEY per instructions.
// If testing locally without process.env, this line will fail or needs a hardcoded key (not recommended).
// For this code generation, we follow strict instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Provides a concise explanation for why an answer is incorrect.
   */
  getExplanation: async (question: Question, selectedAnswer: string): Promise<string> => {
    try {
        const modelId = 'gemini-2.5-flash';
        const prompt = `
        Context: Educational App for Czech Students.
        Question: "${question.otazka}"
        Correct Answer: "${question.spravnaOdpoved}"
        User Selected: "${selectedAnswer}"
        Explanation provided in DB: "${question.vysvetleniChyby}"

        Task: Explain to the student why their answer is wrong and the correct one is right. 
        Use the DB explanation as a base but make it encouraging and clear. Keep it under 50 words.
        Language: Czech.
        `;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
        });

        return response.text || "Omlouváme se, AI vysvětlení není momentálně k dispozici.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Chyba připojení k AI lektorovi.";
    }
  },

  /**
   * Chat interface for the AI Tutor.
   */
  chatWithTutor: async (message: string, history: {role: 'user'|'model', parts: [{text: string}]}[]): Promise<string> => {
    try {
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
        config: {
            systemInstruction: "Jsi nápomocný AI učitel pro české studenty. Vysvětluj látku jasně, trpělivě a používej příklady. Tvá doména je matematika a český jazyk."
        }
      });

      const result = await chat.sendMessage({ message });
      return result.text || "Nerozumím dotazu.";
    } catch (error) {
      console.error("Chat Error:", error);
      return "Momentálně nemohu odpovědět.";
    }
  },

  /**
   * Generates a cheat sheet.
   */
  generateCheatSheet: async (topic: string): Promise<string> => {
      try {
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `Vytvoř stručný přehled (tahák) na téma: ${topic}. Použij odrážky a klíčové pojmy. Jazyk: Čeština.`,
          });
          return response.text || "Chyba generování.";
      } catch (e) {
          return "Chyba generování.";
      }
  }
};
