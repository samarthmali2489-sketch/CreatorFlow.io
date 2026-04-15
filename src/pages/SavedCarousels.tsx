import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function SavedCarousels() {
  const { savedCarousels, deleteCarousel, deleteAllSavedCarousels } = useAppContext();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCarousel, setSelectedCarousel] = useState<any | null>(null);

  const DEFAULT_THEME = { id: 'minimal-light', background: 'bg-white', text: 'text-zinc-900', subtext: 'text-zinc-500', accent: 'text-zinc-900', accentBg: 'bg-zinc-900', font: 'font-serif', pattern: 'none' };

  const formatSlidesText = (slides: any[]) => {
    return slides.map((s, i) => {
      let slideText = `Slide ${i + 1}:\n${s.title || ''}\n${s.content || ''}`;
      if (s.points && s.points.length > 0) {
        slideText += '\n' + s.points.map((p: string) => `- ${p}`).join('\n');
      }
      return slideText.trim() + '\n';
    }).join('\n');
  };

  const handleCopy = (id: string, slides: any[]) => {
    navigator.clipboard.writeText(formatSlidesText(slides));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePostToLinkedIn = (slides: any[]) => {
    const text = formatSlidesText(slides);
    navigator.clipboard.writeText(text);
    alert("Text copied to clipboard! Opening LinkedIn...\n\nNote: Please attach your exported carousel images manually on LinkedIn.");
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/content-lab/linkedin-carousels" className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface">Saved Carousels</h1>
            <p className="text-on-surface-variant mt-2">All your generated LinkedIn Carousels.</p>
          </div>
        </div>

        {savedCarousels.length > 0 && (
          <button 
            onClick={() => {
              if(window.confirm('Are you sure you want to delete all saved carousels?')) {
                deleteAllSavedCarousels();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
            Delete All
          </button>
        )}
      </header>

      {savedCarousels.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-12 border border-outline-variant/10 text-center flex flex-col items-center justify-center min-h-[300px]">
          <span className="material-symbols-outlined text-4xl text-outline mb-4">view_carousel</span>
          <p className="text-on-surface-variant font-medium">No saved carousels yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {savedCarousels.map((carousel) => (
            <div key={carousel.id} onClick={() => setSelectedCarousel(carousel)} className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 relative group shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCopy(carousel.id, carousel.slides); }}
                  className="p-2 bg-surface-container-high text-on-surface rounded-lg hover:bg-surface-container-highest transition-colors"
                  title="Copy text to clipboard"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedId === carousel.id ? 'check' : 'content_copy'}
                  </span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteCarousel(carousel.id); }}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  title="Delete Carousel"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
              
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">{carousel.topic}</h3>
                  <p className="text-sm font-medium text-on-surface-variant">{carousel.date} • {carousel.slides.length} slides</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePostToLinkedIn(carousel.slides); }}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  Post to LinkedIn
                </button>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-6 snap-x custom-scrollbar">
                {carousel.slides.map((slide: any, idx: number) => {
                  const theme = carousel.theme || DEFAULT_THEME;
                  return (
                    <div key={idx} className={`min-w-[320px] w-[320px] aspect-[4/5] border border-outline-variant/20 rounded-2xl p-8 flex flex-col justify-center snap-center relative shadow-sm hover:border-primary/30 transition-colors ${theme.background} ${theme.font}`} style={{ backgroundImage: theme.pattern }}>
                      <div className={`absolute top-6 left-6 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${theme.accentBg} ${theme.background === 'bg-white' ? 'text-white' : 'text-white'}`}>
                        {idx + 1}
                      </div>
                      <h4 className={`text-2xl font-black tracking-tight mb-6 text-center leading-tight ${theme.text}`}>{slide.title}</h4>
                      {slide.content && <p className={`text-center text-base leading-relaxed ${theme.subtext}`}>{slide.content}</p>}
                      {slide.points && slide.points.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {slide.points.map((point: string, i: number) => (
                            <li key={i} className={`text-sm flex items-start gap-2 ${theme.subtext}`}>
                              <span className={`material-symbols-outlined text-sm mt-0.5 ${theme.accent}`}>check_circle</span>
                              <span className="text-left">{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCarousel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedCarousel(null)}>
          <div className="bg-surface-container-lowest rounded-3xl p-8 max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-2">{selectedCarousel.topic}</h2>
                <p className="text-on-surface-variant">{selectedCarousel.date} • {selectedCarousel.slides.length} slides</p>
              </div>
              <button onClick={() => setSelectedCarousel(null)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x custom-scrollbar">
              {selectedCarousel.slides.map((slide: any, idx: number) => {
                const theme = selectedCarousel.theme || DEFAULT_THEME;
                return (
                  <div key={idx} className={`min-w-[400px] w-[400px] aspect-[4/5] border border-outline-variant/20 rounded-2xl p-10 flex flex-col justify-center snap-center relative shadow-lg ${theme.background} ${theme.font}`} style={{ backgroundImage: theme.pattern }}>
                    <div className={`absolute top-8 left-8 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${theme.accentBg} text-white`}>
                      {idx + 1}
                    </div>
                    <h4 className={`text-3xl font-black tracking-tight mb-6 text-center leading-tight ${theme.text}`}>{slide.title}</h4>
                    {slide.content && <p className={`text-center text-lg leading-relaxed ${theme.subtext}`}>{slide.content}</p>}
                    {slide.points && slide.points.length > 0 && (
                      <ul className="mt-6 space-y-3">
                        {slide.points.map((point: string, i: number) => (
                          <li key={i} className={`text-base flex items-start gap-3 ${theme.subtext}`}>
                            <span className={`material-symbols-outlined text-base mt-1 ${theme.accent}`}>check_circle</span>
                            <span className="text-left">{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 mt-4">
              <button onClick={() => handleCopy(selectedCarousel.id, selectedCarousel.slides)} className="flex-1 py-4 bg-surface-container-high text-on-surface rounded-xl font-bold hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2 text-lg">
                <span className="material-symbols-outlined">{copiedId === selectedCarousel.id ? 'check' : 'content_copy'}</span>
                {copiedId === selectedCarousel.id ? 'Copied!' : 'Copy All Text'}
              </button>
              <button onClick={() => handlePostToLinkedIn(selectedCarousel.slides)} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                Post to LinkedIn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
