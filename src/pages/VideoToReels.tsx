import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { GoogleGenAI } from '@google/genai';
import { getGeminiApiKey } from '../lib/gemini';

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
      // 1. Scrape the URL
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });
      
      if (!res.ok) throw new Error('Failed to fetch video data');
      const data = await res.json();
      const transcript = data.text;

      setProgressText('AI is analyzing content for viral moments...');

      // 2. Generate Reel Concepts using Gemini
      const apiKey = getGeminiApiKey();
      if (!apiKey) throw new Error("Gemini API Key is missing. Please add it in Settings.");
      const ai = new GoogleGenAI({ apiKey });
      
      const profileData = profiles['youtube'];
      const styleContext = profileData?.analysis 
        ? `\n\nCRITICAL: Match this creator's specific style and tone based on their YouTube profile analysis:\n${profileData.analysis}`
        : '';

      const prompt = `You are an expert short-form video producer and viral content strategist. 
      Analyze the following video transcript and identify the 3 absolute best, most engaging moments that would make highly viral 30-60 second short-form videos.
      
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
      "${transcript}"
      
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
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
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
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-blue-600' : 'bg-gray-600'}`}
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
    <div className="max-w-[1600px] mx-auto p-8 lg:p-12 min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="mb-10">
        <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">Content Lab</p>
        <h1 className="text-5xl font-extrabold tracking-tighter text-gray-900 mb-4">Video to Reels</h1>
        <p className="text-gray-500 text-lg max-w-2xl">Transform your long-form horizontal content into viral vertical shorts with AI-powered framing and captioning.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Left Column - Upload */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
          {inputMode === 'drop' ? (
            <div className="flex flex-col items-center z-10 w-full max-w-md text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <span className="material-symbols-outlined text-4xl">cloud_upload</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Drop your long-form video here</h2>
              <p className="text-gray-500 mb-8">Support for MP4, MOV, and AVI up to 2GB</p>
              <div className="flex gap-4 w-full justify-center">
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">Browse Files</button>
                <button onClick={() => setInputMode('url')} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">Import from URL</button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-xl flex flex-col items-center z-10">
              <button onClick={() => setInputMode('drop')} className="self-start mb-6 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-sm">arrow_back</span> Back to upload
              </button>
              <div className="w-full space-y-4 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Import from URL</h3>
                <p className="text-gray-500 text-sm mb-6">Paste a YouTube link to generate viral reel concepts.</p>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                  disabled={isProcessing}
                />
                {profiles['youtube'] && (
                  <div className="p-3 bg-green-50 text-green-800 rounded-lg text-xs font-medium flex items-start gap-2 text-left">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>Using connected YouTube profile analysis to match your style.</span>
                  </div>
                )}
                <button
                  onClick={handleGenerate}
                  disabled={isProcessing || !url.trim()}
                  className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <><span className="material-symbols-outlined animate-spin">progress_activity</span> {progressText || 'Analyzing Video...'}</>
                  ) : (
                    <><span className="material-symbols-outlined">auto_awesome</span> Generate Concepts</>
                  )}
                </button>
              </div>
            </div>
          )}
          {/* Decorative element */}
          <div className="absolute bottom-8 right-8 text-blue-100 opacity-50 pointer-events-none">
            <span className="material-symbols-outlined text-[120px]">movie</span>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Enhancement Settings */}
          <div className="bg-[#f1f3f5] rounded-[2rem] p-8 border border-gray-200/50">
            <div className="flex items-center gap-2 mb-8">
              <span className="material-symbols-outlined text-blue-600">auto_awesome</span>
              <h3 className="font-bold text-gray-900 text-lg">AI Enhancement Settings</h3>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Face Tracking</label>
              <div className="flex bg-gray-200/50 p-1 rounded-xl gap-1">
                <button onClick={() => setFaceTracking('Active Speaker')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${faceTracking === 'Active Speaker' ? 'bg-white text-blue-600 shadow-sm border border-blue-100' : 'text-gray-600 hover:text-gray-900'}`}>Active Speaker</button>
                <button onClick={() => setFaceTracking('Center Crop')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${faceTracking === 'Center Crop' ? 'bg-white text-blue-600 shadow-sm border border-blue-100' : 'text-gray-600 hover:text-gray-900'}`}>Center Crop</button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Captions Style</label>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setCaptionStyle('single')} className={`h-16 bg-white rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${captionStyle === 'single' ? 'ring-2 ring-blue-600 shadow-sm' : 'border border-gray-200 hover:border-gray-300'}`}>
                  <div className="w-8 h-1.5 bg-blue-600 rounded-full"></div>
                </button>
                <button onClick={() => setCaptionStyle('double')} className={`h-16 bg-white rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${captionStyle === 'double' ? 'ring-2 ring-blue-600 shadow-sm' : 'border border-gray-200 hover:border-gray-300'}`}>
                  <div className="w-8 h-1.5 bg-blue-600 rounded-full"></div>
                  <div className="w-8 h-1.5 bg-blue-600 rounded-full"></div>
                </button>
                <button onClick={() => setCaptionStyle('none')} className={`h-16 bg-white rounded-xl flex flex-col items-center justify-center transition-all ${captionStyle === 'none' ? 'ring-2 ring-blue-600 shadow-sm' : 'border border-gray-200 hover:border-gray-300'}`}>
                  <span className="material-symbols-outlined text-gray-300 text-2xl">block</span>
                </button>
              </div>
            </div>
          </div>

          {/* Omnichannel Export */}
          <div className="bg-[#1a1d20] rounded-[2rem] p-8 text-white shadow-xl">
            <h3 className="font-bold text-lg mb-6">Omnichannel Export</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-pink-500">music_note</span>
                  <span className="font-medium text-sm">TikTok Native</span>
                </div>
                <ToggleSwitch enabled={exports.tiktok} onChange={() => toggleExport('tiktok')} />
              </div>
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-500">play_arrow</span>
                  <span className="font-medium text-sm">YouTube Shorts</span>
                </div>
                <ToggleSwitch enabled={exports.youtube} onChange={() => toggleExport('youtube')} />
              </div>
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-orange-500">movie</span>
                  <span className="font-medium text-sm">Instagram Reels</span>
                </div>
                <ToggleSwitch enabled={exports.instagram} onChange={() => toggleExport('instagram')} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Reels Section (If any) */}
      {generatedReels.length > 0 && (
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Extracted Viral Concepts</h2>
            <span className="bg-blue-100 text-blue-600 font-bold px-4 py-2 rounded-full text-sm">
              {generatedReels.length} Clips Found
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedReels.map((reel, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-lg leading-tight line-clamp-2 text-gray-900">{reel.title}</h3>
                </div>
                
                <div className="space-y-4 flex-1">
                  <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-600">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">The Hook</p>
                    <p className="font-medium text-gray-900 italic">"{reel.hook}"</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Why it works</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{reel.reasoning}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Visual Direction</p>
                    <p className="text-sm text-gray-600 leading-relaxed flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-blue-600 mt-0.5">movie_edit</span>
                      {reel.visuals}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">
                    Send to Editor
                  </button>
                  <button onClick={() => handleSaveReel(reel)} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">bookmark</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Generations (Live Engine) */}
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Live Engine</p>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Recent Generations</h2>
          <button className="text-blue-600 font-bold flex items-center gap-1 hover:underline">View All Exports <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {savedReels.slice(0, 5).map((exp) => (
            <div key={exp.id} className="relative aspect-[9/16] rounded-3xl overflow-hidden shadow-sm group cursor-pointer">
              <img src={exp.image} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10">
                <span className="material-symbols-outlined text-[12px]">
                  {exp.platforms[0] === 'YOUTUBE' ? 'play_arrow' : exp.platforms[0] === 'INSTAGRAM' ? 'movie' : 'music_note'}
                </span>
                {exp.platforms[0] || 'TIKTOK'}
              </div>
              
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-white font-bold text-sm truncate mb-1">{exp.title}</h4>
                <p className="text-white/70 text-[10px] font-medium">{exp.duration}</p>
              </div>
            </div>
          ))}
          
          {/* New Project Placeholders */}
          {Array.from({ length: Math.max(0, 5 - savedReels.length) }).map((_, i) => (
            <div key={`new-${i}`} className="aspect-[9/16] rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <span className="material-symbols-outlined">add</span>
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">New Project</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
