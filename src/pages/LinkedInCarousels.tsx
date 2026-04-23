import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { GoogleGenAI, getGeminiApiKey } from '../lib/gemini';
import { Link } from 'react-router-dom';
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

type Slide = {
  type: 'hook' | 'problem' | 'value' | 'list' | 'conclusion';
  title: string;
  content?: string;
  points?: string[];
};

type Theme = {
  id: string;
  background: string;
  text: string;
  subtext: string;
  accent: string;
  accentBg: string;
  font: string;
  pattern: string;
};

const DYNAMIC_THEMES: Theme[] = [
  { id: 'midnight-blue', background: 'bg-slate-900', text: 'text-white', subtext: 'text-slate-300', accent: 'text-blue-400', accentBg: 'bg-blue-500', font: 'font-sans', pattern: 'radial-gradient(circle at top right, rgba(59,130,246,0.15), transparent 50%)' },
  { id: 'minimal-light', background: 'bg-white', text: 'text-zinc-900', subtext: 'text-zinc-500', accent: 'text-zinc-900', accentBg: 'bg-zinc-900', font: 'font-serif', pattern: 'none' },
  { id: 'emerald-city', background: 'bg-emerald-950', text: 'text-emerald-50', subtext: 'text-emerald-200/70', accent: 'text-emerald-400', accentBg: 'bg-emerald-500', font: 'font-sans', pattern: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, transparent 100%)' },
  { id: 'sunset-orange', background: 'bg-orange-50', text: 'text-orange-950', subtext: 'text-orange-800/70', accent: 'text-orange-600', accentBg: 'bg-orange-600', font: 'font-sans', pattern: 'radial-gradient(circle at bottom left, rgba(249,115,22,0.1), transparent 60%)' },
  { id: 'cyberpunk', background: 'bg-zinc-950', text: 'text-fuchsia-50', subtext: 'text-fuchsia-200/60', accent: 'text-fuchsia-400', accentBg: 'bg-fuchsia-500', font: 'font-mono', pattern: 'linear-gradient(to bottom, rgba(217,70,239,0.05), rgba(168,85,247,0.05))' },
  { id: 'corporate-trust', background: 'bg-blue-50', text: 'text-blue-950', subtext: 'text-blue-800/70', accent: 'text-blue-700', accentBg: 'bg-blue-700', font: 'font-sans', pattern: 'none' },
];

export default function LinkedInCarousels() {
  const { addGeneration, profiles, saveCarousel, savedCarousels, deleteCarousel, deductCredits } = useAppContext();
  const [sourceText, setSourceText] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme>(DYNAMIC_THEMES[0]);
  
  // Personal Branding State
  const [creatorName, setCreatorName] = useState('Creator Name');
  const [creatorHandle, setCreatorHandle] = useState('@creator');
  
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (slideRefs.current[activeSlide]) {
      slideRefs.current[activeSlide]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeSlide]);

  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleGenerate = async () => {
    if (!sourceText.trim()) return;

    if (!deductCredits(10)) {
      alert("Not enough credits! Please upgrade your plan.");
      return;
    }
    
    setIsGenerating(true);
    try {
      let contentToProcess = sourceText;

      // If the input is a URL, scrape it first
      if (isUrl(sourceText.trim())) {
        try {
          const res = await fetch('/api/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: sourceText.trim() })
          });
          if (res.ok) {
            const data = await res.json();
            contentToProcess = data.text;
          } else {
            console.warn("Failed to scrape URL, falling back to using URL as text");
          }
        } catch (e) {
          console.warn("Error scraping URL:", e);
        }
      }

      const apiKey = getGeminiApiKey();
      if (!apiKey) throw new Error("Server configuration issue. AI key is missing from backend.");
      const ai = new GoogleGenAI({ apiKey });
      
      const profileData = profiles['linkedin'];
      const styleContext = profileData?.analysis 
        ? `\n\nCRITICAL: Match this creator's specific style and tone based on their LinkedIn profile analysis:\n${profileData.analysis}`
        : '';

      const instructionsContext = customInstructions.trim() 
        ? `\n\nAdditional Custom Instructions for the Carousel:\n${customInstructions}`
        : '';

      const prompt = `You are a world-class LinkedIn ghostwriter and personal branding expert. Your task is to create a highly engaging, high-converting ${slideCount}-slide carousel.
      
      You MUST deeply analyze the source material provided. 
      
      IMPORTANT: If the source material is a URL, use your search tools to find and analyze the content (video transcript, article text, etc.) to understand the core message, nuances, and unique value. Do not hallucinate.
      
      Source Material:
      "${contentToProcess}"
      ${styleContext}
      ${instructionsContext}
      
      CRITICAL INSTRUCTIONS (THE CAROUSEL FORMULA):
      You must strictly follow this narrative flow for the ${slideCount} slides:
      
      1. Slide 1 (type: "hook"): The Hook. Must be an irresistible hook. Use a big, bold question or a controversial statement from the video. Keep it under 15 words. Stop the scroll.
      2. Slide 2 (type: "problem"): The Problem. Why the viewer should care. Agitate the pain point that the source material solves.
      3. Slides 3 to ${slideCount - 1} (type: "value" or "list"): The Value. Break down the core message into easily digestible, punchy slides. Use lists, frameworks, steps, or "nuggets" extracted directly from the source. Every word must earn its place.
      4. Slide ${slideCount} (type: "conclusion"): The CTA. Summarize the main takeaway and include a strong Call to Action (e.g., "Follow for more", "Save this post", "What's your take?").
      
      Formatting: Keep sentences short. Use whitespace effectively.
      
      Return the response in valid JSON format with this exact structure:
      {
        "carouselTitle": "A catchy, short title for this carousel (not a URL)",
        "slides": [
          {
            "type": "hook", // Must be exactly "hook", "problem", "value", "list", or "conclusion"
            "title": "Main headline for the slide (short and punchy)",
            "content": "Optional subtext or paragraph (keep it brief)",
            "points": ["Optional bullet point 1", "Optional bullet point 2"] // Only use for "list" type
          }
        ]
      }
      Make sure there are exactly ${slideCount} slides.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          tools: [{ googleSearch: {} }]
        }
      });
      
      let responseText = response.text || '{"slides": []}';
      // Strip markdown code block formatting if present
      responseText = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.warn("Failed to parse JSON directly, attempting fallback:", responseText);
        result = { slides: [] };
      }

      setSlides(result.slides || []);
      setActiveSlide(0);
      
      // Randomize theme for "Nano Banana" dynamic workflow
      const randomTheme = DYNAMIC_THEMES[Math.floor(Math.random() * DYNAMIC_THEMES.length)];
      setCurrentTheme(randomTheme);
      
      addGeneration('LinkedIn Carousel');
      
      if (result.slides && result.slides.length > 0) {
        saveCarousel({
          topic: result.carouselTitle || sourceText.substring(0, 50) + (sourceText.length > 50 ? '...' : ''),
          slides: result.slides,
          theme: randomTheme
        });
      }
    } catch (error: any) {
      console.error("Generation failed", error);
      let errorMsg = error?.message || 'Unknown error';
      if (errorMsg === 'Failed to fetch' || errorMsg.includes('Failed to fetch')) {
        errorMsg = 'Connection failed. High traffic or network issues may be affecting the service. Please try again shortly.';
      }
      alert(`Failed to generate carousel. Error: ${errorMsg}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    if (slides.length === 0) return;
    setIsExporting(true);
    
    try {
      const zip = new JSZip();
      const folder = zip.folder("carousel_images");
      
      if (!folder) throw new Error("Could not create zip folder");

      for (let i = 0; i < slides.length; i++) {
        const slideElement = slideRefs.current[i];
        if (slideElement) {
          // Temporarily ensure the element is visible and rendered properly for html-to-image
          const dataUrl = await htmlToImage.toPng(slideElement, {
            quality: 1.0,
            pixelRatio: 2, // High resolution
            style: {
              transform: 'scale(1)',
              transformOrigin: 'top left'
            }
          });
          
          // Remove data:image/png;base64,
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
          folder.file(`slide_${i + 1}.png`, base64Data, { base64: true });
        }
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "linkedin_carousel.zip");
      
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export images. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const formatSlidesText = (slides: any[]) => {
    return slides.map((s, i) => {
      let slideText = `Slide ${i + 1}:\n${s.title || ''}\n${s.content || ''}`;
      if (s.points && s.points.length > 0) {
        slideText += '\n' + s.points.map((p: string) => `- ${p}`).join('\n');
      }
      return slideText.trim() + '\n';
    }).join('\n');
  };

  const handlePost = () => {
    setIsPosting(true);
    const text = formatSlidesText(slides);
    navigator.clipboard.writeText(text);
    setTimeout(() => {
      setIsPosting(false);
      alert("Text copied to clipboard! Opening LinkedIn...\n\nNote: Please attach your exported carousel images manually on LinkedIn.");
      const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }, 500);
  };

  const renderSlide = (slide: Slide, index: number) => {
    const { background, text, subtext, accent, accentBg, font, pattern } = currentTheme;

    return (
      <div 
        key={index} 
        ref={el => slideRefs.current[index] = el}
        className={`snap-center shrink-0 w-[450px] aspect-square shadow-2xl rounded-xl relative overflow-hidden ${background} ${font}`}
        style={{ backgroundImage: pattern }}
      >
        <div className="relative h-full p-12 flex flex-col justify-center z-10">
          {slide.type === 'hook' && <div className={`w-12 h-1 mb-8 ${accentBg}`}></div>}
          {slide.type !== 'hook' && <p className={`${accent} text-xs font-bold uppercase tracking-[0.2em] mb-6`}>{slide.type}</p>}
          
          <h2 className={`text-3xl lg:text-4xl font-black tracking-tighter leading-[1.2] mb-6 ${text}`}>
            {slide.title}
          </h2>
          
          {slide.content && (
            <p className={`text-lg leading-relaxed ${subtext}`}>
              {slide.content}
            </p>
          )}
          
          {slide.points && slide.points.length > 0 && (
            <div className="space-y-4 mt-4">
              {slide.points.map((point, i) => (
                <div key={i} className={`flex items-start gap-4 ${subtext}`}>
                  <span className={`material-symbols-outlined ${accent} mt-0.5`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-sm md:text-base">{point}</span>
                </div>
              ))}
            </div>
          )}
          
          {slide.type === 'hook' && (
            <div className="absolute bottom-12 left-12 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-black/10 overflow-hidden border-2 border-white/20 shadow-sm flex items-center justify-center">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnD-eDeaQtm5TCuJeN5MI4wp-WNoGEWVe4JWtVgNdNgr6CnDqzr9w9r4Ar6AQnGo1dww_u5_Ih0BQh8WkawS9fxAUpNRUdkCyaK5oHTBaGh2rMeqIaxwVZtru9r5LXIecLV-Qi5fJVemZnYOK0k2U-GfRURfH2iMBI5as6vBdfCnx_Z_mrFYaO8tfWaoG8vuuusOyaAl9InIaktHOybgkC-EN_VAj5v14Y4miWHkbfBzdfx6pDx-LzbNvaUCDmdjNL1-sUY27hdXm-" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className={`font-bold text-sm ${text}`}>{creatorName}</p>
                <p className={`text-xs ${subtext}`}>{creatorHandle}</p>
              </div>
            </div>
          )}
          
          {slide.type !== 'hook' && (
            <div className="absolute bottom-8 left-12 flex items-center gap-3 opacity-80">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnD-eDeaQtm5TCuJeN5MI4wp-WNoGEWVe4JWtVgNdNgr6CnDqzr9w9r4Ar6AQnGo1dww_u5_Ih0BQh8WkawS9fxAUpNRUdkCyaK5oHTBaGh2rMeqIaxwVZtru9r5LXIecLV-Qi5fJVemZnYOK0k2U-GfRURfH2iMBI5as6vBdfCnx_Z_mrFYaO8tfWaoG8vuuusOyaAl9InIaktHOybgkC-EN_VAj5v14Y4miWHkbfBzdfx6pDx-LzbNvaUCDmdjNL1-sUY27hdXm-" alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
              <p className={`text-xs font-bold ${subtext}`}>{creatorHandle}</p>
            </div>
          )}
          
          <div className={`absolute top-12 right-12 text-8xl font-black select-none pointer-events-none opacity-10 ${text}`}>
            {String(index + 1).padStart(2, '0')}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
          <span>Content Lab</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-primary">LinkedIn Carousel Creator</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-4">New Carousel Studio</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl">Powered by the Nano Banana Dynamic Engine. Every generation analyzes the full video context and creates a completely unique visual theme.</p>
      </header>

      <div className="grid grid-cols-12 gap-8 items-start">
        <section className="col-span-12 lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Topic & Narrative (Text, Link, or Doc)</label>
              <label className="cursor-pointer text-primary hover:text-primary-dim flex items-center gap-1 text-xs font-bold transition-colors">
                <span className="material-symbols-outlined text-sm">upload_file</span>
                Upload Doc
                <input 
                  type="file" 
                  accept=".txt,.md,.csv" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => setSourceText(e.target?.result as string);
                      reader.readAsText(file);
                    }
                  }} 
                />
              </label>
            </div>
            <textarea 
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="w-full h-40 bg-surface-container-low border-0 rounded-lg p-5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all resize-none font-body leading-relaxed" 
              placeholder="Paste a YouTube link here! The AI will watch the entire video and extract the best insights for your carousel..."
            ></textarea>
            
            {profiles['linkedin'] && (
              <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg text-xs font-medium flex items-start gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Using connected LinkedIn profile analysis to match your style.</span>
              </div>
            )}
            
            <div className="mt-6 space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Custom Instructions</label>
              <input 
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. Focus on actionable tips, use bullet points..."
                className="w-full bg-surface-container-low border-0 rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary transition-all font-medium"
              />
            </div>

            <div className="mt-6 space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Number of Slides: {slideCount}</label>
              <input 
                type="range"
                min="3"
                max="10"
                value={slideCount}
                onChange={(e) => setSlideCount(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                <span>3</span>
                <span>10</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Personal Branding</label>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Creator Name"
                  className="w-full bg-surface-container-low border-0 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary transition-all text-sm"
                />
                <input 
                  type="text"
                  value={creatorHandle}
                  onChange={(e) => setCreatorHandle(e.target.value)}
                  placeholder="@handle"
                  className="w-full bg-surface-container-low border-0 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary transition-all text-sm"
                />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Visual Theme</label>
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary">shuffle</span>
                <span className="text-sm font-bold text-on-surface">Auto-Randomized (Nano Banana Engine)</span>
              </div>
              <p className="text-xs text-on-surface-variant">A unique, high-converting design is generated every time.</p>
            </div>

            <div className="mt-10">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !sourceText.trim()}
                className="w-full py-5 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-lg font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Analyzing Video & Generating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">auto_awesome</span>
                    Generate Carousel
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-surface-container-high/50 rounded-xl p-6 border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">tips_and_updates</span>
              <h4 className="font-bold text-on-surface">Pro Tip</h4>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Paste a YouTube link! The AI will fetch the full transcript, deeply analyze the speaker's core message, and extract the best frameworks automatically.
            </p>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
          <div className="flex items-center justify-between px-4">
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                disabled={slides.length === 0 || activeSlide === 0}
                className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-lowest transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined">west</span>
              </button>
              <button 
                onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))}
                disabled={slides.length === 0 || activeSlide === slides.length - 1}
                className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-lowest transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined">east</span>
              </button>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExport}
                disabled={isExporting || slides.length === 0}
                className="px-6 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/10 text-on-surface font-bold text-sm flex items-center gap-2 hover:bg-surface-container-low transition-colors disabled:opacity-70"
              >
                {isExporting ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-sm">imagesmode</span>}
                {isExporting ? 'Generating ZIP...' : 'Export as Images (ZIP)'}
              </button>
              <button 
                onClick={handlePost}
                disabled={isPosting || slides.length === 0}
                className="px-6 py-2 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center gap-2 hover:bg-primary-dim transition-colors disabled:opacity-70"
              >
                {isPosting ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-sm">send</span>}
                {isPosting ? 'Posting...' : 'Post to LinkedIn'}
              </button>
            </div>
          </div>

          {slides.length === 0 && !isGenerating && (
            <div className="bg-surface-container-lowest rounded-xl p-12 border border-outline-variant/10 text-center flex flex-col items-center justify-center min-h-[450px]">
              <span className="material-symbols-outlined text-4xl text-outline mb-4">view_carousel</span>
              <p className="text-on-surface-variant font-medium">Enter your topic or paste a YouTube link and click generate to create a carousel.</p>
            </div>
          )}

          {slides.length > 0 && (
            <>
              <div className="slide-preview-container flex gap-8 overflow-x-auto pb-8 snap-x px-4 scroll-smooth">
                {slides.map((slide, index) => renderSlide(slide, index))}
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 shadow-sm">
                <div className="flex gap-2 p-1 overflow-x-auto">
                  {slides.map((_, index) => (
                    <div 
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={`w-12 h-16 rounded flex-shrink-0 cursor-pointer transition-all ${activeSlide === index ? 'border-2 border-primary scale-110' : 'border border-outline-variant/20 opacity-50 hover:opacity-100'} ${currentTheme.background}`}
                      style={{ backgroundImage: currentTheme.pattern }}
                    ></div>
                  ))}
                </div>
                <div className="h-8 w-[1px] bg-outline-variant/20 mx-2"></div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{activeSlide + 1} / {slides.length} slides</span>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">Theme: {currentTheme.id}</span>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Recent Saved Carousels */}
      <div className="mt-16 border-t border-outline-variant/10 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Recent Saved Carousels</h2>
          <Link to="/saved-carousels" className="text-sm font-bold text-primary hover:underline">See All Saved</Link>
        </div>
        
        {savedCarousels.length === 0 ? (
          <div className="text-center text-on-surface-variant py-8">No saved carousels yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCarousels.slice(0, 3).map((carousel) => (
              <div key={carousel.id} className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant/10 relative group flex flex-col">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button 
                    onClick={() => deleteCarousel(carousel.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete Carousel"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                    <span className="material-symbols-outlined">view_carousel</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">LinkedIn Carousel</p>
                    <p className="text-xs text-on-surface-variant">{carousel.date}</p>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{carousel.topic}</h3>
                <p className="text-on-surface-variant text-sm mb-4">{carousel.slides.length} slides</p>
                <div className="flex gap-2 mt-auto overflow-hidden">
                  {carousel.slides.slice(0, 4).map((_, i) => (
                    <div key={i} className={`w-8 h-10 rounded border border-outline-variant/20 flex-shrink-0 flex items-center justify-center ${carousel.theme?.background || 'bg-surface-container-low'}`} style={{ backgroundImage: carousel.theme?.pattern }}>
                      <span className={`text-[8px] font-bold ${carousel.theme?.text || 'text-on-surface'}`}>{i+1}</span>
                    </div>
                  ))}
                  {carousel.slides.length > 4 && (
                    <div className="w-8 h-10 bg-surface-container rounded border border-outline-variant/20 flex items-center justify-center text-[10px] font-bold text-on-surface-variant flex-shrink-0">
                      +{carousel.slides.length - 4}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
