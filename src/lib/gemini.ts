export const getGeminiApiKey = (): string => {
  // Securely retrieve the key from environment variables.
  // 1. Checks for the specific key named "tony the key" (VITE_TONY_THE_KEY)
  // 2. Falls back to standard platform key
  const apiKey = import.meta.env.VITE_TONY_THE_KEY 
    || process.env.GEMINI_API_KEY 
    || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("API key is missing. Please add VITE_TONY_THE_KEY to your environment variables or select an API key from the platform.");
  }
  
  return apiKey || '';
};
