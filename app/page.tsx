'use client';

import { useState, useEffect, useCallback } from 'react';
import { Domain, fetchDomains } from '@/lib/api';
import LandingPage from '@/components/LandingPage';
import AdminPanel from '@/components/AdminPanel';
import DomainSelector from '@/components/DomainSelector';
import ChatInterface from '@/components/ChatInterface';

type View = 'landing' | 'admin' | 'chatbot';

export default function Home() {
  const [view, setView] = useState<View>('landing');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  }, [darkMode]);

  const loadDomains = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDomains();
      setDomains(data);
    } catch (err) {
      console.error('Failed to load domains:', err);
      setError('Failed to connect to the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load domains when entering chatbot view
  useEffect(() => {
    if (view === 'chatbot') {
      loadDomains();
    }
  }, [view, loadDomains]);

  const handleDomainSelect = (domain: Domain) => {
    setSelectedDomain(domain);
  };

  const handleSwitchDomain = () => {
    setSelectedDomain(null);
    setError(null); // Reset error state when switching domains
    // Reload domains in case new ones were added
    loadDomains();
  };

  const handleBackToLanding = () => {
    setView('landing');
    setSelectedDomain(null);
    setError(null);
  };

  // Landing page
  if (view === 'landing') {
    return (
      <LandingPage
        onSelectAdmin={() => setView('admin')}
        onSelectChatbot={() => setView('chatbot')}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  // Admin panel
  if (view === 'admin') {
    return (
      <AdminPanel
        onBack={handleBackToLanding}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  // Chatbot flow - Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Connection Error
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBackToLanding}
              className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl
                         hover:bg-slate-300 dark:hover:bg-slate-600 transition-all font-medium"
            >
              ← Back to Home
            </button>
            <button
              onClick={loadDomains}
              className="px-6 py-3 bg-gradient-to-br from-univr-red to-univr-red-dark text-white rounded-xl
                         hover:shadow-lg hover:scale-105 transition-all font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chatbot flow - Chat interface when domain is selected
  if (selectedDomain) {
    return (
      <ChatInterface
        domain={selectedDomain}
        onSwitchDomain={handleSwitchDomain}
        onBackToHome={handleBackToLanding}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  // Chatbot flow - Domain selection with back button
  return (
    <div className="relative">
      {/* Back button overlay */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={handleBackToLanding}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm 
                     rounded-xl text-slate-600 dark:text-slate-400 hover:text-univr-red transition-colors
                     shadow-lg border border-slate-200 dark:border-slate-700"
        >
          <span>←</span>
          <span className="font-medium">Home</span>
        </button>
      </div>
      <DomainSelector
        domains={domains}
        onSelect={handleDomainSelect}
        loading={loading}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    </div>
  );
}
