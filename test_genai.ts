import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({});
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: "Hello",
    });
    console.log("Success with string!");
  } catch (e: any) {
    console.error("String failed!", e.message);
  }
}

test();
