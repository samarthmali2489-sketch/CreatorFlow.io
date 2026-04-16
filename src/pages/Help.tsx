import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export default function Help() {
  const { user } = useAppContext();
  const [activeSection, setActiveSection] = useState('getting-started');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert([
          { 
            user_email: user?.email || 'anonymous@creatorflow.com',
            message: contactMessage
          }
        ]);

      if (error) throw error;
      
      setSubmitStatus('success');
      setTimeout(() => {
        setIsContactModalOpen(false);
        setContactMessage('');
        setSubmitStatus('idle');
      }, 2000);
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: 'flag' },
    { id: 'analytics', label: 'Analytics Dashboard', icon: 'insert_chart' },
    { id: 'video-to-reels', label: 'Video to Reels', icon: 'movie' },
    { id: 'linkedin-carousels', label: 'LinkedIn Carousels', icon: 'view_carousel' },
    { id: 'yt-insta-posts', label: 'YT & Insta Posts', icon: 'dynamic_feed' },
    { id: 'thumbnail-creator', label: 'Thumbnail Creator', icon: 'wallpaper' },
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
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="w-full bg-white border border-outline-variant/30 text-on-surface px-4 py-2 rounded-lg font-bold hover:bg-zinc-50 transition-colors text-sm"
            >
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

          {activeSection === 'thumbnail-creator' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-4">Thumbnail Creator</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Generate high-CTR, click-worthy YouTube thumbnails instantly using Google's latest Imagen technology, heavily customized for your specific video topic.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold">How it works</h3>
                
                <div className="flex gap-6 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 mt-1">1</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Enter Your Topic</h4>
                    <p className="text-on-surface-variant">Type in exactly what your video is about. Be specific to get more tailored visual metaphors.</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 mt-1">2</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Select A Style</h4>
                    <p className="text-on-surface-variant">Choose from proven styles like "MrBeast / High Energy" or select "Custom" to type out your exact desired visual aesthetic (e.g. Cyberpunk, Minimalist vector).</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 mt-1">3</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Channel Inspiration Tool</h4>
                    <p className="text-on-surface-variant">Want to mimic your favorite creator? Type in their YouTube channel name. The AI connects to Google Search live to analyze their recent thumbnails' lighting, grading, and composition to replicate their aesthetic!</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 mt-1">4</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Save & Download</h4>
                    <p className="text-on-surface-variant">You'll receive 3 text-free backgrounds. You can download them directly or save them to your library to use later with Photoshop or Canva.</p>
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

      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-zinc-900">Contact Support</h3>
              <button onClick={() => setIsContactModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors">
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            </div>
            <form onSubmit={handleContactSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">How can we help?</label>
                <textarea
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Describe your issue or question..."
                  className="w-full h-32 bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-bold flex items-center gap-2 animate-in fade-in">
                  <span className="material-symbols-outlined">check_circle</span>
                  Message sent successfully!
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-bold flex items-center gap-2 animate-in fade-in">
                  <span className="material-symbols-outlined">error</span>
                  Failed. Check Database rules.
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-4 py-2 font-bold text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dim transition-all disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
