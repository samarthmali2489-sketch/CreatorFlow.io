import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.TONY_THE_KEY }); 
  console.log("Using key:", process.env.TONY_THE_KEY?.substring(0, 10) + "...");
  try {
    const res = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: "Hello! Just reply 'Key is active!' if you receive this.",
      });
    console.log("Success! Model response:", res.text);
  } catch (e: any) {
    console.error("Failed! Message:", e.message);
  }
}

test();
