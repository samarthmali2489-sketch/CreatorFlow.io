import React, { useState } from 'react';
import { GoogleGenAI, getGeminiApiKey } from '../lib/gemini';
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
  const { saveThumbnail, deductCredits, addGeneration, showRefImageWarning, setShowRefImageWarning } = useAppContext();
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
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleGenerate = async (skipWarning = false) => {
    if (!topic.trim()) return;
    if (style === 'Custom' && !customStyle.trim()) {
      setError('Please provide a description for the custom style.');
      return;
    }

    if (!referenceImage && showRefImageWarning && !skipWarning) {
      setShowWarningModal(true);
      return;
    }

    if (!deductCredits(20)) {
      alert("Not enough credits! Please upgrade your plan.");
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      const apiKey = getGeminiApiKey();
      if (!apiKey) throw new Error("Server configuration issue. AI key is missing from backend.");
      const ai = new GoogleGenAI({ apiKey });
      
      const actualStyle = style === 'Custom' ? customStyle : style;
      
      // 1. Actively analyze the requested channel using Grounded Search
      let channelAesthetic = "";
      if (channelName.trim()) {
        try {
          const channelAnalysisResponse = await ai.models.generateContent({
            model: 'gemini-3.1-pro-preview',
            contents: {
              parts: [{ text: `Search Google closely for recent YouTube thumbnails and videos from the channel "${channelName}". Deeply analyze their specific visual style, aesthetics, color palettes, lighting, photography style, and common emotional hooks. Give me a 1-paragraph highly detailed aesthetic description that strictly defines their visual identity so I can accurately replicate their thumbnail vibe. Do not include instructions, just the description.` }]
            },
            config: {
              tools: [{ googleSearch: {} }]
            }
          });
          channelAesthetic = channelAnalysisResponse.text || '';
        } catch (searchErr) {
          console.warn("Channel search failed", searchErr);
        }
      }

      // 2. Actively analyze the reference image
      let referenceAesthetic = "";
      if (referenceImage) {
        const [mimeInfo, base64Data] = referenceImage.split(',');
        const mimeType = mimeInfo.split(':')[1].split(';')[0];
        
        try {
          const analysisResponse = await ai.models.generateContent({
            model: 'gemini-3.1-pro-preview',
            contents: {
              parts: [
                { text: "Analyze this image meticulously. Extract the exact camera angle, lighting setup (e.g., hard flash, soft window light, neon), color grading, subject posing, facial expression intensity, compositional layout, and crucially, the exact typography style of any text present in the image (font type, weight, colors, stroke, 3D effect, placement). Give me a highly detailed structural breakdown so I can prompt an image generator to replicate this exact same vibe, layout, photography style, and typographic treatment." },
                {
                  inlineData: {
                    data: base64Data,
                    mimeType
                  }
                }
              ]
            }
          });
          referenceAesthetic = analysisResponse.text || '';
        } catch (imgErr) {
          console.warn("Reference image analysis failed.", imgErr);
        }
      }

      // 3. Build User Context for Thumbnail God prompt formulation
      let userContext = `Video Title/Topic: ${topic}`;
      if (thumbnailText.trim()) userContext += `\nRequested Text/Hook: ${thumbnailText}`;
      if (actualStyle) userContext += `\nStyle/Category: ${actualStyle}`;
      if (channelAesthetic) userContext += `\nChannel Aesthetic to mimic: ${channelAesthetic}`;
      if (referenceAesthetic) userContext += `\nCRITICAL REFERENCE IMAGE AESTHETIC ENFORCEMENT:\nThe user uploaded a reference image. You MUST mirror this exact composition, layout, camera angle, posing, lighting, and crucially, the EXACT TYPOGRAPHY AND TEXT STYLE (font, color, stroke, 3D effect) seen in the reference perfectly: ${referenceAesthetic}`;

      const thumbnailGodInstruction = `You are Thumbnail God — the world's best YouTube thumbnail engineer.

Your ONLY job: Turn any video into the MOST clickable, viral YouTube thumbnail possible. The base image MUST look like a completely real photograph (NO CGI, NO plastic skin, NO "AI look"), while seamlessly integrating stunning, highly stylized text typography.

Every single thumbnail must follow these strict rules (never break them):
1. Realism: "Photorealistic, shot on Sony A7S III, raw photography, natural skin textures with slight imperfections."
2. Aspect ratio: 16:9
3. Reference Style: If Reference Image details are provided, the generated text typography MUST exactly match the typography style described in the reference.
4. Main subject: Highly charismatic, relatable human face. The emotion should match the mood of the video. 
5. Text integration (CRITICAL): The text MUST be perfectly integrated into the thumbnail design. Use descriptions that make the text look natively rendered and high-quality, matching the reference image's text style exactly if provided, or otherwise using bold, clean, modern typography.
6. Short text: Distill the message into exactly 2-4 massive, catchy words.
7. Lighting: Emulate real-world vlogger lighting (e.g., softbox, ring light, natural daylight, or RGB room lights).
8. Negative rules: NO blurry text, NO misspellings, NO extra limbs, NO watermark.

When the user gives you information, do this exact pipeline internally:
Step 1: Analyze the input and create a 2-4 word powerful semantic hook (if not provided).
Step 2: Build the Nano Banana 2 prompt using this template:
"Viral YouTube thumbnail photograph, 16:9 aspect ratio, [insert strict lighting/camera details from Reference Image if available, otherwise realistic photography, 35mm lens], [detailed scene with a realistic human subject showing [emotion], natural skin], [background elements], [describe highly cohesive, stylized bold text reading '[2-4 WORD HOOK]' matching the reference typography exactly], authentic vlogger style, raw photo, realistic."

RETURN ONLY THE COMPLETED TEXT PROMPT STRING. NOTHING ELSE.`;

      const promptBuilderResponse = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: {
            parts: [{ text: userContext }]
          },
          config: {
            systemInstruction: thumbnailGodInstruction
          }
      });

      const finalImagePrompt = promptBuilderResponse.text.trim();
      setGeneratedPrompt(finalImagePrompt);

      // 4. Generate Thumbnail directly using the curated exact prompt
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
        setGeneratedThumbnails([finalBase64]);
        setSavedStatus({ 0: false }); 
        addGeneration('YouTube Thumbnail');
      } else {
        throw new Error('No images generated');
      }
    } catch (err: any) {
      console.error("Image generation failed", err);
      
      if (err.message && err.message.includes("Requested entity was not found.")) {
        setError('The generation service is temporarily unavailable. Please try again later.');
      } else if (err.message === 'Failed to fetch' || err?.message?.includes('Failed to fetch')) {
        setError('Network error: Could not reach the generation servers. Please check your connection.');
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
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12">
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
              onClick={() => handleGenerate(false)}
              disabled={isProcessing || !topic.trim() || (style === 'Custom' && !customStyle.trim())}
              className="w-full bg-blue-600 text-white dark:text-zinc-900 px-8 py-5 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
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
                className="w-full bg-white dark:bg-zinc-900 border border-gray-200 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium"
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
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black text-white dark:text-zinc-900 rounded-full flex items-center justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white dark:text-zinc-900 text-[10px] font-bold py-1 px-3 uppercase tracking-widest text-center truncate">
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
              <div key={index} className="bg-white dark:bg-zinc-900 rounded-[2rem] p-4 shadow-sm border border-gray-100 group w-full max-w-3xl">
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                  <img src={thumbnail} alt={`Generated thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <a href={thumbnail} download={`thumbnail-concept-${index + 1}.jpg`} className="bg-white dark:bg-zinc-900 text-gray-900 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg z-10" title="Download">
                      <span className="material-symbols-outlined font-bold">download</span>
                    </a>
                    <button 
                      onClick={() => handleSave(thumbnail, index)}
                      disabled={savedStatus[index]}
                      className={`w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg z-10 ${savedStatus[index] ? 'bg-blue-600 text-white dark:text-zinc-900' : 'bg-white dark:bg-zinc-900 text-gray-900'}`}
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
                  
                  {generatedPrompt && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl text-left border border-gray-100">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nano Banana 2 Prompt Used:</p>
                      <p className="text-sm text-gray-800 font-mono italic break-words">{generatedPrompt}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md overflow-hidden shadow-lg animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Reference Image Provided</h3>
              <p className="text-gray-600 text-sm mb-6">
                Providing a reference image helps the AI generate significantly higher quality thumbnails by giving it a specific visual anchor for typography, lighting, and composition. 
              </p>
              
              <label className="flex items-center gap-2 mb-6 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="peer w-5 h-5 appearance-none border-2 border-gray-300 rounded cursor-pointer checked:bg-blue-600 checked:border-blue-600 transition-all"
                  />
                  <span className="material-symbols-outlined absolute text-white dark:text-zinc-900 text-[16px] pointer-events-none opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">check</span>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Don't show this tip again</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel & Add Image
                </button>
                <button
                  onClick={() => {
                    if (dontShowAgain) {
                      setShowRefImageWarning(false);
                    }
                    setShowWarningModal(false);
                    handleGenerate(true);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg font-bold text-white dark:text-zinc-900 bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Continue Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
