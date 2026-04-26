import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function SavedCarousels() {
  const { savedCarousels, deleteCarousel, deleteAllSavedCarousels, user } = useAppContext();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCarousel, setSelectedCarousel] = useState<any | null>(null);

  const DEFAULT_THEME = { id: 'minimal-light', background: 'bg-white dark:bg-zinc-900', text: 'text-zinc-900 dark:text-white', subtext: 'text-zinc-500 dark:text-zinc-400', accent: 'text-zinc-900 dark:text-white', accentBg: 'bg-zinc-900 dark:bg-zinc-100', font: 'font-serif', pattern: 'none' };

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
                  className="px-6 py-2.5 bg-blue-600 text-white dark:text-zinc-900 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  Post to LinkedIn
                </button>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-6 snap-x custom-scrollbar">
                {carousel.slides.map((slide: any, idx: number) => {
                  const theme = carousel.theme || DEFAULT_THEME;
                  const creatorName = carousel.creatorName || user?.user_metadata?.full_name || user?.user_metadata?.name || 'John Doe';
                  const creatorHandle = carousel.creatorHandle || `@${creatorName.toLowerCase().replace(/\s+/g, '')}`;
                  return (
                    <div 
                      key={idx} 
                      className={`min-w-[320px] w-[320px] aspect-[4/5] shrink-0 shadow-lg rounded-xl relative overflow-hidden snap-center hover:shadow-lg transition-all ${theme.background} ${theme.font} border border-outline-variant/10`}
                      style={{ backgroundImage: theme.pattern }}
                    >
                      <div className={`absolute top-4 right-4 text-5xl font-black select-none pointer-events-none opacity-10 z-0 ${theme.text}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="relative h-full px-6 pt-10 pb-20 flex flex-col z-10 overflow-hidden">
                        <div className="my-auto flex flex-col w-full h-fit">
                          {slide.type === 'hook' && <div className={`w-10 h-1 mb-4 ${theme.accentBg} shrink-0`}></div>}
                          {slide.type !== 'hook' && <p className={`${theme.accent} text-[10px] font-bold uppercase tracking-[0.2em] mb-3 shrink-0`}>{slide.type}</p>}
                          
                          <h4 className={`text-xl font-black tracking-tighter leading-[1.2] mb-3 shrink-0 ${theme.text}`}>{slide.title}</h4>
                          
                          {slide.imageUrl && (
                            <div className="mb-3 rounded-xl overflow-hidden flex-shrink-0 w-full h-[100px] relative mt-1 group">
                              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent z-10 pointer-events-none mix-blend-overlay"></div>
                              <img src={slide.imageUrl} alt="Slide Visual" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 shadow-xl ring-1 ring-black/10" />
                            </div>
                          )}
                          
                          {slide.content && !slide.imageUrl && <p className={`text-sm leading-relaxed shrink-0 ${theme.subtext}`}>{slide.content}</p>}
                          {slide.content && slide.imageUrl && <p className={`text-xs leading-snug shrink-0 line-clamp-3 ${theme.subtext}`}>{slide.content}</p>}
                          
                          {slide.points && slide.points.length > 0 && (
                            <ul className={`mt-2 space-y-2 shrink-0 ${slide.imageUrl ? 'text-[10px]' : ''}`}>
                              {slide.points.slice(0, 3).map((point: string, i: number) => (
                                <li key={i} className={`text-xs flex items-start gap-2 ${theme.subtext}`}>
                                  <span className={`material-symbols-outlined text-xs mt-0.5 ${theme.accent}`}>check_circle</span>
                                  <span className="text-left line-clamp-2">{point}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      {slide.type === 'hook' && (
                        <div className="absolute bottom-6 left-6 flex items-center gap-3 z-20">
                          <div className="w-8 h-8 rounded-full bg-black/10 overflow-hidden border border-white/20 shadow-sm flex items-center justify-center shrink-0">
                            <img src={user?.user_metadata?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAnD-eDeaQtm5TCuJeN5MI4wp-WNoGEWVe4JWtVgNdNgr6CnDqzr9w9r4Ar6AQnGo1dww_u5_Ih0BQh8WkawS9fxAUpNRUdkCyaK5oHTBaGh2rMeqIaxwVZtru9r5LXIecLV-Qi5fJVemZnYOK0k2U-GfRURfH2iMBI5as6vBdfCnx_Z_mrFYaO8tfWaoG8vuuusOyaAl9InIaktHOybgkC-EN_VAj5v14Y4miWHkbfBzdfx6pDx-LzbNvaUCDmdjNL1-sUY27hdXm-"} alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                          <div className="max-w-[150px]">
                            <p className={`font-bold text-xs truncate ${theme.text}`}>{creatorName}</p>
                            <p className={`text-[10px] truncate ${theme.subtext}`}>{creatorHandle}</p>
                          </div>
                        </div>
                      )}
                      
                      {slide.type !== 'hook' && (
                        <div className="absolute bottom-5 left-6 flex items-center gap-2 opacity-90 z-20 backdrop-blur-sm px-2 py-1 -ml-2 rounded-lg">
                          <img src={user?.user_metadata?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAnD-eDeaQtm5TCuJeN5MI4wp-WNoGEWVe4JWtVgNdNgr6CnDqzr9w9r4Ar6AQnGo1dww_u5_Ih0BQh8WkawS9fxAUpNRUdkCyaK5oHTBaGh2rMeqIaxwVZtru9r5LXIecLV-Qi5fJVemZnYOK0k2U-GfRURfH2iMBI5as6vBdfCnx_Z_mrFYaO8tfWaoG8vuuusOyaAl9InIaktHOybgkC-EN_VAj5v14Y4miWHkbfBzdfx6pDx-LzbNvaUCDmdjNL1-sUY27hdXm-"} alt="Avatar" className="w-5 h-5 rounded-full object-cover shrink-0" />
                          <p className={`text-[10px] font-bold truncate max-w-[200px] ${theme.subtext}`}>{creatorHandle}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCarousel && createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setSelectedCarousel(null)}>
          <div className="bg-surface-container-lowest rounded-3xl p-8 max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-lg" onClick={e => e.stopPropagation()}>
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
                const creatorName = selectedCarousel.creatorName || user?.user_metadata?.full_name || user?.user_metadata?.name || 'John Doe';
                const creatorHandle = selectedCarousel.creatorHandle || `@${creatorName.toLowerCase().replace(/\s+/g, '')}`;
                return (
                  <div 
                    key={idx} 
                    className={`min-w-[450px] w-[450px] aspect-[4/5] shrink-0 shadow-lg rounded-xl relative overflow-hidden snap-center ${theme.background} ${theme.font} border border-outline-variant/10`}
                    style={{ backgroundImage: theme.pattern }}
                  >
                    <div className={`absolute top-6 right-6 text-7xl font-black select-none pointer-events-none opacity-10 z-0 ${theme.text}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="relative h-full px-10 pt-12 pb-24 flex flex-col z-10 overflow-hidden">
                      <div className="my-auto flex flex-col w-full h-fit">
                        {slide.type === 'hook' && <div className={`w-12 h-1 mb-6 ${theme.accentBg} shrink-0`}></div>}
                        {slide.type !== 'hook' && <p className={`${theme.accent} text-xs font-bold uppercase tracking-[0.2em] mb-4 shrink-0`}>{slide.type}</p>}
                        
                        <h2 className={`text-2xl lg:text-3xl font-black tracking-tighter leading-[1.2] mb-4 shrink-0 ${theme.text}`}>
                          {slide.title}
                        </h2>
                        
                        {slide.imageUrl && (
                          <div className="mb-4 rounded-xl overflow-hidden flex-shrink-0 w-full h-[160px] relative mt-2 group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent z-10 pointer-events-none mix-blend-overlay"></div>
                            <img src={slide.imageUrl} alt="Slide Visual" className="w-full h-full object-cover shadow-lg ring-1 ring-black/10" />
                          </div>
                        )}
                        
                        {slide.content && !slide.imageUrl && (
                          <p className={`text-lg leading-relaxed shrink-0 ${theme.subtext}`}>
                            {slide.content}
                          </p>
                        )}

                        {slide.content && slide.imageUrl && (
                          <p className={`text-sm md:text-base leading-snug shrink-0 ${theme.subtext}`}>
                            {slide.content}
                          </p>
                        )}
                        
                        {slide.points && slide.points.length > 0 && (
                          <div className={`space-y-3 mt-3 shrink-0 ${slide.imageUrl ? 'text-xs' : ''}`}>
                            {slide.points.slice(0, 3).map((point: string, i: number) => (
                              <div key={i} className={`flex items-start gap-2 ${theme.subtext}`}>
                                <span className={`material-symbols-outlined ${theme.accent} ${slide.imageUrl ? 'text-sm mt-0' : 'mt-0.5'}`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                <span className={slide.imageUrl ? 'text-xs leading-tight' : 'text-sm md:text-base line-clamp-2'}>{point}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {slide.type === 'hook' && (
                      <div className="absolute bottom-8 left-10 flex items-center gap-4 z-20">
                        <div className="w-12 h-12 rounded-full bg-black/10 overflow-hidden border-2 border-white/20 shadow-sm flex items-center justify-center shrink-0">
                          <img src={user?.user_metadata?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAnD-eDeaQtm5TCuJeN5MI4wp-WNoGEWVe4JWtVgNdNgr6CnDqzr9w9r4Ar6AQnGo1dww_u5_Ih0BQh8WkawS9fxAUpNRUdkCyaK5oHTBaGh2rMeqIaxwVZtru9r5LXIecLV-Qi5fJVemZnYOK0k2U-GfRURfH2iMBI5as6vBdfCnx_Z_mrFYaO8tfWaoG8vuuusOyaAl9InIaktHOybgkC-EN_VAj5v14Y4miWHkbfBzdfx6pDx-LzbNvaUCDmdjNL1-sUY27hdXm-"} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="max-w-[200px]">
                          <p className={`font-bold text-sm truncate ${theme.text}`}>{creatorName}</p>
                          <p className={`text-xs truncate ${theme.subtext}`}>{creatorHandle}</p>
                        </div>
                      </div>
                    )}
                    
                    {slide.type !== 'hook' && (
                      <div className="absolute bottom-6 left-10 flex items-center gap-3 opacity-90 z-20 backdrop-blur-sm px-2 py-1 -ml-2 rounded-lg">
                        <img src={user?.user_metadata?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAnD-eDeaQtm5TCuJeN5MI4wp-WNoGEWVe4JWtVgNdNgr6CnDqzr9w9r4Ar6AQnGo1dww_u5_Ih0BQh8WkawS9fxAUpNRUdkCyaK5oHTBaGh2rMeqIaxwVZtru9r5LXIecLV-Qi5fJVemZnYOK0k2U-GfRURfH2iMBI5as6vBdfCnx_Z_mrFYaO8tfWaoG8vuuusOyaAl9InIaktHOybgkC-EN_VAj5v14Y4miWHkbfBzdfx6pDx-LzbNvaUCDmdjNL1-sUY27hdXm-"} alt="Avatar" className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <p className={`text-xs font-bold truncate max-w-[250px] ${theme.subtext}`}>{creatorHandle}</p>
                      </div>
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
              <button onClick={() => handlePostToLinkedIn(selectedCarousel.slides)} className="flex-1 py-4 bg-blue-600 text-white dark:text-zinc-900 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                Post to LinkedIn
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
