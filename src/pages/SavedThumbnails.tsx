import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function SavedThumbnails() {
  const { savedThumbnails, deleteThumbnail, deleteAllSavedThumbnails } = useAppContext();

  return (
    <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/content-lab/thumbnail-creator" className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface">Saved Thumbnails</h1>
            <p className="text-on-surface-variant mt-2">All your generated and saved YouTube thumbnail concepts.</p>
          </div>
        </div>
        
        {savedThumbnails.length > 0 && (
          <button 
            onClick={() => {
              if(window.confirm('Are you sure you want to delete all saved thumbnails?')) {
                deleteAllSavedThumbnails();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
            Delete All
          </button>
        )}
      </header>

      {savedThumbnails.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-12 border border-outline-variant/10 text-center flex flex-col items-center justify-center min-h-[300px]">
          <span className="material-symbols-outlined text-4xl text-outline mb-4">photo_library</span>
          <p className="text-on-surface-variant font-medium">No saved thumbnails yet.</p>
          <Link to="/content-lab/thumbnail-creator" className="text-primary font-bold mt-4 hover:underline">
            Go generate some!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedThumbnails.map((thumbnail) => (
            <div key={thumbnail.id} className="bg-surface-container-lowest rounded-[2rem] p-4 border border-outline-variant/20 hover:border-primary/30 transition-all shadow-sm group">
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                <img src={thumbnail.url} alt="Saved thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a href={thumbnail.url} download={`saved-thumbnail-${thumbnail.id}.jpg`} className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined font-bold text-sm">download</span>
                  </a>
                  <button 
                    onClick={() => {
                      if(window.confirm('Delete this thumbnail?')) {
                        deleteThumbnail(thumbnail.id);
                      }
                    }}
                    className="bg-red-50 text-red-600 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 hover:bg-red-100 transition-transform"
                  >
                    <span className="material-symbols-outlined font-bold text-sm">delete</span>
                  </button>
                </div>
              </div>
              <div className="px-2 pb-2">
                <h3 className="font-bold text-gray-900 line-clamp-1" title={thumbnail.topic}>{thumbnail.topic}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 flex items-center gap-1 rounded-md text-[10px] font-bold uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[12px]">palette</span>
                    {thumbnail.style}
                  </span>
                  {thumbnail.channelInspiration && (
                    <span className="bg-red-50 text-red-700 px-2 py-1 flex items-center gap-1 rounded-md text-[10px] font-bold uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[12px]">youtube_activity</span>
                      {thumbnail.channelInspiration}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-3 font-medium">Saved on {thumbnail.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
