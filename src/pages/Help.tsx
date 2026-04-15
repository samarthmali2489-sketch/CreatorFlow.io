import React, { useState } from 'react';

export default function Help() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: 'flag' },
    { id: 'analytics', label: 'Analytics Dashboard', icon: 'insert_chart' },
    { id: 'video-to-reels', label: 'Video to Reels', icon: 'movie' },
    { id: 'linkedin-carousels', label: 'LinkedIn Carousels', icon: 'view_carousel' },
    { id: 'yt-insta-posts', label: 'YT & Insta Posts', icon: 'dynamic_feed' },
    { id: 'product-photo-studio', label: 'Product Photo Studio', icon: 'shopping_cart' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-3">
          <span className="material-symbols-outlined text-sm">menu_book</span>
          <span>Documentation</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface mb-4">Help Center</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl">Learn how to use CreatorFlow to 10x your content output and streamline your workflow.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Docs Sidebar */}
        <aside className="w-full md:w-64 shrink-0 sticky top-24">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left ${
                  activeSection === section.id
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
          
          <div className="mt-8 p-6 bg-surface-container-low rounded-2xl border border-outline-variant/20">
            <h4 className="font-bold mb-2">Need more help?</h4>
            <p className="text-sm text-on-surface-variant mb-4">Our support team is available 24/7 to assist you.</p>
            <button className="w-full bg-white border border-outline-variant/30 text-on-surface px-4 py-2 rounded-lg font-bold hover:bg-zinc-50 transition-colors text-sm">
              Contact Support
            </button>
          </div>
        </aside>

        {/* Docs Content */}
        <div className="flex-1 max-w-4xl bg-surface-container-lowest rounded-3xl p-8 md:p-12 border border-outline-variant/15 shadow-sm min-h-[600px]">
          
          {activeSection === 'getting-started' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-4">Welcome to CreatorFlow</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  CreatorFlow is your all-in-one AI-powered studio for content creation, analytics, and e-commerce growth. 
                  This guide will help you navigate the platform and get the most out of our tools.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined">science</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Content Lab</h3>
                  <p className="text-on-surface-variant text-sm">Transform long-form videos into shorts, generate carousels, and write viral posts.</p>
                </div>
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Shopify Tools</h3>
                  <p className="text-on-surface-variant text-sm">Generate professional product photos and SEO-optimized copy for your store.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-4">Analytics Dashboard</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Track your growth across all platforms in one unified view. Our analytics dashboard pulls data from YouTube, Instagram, and LinkedIn to give you actionable insights.
                </p>
              </div>

              <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full"></div>
                <h3 className="font-bold text-zinc-400 mb-6 uppercase tracking-widest text-xs">Visual Guide</h3>
                <div className="flex flex-col gap-4 relative z-10">
                  <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined">trending_up</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Growth Metrics</h4>
                      <p className="text-xs text-zinc-400">See your follower growth and engagement rates at a glance.</p>
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined">bar_chart</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Performance Charts</h4>
                      <p className="text-xs text-zinc-400">Interactive charts showing views, likes, and shares over time.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'video-to-reels' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-4">Video to Reels</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Automatically convert your horizontal YouTube videos into vertical, engaging shorts for TikTok, Instagram Reels, and YouTube Shorts.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold">How it works</h3>
                
                <div className="flex gap-6 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 mt-1">1</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Upload or Link</h4>
                    <p className="text-on-surface-variant">Upload an MP4 file or paste a YouTube link. Our AI will download and process the video.</p>
                    <div className="mt-3 bg-surface-container p-4 rounded-xl border border-outline-variant/20 flex items-center justify-center gap-4">
                      <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
                      <span className="material-symbols-outlined text-3xl text-zinc-300">arrow_forward</span>
                      <span className="material-symbols-outlined text-3xl text-red-500">smart_display</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 mt-1">2</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">AI Face Tracking</h4>
                    <p className="text-on-surface-variant">The AI automatically detects the active speaker and crops the video to 9:16, keeping them perfectly centered.</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 mt-1">3</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Dynamic Captions</h4>
                    <p className="text-on-surface-variant">Alex Hormozi-style captions are generated and synced perfectly with the audio to maximize retention.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'linkedin-carousels' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-4">LinkedIn Carousels</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Turn any idea, article, or video transcript into a high-converting, multi-slide LinkedIn carousel in seconds.
                </p>
              </div>

              <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100">
                <h3 className="text-xl font-bold text-blue-900 mb-6">The Carousel Formula</h3>
                
                <div className="flex overflow-x-auto pb-4 gap-4 snap-x">
                  <div className="shrink-0 w-48 h-48 bg-white rounded-xl shadow-sm border border-blue-100 p-4 flex flex-col justify-center items-center text-center snap-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Slide 1</span>
                    <h4 className="font-black text-lg text-zinc-900">The Hook</h4>
                    <p className="text-xs text-zinc-500 mt-2">A bold statement to stop the scroll.</p>
                  </div>
                  <div className="shrink-0 w-48 h-48 bg-white rounded-xl shadow-sm border border-blue-100 p-4 flex flex-col justify-center items-center text-center snap-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Slides 2-4</span>
                    <h4 className="font-black text-lg text-zinc-900">The Value</h4>
                    <p className="text-xs text-zinc-500 mt-2">Actionable steps and frameworks.</p>
                  </div>
                  <div className="shrink-0 w-48 h-48 bg-white rounded-xl shadow-sm border border-blue-100 p-4 flex flex-col justify-center items-center text-center snap-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Last Slide</span>
                    <h4 className="font-black text-lg text-zinc-900">The CTA</h4>
                    <p className="text-xs text-zinc-500 mt-2">"Follow for more tips."</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Pro Tips</h3>
                <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
                  <li>Paste a YouTube link to automatically extract the transcript and turn it into a carousel.</li>
                  <li>Use the "Custom Instructions" field to dictate the exact tone (e.g., "Make it sound like Naval Ravikant").</li>
                  <li>Adjust the slide count slider to control the depth of the content.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'yt-insta-posts' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-4">YT & Insta Posts</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Generate highly engaging YouTube Community posts and Instagram captions tailored to your specific audience and tone.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-red-500 text-3xl">smart_display</span>
                    <h3 className="text-xl font-bold">YouTube Community</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-4">Optimized for driving engagement, asking questions, and teasing upcoming videos.</p>
                  <div className="bg-white p-4 rounded-xl text-xs border border-outline-variant/20 shadow-sm">
                    <p className="font-bold mb-2">Example Output:</p>
                    <p className="text-zinc-600">"Just wrapped up editing the new video on AI workflows... 🤯 What's the biggest bottleneck in your creation process right now? Let me know below! 👇"</p>
                  </div>
                </div>

                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-pink-500 text-3xl">camera_roll</span>
                    <h3 className="text-xl font-bold">Instagram Captions</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-4">Optimized for storytelling, visual descriptions, and encouraging saves/shares.</p>
                  <div className="bg-white p-4 rounded-xl text-xs border border-outline-variant/20 shadow-sm">
                    <p className="font-bold mb-2">Example Output:</p>
                    <p className="text-zinc-600">"The reality of building a creator business isn't always aesthetic desk setups. ☕️ Swipe to see the 3 frameworks that actually moved the needle for me this month. ➡️ Save this for your next planning session!"</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'product-photo-studio' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-4">Product Photo Studio</h2>
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Coming Soon</div>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Transform basic product photos into professional, studio-quality lifestyle images using AI.
                </p>
              </div>

              <div className="bg-zinc-900 rounded-3xl p-8 text-white text-center">
                <div className="flex justify-center items-center gap-8 mb-8">
                  <div className="w-32 h-32 bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-zinc-500">inventory_2</span>
                  </div>
                  <span className="material-symbols-outlined text-4xl text-primary">arrow_forward</span>
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/40 to-purple-500/40 rounded-xl border border-primary/50 flex items-center justify-center shadow-[0_0_30px_rgba(var(--color-primary),0.3)]">
                    <span className="material-symbols-outlined text-4xl text-white">auto_awesome</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Studio Quality, Zero Equipment</h3>
                <p className="text-zinc-400 max-w-md mx-auto">Upload a photo of your product on a plain background, and our AI will place it in stunning, realistic lifestyle scenes perfect for Shopify and Instagram.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
