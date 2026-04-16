import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function ThumbnailCreator() {
  const { saveThumbnail } = useAppContext();
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('MrBeast / High Energy');
  const [customStyle, setCustomStyle] = useState('');
  const [channelName, setChannelName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);
  const [savedStatus, setSavedStatus] = useState<Record<number, boolean>>({});

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    if (style === 'Custom' && !customStyle.trim()) {
      setError('Please provide a description for the custom style.');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey && window.aistudio.openSelectKey) {
          await window.aistudio.openSelectKey();
        }
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const actualStyle = style === 'Custom' ? customStyle : style;
      let targetPrompt = `Create a highly engaging, high-CTR YouTube thumbnail background without any text. 
Topic: ${topic}. 
Visual Style: ${actualStyle}. 
Make it extremely eye-catching, high contrast, perfect composition, appealing to YouTube audiences. No text, words, or letters in the image.`;
      
      if (channelName.trim()) {
        targetPrompt += `\nCRITICAL: Find and analyze the latest typical YouTube thumbnails from the channel "${channelName}". Deeply analyze their thumbnails for color grading, composition, lighting, and visual hooks. Replicate their exact aesthetic and visual style for this generated thumbnail background.`;
      }

      const config: any = {
        imageConfig: {
          aspectRatio: '16:9',
          imageSize: '1K'
        }
      };

      if (channelName.trim()) {
        config.tools = [
          {
            googleSearch: {
              searchTypes: {
                webSearch: {},
                imageSearch: {}
              }
            }
          }
        ];
      }

      const promises = Array.from({ length: 3 }).map(async () => {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image-preview',
          contents: {
            parts: [{ text: targetPrompt }]
          },
          config
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
          }
        }
        return null;
      });

      const results = await Promise.all(promises);
      const validImages = results.filter(Boolean) as string[];
      
      if (validImages.length > 0) {
        setGeneratedThumbnails(validImages);
        setSavedStatus({});
      } else {
        throw new Error('No images generated');
      }
    } catch (err: any) {
      console.error("Image generation failed", err);
      
      if (err.message && err.message.includes("Requested entity was not found.")) {
        if (window.aistudio && window.aistudio.openSelectKey) {
          await window.aistudio.openSelectKey();
        }
        setError('Please select a valid paid Google Cloud API key and try again.');
      } else {
        setError(err.message || 'Failed to generate thumbnails. Please try another prompt.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = (thumbnail: string, index: number) => {
    saveThumbnail({
      url: thumbnail,
      topic,
      style: style === 'Custom' ? customStyle : style,
      channelInspiration: channelName.trim() ? channelName : undefined,
    });
    setSavedStatus(prev => ({ ...prev, [index]: true }));
  };

  const styles = [
    { name: 'MrBeast / High Energy', icon: 'electric_bolt' },
    { name: 'Minimalist & Clean', icon: 'space_dashboard' },
    { name: 'Podcast/Interview', icon: 'mic' },
    { name: 'Tech/Neon Review', icon: 'devices' },
    { name: 'Gaming / Cartoon', icon: 'sports_esports' },
    { name: 'Cinematic / Drama', icon: 'theaters' },
    { name: 'Custom', icon: 'edit' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto p-8 lg:p-12 min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="mb-10">
        <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">Creator Lab</p>
        <h1 className="text-5xl font-extrabold tracking-tighter text-gray-900 mb-4">AI Thumbnail Creator</h1>
        <p className="text-gray-500 text-lg max-w-2xl">Generate high-CTR, click-worthy YouTube thumbnails instantly using Google's Imagen technology.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        
        {/* Left Column - Builder */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">
                Video Title or Topic
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. 'Testing 100 Viral TikTok Life Hacks' or 'I Survived 50 Days in Antarctica'"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none resize-none h-32"
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">
                Thumbnail Style
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 mb-4">
                {styles.map(s => (
                  <button
                    key={s.name}
                    onClick={() => setStyle(s.name)}
                    className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all border-2 ${style === s.name ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                  >
                    <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                    <span className="text-xs">{s.name}</span>
                  </button>
                ))}
              </div>
              {style === 'Custom' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <input
                    type="text"
                    value={customStyle}
                    onChange={(e) => setCustomStyle(e.target.value)}
                    placeholder="Describe your custom style (e.g. 'Cyberpunk, highly saturated, wide angle')"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                    disabled={isProcessing}
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isProcessing || !topic.trim() || (style === 'Custom' && !customStyle.trim())}
              className="w-full bg-blue-600 text-white px-8 py-5 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
            >
              {isProcessing ? (
                <><span className="material-symbols-outlined animate-spin">progress_activity</span> Generating Thumbnails...</>
              ) : (
                <><span className="material-symbols-outlined">auto_awesome</span> Generate Thumbnails ✨</>
              )}
            </button>
            {error && <p className="text-red-500 text-sm font-medium mt-2">{error}</p>}
          </div>
        </div>

        {/* Right Column - Settings & Tips */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#f1f3f5] rounded-[2rem] p-8 border border-gray-200/50">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-red-600">youtube_activity</span>
              <h3 className="font-bold text-gray-900 text-lg">Channel Inspiration</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 font-medium">
                Want to steal like an artist? Enter a YouTube channel and the AI will analyze their recent thumbnails to mimic their viral aesthetic.
              </p>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="e.g. Ali Abdaal, Vox, MrBeast"
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium"
                disabled={isProcessing}
              />
              {channelName.trim() && (
                <div className="bg-blue-100 text-blue-800 text-xs p-4 rounded-xl flex items-start gap-2 font-bold animate-in fade-in slide-in-from-top-1">
                  <span className="material-symbols-outlined text-base">saved_search</span>
                  <span>Live Google Search active! Connecting to analyze {channelName}'s thumbnails.</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100">
            <h3 className="font-bold text-blue-900 text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">lightbulb</span> Pro Tips
            </h3>
            <ul className="text-blue-800 text-sm space-y-3 font-medium">
              <li>• Contrast is king. Ensure the main subject pops against the background.</li>
              <li>• Faces drive clicks. A strong emotional expression boosts CTR significantly.</li>
              <li>• Less is more. We generate text-less backgrounds so you can add 2-3 massive words in Photoshop or Canva!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {generatedThumbnails.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Generated Concepts</h2>
            <Link to="/content-lab/saved-thumbnails" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
              View Saved Thumbnails <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedThumbnails.map((thumbnail, index) => (
              <div key={index} className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 group">
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                  <img src={thumbnail} alt={`Generated thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <a href={thumbnail} download={`thumbnail-concept-${index + 1}.jpg`} className="bg-white text-gray-900 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform" title="Download">
                      <span className="material-symbols-outlined font-bold">download</span>
                    </a>
                    <button 
                      onClick={() => handleSave(thumbnail, index)}
                      disabled={savedStatus[index]}
                      className={`w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform ${savedStatus[index] ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'}`}
                      title={savedStatus[index] ? "Saved" : "Save to Libary"}
                    >
                      <span className="material-symbols-outlined font-bold">{savedStatus[index] ? 'check' : 'favorite'}</span>
                    </button>
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <h3 className="font-bold text-gray-900">Concept #{index + 1}</h3>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mt-1 max-w-full truncate">
                    {style === 'Custom' ? customStyle : style} 
                    {channelName.trim() && ` • Inspired by ${channelName}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
