import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { get, set } from 'idb-keyval';

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

const DEFAULT_ANALYTICS: AnalyticsData = {
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
  thumbnailText?: string;
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

  autoSave: boolean;
  setAutoSave: (save: boolean) => void;
  showRefImageWarning: boolean;
  setShowRefImageWarning: (show: boolean) => void;
  subscriptionPlan: 'free' | 'pro' | 'infinity';
  setSubscriptionPlan: (plan: 'free' | 'pro' | 'infinity') => void;
  credits: number;
  deductCredits: (amount: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Load preferences from localStorage settings
  const [autoSave, setAutoSave] = useState(() => {
    const saved = localStorage.getItem('creatorflow_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.autoSave ?? true;
    }
    return true;
  });

  const [showRefImageWarning, setShowRefImageWarning] = useState(() => {
    const saved = localStorage.getItem('creatorflow_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.showRefImageWarning ?? true;
    }
    return true;
  });

  const [credits, setCreditsState] = useState<number>(() => {
    const saved = localStorage.getItem('creatorflow_credits');
    if (saved) {
      const parsed = parseInt(saved, 10);
      return Math.min(parsed, 100000); // Higher cap for legit top ups & infinity
    }
    return 80;
  });

  const setCredits = useCallback((newCredits: number) => {
    setCreditsState(newCredits);
    localStorage.setItem('creatorflow_credits', newCredits.toString());
  }, []);

  const [subscriptionPlan, setSubscriptionPlanState] = useState<'free' | 'pro' | 'infinity'>(() => {
    const saved = localStorage.getItem('creatorflow_plan');
    if (saved) return saved as 'free' | 'pro' | 'infinity';
    return 'free';
  });

  const setSubscriptionPlan = useCallback((plan: 'free' | 'pro' | 'infinity') => {
    setSubscriptionPlanState(plan);
    localStorage.setItem('creatorflow_plan', plan);
    
    // Automatically provision credits on upgrade
    let newCredits = credits;
    if (plan === 'pro') newCredits = 500;
    if (plan === 'infinity') newCredits = 99999;
    if (plan === 'free') newCredits = 80;

    setCredits(newCredits);
    
    // Explicitly sync to Supabase to prevent device wiping
    if (user) {
      supabase.auth.updateUser({ data: { plan, credits: newCredits } }).catch(() => {});
    }
  }, [user, credits, setCredits]);

  useEffect(() => {
    // Update local storage settings safely
    const saved = localStorage.getItem('creatorflow_settings');
    let parsed = saved ? JSON.parse(saved) : {};
    parsed.autoSave = autoSave;
    parsed.showRefImageWarning = showRefImageWarning;
    localStorage.setItem('creatorflow_settings', JSON.stringify(parsed));
  }, [autoSave, showRefImageWarning]);

  useEffect(() => {
    const handleAuthChange = (session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);
      
      if (session?.user) {
        const currentUserId = session.user.id;
        const lastUserId = localStorage.getItem('creatorflow_last_user_id');
        
        if (lastUserId && lastUserId !== currentUserId) {
          localStorage.removeItem('creatorflow_profiles');
          localStorage.removeItem('creatorflow_saved_posts');
          localStorage.removeItem('creatorflow_saved_carousels');
          localStorage.removeItem('creatorflow_saved_reels');
          import('idb-keyval').then(({ del }) => {
            del('creatorflow_saved_thumbnails');
            del('creatorflow_saved_posts');
            del('creatorflow_saved_carousels');
            del('creatorflow_saved_reels');
          });
          setProfiles({});
          setSavedPosts([]);
          setSavedCarousels([]);
          setSavedReels([]);
          setSavedThumbnails([]);
        }
        localStorage.setItem('creatorflow_last_user_id', currentUserId);

        let updateData: any = {};
        let needsUpdate = false;

        const metadataCredits = session.user.user_metadata?.credits;
        if (metadataCredits !== undefined) {
          setCredits(metadataCredits);
        } else {
          updateData.credits = 80;
          needsUpdate = true;
          setCredits(80);
        }

        const metadataPlan = session.user.user_metadata?.plan;
        if (metadataPlan !== undefined) {
          setSubscriptionPlanState(metadataPlan);
          localStorage.setItem('creatorflow_plan', metadataPlan);
        } else {
          updateData.plan = 'free';
          needsUpdate = true;
          setSubscriptionPlanState('free');
          localStorage.setItem('creatorflow_plan', 'free');
        }

        const metadataAnalytics = session.user.user_metadata?.analytics;
        if (metadataAnalytics !== undefined) {
          setAnalytics(metadataAnalytics);
          localStorage.setItem('creatorflow_analytics', JSON.stringify(metadataAnalytics));
        } else {
          updateData.analytics = DEFAULT_ANALYTICS;
          needsUpdate = true;
          setAnalytics(DEFAULT_ANALYTICS);
          localStorage.setItem('creatorflow_analytics', JSON.stringify(DEFAULT_ANALYTICS));
        }

        if (needsUpdate) {
          supabase.auth.updateUser({ data: updateData }).catch(() => {});
        }
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        if (error.message?.toLowerCase().includes('refresh token') || error.message?.toLowerCase().includes('refresh_token_not_found')) {
          // Benign error when session expires or user is deleted.
          // Suppress warning and forcibly clear state to escape loops.
          handleAuthChange(null);
          supabase.auth.signOut().catch(() => {});
          
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
             const key = localStorage.key(i);
             if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
                 keysToRemove.push(key);
             }
          }
          keysToRemove.forEach(k => localStorage.removeItem(k));
          return;
        } else {
          console.warn("Session error:", error.message);
        }
      }
      handleAuthChange(session);
    }).catch((e) => {
      if (e?.message?.toLowerCase().includes('refresh token')) {
        handleAuthChange(null);
        supabase.auth.signOut().catch(() => {});
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
           const key = localStorage.key(i);
           if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
               keysToRemove.push(key);
           }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      } else {
        console.warn("Failed to get session:", e);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
         handleAuthChange(session);
      } else if (event === 'USER_UPDATED') {
         handleAuthChange(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('creatorflow_analytics');
      localStorage.removeItem('creatorflow_profiles');
      localStorage.removeItem('creatorflow_saved_posts');
      localStorage.removeItem('creatorflow_saved_carousels');
      localStorage.removeItem('creatorflow_saved_reels');
      localStorage.removeItem('creatorflow_plan');
      localStorage.removeItem('creatorflow_credits');
      import('idb-keyval').then(({ del }) => {
        del('creatorflow_saved_thumbnails');
        del('creatorflow_saved_posts');
        del('creatorflow_saved_carousels');
        del('creatorflow_saved_reels');
      });
      
      setAnalytics(DEFAULT_ANALYTICS);
      setProfiles({});
      setSavedPosts([]);
      setSavedCarousels([]);
      setSavedReels([]);
      setSavedThumbnails([]);
      setCreditsState(80);
      setSubscriptionPlanState('free');
    } catch (e) {
      console.warn("Sign out error:", e);
    }
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

  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [savedCarousels, setSavedCarousels] = useState<SavedCarousel[]>([]);
  const [savedReels, setSavedReels] = useState<SavedReel[]>([]);
  const [savedThumbnails, setSavedThumbnails] = useState<SavedThumbnail[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Asynchronously load heavy saved objects from IndexedDB on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fallback to localStorage if idb is empty (migration)
        let fallbackPosts = [];
        let fallbackCarousels = [];
        let fallbackReels = [];
        try { fallbackPosts = JSON.parse(localStorage.getItem('creatorflow_saved_posts') || '[]'); } catch (e) {}
        try { fallbackCarousels = JSON.parse(localStorage.getItem('creatorflow_saved_carousels') || '[]'); } catch (e) {}
        try { fallbackReels = JSON.parse(localStorage.getItem('creatorflow_saved_reels') || '[]'); } catch (e) {}

        const [posts, carousels, reels, thumbnails] = await Promise.all([
          get('creatorflow_saved_posts').then(val => {
            if (val && val.length > 0) return val;
            return fallbackPosts;
          }),
          get('creatorflow_saved_carousels').then(val => {
            if (val && val.length > 0) return val;
            return fallbackCarousels;
          }),
          get('creatorflow_saved_reels').then(val => {
            if (val && val.length > 0) return val;
            return fallbackReels;
          }),
          get('creatorflow_saved_thumbnails').then(val => val || [])
        ]);

        // Deduplicate any IDs when loading from fallback
        const dedup = (arr: any[]) => {
          const seen = new Set();
          return arr.map(item => {
            if (seen.has(item.id)) item.id = generateId();
            seen.add(item.id);
            return item;
          });
        };

        setSavedPosts(dedup(posts));
        setSavedCarousels(dedup(carousels));
        setSavedReels(dedup(reels));
        setSavedThumbnails(dedup(thumbnails));
      } catch (err) {
        console.warn('Failed to load data from idb:', err);
      } finally {
        setIsDataLoaded(true);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('creatorflow_analytics', JSON.stringify(analytics));
  }, [analytics]);

  useEffect(() => {
    localStorage.setItem('creatorflow_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (isDataLoaded) {
      set('creatorflow_saved_posts', savedPosts).catch(console.error);
    }
  }, [savedPosts, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      set('creatorflow_saved_carousels', savedCarousels).catch(console.error);
    }
  }, [savedCarousels, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      set('creatorflow_saved_reels', savedReels).catch(console.error);
    }
  }, [savedReels, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      set('creatorflow_saved_thumbnails', savedThumbnails).catch(console.error);
    }
  }, [savedThumbnails, isDataLoaded]);

  const deductCredits = useCallback((amount: number) => {
    if (subscriptionPlan === 'infinity') return true;
    if (credits >= amount) {
      const newCredits = credits - amount;
      setCredits(newCredits);
      // Sync seamlessly to Supabase
      if (user) {
        supabase.auth.updateUser({ data: { credits: newCredits } }).catch(() => {});
      }
      return true;
    }
    return false;
  }, [subscriptionPlan, credits, user]);

  const setAnalyticsData = useCallback((newAnalytics: AnalyticsData) => {
    setAnalytics(newAnalytics);
    localStorage.setItem('creatorflow_analytics', JSON.stringify(newAnalytics));
    // Sync to Supabase for cross-device usage stats
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.auth.updateUser({ data: { analytics: newAnalytics } }).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  const addGeneration = useCallback((type: string) => {
    setAnalytics(prev => {
      let mappedType = type;
      if (type === 'Social Post') mappedType = 'Instagram Reels';
      else if (type === 'LinkedIn Carousel') mappedType = 'LinkedIn';
      else if (type === 'TikTok') mappedType = 'TikTok Native';
      
      const newAnalytics = {
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
      
      // We manually sync the Supabase data here without creating an infinite loop
      localStorage.setItem('creatorflow_analytics', JSON.stringify(newAnalytics));
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) supabase.auth.updateUser({ data: { analytics: newAnalytics } }).catch(() => {});
      }).catch(() => {});

      return newAnalytics;
    });
  }, []);

  const addVideoProcessed = useCallback(() => {
    setAnalytics(prev => {
      const newAnalytics = {
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
      };

      localStorage.setItem('creatorflow_analytics', JSON.stringify(newAnalytics));
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) supabase.auth.updateUser({ data: { analytics: newAnalytics } }).catch(() => {});
      }).catch(() => {});

      return newAnalytics;
    });
  }, []);

  const setPlatformsConnected = useCallback((count: number) => {
    setAnalytics(prev => {
      const newAnalytics = { ...prev, platformsConnected: count };
      localStorage.setItem('creatorflow_analytics', JSON.stringify(newAnalytics));
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) supabase.auth.updateUser({ data: { analytics: newAnalytics } }).catch(() => {});
      }).catch(() => {});
      return newAnalytics;
    });
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
      autoSave, setAutoSave,
      showRefImageWarning, setShowRefImageWarning,
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
