import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { user, autoSave, setAutoSave, showRefImageWarning, setShowRefImageWarning, subscriptionPlan, setSubscriptionPlan, credits } = useAppContext();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Check for successful redirect from hosted checkout
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('success') || urlParams.has('orderId') || urlParams.has('checkoutId')) {
        setSubscriptionPlan('pro');
        // Clean up URL so it doesn't trigger on every single refresh
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [setSubscriptionPlan]);

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('creatorflow_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setFirstName(parsed.firstName || '');
      setLastName(parsed.lastName || '');
    }
  }, []);

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      const savedSettings = localStorage.getItem('creatorflow_settings');
      let parsed = savedSettings ? JSON.parse(savedSettings) : {};
      parsed.firstName = firstName;
      parsed.lastName = lastName;
      localStorage.setItem('creatorflow_settings', JSON.stringify(parsed));
      setIsSaving(false);
      setSaveMessage('Profile saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 800);
  };

  const handleTogglePreference = (key: 'autoSave' | 'showRefImageWarning') => {
    if (key === 'autoSave') setAutoSave(!autoSave);
    if (key === 'showRefImageWarning') setShowRefImageWarning(!showRefImageWarning);
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface mb-4">Settings</h1>
            <p className="text-on-surface-variant text-lg">Manage your account and preferences.</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Settings Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          {[
            { id: 'profile', label: 'Profile', icon: 'person' },
            { id: 'preferences', label: 'Preferences', icon: 'tune' },
            { id: 'billing', label: 'Billing & Plans', icon: 'credit_card' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Settings Content */}
        <div className="flex-1 max-w-3xl">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">First Name</label>
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Creator" 
                      className="w-full bg-surface-container-low border-0 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Pro" 
                      className="w-full bg-surface-container-low border-0 rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary transition-all" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-medium">Email Address</label>
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      disabled
                      className="w-full bg-surface-container-low border-0 rounded-lg p-3 text-on-surface opacity-70 cursor-not-allowed" 
                    />
                    <p className="text-[10px] text-on-surface-variant mt-1">Email is managed via your authentication provider.</p>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-end gap-4">
                  {saveMessage && <span className="text-sm font-bold text-green-600 animate-in fade-in">{saveMessage}</span>}
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary-dim text-white dark:text-zinc-900 px-6 py-2.5 rounded-lg font-bold transition-all disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSaving ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : null}
                    Save Changes
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 shadow-sm">
                <h2 className="text-xl font-bold mb-6">App Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-on-surface">App Theme</h3>
                      <p className="text-sm text-on-surface-variant">Select light, dark, or system default.</p>
                    </div>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                      className="bg-surface-container-high border-none text-on-surface rounded-lg p-2 font-medium focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="system">System</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  <hr className="border-outline-variant/20" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-on-surface">Auto-Save Drafts</h3>
                      <p className="text-sm text-on-surface-variant">Automatically save your work in Content Lab.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={autoSave} onChange={() => handleTogglePreference('autoSave')} className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-zinc-900 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <hr className="border-outline-variant/20" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-on-surface">Thumbnail Assistant</h3>
                      <p className="text-sm text-on-surface-variant">Show tips when generating thumbnails without a reference image.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={showRefImageWarning} onChange={() => handleTogglePreference('showRefImageWarning')} className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-zinc-900 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Subscription Plan</h2>
                <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-xl border border-outline-variant/20 mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-on-surface capitalize">
                      {subscriptionPlan === 'infinity' ? 'Infinity (Enterprise)' : subscriptionPlan === 'pro' ? 'Professional' : 'Starter'} Plan
                    </h3>
                    <p className="text-sm text-on-surface-variant font-medium mt-1">
                      {subscriptionPlan === 'infinity' ? 'Unlimited access to all features.' : subscriptionPlan === 'pro' ? '1000 credits/month with full features.' : '150 free credits/month.'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Remaining Credits</div>
                    <div className="text-3xl font-black text-primary">
                      {subscriptionPlan === 'infinity' ? '∞' : credits}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Placeholders for others */}
          {(activeTab === 'notifications') && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-surface-container-lowest rounded-2xl p-12 border border-outline-variant/20 shadow-sm text-center">
                <span className="material-symbols-outlined text-4xl text-primary/40 mb-4">construction</span>
                <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
                <p className="text-on-surface-variant">This section is currently under development.</p>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
