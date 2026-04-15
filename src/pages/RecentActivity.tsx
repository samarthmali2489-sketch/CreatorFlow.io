import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function RecentActivity() {
  const { analytics } = useAppContext();

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-12">
      <header className="mb-12 flex items-center gap-4">
        <Link to="/analytics" className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface">All Recent Activity</h1>
      </header>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
        {analytics.recentActivity.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">No recent activity found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container-lowest">
                <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Action</th>
                <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Time</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentActivity.map((activity, i) => (
                <tr key={i} className="border-b border-outline-variant/5 hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="p-4 font-medium text-on-surface">{activity.action}</td>
                  <td className="p-4 text-on-surface-variant">{activity.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
