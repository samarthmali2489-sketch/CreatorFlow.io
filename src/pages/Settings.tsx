import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Settings() {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Preferences State
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('creatorflow_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setFirstName(parsed.firstName || '');
      setLastName(parsed.lastName || '');
      setDarkMode(parsed.darkMode || false);
      setAutoSave(parsed.autoSave ?? true);
    }
  }, []);

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      const settings = { firstName, lastName, darkMode, autoSave };
      localStorage.setItem('creatorflow_settings', JSON.stringify(settings));
      setIsSaving(false);
      setSaveMessage('Profile saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 800);
  };

  const handleTogglePreference = (key: 'darkMode' | 'autoSave') => {
    const newSettings = {
      firstName,
      lastName,
      darkMode: key === 'darkMode' ? !darkMode : darkMode,
      autoSave: key === 'autoSave' ? !autoSave : autoSave,
    };
    
    if (key === 'darkMode') setDarkMode(!darkMode);
    if (key === 'autoSave') setAutoSave(!autoSave);
    
    localStorage.setItem('creatorflow_settings', JSON.stringify(newSettings));
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface mb-4">Settings</h1>
        <p className="text-on-surface-variant text-lg">Manage your account, preferences, and API keys.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Settings Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          {[
            { id: 'profile', label: 'Profile', icon: 'person' },
            { id: 'preferences', label: 'Preferences', icon: 'tune' },
            { id: 'notifications', label: 'Notifications', icon: 'notifications' },
            { id: 'billing', label: 'Billing & Plans', icon: 'credit_card' },
            { id: 'api-keys', label: 'API Keys', icon: 'key' },
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
                <div className="flex items-center gap-6 mb-8">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnD-eDeaQtm5TCuJeN5MI4wp-WNoGEWVe4JWtVgNdNgr6CnDqzr9w9r4Ar6AQnGo1dww_u5_Ih0BQh8WkawS9fxAUpNRUdkCyaK5oHTBaGh2rMeqIaxwVZtru9r5LXIecLV-Qi5fJVemZnYOK0k2U-GfRURfH2iMBI5as6vBdfCnx_Z_mrFYaO8tfWaoG8vuuusOyaAl9InIaktHOybgkC-EN_VAj5v14Y4miWHkbfBzdfx6pDx-LzbNvaUCDmdjNL1-sUY27hdXm-" 
                    alt="Avatar" 
                    className="w-20 h-20 rounded-full border-2 border-surface-container-high object-cover"
                  />
                  <div>
                    <button className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg font-bold text-sm transition-colors mb-2">
                      Change Avatar
                    </button>
                    <p className="text-xs text-on-surface-variant">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Email Address</label>
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

          {activeTab === 'api-keys' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 shadow-sm">
                <h2 className="text-xl font-bold mb-2">API Keys</h2>
                <p className="text-on-surface-variant mb-6">Manage your keys for external integrations and custom models.</p>
                
                <div className="space-y-4">
                  <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Gemini API Key
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-1">Configured via environment variables.</p>
                    </div>
                    <span className="text-xs font-bold bg-surface-container-high px-2 py-1 rounded text-on-surface-variant">Active</span>
                  </div>
                  
                  <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex items-center justify-between opacity-60">
                    <div>
                      <h4 className="font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
                        OpenAI API Key
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-1">Not configured.</p>
                    </div>
                    <button className="text-xs font-bold text-primary hover:underline">Add Key</button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Placeholders for others */}
          {(activeTab === 'notifications' || activeTab === 'billing') && (
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
