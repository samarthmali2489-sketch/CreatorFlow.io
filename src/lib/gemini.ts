/**
 * Transparent frontend proxy for GoogleGenAI.
 * Keeps the API key securely on the backend while allowing frontend components
 * to use the exact same SDK syntax without modification.
 */
export class GoogleGenAI {
  constructor(options?: { apiKey?: string }) {
     // Ignore passed keys; the backend uses its own securely stored TONY_THE_KEY
  }
  
  models = {
    generateContent: async (params: any) => {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      
      if (!res.ok) {
        let msg = 'Failed to generate content';
        try { 
          const err = await res.json(); 
          msg = err.error || msg; 
        } catch(e) {}
        throw new Error(msg);
      }
      
      const payload = await res.json();
      
      // Reconstruct the response object for the frontend expectations
      return {
        ...payload,
        text: () => {
          if (payload.candidates?.[0]?.content?.parts) {
             return payload.candidates[0].content.parts.map((p: any) => p.text || '').join("");
          }
          return "";
        }
      };
    }
  };
}

export const getGeminiApiKey = (): string => {
  // We no longer need to check for a client-side key, as it's handled on the backend.
  // We return a dummy string to bypass client-side checks in the templates.
  return 'backend-proxy';
};
