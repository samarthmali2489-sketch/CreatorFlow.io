/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Analytics from './pages/Analytics';
import VideoToReels from './pages/VideoToReels';
import LinkedInCarousels from './pages/LinkedInCarousels';
import YTAndInstaPostsCreator from './pages/YTAndInstaPostsCreator';
import ThumbnailCreator from './pages/ThumbnailCreator';
import ProductPhotoStudio from './pages/ProductPhotoStudio';
import Integrations from './pages/Integrations';
import Upgrade from './pages/Upgrade';
import RecentActivity from './pages/RecentActivity';
import SavedPosts from './pages/SavedPosts';
import SavedCarousels from './pages/SavedCarousels';
import SavedThumbnails from './pages/SavedThumbnails';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Auth from './pages/Auth';
import { AppProvider, useAppContext } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

// Suppress benign Supabase token refresh errors from bubbling up to the UI
window.addEventListener('unhandledrejection', (event) => {
  const msg = typeof event.reason === 'string' ? event.reason : event.reason?.message || '';
  if (msg.toLowerCase().includes('refresh token') || msg.toLowerCase().includes('refresh_token_not_found')) {
    event.preventDefault();
  }
});

function AppRoutes() {
  const { user, authLoading } = useAppContext();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!user ? <Landing /> : <Navigate to="/analytics" replace />} />
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/analytics" replace />} />
        
        <Route element={user ? <Layout /> : <Navigate to="/auth" replace />}>
          <Route path="analytics" element={<Analytics />} />
          <Route path="content-lab">
            <Route path="video-to-reels" element={<VideoToReels />} />
            <Route path="linkedin-carousels" element={<LinkedInCarousels />} />
            <Route path="yt-insta-posts" element={<YTAndInstaPostsCreator />} />
            <Route path="thumbnail-creator" element={<ThumbnailCreator />} />
            <Route path="saved-thumbnails" element={<SavedThumbnails />} />
          </Route>
          <Route path="shopify-tools">
            <Route path="product-photo-studio" element={<ProductPhotoStudio />} />
          </Route>
          <Route path="integrations" element={<Integrations />} />
          <Route path="upgrade" element={<Upgrade />} />
          <Route path="recent-activity" element={<RecentActivity />} />
          <Route path="saved-posts" element={<SavedPosts />} />
          <Route path="saved-carousels" element={<SavedCarousels />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </ThemeProvider>
  );
}
