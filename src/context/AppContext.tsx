import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

type Activity = {
  id: string;
  action: string;
  time: string;
};

type AnalyticsData = {
  totalGenerations: number;
  videosProcessed: number;
  platformsConnected: number;
  recentActivity: Activity[];
  chartData: { name: string; value: number }[];
  contentTypes: Record<string, number>;
};

export type SavedPost = {
  id: string;
  platform: string;
  tone: string;
  content: string;
  tags: string[];
  date: string;
};

export type SavedCarousel = {
  id: string;
  topic: string;
  slides: any[];
  date: string;
  theme?: any;
};

export type SavedReel = {
  id: string;
  title: string;
  hook: string;
  reasoning: string;
  visuals: string;
  date: string;
  platforms: string[];
  duration: string;
  image: string;
};

export type SavedThumbnail = {
  id: string;
  url: string;
  topic: string;
  style: string;
  channelInspiration?: string;
  date: string;
};

interface AppContextType {
  user: User | null;
  session: Session | null;
  authLoading: boolean;
  signOut: () => Promise<void>;
  analytics: AnalyticsData;
  addGeneration: (type: string) => void;
  addVideoProcessed: () => void;
  setPlatformsConnected: (count: number) => void;
  profiles: Record<string, any>;
  saveProfileAnalysis: (platform: string, data: any) => void;
  savedPosts: SavedPost[];
  savePost: (post: Omit<SavedPost, 'id' | 'date'>) => void;
  deletePost: (id: string) => void;
  deleteAllSavedPosts: () => void;
  savedCarousels: SavedCarousel[];
  saveCarousel: (carousel: Omit<SavedCarousel, 'id' | 'date'>) => void;
  deleteCarousel: (id: string) => void;
  deleteAllSavedCarousels: () => void;
  
  savedReels: SavedReel[];
  saveReel: (reel: Omit<SavedReel, 'id' | 'date'>) => void;
  deleteReel: (id: string) => void;

  savedThumbnails: SavedThumbnail[];
  saveThumbnail: (thumbnail: Omit<SavedThumbnail, 'id' | 'date'>) => void;
  deleteThumbnail: (id: string) => void;
  deleteAllSavedThumbnails: () => void;

  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  autoSave: boolean;
  setAutoSave: (save: boolean) => void;
  subscriptionPlan: 'free' | 'pro';
  setSubscriptionPlan: (plan: 'free' | 'pro') => void;
  credits: number;
  deductCredits: (amount: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Load preferences from localStorage settings
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('creatorflow_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.darkMode || false;
    }
    return false;
  });

  const [autoSave, setAutoSave] = useState(() => {
    const saved = localStorage.getItem('creatorflow_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.autoSave ?? true;
    }
    return true;
  });

  const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'pro'>(() => {
    const saved = localStorage.getItem('creatorflow_plan');
    if (saved) return saved as 'free' | 'pro';
    return 'free';
  });

  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('creatorflow_credits');
    if (saved) {
      const parsed = parseInt(saved, 10);
      // Automatically cap legacy users who had 1000 down to 50 max if they are free
      return parsed > 50 ? 50 : parsed;
    }
    return 50;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update local storage settings safely
    const saved = localStorage.getItem('creatorflow_settings');
    let parsed = saved ? JSON.parse(saved) : {};
    parsed.darkMode = darkMode;
    parsed.autoSave = autoSave;
    localStorage.setItem('creatorflow_settings', JSON.stringify(parsed));
  }, [darkMode, autoSave]);

  useEffect(() => {
    const handleAuthChange = (session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);
      
      if (session?.user) {
        let updateData: any = {};
        let needsUpdate = false;

        const metadataCredits = session.user.user_metadata?.credits;
        if (metadataCredits !== undefined) {
          setCredits(metadataCredits);
        } else {
          updateData.credits = 50;
          needsUpdate = true;
          setCredits(50);
        }

        const metadataPlan = session.user.user_metadata?.plan;
        if (metadataPlan !== undefined) {
          setSubscriptionPlan(metadataPlan);
        } else {
          updateData.plan = 'free';
          needsUpdate = true;
          setSubscriptionPlan('free');
        }

        if (needsUpdate) {
          supabase.auth.updateUser({ data: updateData });
        }
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const [analytics, setAnalytics] = useState<AnalyticsData>(() => {
    const saved = localStorage.getItem('creatorflow_analytics');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Deduplicate recentActivity keys
      if (parsed.recentActivity) {
        const seen = new Set();
        parsed.recentActivity = parsed.recentActivity.map((a: any) => {
          if (seen.has(a.id)) {
            a.id = generateId();
          }
          seen.add(a.id);
          return a;
        });
      }
      return parsed;
    }
    return {
      totalGenerations: 0,
      videosProcessed: 0,
      platformsConnected: 0,
      recentActivity: [],
      chartData: [
        { name: 'Mon', value: 0 },
        { name: 'Tue', value: 0 },
        { name: 'Wed', value: 0 },
        { name: 'Thu', value: 0 },
        { name: 'Fri', value: 0 },
        { name: 'Sat', value: 0 },
        { name: 'Sun', value: 0 },
      ],
      contentTypes: {
        'YouTube Shorts': 0,
        'Instagram Reels': 0,
        'LinkedIn': 0,
        'TikTok Native': 0,
      }
    };
  });

  const [profiles, setProfiles] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem('creatorflow_profiles');
    if (saved) return JSON.parse(saved);
    return {};
  });

  const [savedPosts, setSavedPosts] = useState<SavedPost[]>(() => {
    const saved = localStorage.getItem('creatorflow_saved_posts');
    if (saved) {
      const parsed = JSON.parse(saved);
      const seen = new Set();
      return parsed.map((p: any) => {
        if (seen.has(p.id)) {
          p.id = generateId();
        }
        seen.add(p.id);
        return p;
      });
    }
    return [];
  });

  const [savedCarousels, setSavedCarousels] = useState<SavedCarousel[]>(() => {
    const saved = localStorage.getItem('creatorflow_saved_carousels');
    if (saved) {
      const parsed = JSON.parse(saved);
      const seen = new Set();
      return parsed.map((c: any) => {
        if (seen.has(c.id)) {
          c.id = generateId();
        }
        seen.add(c.id);
        return c;
      });
    }
    return [];
  });

  const [savedReels, setSavedReels] = useState<SavedReel[]>(() => {
    const saved = localStorage.getItem('creatorflow_saved_reels');
    if (saved) {
      const parsed = JSON.parse(saved);
      const seen = new Set();
      return parsed.map((r: any) => {
        if (seen.has(r.id)) {
          r.id = generateId();
        }
        seen.add(r.id);
        return r;
      });
    }
    return [];
  });

  const [savedThumbnails, setSavedThumbnails] = useState<SavedThumbnail[]>(() => {
    const saved = localStorage.getItem('creatorflow_saved_thumbnails');
    if (saved) {
      const parsed = JSON.parse(saved);
      const seen = new Set();
      return parsed.map((t: any) => {
        if (seen.has(t.id)) {
          t.id = generateId();
        }
        seen.add(t.id);
        return t;
      });
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('creatorflow_analytics', JSON.stringify(analytics));
  }, [analytics]);

  useEffect(() => {
    localStorage.setItem('creatorflow_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('creatorflow_saved_posts', JSON.stringify(savedPosts));
  }, [savedPosts]);

  useEffect(() => {
    localStorage.setItem('creatorflow_saved_carousels', JSON.stringify(savedCarousels));
  }, [savedCarousels]);

  useEffect(() => {
    localStorage.setItem('creatorflow_saved_reels', JSON.stringify(savedReels));
  }, [savedReels]);

  useEffect(() => {
    localStorage.setItem('creatorflow_saved_thumbnails', JSON.stringify(savedThumbnails));
  }, [savedThumbnails]);

  useEffect(() => {
    localStorage.setItem('creatorflow_plan', subscriptionPlan);
    if (user && user.user_metadata?.plan !== subscriptionPlan) {
      supabase.auth.updateUser({ data: { plan: subscriptionPlan } });
    }
  }, [subscriptionPlan, user]);

  useEffect(() => {
    localStorage.setItem('creatorflow_credits', credits.toString());
  }, [credits]);

  const deductCredits = useCallback((amount: number) => {
    if (subscriptionPlan === 'pro') return true;
    if (credits >= amount) {
      const newCredits = credits - amount;
      setCredits(newCredits);
      // Sync seamlessly to Supabase
      if (user) {
        supabase.auth.updateUser({ data: { credits: newCredits } });
      }
      return true;
    }
    return false;
  }, [subscriptionPlan, credits, user]);

  const addGeneration = useCallback((type: string) => {
    setAnalytics(prev => {
      let mappedType = type;
      if (type === 'Social Post') mappedType = 'Instagram Reels';
      else if (type === 'LinkedIn Carousel') mappedType = 'LinkedIn';
      else if (type === 'TikTok') mappedType = 'TikTok Native';
      
      return {
        ...prev,
        totalGenerations: prev.totalGenerations + 1,
        recentActivity: [
          { id: generateId(), action: `Generated ${type}`, time: new Date().toLocaleString() },
          ...prev.recentActivity
        ],
        chartData: prev.chartData.map((d, i) => i === 6 ? { ...d, value: d.value + 1 } : d),
        contentTypes: {
          ...prev.contentTypes,
          [mappedType]: (prev.contentTypes[mappedType] || 0) + 1
        }
      };
    });
  }, []);

  const addVideoProcessed = useCallback(() => {
    setAnalytics(prev => ({
      ...prev,
      videosProcessed: prev.videosProcessed + 1,
      recentActivity: [
        { id: generateId(), action: `Processed Video`, time: new Date().toLocaleString() },
        ...prev.recentActivity
      ],
      contentTypes: {
        ...prev.contentTypes,
        'YouTube Shorts': (prev.contentTypes['YouTube Shorts'] || 0) + 1
      }
    }));
  }, []);

  const setPlatformsConnected = useCallback((count: number) => {
    setAnalytics(prev => ({ ...prev, platformsConnected: count }));
  }, []);

  const saveProfileAnalysis = useCallback((platform: string, data: any) => {
    setProfiles(prev => ({ ...prev, [platform]: data }));
  }, []);

  const savePost = useCallback((post: Omit<SavedPost, 'id' | 'date'>) => {
    setSavedPosts(prev => [
      { ...post, id: generateId(), date: new Date().toLocaleString() },
      ...prev
    ]);
  }, []);

  const deletePost = useCallback((id: string) => {
    setSavedPosts(prev => prev.filter(p => p.id !== id));
  }, []);

  const deleteAllSavedPosts = useCallback(() => {
    setSavedPosts([]);
  }, []);

  const saveCarousel = useCallback((carousel: Omit<SavedCarousel, 'id' | 'date'>) => {
    setSavedCarousels(prev => [
      { ...carousel, id: generateId(), date: new Date().toLocaleString() },
      ...prev
    ]);
  }, []);

  const deleteCarousel = useCallback((id: string) => {
    setSavedCarousels(prev => prev.filter(c => c.id !== id));
  }, []);

  const deleteAllSavedCarousels = useCallback(() => {
    setSavedCarousels([]);
  }, []);

  const saveReel = useCallback((reel: Omit<SavedReel, 'id' | 'date'>) => {
    setSavedReels(prev => [
      { ...reel, id: generateId(), date: new Date().toLocaleString() },
      ...prev
    ]);
  }, []);

  const deleteReel = useCallback((id: string) => {
    setSavedReels(prev => prev.filter(r => r.id !== id));
  }, []);

  const saveThumbnail = useCallback((thumbnail: Omit<SavedThumbnail, 'id' | 'date'>) => {
    setSavedThumbnails(prev => [
      { ...thumbnail, id: generateId(), date: new Date().toLocaleString() },
      ...prev
    ]);
  }, []);

  const deleteThumbnail = useCallback((id: string) => {
    setSavedThumbnails(prev => prev.filter(t => t.id !== id));
  }, []);

  const deleteAllSavedThumbnails = useCallback(() => {
    setSavedThumbnails([]);
  }, []);

  return (
    <AppContext.Provider value={{ 
      user, session, authLoading, signOut,
      analytics, addGeneration, addVideoProcessed, setPlatformsConnected, 
      profiles, saveProfileAnalysis,
      savedPosts, savePost, deletePost, deleteAllSavedPosts,
      savedCarousels, saveCarousel, deleteCarousel, deleteAllSavedCarousels,
      savedReels, saveReel, deleteReel,
      savedThumbnails, saveThumbnail, deleteThumbnail, deleteAllSavedThumbnails,
      darkMode, setDarkMode, autoSave, setAutoSave,
      subscriptionPlan, setSubscriptionPlan,
      credits, deductCredits
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
