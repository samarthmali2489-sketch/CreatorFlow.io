import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Analytics() {
  const { analytics } = useAppContext();
  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const navigate = useNavigate();

  const getData = () => {
    if (timeframe === 'Yearly') {
      return [
        { name: 'Jan', value: 120 }, { name: 'Feb', value: 150 }, { name: 'Mar', value: 180 },
        { name: 'Apr', value: 200 }, { name: 'May', value: 250 }, { name: 'Jun', value: 300 },
        { name: 'Jul', value: 320 }, { name: 'Aug', value: 400 }, { name: 'Sep', value: 450 },
        { name: 'Oct', value: 500 }, { name: 'Nov', value: 550 }, { name: 'Dec', value: 600 }
      ].map(d => ({ ...d, views: d.value * 20 }));
    } else if (timeframe === 'Last Quarter') {
      return [
        { name: 'Week 1', value: 100 }, { name: 'Week 2', value: 120 }, { name: 'Week 3', value: 150 }, { name: 'Week 4', value: 140 },
        { name: 'Week 5', value: 180 }, { name: 'Week 6', value: 200 }, { name: 'Week 7', value: 220 }, { name: 'Week 8', value: 210 },
        { name: 'Week 9', value: 250 }, { name: 'Week 10', value: 280 }, { name: 'Week 11', value: 300 }, { name: 'Week 12', value: 350 }
      ].map(d => ({ ...d, views: d.value * 10 }));
    } else if (timeframe === 'Custom') {
      return analytics.chartData.map(d => ({ ...d, views: d.value * 5 }));
    } else if (timeframe === 'Monthly' || timeframe === 'Last 30 Days') {
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tighter">Analytics Lab</h1>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-low p-1 rounded-xl overflow-x-auto">
          {['Last 30 Days', 'Last Quarter', 'Yearly', 'Custom'].map(tf => (
            <button 
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${timeframe === tf ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              {tf}
            </button>
          ))}
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
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-extrabold tracking-tight">Growth Projection</h3>
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-surface-container border-none text-xs font-bold rounded-lg px-4 py-2"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last Quarter">Last Quarter</option>
              <option value="Yearly">Yearly</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          {timeframe === 'Custom' && (
            <div className="flex items-center gap-4 mb-6">
              <input type="date" value={customDateRange.start} onChange={e => setCustomDateRange({ ...customDateRange, start: e.target.value })} className="bg-surface-container text-xs font-bold rounded-lg px-4 py-2 outline-none" />
              <span className="text-zinc-500 font-bold">to</span>
              <input type="date" value={customDateRange.end} onChange={e => setCustomDateRange({ ...customDateRange, end: e.target.value })} className="bg-surface-container text-xs font-bold rounded-lg px-4 py-2 outline-none" />
            </div>
          )}
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
          <button 
            onClick={() => setShowDetails(true)}
            className="w-full mt-8 py-3 bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm font-bold rounded-xl hover:bg-zinc-100 transition-colors"
          >
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

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-zinc-900">Traffic Source Details</h3>
              <button onClick={() => setShowDetails(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors">
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                    <th className="pb-4 pt-2">Source</th>
                    <th className="pb-4 pt-2">Total Impressions</th>
                    <th className="pb-4 pt-2">Clicks</th>
                    <th className="pb-4 pt-2">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 text-sm font-medium">
                  <tr>
                    <td className="py-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> YouTube Shorts</td>
                    <td className="py-4 text-zinc-600">345,120</td>
                    <td className="py-4 text-zinc-600">45,020</td>
                    <td className="py-4 text-emerald-600">13.04%</td>
                  </tr>
                  <tr>
                    <td className="py-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-container"></span> Instagram Reels</td>
                    <td className="py-4 text-zinc-600">229,400</td>
                    <td className="py-4 text-zinc-600">31,100</td>
                    <td className="py-4 text-emerald-600">13.55%</td>
                  </tr>
                  <tr>
                    <td className="py-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-zinc-400"></span> LinkedIn (Organic)</td>
                    <td className="py-4 text-zinc-600">120,500</td>
                    <td className="py-4 text-zinc-600">18,300</td>
                    <td className="py-4 text-emerald-600">15.18%</td>
                  </tr>
                  <tr>
                    <td className="py-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sky-400"></span> X / Twitter</td>
                    <td className="py-4 text-zinc-600">85,200</td>
                    <td className="py-4 text-zinc-600">9,500</td>
                    <td className="py-4 text-emerald-600">11.15%</td>
                  </tr>
                  <tr>
                    <td className="py-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Direct Traffic</td>
                    <td className="py-4 text-zinc-600">15,000</td>
                    <td className="py-4 text-zinc-600">2,400</td>
                    <td className="py-4 text-emerald-600">16.00%</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-8 bg-zinc-50 rounded-xl p-4 border border-zinc-100 flex gap-4 items-center">
                <span className="material-symbols-outlined text-primary text-3xl">lightbulb</span>
                <p className="text-sm font-medium text-zinc-600">Your conversion rate from LinkedIn is significantly higher than other platforms. Consider increasing your LinkedIn carousel output.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
