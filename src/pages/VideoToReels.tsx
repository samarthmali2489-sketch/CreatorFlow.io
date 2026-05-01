import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { GoogleGenAI, getGeminiApiKey } from '../lib/gemini';
import { GeneratingAnimation } from '../components/GeneratingAnimation';

export default function VideoToReels() {
  const { addVideoProcessed, profiles, savedReels, saveReel, deductCredits } = useAppContext();
  const [url, setUrl] = useState('');
  const [inputMode, setInputMode] = useState<'drop' | 'url'>('drop');
  
  // Settings State
  const [faceTracking, setFaceTracking] = useState('Active Speaker');
  const [captionStyle, setCaptionStyle] = useState('double');
  const [exports, setExports] = useState({
    tiktok: true,
    youtube: true,
    instagram: true
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [generatedReels, setGeneratedReels] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!url.trim()) return;

    if (!deductCredits(30)) {
      alert("Not enough credits! Please upgrade your plan to generate more Reels.");
      return;
    }
    
    setIsProcessing(true);
    setProgressText('Fetching video transcript...');
    setGeneratedReels([]);

    try {
      // 1. Try to Scrape the URL (Will fail on static hosts like Vercel without a Node backend)
      let customContext = '';
      try {
        const res = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url.trim() })
        });
        
        if (res.ok) {
          const data = await res.json();
          customContext = data.text;
        } else {
           console.warn("Scraper failed, falling back to Gemini native search:", res.status);
        }
      } catch (scrapeErr) {
         console.warn("Scrape endpoint offline, falling back to Gemini Search", scrapeErr);
      }

      const contentToAnalyze = customContext || `Please deeply analyze this URL for the video contents: ${url.trim()}`;

      setProgressText('AI is analyzing content for viral moments...');

      // 2. Generate Reel Concepts using Gemini
      const apiKey = getGeminiApiKey();
      if (!apiKey) throw new Error("Server configuration issue. AI key is missing from backend.");
      const ai = new GoogleGenAI({ apiKey });
      
      const profileData = profiles['youtube'];
      const styleContext = profileData?.analysis 
        ? `\n\nCRITICAL: Match this creator's specific style and tone based on their YouTube profile analysis:\n${profileData.analysis}`
        : '';

      const prompt = `You are an expert short-form video producer and viral content strategist. 
      Analyze the provided video transcript or URL and identify the 3 absolute best, most engaging moments.
      
      IMPORTANT: If only a URL is provided, use your search tools to find the video's content or transcript. Do not hallucinate.
      
      Target Platforms: ${Object.entries(exports).filter(([_, v]) => v).map(([k]) => k).join(', ') || 'TikTok, Reels, Shorts'}
      Face Tracking Preference: ${faceTracking}
      Caption Style Preference: ${captionStyle === 'single' ? '1-2 words per line (fast paced)' : captionStyle === 'double' ? 'Full sentence per line (readable)' : 'No captions'}
      ${styleContext}
      
      For each moment, provide:
      1. A catchy title for the reel.
      2. The exact "Hook" (the first 3 seconds of spoken text to grab attention).
      3. A brief description of why this moment is viral-worthy.
      4. Visual instructions (e.g., "Zoom in on face", "Add B-roll of money", "Pop-up text"). Explicitly mention how to apply the requested ${faceTracking} framing and ${captionStyle} captions.
      
      Transcript/Content:
      "${contentToAnalyze}"
      
      Return the response in valid JSON format with this exact structure:
      {
        "reels": [
          {
            "title": "Reel Title",
            "hook": "The spoken hook...",
            "reasoning": "Why it works...",
            "visuals": "Visual instructions..."
          }
        ]
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          tools: [{ googleSearch: {} }]
        }
      });
      
      let responseText = response.text || '{"reels": []}';
      responseText = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.warn("Failed to parse JSON directly:", responseText);
        result = { reels: [] };
      }

      setGeneratedReels(result.reels || []);
      addVideoProcessed();
      
    } catch (error: any) {
      console.error("Processing failed", error);
      let errorMsg = error?.message || 'Unknown error';
      if (errorMsg === 'Failed to fetch' || errorMsg.includes('Failed to fetch')) {
        errorMsg = 'Failed to connect to the scraping server. If you deployed this to Vercel, please note that the /api/scrape backend requires a Node.js server. Contact support or use a custom API.';
      }
      alert(`Failed to process video. Error: ${errorMsg}.`);
    } finally {
      setIsProcessing(false);
      setProgressText('');
    }
  };

  const toggleExport = (platform: keyof typeof exports) => {
    setExports(prev => ({ ...prev, [platform]: !prev[platform] }));
  };

  const handleSaveReel = (reel: any) => {
    const platforms = Object.entries(exports).filter(([_, v]) => v).map(([k]) => k.toUpperCase());
    saveReel({
      title: reel.title,
      hook: reel.hook,
      reasoning: reel.reasoning,
      visuals: reel.visuals,
      platforms: platforms.length > 0 ? platforms : ['TIKTOK'],
      duration: '9:16 • 00:45s', // Simulated duration
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80' // Default placeholder
    });
    alert('Reel concept saved successfully!');
  };

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-primary' : 'bg-zinc-600 dark:bg-zinc-700'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  const recentExports = [
    { id: 1, title: 'Marketing_Keynote...', duration: '9:16 • 00:58s', type: 'TIKTOK', icon: 'music_note', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: 'Podcast_S02E04_Hi...', duration: '9:16 • 00:34s', type: 'REELS', icon: 'movie', image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: 'Gaming_Clip_Final', duration: '9:16 • 00:15s', type: 'SHORTS', icon: 'play_arrow', image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto p-8 lg:p-12 min-h-screen relative overflow-hidden flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6 border border-primary/20">
        <span className="material-symbols-outlined text-5xl">movie</span>
      </div>
      <h1 className="text-5xl font-extrabold tracking-tighter text-zinc-900 dark:text-white mb-4">Video to Reels</h1>
      <span className="bg-primary pt-[5px] pb-1 text-white text-xs font-bold px-3 rounded-full uppercase tracking-widest mb-6">Coming Soon</span>
      <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mb-8">
        We're putting the finishing touches on our AI-powered framing and captioning engine. 
        Transforming your long-form horizontal content into viral vertical shorts is about to get a whole lot easier.
      </p>
      <button onClick={() => window.history.back()} className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-sm flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Go Back
      </button>
    </div>
  );
}
