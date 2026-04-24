import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function SavedPosts() {
  const { savedPosts, deletePost, deleteAllSavedPosts } = useAppContext();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/content-lab/yt-insta-posts" className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface">Saved Posts</h1>
            <p className="text-on-surface-variant mt-2">All your generated YouTube and Instagram posts.</p>
          </div>
        </div>
        
        {savedPosts.length > 0 && (
          <button 
            onClick={() => {
              if(window.confirm('Are you sure you want to delete all saved posts?')) {
                deleteAllSavedPosts();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
            Delete All
          </button>
        )}
      </header>

      {savedPosts.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-12 border border-outline-variant/10 text-center flex flex-col items-center justify-center min-h-[300px]">
          <span className="material-symbols-outlined text-4xl text-outline mb-4">edit_document</span>
          <p className="text-on-surface-variant font-medium">No saved posts yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPosts.map((post) => (
            <div key={post.id} onClick={() => setSelectedPost(post)} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/20 relative group flex flex-col hover:shadow-md transition-all cursor-pointer">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCopy(post.id, post.content); }}
                  className="p-2 bg-surface-container-high text-on-surface rounded-lg hover:bg-surface-container-highest transition-colors"
                  title="Copy to clipboard"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedId === post.id ? 'check' : 'content_copy'}
                  </span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); deletePost(post.id); }}
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
              
              <div className="bg-surface-container-low/50 p-4 rounded-xl mb-4 flex-1 overflow-hidden">
                <p className="text-on-surface whitespace-pre-line leading-relaxed text-sm line-clamp-6">
                  {post.content}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, i) => (
                  <span key={i} className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPost && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setSelectedPost(null)}>
          <div className="bg-surface-container-lowest rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedPost.platform === 'youtube' ? 'bg-red-100 text-red-600' : 'bg-pink-100 text-pink-600'}`}>
                  <span className="material-symbols-outlined">{selectedPost.platform === 'youtube' ? 'smart_display' : 'camera_roll'}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedPost.platform === 'youtube' ? 'YouTube Community Post' : 'Instagram Caption'}</h2>
                  <p className="text-sm text-on-surface-variant">{selectedPost.date}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="bg-surface-container-low/50 p-6 rounded-2xl mb-6">
              <p className="text-on-surface whitespace-pre-line leading-relaxed text-lg">
                {selectedPost.content}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {selectedPost.tags.map((tag: string, i: number) => (
                <span key={i} className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">#{tag}</span>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleCopy(selectedPost.id, selectedPost.content)} className="w-full py-3 bg-surface-container-high text-on-surface rounded-xl font-bold hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">{copiedId === selectedPost.id ? 'check' : 'content_copy'}</span>
                {copiedId === selectedPost.id ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
