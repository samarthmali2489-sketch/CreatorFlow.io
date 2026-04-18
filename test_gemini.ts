import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const res = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Hello!'
    });
    console.log("gemini-3-flash-preview SUCCESS:", res.text);
  } catch (e: any) {
    console.error("gemini-3-flash-preview FAILED:", e.message);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const res = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: 'Hello!'
    });
    console.log("gemini-flash-latest SUCCESS:", res.text);
  } catch (e: any) {
    console.error("gemini-flash-latest FAILED:", e.message);
  }
}

test();
