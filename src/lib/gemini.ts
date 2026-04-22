export const getGeminiApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const savedSettings = localStorage.getItem('creatorflow_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.geminiApiKey && parsed.geminiApiKey.trim() !== '') {
          return parsed.geminiApiKey.trim();
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }
  
  // Fallback to process.env (AI Studio environment)
  const envKey = process.env.GEMINI_API_KEY;
  if (envKey && envKey.trim() !== '') {
    return envKey.trim();
  }
  
  return '';
};
