import React, { useState } from 'react';
import { GoogleGenAI, getGeminiApiKey } from '../lib/gemini';
import { useAppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function ThumbnailCreator() {
  const { saveThumbnail, deductCredits, addGeneration } = useAppContext();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [channelName, setChannelName] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
  const [savedStatus, setSavedStatus] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'What kind of thumbnail are we building today? You can just tell me the topic, or provide your channel name in the right sidebar to steal their aesthetic!' }
  ]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isProcessing) return;
    
    const newMessages = [...chatMessages, { role: 'user' as const, content: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsProcessing(true);
    setError('');

    try {
      if (!deductCredits(20)) {
        throw new Error("Not enough credits! Please upgrade your plan.");
      }

      const apiKey = getGeminiApiKey();
      if (!apiKey) throw new Error("Server configuration issue. AI key is missing from backend.");
      const ai = new GoogleGenAI({ apiKey });

      const promptContext = `User Request: ${newMessages[newMessages.length - 1].content}\nCurrent Topic context: ${topic}\nChannel context: ${channelName}`;

      const thumbnailGodInstruction = `You are Thumbnail God. Generate a prompt for an ultra-realistic, highly-clickable YouTube thumbnail (16:9). Follow the user's instructions perfectly. RETURN ONLY THE TEXT PROMPT STRING FOR AN IMAGE GENERATOR.`;

      const promptResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: promptContext }] }],
        config: { systemInstruction: thumbnailGodInstruction }
      });

      const finalImagePrompt = promptResponse.text?.trim() || "";
      
      if (!finalImagePrompt) throw new Error("Failed to formulate prompt.");

      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: finalImagePrompt,
        config: {
          aspectRatio: '16:9',
          outputMimeType: 'image/jpeg',
          numberOfImages: 1
        }
      });

      const parts = response.generatedImages || [];
      let finalBase64 = null;
      for (const part of parts) {
        if (part.image?.imageBytes) {
           finalBase64 = `data:image/jpeg;base64,${part.image.imageBytes}`;
           break;
        }
      }

      if (finalBase64) {
        setGeneratedThumbnail(finalBase64);
        setSavedStatus(false);
        addGeneration('YouTube Thumbnail');
        setChatMessages(prev => [...prev, { role: 'ai', content: `Here's your thumbnail! You can tell me to tweak the text, change the background, or make it more clickbaity.` }]);
        if(!topic) setTopic(newMessages[newMessages.length - 1].content);
      } else {
        throw new Error('No images generated');
      }

    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'ai', content: `Oops, something went wrong: ${err.message}` }]);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if(!generatedThumbnail) return;
    saveThumbnail({
      url: generatedThumbnail,
      topic: topic || 'Custom Generated Thumbnail',
      style: 'Custom',
      channelInspiration: channelName.trim() ? channelName : undefined,
    });
    setSavedStatus(true);
    setTimeout(() => {
      navigate('/analytics');
    }, 1000);
  };

  return (
    <div className="h-full flex font-sans bg-[#0A0A0A] overflow-hidden">
      
      {/* Left Chat Sidebar */}
      <div className="w-[360px] bg-[#0F0F0F] border-r border-white/5 flex flex-col shrink-0 z-20">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/analytics')} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/50 transition-colors mr-1">
               <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
            <h2 className="font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500">auto_awesome</span>
              AI Assistant
            </h2>
          </div>
          <button className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">more_horiz</span>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
              <div 
                className={cn(
                  "p-3 rounded-2xl max-w-[90%] text-sm",
                  msg.role === 'user' 
                    ? "bg-blue-600 text-white rounded-tr-sm" 
                    : "bg-white/10 text-white/90 rounded-tl-sm"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="items-start flex flex-col">
              <div className="p-3 py-4 rounded-2xl bg-white/5 text-white/50 text-sm rounded-tl-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse delay-75"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse delay-150"></span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-white/5 bg-[#0F0F0F]">
          <div className="relative">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
              placeholder="Describe your thumbnail..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:bg-white/10 focus:border-white/20 transition-all outline-none resize-none h-[100px]"
              disabled={isProcessing}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isProcessing}
              className="absolute bottom-3 right-3 w-8 h-8 bg-blue-600 rounded-lg text-white flex items-center justify-center hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
             <span className="text-[10px] text-white/40">Powered by Nano Banana 2</span>
             <span className="text-[10px] text-white/40">Shift + Enter for new line</span>
          </div>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative bg-black custom-grid z-0 overflow-y-auto">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} 
        />

        {generatedThumbnail ? (
          <div className="w-full max-w-5xl animate-in fade-in zoom-in-95 duration-500 relative z-10">
            {/* The Canvas Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                 <span className="text-white/60 text-sm font-semibold tracking-widest uppercase">Canvas Active</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleSave}
                  className={cn("px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors", savedStatus ? "bg-white text-black" : "bg-white/10 hover:bg-white/20 text-white")}
                >
                  <span className="material-symbols-outlined text-[16px]">{savedStatus ? 'check' : 'favorite'}</span>
                  {savedStatus ? 'Saved to Dashboard' : 'Save & Exit'}
                </button>
                <a href={generatedThumbnail} download="thumbnail.jpg" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Download
                </a>
              </div>
            </div>

            {/* The Image */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group bg-zinc-900 flex items-center justify-center">
              <img src={generatedThumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
              
              {/* Overlay Tools */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div className="flex items-center gap-4">
                    <button className="flex flex-col items-center gap-2 text-white hover:text-blue-400 transition-colors" title="Generate Variations">
                      <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                         <span className="material-symbols-outlined text-[24px]">collections</span>
                      </div>
                      <span className="text-xs font-bold bg-black/50 px-2 py-1 rounded">Variations</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 text-white hover:text-green-400 transition-colors" title="Upscale to 4K">
                      <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                         <span className="material-symbols-outlined text-[24px]">high_quality</span>
                      </div>
                      <span className="text-xs font-bold bg-black/50 px-2 py-1 rounded">Upscale 4K</span>
                    </button>
                 </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center gap-2">
              <button className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 rounded-full text-xs font-semibold">Change Text</button>
              <button className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 rounded-full text-xs font-semibold">Remove Background</button>
              <button className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 rounded-full text-xs font-semibold">More Clickbaity</button>
            </div>
          </div>
        ) : (
          <div className="text-center w-full max-w-lg mb-12 relative z-10 flex flex-col items-center">
            {isProcessing ? (
               <div className="w-24 h-24 mb-6 relative">
                 <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <span className="material-symbols-outlined text-blue-500 animate-pulse text-[32px]">auto_awesome</span>
                 </div>
               </div>
            ) : (
              <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
                <span className="material-symbols-outlined text-4xl text-white/20">wallpaper</span>
              </div>
            )}
            <h2 className="text-2xl font-bold text-white mb-3">
              {isProcessing ? "Crafting your masterpiece..." : "Start your next viral hit"}
            </h2>
            <p className="text-white/40 text-sm max-w-md">
              {isProcessing 
                ? "The AI is analyzing trends, rendering high-contrast imagery, and applying the perfect color grading."
                : "Tell the AI Assistant what you want to build. You can attach a reference image or specify a YouTube channel's style in the right sidebar."
              }
            </p>
          </div>
        )}
      </div>

      {/* Right Properties Sidebar */}
      <div className="w-[300px] xl:w-[340px] bg-[#0F0F0F] border-l border-white/5 flex flex-col shrink-0 z-20 overflow-y-auto">
        <div className="p-4 border-b border-white/5">
          <h2 className="font-bold text-white text-sm uppercase tracking-wider text-white/60">Creative Refs</h2>
        </div>
        
        <div className="p-5 space-y-8">
          {/* Channel Inspiration */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-blue-500 text-[20px]">youtube_activity</span>
              <h3 className="font-bold text-white text-sm">Channel Reference</h3>
            </div>
            <p className="text-xs text-white/40 mb-3 leading-relaxed">
              Name a YouTube channel to analyze and mimic their specific lighting, color grading, and facial expressions.
            </p>
            <div className="relative">
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="e.g. MrBeast, Ali Abdaal..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:bg-white/10 focus:border-blue-500/50 transition-all outline-none"
                disabled={isProcessing}
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-white/40">search</span>
            </div>
          </div>

          {/* Image Reference */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-500 text-[20px]">image</span>
                <h3 className="font-bold text-white text-sm">Visual Anchor</h3>
              </div>
            </div>
            <p className="text-xs text-white/40 mb-4 leading-relaxed">
              Upload a specific thumbnail to copy its exact composition, typography style, and layout structure.
            </p>
            
            {referenceImage ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/20 bg-black/50 group">
                <img src={referenceImage} alt="Reference anchor" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setReferenceImage(null)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
                <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold py-1.5 px-3 truncate border-t border-white/10">
                  Image attached to prompt
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-video border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 transition-all rounded-xl cursor-pointer bg-white/[0.02]">
                <span className="material-symbols-outlined text-white/20 text-3xl mb-2">add_photo_alternate</span>
                <span className="text-xs font-semibold text-white/60">Upload Image</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  disabled={isProcessing}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setReferenceImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

