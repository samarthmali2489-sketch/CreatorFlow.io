import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { FounderRewardModal } from '../components/FounderRewardModal';

export default function Analytics() {
  const { analytics } = useAppContext();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isRewardOpen, setIsRewardOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenReward = localStorage.getItem('klipora_reward_seen');
    if (!hasSeenReward) {
      const timer = setTimeout(() => {
        setIsRewardOpen(true);
        localStorage.setItem('klipora_reward_seen', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const data = analytics.chartData?.map(d => ({ name: d.name, generations: d.value })) || [];

  const totalContent: number = Object.values(analytics.contentTypes || {}).reduce((a: number, b: any) => a + Number(b), 0) as number;
  const getPercentage = (type: string) => {
    if (totalContent === 0) return 0;
    return Math.round((Number(analytics.contentTypes?.[type] || 0) / totalContent) * 100);
  };

  const getLinkForAction = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('carousel')) return '/content-lab/saved-carousels';
    if (act.includes('video') || act.includes('reel') || act.includes('tiktok')) return '/content-lab/video-to-reels';
    if (act.includes('thumbnail')) return '/content-lab/saved-thumbnails';
    if (act.includes('post')) return '/content-lab/saved-posts';
    return '/content-lab/yt-insta-posts';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2 block">Performance Overview</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tighter">Analytics Lab</h1>
        </div>
      </header>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total Reach */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_24px_48px_rgba(0,0,0,0.02)] border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between min-h-[200px] group hover:border-primary/20 transition-all">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Total Generations</span>
              <div className="p-2 bg-primary/5 rounded-lg">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              </div>
            </div>
            <div className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">{analytics.totalGenerations}</div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <span className="material-symbols-outlined text-sm">north</span>
            <span>Active this session</span>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-zinc-900 dark:bg-zinc-100 p-8 rounded-xl shadow-xl flex flex-col justify-between min-h-[200px] text-white dark:text-zinc-900">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-zinc-400 font-medium">Videos Processed</span>
              <div className="p-2 bg-white dark:bg-zinc-900/10 rounded-lg">
                <span className="material-symbols-outlined text-white dark:text-zinc-900" style={{ fontVariationSettings: "'FILL' 1" }}>movie</span>
              </div>
            </div>
            <div className="text-5xl font-black tracking-tighter">{analytics.videosProcessed}</div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-zinc-400">
            <span className="material-symbols-outlined text-sm">remove</span>
            <span>Stable performance</span>
          </div>
        </div>

        {/* Conversions */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_24px_48px_rgba(0,0,0,0.02)] border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between min-h-[200px] group hover:border-primary/20 transition-all">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Platforms Connected</span>
              <div className="p-2 bg-primary/5 rounded-lg">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              </div>
            </div>
            <div className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">{analytics.platformsConnected}</div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <span className="material-symbols-outlined text-sm">north</span>
            <span>Ready for distribution</span>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Main Chart Area */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 border border-zinc-100 dark:border-zinc-800 shadow-[0px_24px_48px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-extrabold tracking-tight">Activity Over Time</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(value) => `${value >= 1000 ? (value / 1000) + 'k' : value}`}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                  itemStyle={{ color: '#09090b' }}
                />
                <Bar 
                  dataKey="generations" 
                  radius={[6, 6, 0, 0]}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={activeIndex === index ? '#2563eb' : '#d4d4d8'} 
                      className="transition-all duration-300"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Breakdown */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-xl p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col">
          <h3 className="text-xl font-extrabold tracking-tight mb-8">Content Generation</h3>
          <div className="space-y-6 flex-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(analytics.contentTypes || {})
              .map(([key, count]) => {
                let icon = 'public';
                let colorClass = 'bg-primary';
                
                if (key.includes('Thumbnail')) { icon = 'image'; colorClass = 'bg-indigo-500'; }
                else if (key.includes('YouTube')) { icon = 'movie'; colorClass = 'bg-red-500'; }
                else if (key.includes('Instagram')) { icon = 'smartphone'; colorClass = 'bg-pink-500'; }
                else if (key.includes('LinkedIn')) { icon = 'view_carousel'; colorClass = 'bg-blue-600'; }
                else if (key.includes('TikTok') || key.includes('Reels')) { icon = 'music_note'; colorClass = 'bg-black'; }

                return { type: key, generations: count, icon, color: colorClass };
              })
              .sort((a, b) => Number(b.generations) - Number(a.generations))
              .map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-white dark:text-zinc-900">{item.icon}</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white truncate pr-2">{item.type}</span>
                      <span className="text-sm font-black text-zinc-900 dark:text-white">{item.generations}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 dark:text-zinc-400 font-medium">Items Generated</span>
                      <span className="font-bold text-zinc-400">
                        {getPercentage(item.type)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            
            {/* Empty state if nothing generated yet */}
            {Object.keys(analytics.contentTypes || {}).length === 0 && (
              <div className="flex flex-col items-center justify-center p-6 text-center h-full opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2 text-zinc-400">query_stats</span>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">No data yet</p>
                <p className="text-xs text-zinc-400 mt-2">Generate content to track your activity.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-[0px_24px_48px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <h3 className="text-xl font-extrabold tracking-tight">Recent Activity</h3>
          <Link to="/recent-activity" className="text-sm font-bold text-primary hover:underline">See All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-4">Action</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-8 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {analytics.recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-8 text-center text-zinc-500 dark:text-zinc-400 font-medium">
                    No recent activity. Start generating content!
                  </td>
                </tr>
              ) : (
                analytics.recentActivity.slice(0, 3).map((activity) => (
                  <tr key={activity.id} className="hover:bg-zinc-50 dark:bg-zinc-800 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-sm">bolt</span>
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white">{activity.action}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{activity.time}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => navigate(getLinkForAction(activity.action))}
                        className="text-sm font-bold text-primary hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <FounderRewardModal isOpen={isRewardOpen} onClose={() => setIsRewardOpen(false)} />
    </div>
  );
}
