import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { GoogleGenAI } from '@google/genai';
import { getGeminiApiKey } from '../lib/gemini';
import { Link } from 'react-router-dom';

export default function YTAndInstaPostsCreator() {
  const { addGeneration, profiles, savePost, savedPosts, deletePost, deductCredits } = useAppContext();
  const [targetPlatform, setTargetPlatform] = useState('youtube');
  const [tone, setTone] = useState('Engaging & Conversational');
  const [customTone, setCustomTone] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [generatedPosts, setGeneratedPosts] = useState<{title: string, content: string, tags: string[]}[]>([]);

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
      if (!apiKey) throw new Error("Gemini API Key is missing. Please add it in Settings.");
      const ai = new GoogleGenAI({ apiKey });
      
      const profileData = profiles[targetPlatform];
      const styleContext = profileData?.analysis 
        ? `\n\nCRITICAL: Match this creator's specific style and tone based on their profile analysis:\n${profileData.analysis}`
        : '';

      const finalTone = tone === 'Custom' ? customTone : tone;

      const prompt = `You are a world-class, highly-paid social media copywriter and strategist. Your task is to create 2 distinct, highly engaging, and viral-worthy variations of a ${targetPlatform === 'youtube' ? 'YouTube Community Post' : 'Instagram Caption'} based on the provided source material.

      You MUST deeply analyze the source material provided. 

      IMPORTANT: If the source material is a URL, use your search tools to find and analyze the content (video transcript, article text, etc.) to understand the core message, nuances, and unique value. Do not hallucinate.

      Source Material:
      "${contentToProcess}"
      
      Requested Tone: ${finalTone}${styleContext}
      
      CRITICAL INSTRUCTIONS:
      1. Deep Comprehension: Ensure the post reflects the profound insights of the source material. If the source is a video, capture the speaker's unique perspective and frameworks.
      2. Hook the reader immediately in the first sentence. Stop the scroll. Use a bold claim, a surprising statistic, or a deep question.
      3. Provide real value, insight, or entertainment based on the source material. Do not just summarize; elevate the content. Extract specific "nuggets" of wisdom.
      4. Format for readability: Use short paragraphs, strategic line breaks, and appropriate emojis (don't overdo it).
      5. Include a strong, clear Call to Action (CTA) at the end (e.g., "Watch the full video", "Link in bio", "What do you think? Let me know below!").
      6. ${targetPlatform === 'youtube' ? 'For YouTube: Keep it conversational, ask questions to drive comments, and tease upcoming or linked video content. Use polls or open-ended questions.' : 'For Instagram: Make it visually descriptive, use engaging storytelling, and encourage saves/shares. Write it as if it accompanies a high-quality photo or reel.'}
      7. Generate 3-5 highly relevant hashtags.
      
      Return the response in valid JSON format with this exact structure:
      {
        "posts": [
          {
            "title": "Variation 1 - [Short description of style, e.g., Story-driven & Emotional]",
            "content": "The actual post content here...",
            "tags": ["tag1", "tag2"]
          },
          {
            "title": "Variation 2 - [Short description of style, e.g., Punchy & Action-Oriented]",
            "content": "The actual post content here...",
            "tags": ["tag1", "tag2"]
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
      
      let responseText = response.text || '{"posts": []}';
      responseText = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.warn("Failed to parse JSON directly:", responseText);
        result = { posts: [] };
      }

      setGeneratedPosts(result.posts || []);
      addGeneration('Social Post');
      
      // Save each generated post
      if (result.posts) {
        result.posts.forEach((p: any) => {
          savePost({
            platform: targetPlatform,
            tone: finalTone,
            content: p.content,
            tags: p.tags || []
          });
        });
      }
    } catch (error: any) {
      console.error("Generation failed", error);
      let errorMsg = error?.message || 'Unknown error';
      if (errorMsg === 'Failed to fetch' || errorMsg.includes('Failed to fetch')) {
        errorMsg = 'Connection failed. If you provided a custom API Key, ensure it is completely valid. Invalid keys trigger network fetch errors due to CORS restrictions.';
      }
      alert(`Failed to generate posts. Error: ${errorMsg}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAll = () => {
    const allText = generatedPosts.map(p => `${p.content}\n\n${p.tags.map(t => `#${t}`).join(' ')}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopy = (index: number, post: any) => {
    const text = `${post.content}\n\n${post.tags.map((t: string) => `#${t}`).join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
          <span>Content Lab</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-primary">YT & Insta Posts Creator</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface">Social Post Studio</h1>
        <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed mt-4">
          Generate engaging YouTube Community posts and Instagram captions from your existing videos, links, or ideas.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-8 items-start mb-16">
        <section className="col-span-12 lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Source Material (Text, Link, or Doc)</label>
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
              className="w-full h-32 bg-surface-container-low border-0 rounded-lg p-5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all resize-none font-body leading-relaxed mb-4" 
              placeholder="Paste your video transcript, a link to an article, or a rough idea..."
            ></textarea>
            
            <div className="space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Target Platform</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setTargetPlatform('youtube')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg font-bold transition-all ${targetPlatform === 'youtube' ? 'border-2 border-primary bg-primary/5 text-primary' : 'border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container'}`}
                >
                  <span className="material-symbols-outlined">smart_display</span>
                  YouTube
                </button>
                <button 
                  onClick={() => setTargetPlatform('instagram')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg font-bold transition-all ${targetPlatform === 'instagram' ? 'border-2 border-primary bg-primary/5 text-primary' : 'border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container'}`}
                >
                  <span className="material-symbols-outlined">camera_roll</span>
                  Instagram
                </button>
              </div>
              {profiles[targetPlatform] && (
                <div className="mt-2 p-3 bg-green-50 text-green-800 rounded-lg text-xs font-medium flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Using connected {targetPlatform} profile analysis to match your style.</span>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Tone of Voice</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-surface-container-low border-0 rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary transition-all font-medium"
              >
                <option>Engaging & Conversational</option>
                <option>Professional & Informative</option>
                <option>Humorous & Witty</option>
                <option>Inspirational & Motivational</option>
                <option>Custom</option>
              </select>
              
              {tone === 'Custom' && (
                <input 
                  type="text"
                  value={customTone}
                  onChange={(e) => setCustomTone(e.target.value)}
                  placeholder="e.g. Sarcastic but helpful, Gen Z slang..."
                  className="w-full bg-surface-container-low border-0 rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary transition-all font-medium mt-2"
                />
              )}
            </div>

            <div className="mt-10">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !sourceText.trim() || (tone === 'Custom' && !customTone.trim())}
                className="w-full py-5 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-lg font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">auto_awesome</span>
                    Generate Posts
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold">Generated Variations</h3>
            {generatedPosts.length > 0 && (
              <div className="flex gap-3">
                <button 
                  onClick={handleCopyAll}
                  className="px-4 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/10 text-on-surface font-bold text-sm flex items-center gap-2 hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">{copiedAll ? 'check' : 'content_copy'}</span>
                  {copiedAll ? 'Copied!' : 'Copy All'}
                </button>
              </div>
            )}
          </div>

          {generatedPosts.length === 0 && !isGenerating && (
            <div className="bg-surface-container-lowest rounded-xl p-12 border border-outline-variant/10 text-center flex flex-col items-center justify-center min-h-[300px]">
              <span className="material-symbols-outlined text-4xl text-outline mb-4">edit_document</span>
              <p className="text-on-surface-variant font-medium">Enter your source material and click generate to create posts.</p>
            </div>
          )}

          {generatedPosts.map((post, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant/10 relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={() => handleCopy(index, post)}
                  className="p-2 bg-surface-container-low rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">{copiedIndex === index ? 'check' : 'content_copy'}</span>
                </button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${targetPlatform === 'youtube' ? 'bg-red-100 text-red-600' : 'bg-pink-100 text-pink-600'}`}>
                  <span className="material-symbols-outlined">{targetPlatform === 'youtube' ? 'smart_display' : 'camera_roll'}</span>
                </div>
                <div>
                  <p className="font-bold text-sm">{targetPlatform === 'youtube' ? 'YouTube Community Post' : 'Instagram Caption'}</p>
                  <p className="text-xs text-on-surface-variant">{post.title}</p>
                </div>
              </div>
              <p className="text-on-surface whitespace-pre-line leading-relaxed">
                {post.content}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span key={i} className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Recent Saved Posts */}
      <div className="mt-16 border-t border-outline-variant/10 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Recent Saved Posts</h2>
          <Link to="/saved-posts" className="text-sm font-bold text-primary hover:underline">See All Saved</Link>
        </div>
        
        {savedPosts.length === 0 ? (
          <div className="text-center text-on-surface-variant py-8">No saved posts yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant/10 relative group flex flex-col">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button 
                    onClick={() => deletePost(post.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete Post"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${post.platform === 'youtube' ? 'bg-red-100 text-red-600' : 'bg-pink-100 text-pink-600'}`}>
                    <span className="material-symbols-outlined">{post.platform === 'youtube' ? 'smart_display' : 'camera_roll'}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{post.platform === 'youtube' ? 'YouTube Community Post' : 'Instagram Caption'}</p>
                    <p className="text-xs text-on-surface-variant">{post.date}</p>
                  </div>
                </div>
                <p className="text-on-surface whitespace-pre-line leading-relaxed flex-1 line-clamp-4">
                  {post.content}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">#{tag}</span>
                  ))}
                  {post.tags.length > 3 && <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded-md">+{post.tags.length - 3}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
