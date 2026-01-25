'use client';

import ThemeToggle from './ThemeToggle';

interface LandingPageProps {
    onSelectAdmin: () => void;
    onSelectChatbot: () => void;
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

export default function LandingPage({ onSelectAdmin, onSelectChatbot, darkMode, onToggleDarkMode }: LandingPageProps) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Theme Toggle */}
            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
            </div>
            {/* Header */}
            <header className="pt-16 pb-8 px-4 text-center">
                <div className="animate-float text-7xl mb-6">🎓</div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-univr-red via-univr-red-dark to-univr-gold bg-clip-text text-transparent mb-4">
                    UniVR Chatbot
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    University of Verona AI-Powered Knowledge System
                </p>
            </header>

            {/* Main Options */}
            <main className="flex-1 flex items-center justify-center px-4 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                    {/* Admin Panel Card */}
                    <button
                        onClick={onSelectAdmin}
                        className="group relative p-8 rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl 
                                 shadow-xl hover:shadow-2xl border border-slate-200/50 dark:border-slate-700/50
                                 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1
                                 overflow-hidden"
                    >
                        {/* Background gradient effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Icon */}
                        <div className="relative text-6xl mb-6 transition-transform duration-300 group-hover:scale-110">
                            ⚙️
                        </div>

                        {/* Title */}
                        <h2 className="relative text-2xl font-bold text-slate-800 dark:text-white mb-3">
                            Admin Panel
                        </h2>

                        {/* Description */}
                        <p className="relative text-slate-600 dark:text-slate-400 text-base">
                            Manage knowledge domains and upload documents for the RAG system
                        </p>

                        {/* Features list */}
                        <ul className="relative mt-4 text-left text-sm text-slate-500 dark:text-slate-500 space-y-1">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Create & manage domains
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Upload PDF, TXT, DOCX files
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> View & delete documents
                            </li>
                        </ul>

                        {/* Hover border effect */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-transparent 
                                      group-hover:border-amber-500/50 transition-colors duration-300 pointer-events-none" />
                    </button>

                    {/* Chatbot Card */}
                    <button
                        onClick={onSelectChatbot}
                        className="group relative p-8 rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl 
                                 shadow-xl hover:shadow-2xl border border-slate-200/50 dark:border-slate-700/50
                                 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1
                                 overflow-hidden"
                    >
                        {/* Background gradient effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Icon */}
                        <div className="relative text-6xl mb-6 transition-transform duration-300 group-hover:scale-110">
                            💬
                        </div>

                        {/* Title */}
                        <h2 className="relative text-2xl font-bold text-slate-800 dark:text-white mb-3">
                            Chatbot
                        </h2>

                        {/* Description */}
                        <p className="relative text-slate-600 dark:text-slate-400 text-base">
                            Ask questions and get AI-powered answers from university knowledge
                        </p>

                        {/* Features list */}
                        <ul className="relative mt-4 text-left text-sm text-slate-500 dark:text-slate-500 space-y-1">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Select knowledge domain
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> AI-powered responses
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Source citations
                            </li>
                        </ul>

                        {/* Hover border effect */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-transparent 
                                      group-hover:border-blue-500/50 transition-colors duration-300 pointer-events-none" />
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-sm text-slate-500 dark:text-slate-500">
                Powered by <span className="text-univr-red font-semibold">Gemini AI</span> with RAG
            </footer>
        </div>
    );
}
