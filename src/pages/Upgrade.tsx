import React from 'react';
import { Link } from 'react-router-dom';

export default function Upgrade() {
  return (
    <div className="max-w-6xl mx-auto p-8 lg:p-12">
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-4">Upgrade Your Flow</h1>
        <p className="text-on-surface-variant text-xl max-w-2xl mx-auto">Choose the perfect plan to scale your content creation.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Free Plan */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/20 flex flex-col">
          <h2 className="text-2xl font-bold mb-2">Free</h2>
          <p className="text-on-surface-variant mb-6">Perfect for getting started.</p>
          <div className="text-5xl font-black mb-8">$0<span className="text-lg text-on-surface-variant font-medium">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> 5 Generations / month</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> Basic AI Models</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> 1 Connected Profile</li>
          </ul>
          
          <button className="w-full py-4 rounded-xl font-bold bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors">Current Plan</button>
        </div>

        {/* Starter Plan */}
        <div className="bg-zinc-900 text-white rounded-[2rem] p-8 border border-zinc-800 flex flex-col relative transform md:-translate-y-4 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Most Popular</div>
          <h2 className="text-2xl font-bold mb-2">Starter</h2>
          <p className="text-zinc-400 mb-6">For growing creators.</p>
          <div className="text-5xl font-black mb-8">$20<span className="text-lg text-zinc-400 font-medium">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> 100 Generations / month</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> Advanced AI Models</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> 5 Connected Profiles</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> Priority Support</li>
          </ul>
          
          <button className="w-full py-4 rounded-xl font-bold bg-primary text-white hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20">Upgrade to Starter</button>
        </div>

        {/* Infinity Plan */}
        <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-[2rem] p-8 border border-primary/20 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-9xl text-primary">all_inclusive</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">Infinity</h2>
          <p className="text-on-surface-variant mb-6 relative z-10">For agencies and power users.</p>
          <div className="text-5xl font-black mb-8 relative z-10">$100<span className="text-lg text-on-surface-variant font-medium">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1 relative z-10">
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> <strong className="text-primary">Infinite Generations</strong></li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> Premium AI Models</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> Unlimited Profiles</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> API Access</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> Dedicated Account Manager</li>
          </ul>
          
          <button className="w-full py-4 rounded-xl font-bold bg-zinc-900 text-white hover:bg-black transition-colors relative z-10">Go Infinite</button>
        </div>
      </div>
    </div>
  );
}
