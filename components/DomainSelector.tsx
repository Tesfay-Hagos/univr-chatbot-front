'use client';

import { Domain } from '@/lib/api';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

// Domain icons mapping
const domainIcons: Record<string, string> = {
    scholarships: '🎓',
    admissions: '📝',
    tuition: '💰',
    housing: '🏠',
    international: '🌍',
    research: '🔬',
    library: '📚',
    career: '💼',
    default: '📁'
};

interface DomainSelectorProps {
    domains: Domain[];
    onSelect: (domain: Domain) => void;
    loading?: boolean;
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

export default function DomainSelector({ domains, onSelect, loading, darkMode, onToggleDarkMode }: DomainSelectorProps) {
    const [selectedCard, setSelectedCard] = useState<string | null>(null);

    const getIcon = (domain: string) => {
        const lowerDomain = domain.toLowerCase();
        for (const [key, icon] of Object.entries(domainIcons)) {
            if (lowerDomain.includes(key)) return icon;
        }
        return domainIcons.default;
    };

    const handleSelect = (domain: Domain) => {
        setSelectedCard(domain.domain);
        // Small delay for animation
        setTimeout(() => onSelect(domain), 150);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-univr-red border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading domains...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Theme Toggle */}
            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
            </div>
            {/* Header */}
            <header className="pt-12 pb-8 px-4 text-center">
                <div className="animate-float text-6xl mb-4">🎓</div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-univr-red to-univr-gold bg-clip-text text-transparent mb-3">
                    UniVR Chatbot
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Welcome to the University of Verona AI Assistant. Select a topic to get started.
                </p>
            </header>

            {/* Domain Cards */}
            <main className="flex-1 px-4 pb-12">
                <div className="max-w-4xl mx-auto">
                    <p className="text-sm text-slate-500 dark:text-slate-500 text-center mb-6">
                        Choose a domain to access specialized knowledge
                    </p>

                    {domains.length === 0 ? (
                        <div className="text-center py-12 glass-panel rounded-2xl">
                            <div className="text-5xl mb-4">📭</div>
                            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                No Domains Available
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400">
                                Please create a domain using the Admin API to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {domains.map((domain) => (
                                <button
                                    key={domain.domain}
                                    onClick={() => handleSelect(domain)}
                                    className={`
                    domain-card group relative
                    ${selectedCard === domain.domain ? 'scale-95 opacity-70' : ''}
                  `}
                                >
                                    {/* Icon */}
                                    <div className="text-4xl mb-3 transition-transform group-hover:scale-110 group-hover:-translate-y-1">
                                        {getIcon(domain.domain)}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1 capitalize">
                                        {domain.display_name || domain.domain}
                                    </h3>

                                    {/* Document count */}
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {domain.document_count} document{domain.document_count !== 1 ? 's' : ''} available
                                    </p>

                                    {/* Hover effect */}
                                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-univr-red/50 transition-colors pointer-events-none" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-sm text-slate-500 dark:text-slate-500">
                Powered by <span className="text-univr-red font-semibold">Gemini AI</span> with RAG
            </footer>
        </div>
    );
}
