import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({ apiKey: "AIzaSyCWbAtuaX_VTevt84d2_FQkB6p3OFBgJr8" }); 
  try {
    const res = await ai.models.generateContent({
        model: 'imagen-3.0-generate-002',
        contents: "Hello",
      });
    console.log("Success!");
  } catch (e: any) {
    console.error("Failed! Message:", e.message);
  }
}

test();
