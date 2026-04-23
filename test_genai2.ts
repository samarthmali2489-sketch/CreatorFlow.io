import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({});
  try {
    const res = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: "Hello",
        config: {
          responseMimeType: 'application/json',
          tools: [{ googleSearch: {} }]
        }
      });
    console.log("Success!");
  } catch (e: any) {
    console.error("Failed!", e.message);
  }
}

test();
