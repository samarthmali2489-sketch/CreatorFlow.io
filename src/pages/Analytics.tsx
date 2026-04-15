import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function Analytics() {
  const { analytics } = useAppContext();
  const [timeframe, setTimeframe] = useState('Weekly');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const getData = () => {
    // In a real app, we would filter analytics.chartData based on timeframe.
    // For now, we'll just use the context's chartData for Daily/Weekly and scale it for Monthly.
    if (timeframe === 'Monthly') {
      return analytics.chartData.map(d => ({ ...d, views: d.value * 30 }));
    } else if (timeframe === 'Weekly') {
      return analytics.chartData.map(d => ({ ...d, views: d.value * 7 }));
    }
    return analytics.chartData.map(d => ({ ...d, views: d.value }));
  };

  const data = getData();

  const totalContent: number = Object.values(analytics.contentTypes || {}).reduce((a: number, b: any) => a + Number(b), 0) as number;
  const getPercentage = (type: string) => {
    if (totalContent === 0) return 0;
    return Math.round((Number(analytics.contentTypes?.[type] || 0) / totalContent) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2 block">Performance Overview</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tighter">Analytics Lab</h1>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-low p-1 rounded-xl">
          <button className="px-4 py-2 text-sm font-semibold bg-white shadow-sm rounded-lg text-zinc-900">Last 30 Days</button>
          <button className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 transition-colors">Last Quarter</button>
          <button className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 transition-colors">Yearly</button>
        </div>
      </header>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total Reach */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_24px_48px_rgba(0,0,0,0.02)] border border-zinc-100 flex flex-col justify-between min-h-[200px] group hover:border-primary/20 transition-all">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-zinc-500 font-medium">Total Generations</span>
              <div className="p-2 bg-primary/5 rounded-lg">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              </div>
            </div>
            <div className="text-5xl font-black tracking-tighter text-zinc-900">{analytics.totalGenerations}</div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <span className="material-symbols-outlined text-sm">north</span>
            <span>Active this session</span>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-zinc-900 p-8 rounded-xl shadow-xl flex flex-col justify-between min-h-[200px] text-white">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-zinc-400 font-medium">Videos Processed</span>
              <div className="p-2 bg-white/10 rounded-lg">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>movie</span>
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
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_24px_48px_rgba(0,0,0,0.02)] border border-zinc-100 flex flex-col justify-between min-h-[200px] group hover:border-primary/20 transition-all">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-zinc-500 font-medium">Platforms Connected</span>
              <div className="p-2 bg-primary/5 rounded-lg">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              </div>
            </div>
            <div className="text-5xl font-black tracking-tighter text-zinc-900">{analytics.platformsConnected}</div>
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
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 border border-zinc-100 shadow-[0px_24px_48px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-extrabold tracking-tight">Growth Projection</h3>
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-surface-container border-none text-xs font-bold rounded-lg px-4 py-2"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
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
                  dataKey="views" 
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

        {/* Channel Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-xl p-8 border border-zinc-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-extrabold tracking-tight mb-8">Traffic Sources</h3>
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-zinc-600">movie</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold">YouTube Shorts</span>
                  <span className="text-sm font-medium">{getPercentage('YouTube Shorts')}%</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full">
                  <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${getPercentage('YouTube Shorts')}%` }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-zinc-600">smartphone</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold">Instagram Reels</span>
                  <span className="text-sm font-medium">{getPercentage('Instagram Reels')}%</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full">
                  <div className="bg-primary-container h-2 rounded-full transition-all duration-500" style={{ width: `${getPercentage('Instagram Reels')}%` }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-zinc-600">description</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold">LinkedIn</span>
                  <span className="text-sm font-medium">{getPercentage('LinkedIn')}%</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full">
                  <div className="bg-zinc-300 h-2 rounded-full transition-all duration-500" style={{ width: `${getPercentage('LinkedIn')}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-8 py-3 bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm font-bold rounded-xl hover:bg-zinc-100 transition-colors">
            View Details
          </button>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-zinc-100 shadow-[0px_24px_48px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="text-xl font-extrabold tracking-tight">Recent Activity</h3>
          <Link to="/recent-activity" className="text-sm font-bold text-primary hover:underline">See All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-4">Action</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-8 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {analytics.recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-8 text-center text-zinc-500 font-medium">
                    No recent activity. Start generating content!
                  </td>
                </tr>
              ) : (
                analytics.recentActivity.slice(0, 3).map((activity) => (
                  <tr key={activity.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-sm">bolt</span>
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900">{activity.action}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-zinc-500">{activity.time}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-sm font-bold text-primary hover:underline">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
