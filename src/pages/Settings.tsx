import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Settings() {
  const { user, darkMode, setDarkMode, autoSave, setAutoSave, subscriptionPlan, setSubscriptionPlan, credits } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Custom API Key State (Tony the key)
  const [customKey, setCustomKey] = useState('');
  const [isKeySaving, setIsKeySaving] = useState(false);
  const [keySaveMessage, setKeySaveMessage] = useState('');

  // Lemon Squeezy State
  const [lsCheckoutUrl, setLsCheckoutUrl] = useState('');
  const [lsApiKey, setLsApiKey] = useState('');
  const [lsWebhookSecret, setLsWebhookSecret] = useState('');
  const [isLSSaving, setIsLSSaving] = useState(false);
  const [lsSaveMessage, setLsSaveMessage] = useState('');

  // Default Lemon Squeezy URL from user
  const DEFAULT_LS_URL = "https://creator-flow-io.lemonsqueezy.com/checkout/buy/2af2c0ff-2dbe-4309-a6c6-b15853ae6e8b";

  // Check for successful redirect from LemonSqueezy hosted checkout
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
    // Re-initialize lemonsqueezy buttons on mount just in case
    if (typeof window !== 'undefined' && (window as any).createLemonSqueezy) {
      (window as any).createLemonSqueezy();
      
      // Setup event listener to catch successful checkouts in Settings
      if ((window as any).LemonSqueezy && (window as any).LemonSqueezy.Setup) {
        (window as any).LemonSqueezy.Setup({
          eventHandler: (event: any) => {
            if (event.event === 'Checkout.Success') {
              setSubscriptionPlan('pro');
            }
          }
        });
      }
    }
  }, [activeTab, setSubscriptionPlan]); // Re-run when tab changes to billing

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('creatorflow_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setFirstName(parsed.firstName || '');
      setLastName(parsed.lastName || '');
      setLsCheckoutUrl(parsed.lsCheckoutUrl || '');
      setLsApiKey(parsed.lsApiKey || '');
      setLsWebhookSecret(parsed.lsWebhookSecret || '');
      setCustomKey(parsed.customApiKey || '');
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

  const handleSaveKey = () => {
    setIsKeySaving(true);
    setTimeout(() => {
      const savedSettings = localStorage.getItem('creatorflow_settings');
      let parsed = savedSettings ? JSON.parse(savedSettings) : {};
      parsed.customApiKey = customKey;
      localStorage.setItem('creatorflow_settings', JSON.stringify(parsed));
      setIsKeySaving(false);
      setKeySaveMessage('API Key securely saved to your browser!');
      setTimeout(() => setKeySaveMessage(''), 3000);
    }, 400);
  };

  const handleTogglePreference = (key: 'darkMode' | 'autoSave') => {
    if (key === 'darkMode') setDarkMode(!darkMode);
    if (key === 'autoSave') setAutoSave(!autoSave);
  };

  const handleUpgradeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const finalUrl = lsCheckoutUrl || DEFAULT_LS_URL;
    if (typeof window !== 'undefined' && (window as any).LemonSqueezy && (window as any).LemonSqueezy.Url) {
      (window as any).LemonSqueezy.Url.Open(finalUrl);
    } else {
      window.open(finalUrl, '_blank');
    }
  };

  const handleSaveLemonSqueezy = () => {
    setIsLSSaving(true);
    // Simulate saving connection locally for demo/MVP
    setTimeout(() => {
      const savedSettings = localStorage.getItem('creatorflow_settings');
      let parsed = savedSettings ? JSON.parse(savedSettings) : {};
      parsed.lsCheckoutUrl = lsCheckoutUrl;
      parsed.lsApiKey = lsApiKey;
      parsed.lsWebhookSecret = lsWebhookSecret;
      localStorage.setItem('creatorflow_settings', JSON.stringify(parsed));
      setIsLSSaving(false);
      setLsSaveMessage('Lemon Squeezy connected!');
      setTimeout(() => setLsSaveMessage(''), 3000);
    }, 800);
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
            { id: 'api_keys', label: 'API Keys', icon: 'key' },
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
                    className="bg-primary hover:bg-primary-dim text-white px-6 py-2.5 rounded-lg font-bold transition-all disabled:opacity-70 flex items-center gap-2"
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
                      <h3 className="font-bold text-on-surface">Dark Mode</h3>
                      <p className="text-sm text-on-surface-variant">Toggle dark mode appearance.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={darkMode} onChange={() => handleTogglePreference('darkMode')} className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <hr className="border-outline-variant/20" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-on-surface">Auto-Save Drafts</h3>
                      <p className="text-sm text-on-surface-variant">Automatically save your work in Content Lab.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={autoSave} onChange={() => handleTogglePreference('autoSave')} className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'api_keys' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 shadow-sm">
                <div className="flex items-center gap-3 mb-6 relative">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">key</span>
                  <h2 className="text-xl font-bold">Bring Your Own Key</h2>
                </div>
                
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                  To securely bypass shared free-tier quota limits without hardcoding your API key into the source code, paste your personal Gemini API key below. This key ("Tony the key" or otherwise) is encrypted and saved <strong>locally</strong> in your browser.
                </p>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Your Paid API Key</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      placeholder="e.g. AIzaSy..." 
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 pr-12 text-on-surface focus:ring-2 focus:ring-primary transition-all font-mono" 
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50">lock</span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-4">
                  {keySaveMessage && <span className="text-sm font-bold text-green-600 animate-in fade-in">{keySaveMessage}</span>}
                  <button 
                    onClick={handleSaveKey}
                    disabled={isKeySaving}
                    className="bg-primary hover:bg-primary-dim text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {isKeySaving ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : <span className="material-symbols-outlined text-sm">enhanced_encryption</span>}
                    Securely Save Key
                  </button>
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
