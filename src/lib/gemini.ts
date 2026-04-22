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

export const generateContentProxy = async (model: string, promptOrContents: any, config: any = {}) => {
  const body: any = { model, config };
  
  if (typeof promptOrContents === 'string') {
    body.prompt = promptOrContents;
  } else {
    body.contents = promptOrContents;
  }

  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let errorMsg = 'Server-side generation failed';
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch (e) {
      // If it's not JSON, it might be an HTML error page
      const text = await response.text();
      if (text.includes('<title>')) {
        errorMsg = `Server error (HTML): ${response.status} ${response.statusText}`;
      } else {
        errorMsg = text || errorMsg;
      }
    }
    throw new Error(errorMsg);
  }

  return await response.json();
};
