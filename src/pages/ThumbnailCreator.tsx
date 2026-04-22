import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { getGeminiApiKey } from '../lib/gemini';
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

// Utility to forcefully overlay massive, YouTube-style text via HTML Canvas
const overlayTextOnImage = async (base64Image: string, text: string): Promise<string> => {
  if (!text) return base64Image;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(base64Image);
      
      // Draw the hyper-realistic background
      ctx.drawImage(img, 0, 0);
      
      // Setup Text Styles for YouTube 
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Dynamic font size: Massive text
      let fontSize = Math.floor(canvas.height / 5);
      ctx.font = `900 italic ${fontSize}px "Impact", "Arial Black", sans-serif`;
      
      // Basic word wrap
      const words = text.toUpperCase().split(' ');
      let lines: string[] = [];
      let currentLine = "";
      for (const word of words) {
        if (!currentLine) {
           currentLine = word;
        } else if (ctx.measureText(currentLine + " " + word).width < canvas.width * 0.9) {
           currentLine += " " + word;
        } else {
           lines.push(currentLine);
           currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      
      const totalHeight = lines.length * fontSize * 1.1;
      let startY = canvas.height - (totalHeight / 2) - (canvas.height * 0.1); 
      
      lines.forEach((line, index) => {
        const y = startY + (index * fontSize * 1.1) - (totalHeight / 2);
        
        ctx.fillStyle = "#FFF300"; // Signature click-bait yellow
        ctx.strokeStyle = "#000000"; // Thick black outline
        ctx.lineWidth = fontSize * 0.15;
        ctx.lineJoin = "round";
        ctx.miterLimit = 2;

        // Base black stroke for contrast
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 35;
        ctx.shadowOffsetX = 12;
        ctx.shadowOffsetY = 12;
        ctx.strokeText(line, canvas.width / 2, y);
        
        // Remove shadow for inner layers
        ctx.shadowColor = 'transparent';
        ctx.fillText(line, canvas.width / 2, y);
        
        // Inner white stroke for sharpness
        ctx.lineWidth = fontSize * 0.04;
        ctx.strokeStyle = "#FFFFFF";
        ctx.strokeText(line, canvas.width / 2, y);
      });
      
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.src = base64Image;
  });
};

export default function ThumbnailCreator() {
  const { saveThumbnail, deductCredits, addGeneration } = useAppContext();
  const [topic, setTopic] = useState('');
  const [thumbnailText, setThumbnailText] = useState('');
  const [style, setStyle] = useState('MrBeast / High Energy');
  const [customStyle, setCustomStyle] = useState('');
  const [channelName, setChannelName] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
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

    if (!deductCredits(10)) {
      alert("Not enough credits! Please upgrade your plan.");
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      const apiKey = getGeminiApiKey();
      if (!apiKey) throw new Error("Backend API key is not configured yet. The developer will provide it soon!");
      
      const ai = new GoogleGenAI({ apiKey });
      
      const actualStyle = style === 'Custom' ? customStyle : style;
      
      let targetPrompt = `Create a cinematic, high-CTR YouTube thumbnail background. DO NOT INCLUDE ANY TEXT, WORDS, OR LETTERS IN THIS IMAGE. 
Topic: ${topic}. 
Visual Style: ${actualStyle}.
CINEMATIC DIRECTOR GUIDELINES:
- Lighting: Rim lighting, dual-tone neon lighting (e.g., Teal and Orange), or dramatic volumetric fog to add depth.
- Composition: Rule of Thirds, Extreme Close-up, or Low Angle Shot making the subject look heroic and dominant.
- Subject: Inject a vividly expressive main character showing an exaggerated emotional response (e.g., wide-eyed shock, intense focus, anger, jaw-dropping surprise) reflecting the topic.
- Contrast: Ensure the main subject is sharply focused with a shallow depth of field (heavy bokeh effect). The background should be blurry but contextually recognizable.
- Mobile Optimization: Use highly saturated colors and bold, readable silhouettes that pass the 'squint test'.
- Aesthetics: 8k resolution, hyper-realistic textures. 
- Negative Constraints: Absolutely NO text, letters, or words. NO cartoonish styles (unless gaming/cartoon requested), NO blurry subjects, NO deformed features, NO cluttered backgrounds.`;
      
      let finalImagePrompt = targetPrompt;

      // 1. Actively analyze the requested channel using Grounded Search
      if (channelName.trim()) {
        try {
          const channelAnalysisResponse = await ai.models.generateContent({
            model: 'gemini-3.1-flash-preview',
            contents: {
              parts: [{ text: `Search Google closely for recent YouTube thumbnails and videos from the channel "${channelName}". Deeply analyze their specific visual style, aesthetics, color palettes, lighting, photography style, and common emotional hooks. Give me a 1-paragraph highly detailed aesthetic description that strictly defines their visual identity so I can accurately replicate their thumbnail vibe. Do not include instructions, just the description.` }]
            },
            config: {
              tools: [{ googleSearch: {} }]
            }
          });
          const channelAesthetic = channelAnalysisResponse.text || '';
          if (channelAesthetic) {
            finalImagePrompt += `\n\nCHANNEL AESTHETIC DIRECTIVE: You must rigidly follow this visual style description to match the user's requested channel inspiration (${channelName}): ${channelAesthetic}`;
          }
        } catch (searchErr) {
          console.warn("Channel search failed, falling back to basic prompt.", searchErr);
          finalImagePrompt += `\n\nCRITICAL: Try your best to replicate the exact aesthetic, color grading, and visual style of the YouTube channel "${channelName}".`;
        }
      }

      // 2. Actively analyze the reference image
      if (referenceImage) {
        const [mimeInfo, base64Data] = referenceImage.split(',');
        const mimeType = mimeInfo.split(':')[1].split(';')[0];
        
        try {
          const analysisResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
              parts: [
                { text: "Analyze this image's specific visual style, aesthetics, color grading, lighting, and composition. Give me a 3 sentence detailed aesthetic description I can use to prompt an image generator to replicate this exact same vibe. Focus ONLY on the stylistic look, not the specific subjects." },
                {
                  inlineData: {
                    data: base64Data,
                    mimeType
                  }
                }
              ]
            }
          });
          const aestheticDescription = analysisResponse.text || '';
          if (aestheticDescription) {
            finalImagePrompt += `\n\nREFERENCE IMAGE AESTHETIC DIRECTIVE: You must rigidly follow this visual style description to match the user's requested reference look: ${aestheticDescription}`;
          }
        } catch (imgErr) {
          console.warn("Reference image analysis failed.", imgErr);
        }
      }

      finalImagePrompt += `\n\nCRUEL CRITERIA: DO NOT use childish, cheap clip-art, or amateur vector styles. This MUST look like a multi-million-subscriber Youtube channel's premium thumbnail: highly produced, extremely crisp, breathtaking cinematography, dramatic shading, and professional-grade editing. ABSOLUTELY NO TEXT.`;

      // 3. Generate exactly 1 Thumbnail using gemini-3-pro-image-preview
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: finalImagePrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: '16:9',
            imageSize: '1K'
          }
        }
      });

      let finalBase64 = null;
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
           finalBase64 = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
           break;
        }
      }

      if (finalBase64) {
        // 4. Overlay Text programmatically if requested
        let resultingImage = finalBase64;
        
        // If the user didn't provide text, generate 2-3 massive click-bait words
        let textToOverlay = thumbnailText.trim();
        if (!textToOverlay) {
            try {
                const textResponse = await ai.models.generateContent({
                    model: 'gemini-3.1-flash-preview',
                    contents: {
                        parts: [{ text: `Generate a super catchy 2-3 word click-bait title for a YouTube video about: ${topic}. Respond ONLY with the text in ALL CAPS, nothing else.` }]
                    }
                });
                textToOverlay = (textResponse.text || '').trim();
            } catch (err) {
                console.warn("Auto text generation failed.", err);
            }
        }
        
        if (textToOverlay) {
            resultingImage = await overlayTextOnImage(finalBase64, textToOverlay);
        }

        setGeneratedThumbnails([resultingImage]);
        setSavedStatus({ 0: true }); 
        addGeneration('YouTube Thumbnail');
        
        // Auto-save the thumbnail so the user doesn't lose it
        saveThumbnail({
          url: resultingImage,
          topic,
          thumbnailText: textToOverlay,
          style: style === 'Custom' ? customStyle : style,
          channelInspiration: channelName.trim() ? channelName : undefined,
        });

      } else {
        throw new Error('No images generated');
      }
    } catch (err: any) {
      console.error("Image generation failed", err);
      
      if (err.message && err.message.includes("Requested entity was not found.")) {
        setError('Configured API Key does not have access to the Image Generation model.');
      } else if (err.message === 'Failed to fetch' || err?.message?.includes('Failed to fetch')) {
        setError('Connection failed. Ensure the configured API Key is valid and there are no network restrictions.');
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
      thumbnailText: thumbnailText.trim() ? thumbnailText.trim() : undefined,
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
              <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>Thumbnail Text (Optional)</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">New</span>
              </label>
              <input
                type="text"
                value={thumbnailText}
                onChange={(e) => setThumbnailText(e.target.value)}
                placeholder="e.g. 'I REGRET THIS' or 'DO NOT TRY!'"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                disabled={isProcessing}
                maxLength={40}
              />
              <p className="text-xs text-gray-500 mt-2 font-medium">Keep it to 2-4 words for the best visual impact. Leave blank for AI to auto-generate catchy text.</p>
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
              
              <div className="relative mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">Upload Reference</p>
                <p className="text-sm text-gray-600 font-medium mb-4">Have an exact thumbnail image you want to copy? Upload it here to strictly guide the aesthetic.</p>
                
                {referenceImage ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-blue-200 bg-gray-100 mb-2">
                    <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button 
                      onClick={() => setReferenceImage(null)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] font-bold py-1 px-3 uppercase tracking-widest text-center truncate">
                      Image attached to prompt
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-[21/9] border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all rounded-xl cursor-pointer">
                    <span className="material-symbols-outlined text-gray-400 text-3xl mb-2">add_photo_alternate</span>
                    <span className="text-sm font-bold text-gray-500">Upload Reference Image</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      disabled={isProcessing}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setReferenceImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100">
            <h3 className="font-bold text-blue-900 text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">lightbulb</span> Pro Tips
            </h3>
            <ul className="text-blue-800 text-sm space-y-3 font-medium">
              <li>• Contrast is king. Ensure the main subject pops against the background.</li>
              <li>• Faces drive clicks. A strong emotional expression boosts CTR significantly.</li>
              <li>• Nano Banana 2 generated text shines best when you keep it short! Less than 4 words guarantees punchy rendering.</li>
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
          
          <div className="flex justify-center">
            {generatedThumbnails.map((thumbnail, index) => (
              <div key={index} className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 group w-full max-w-3xl">
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                  <img src={thumbnail} alt={`Generated thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <a href={thumbnail} download={`thumbnail-concept-${index + 1}.jpg`} className="bg-white text-gray-900 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg z-10" title="Download">
                      <span className="material-symbols-outlined font-bold">download</span>
                    </a>
                    <button 
                      onClick={() => handleSave(thumbnail, index)}
                      disabled={savedStatus[index]}
                      className={`w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg z-10 ${savedStatus[index] ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'}`}
                      title={savedStatus[index] ? "Saved" : "Save to Libary"}
                    >
                      <span className="material-symbols-outlined font-bold">{savedStatus[index] ? 'check' : 'favorite'}</span>
                    </button>
                  </div>
                </div>
                <div className="px-2 pb-2 text-center">
                  <h3 className="font-bold text-gray-900 text-2xl">Final Concept</h3>
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
