import React, { useState, useEffect } from 'react';
import { GoogleGenAI, getGeminiApiKey } from '../lib/gemini';
import { useAppContext } from '../context/AppContext';

export default function Integrations() {
  const { setPlatformsConnected, saveProfileAnalysis, profiles } = useAppContext();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [integrations, setIntegrations] = useState([
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'Auto-publish Shorts and Community posts directly to your channel.',
      icon: 'smart_display',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      connected: false,
      comingSoon: false,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Schedule Reels and posts to your Instagram Business account.',
      icon: 'camera_roll',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      connected: false,
      comingSoon: false,
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'Push generated vertical videos straight to your TikTok drafts.',
      icon: 'music_note',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      connected: false,
      comingSoon: true,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Publish PDF carousels and text posts to your personal profile or company page.',
      icon: 'work',
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10',
      connected: false,
      comingSoon: false,
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Sync product catalogs and automatically update product images.',
      icon: 'shopping_bag',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      connected: false,
      comingSoon: true,
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Export generated scripts, captions, and ideas to your Notion workspace.',
      icon: 'description',
      color: 'text-zinc-800',
      bgColor: 'bg-zinc-800/10',
      connected: false,
      comingSoon: true,
    }
  ]);

  // Sync with context on load
  useEffect(() => {
    const connectedCount = Object.keys(profiles).length;
    setPlatformsConnected(connectedCount);
    
    setIntegrations(prev => prev.map(int => ({
      ...int,
      connected: !!profiles[int.id]
    })));
  }, [profiles, setPlatformsConnected]);

  const handleConnectClick = (id: string, comingSoon: boolean) => {
    if (comingSoon) return;
    
    const isConnected = profiles[id];
    if (isConnected) {
      // Disconnect
      saveProfileAnalysis(id, null);
    } else {
      setActiveModal(id);
      setUrlInput('');
    }
  };

  const runAnalysis = async () => {
    if (!urlInput || !activeModal) return;
    setIsAnalyzing(true);
    try {
      // 1. Try to scrape the URL for content
      let scrapedText = '';
      try {
        const res = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlInput.trim() })
        });
        if (res.ok) {
          const data = await res.json();
          scrapedText = data.text || '';
        }
      } catch (e) {
        console.warn("Scraping failed, falling back to URL-only analysis", e);
      }

      // 2. Analyze with Gemini
      const apiKey = getGeminiApiKey();
      if (!apiKey) throw new Error("Gemini API Key is missing. Please go to the Settings tab to securely add your custom API Key.");
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = scrapedText 
        ? `Analyze the following content scraped from the creator's ${activeModal} profile (${urlInput}). Extract their exact tone of voice, stylistic quirks, common topics, and target audience. Return a concise but highly detailed summary that can be used as a system prompt to mimic their style perfectly.\n\nContent:\n${scrapedText.substring(0, 15000)}`
        : `Analyze the creator's ${activeModal} profile based on this URL: ${urlInput}. If you recognize the creator, extract their exact tone of voice, stylistic quirks, common topics, and target audience. Return a concise but highly detailed summary that can be used as a system prompt to mimic their style perfectly.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }] // Use search grounding if scraping fails or to augment
        }
      });
      
      saveProfileAnalysis(activeModal, {
        url: urlInput,
        analysis: response.text
      });
      
      setActiveModal(null);
    } catch (e: any) {
      console.error("Analysis failed", e);
      let errorMsg = e?.message || 'Unknown error';
      if (errorMsg === 'Failed to fetch' || errorMsg.includes('Failed to fetch')) {
        errorMsg = 'Connection failed. This might be due to a temporary network issue or an invalid configuration. Please try again later or contact support if the problem persists.';
      }
      alert(`Failed to analyze profile. Error: ${errorMsg}`);
      setActiveModal(null);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto p-8 lg:p-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <header className="mb-16 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/20 mb-6 shadow-sm">
          <span className="material-symbols-outlined text-primary text-sm">hub</span>
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Ecosystem</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-on-surface mb-6">Integrations</h1>
        <p className="text-on-surface-variant text-xl leading-relaxed">
          Connect your favorite platforms to automate your content distribution and streamline your workflow.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {integrations.map((integration) => (
          <div key={integration.id} className="group relative bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/10 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-start justify-between mb-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${integration.bgColor} shadow-inner`}>
                <span className={`material-symbols-outlined text-3xl ${integration.color}`}>
                  {integration.icon}
                </span>
              </div>
              
              {integration.comingSoon ? (
                <span className="px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase text-zinc-500 bg-zinc-100 border border-zinc-200">
                  Soon
                </span>
              ) : (
                <button 
                  onClick={() => handleConnectClick(integration.id, integration.comingSoon)}
                  className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 ${integration.connected ? 'text-green-600 bg-green-50 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 group/btn' : 'text-primary bg-primary/10 border border-primary/20 hover:bg-primary hover:text-white cursor-pointer shadow-sm'}`}
                >
                  <span className="group-hover/btn:hidden">{integration.connected ? 'Connected' : 'Connect'}</span>
                  <span className="hidden group-hover/btn:inline">Disconnect</span>
                </button>
              )}
            </div>
            
            <h3 className="text-2xl font-bold mb-3 tracking-tight">{integration.name}</h3>
            <p className="text-on-surface-variant leading-relaxed flex-grow">
              {integration.description}
            </p>
            
            {integration.connected && profiles[integration.id] && (
              <div className="mt-8 pt-6 border-t border-outline-variant/10 relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">AI Analysis Active</p>
                </div>
                <p className="text-sm text-zinc-600 line-clamp-3 leading-relaxed bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">{profiles[integration.id].analysis}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Connection Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-[2rem] p-10 max-w-lg w-full shadow-2xl border border-outline-variant/20 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl text-primary">link</span>
            </div>
            <h3 className="text-3xl font-black tracking-tighter mb-3 capitalize">Connect {activeModal}</h3>
            <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">Enter your profile URL. Our AI will analyze your recent content to match your style and tone perfectly.</p>
            
            <input 
              type="url" 
              placeholder={`https://${activeModal}.com/...`}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-surface-container-low border-2 border-transparent rounded-xl p-5 mb-8 focus:border-primary focus:bg-surface-container-lowest outline-none transition-all text-lg font-medium placeholder:text-outline"
            />

            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-6 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                disabled={isAnalyzing}
              >
                Cancel
              </button>
              <button 
                onClick={runAnalysis}
                disabled={!urlInput || isAnalyzing}
                className="px-8 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary-dim transition-all disabled:opacity-50 flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isAnalyzing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">auto_awesome</span>
                    Analyze & Connect
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
