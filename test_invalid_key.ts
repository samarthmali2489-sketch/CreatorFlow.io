import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({ apiKey: "AIzaSyCWbAtuaX_VTevt84d2_FQkB6p3OFBgJr8" }); // The key the user provided
  try {
    const res = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: "Hello",
      });
    console.log("Success!");
  } catch (e: any) {
    console.error("Failed! Message:", e.message);
  }
}

test();
