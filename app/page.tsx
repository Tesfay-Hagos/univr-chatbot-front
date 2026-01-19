'use client';

import { useState, useEffect } from 'react';
import { Domain, fetchDomains } from '@/lib/api';
import DomainSelector from '@/components/DomainSelector';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load domains on mount
  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
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
  };

  const handleDomainSelect = (domain: Domain) => {
    setSelectedDomain(domain);
  };

  const handleSwitchDomain = () => {
    setSelectedDomain(null);
    // Reload domains in case new ones were added
    loadDomains();
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Connection Error
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={loadDomains}
            className="px-6 py-3 bg-gradient-to-br from-univr-red to-univr-red-dark text-white rounded-xl
                       hover:shadow-lg hover:scale-105 transition-all font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Chat interface when domain is selected
  if (selectedDomain) {
    return (
      <ChatInterface
        domain={selectedDomain}
        onSwitchDomain={handleSwitchDomain}
      />
    );
  }

  // Domain selection
  return (
    <DomainSelector
      domains={domains}
      onSelect={handleDomainSelect}
      loading={loading}
    />
  );
}
